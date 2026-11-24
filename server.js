const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const MAX_BOOKING_DURATION_MINUTES = 120;
const MAX_BOOKING_EXTENSIONS = 1;
const BOOKING_EXTENSION_MINUTES = 30;
const CONSOLE_CAPACITY = { Xbox: 2, PlayStation: 2 };

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const basePgConfig = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
};

const bookingDb = new Pool({
  ...basePgConfig,
  database: process.env.BOOKING_DB || "cabins_booking_db",
});

const gameDb = new Pool({
  ...basePgConfig,
  database: process.env.GAME_DB || "game_rental_db",
});

async function ensureGameMediaSchema() {
  await gameDb.query(`
    ALTER TABLE games
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(32),
      ADD COLUMN IF NOT EXISTS screenshots JSONB NOT NULL DEFAULT '[]'::jsonb
  `);

  await gameDb.query(`
    ALTER TABLE game_copies
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE
  `);
}

async function ensureCoreSchema() {
  await bookingDb.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS campus_city TEXT,
      ADD COLUMN IF NOT EXISTS campus_address TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url TEXT
  `);

  await bookingDb.query(`
    ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS campus_city TEXT,
      ADD COLUMN IF NOT EXISTS campus_address TEXT
  `);

  await bookingDb.query(`
    ALTER TABLE bookings
      DROP CONSTRAINT IF EXISTS bookings_status_check
  `);

  await bookingDb.query(`
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_status_check
      CHECK (status IN ('active', 'released', 'cancelled', 'completed'))
  `);

  await bookingDb.query(`
    ALTER TABLE cabins
      ADD COLUMN IF NOT EXISTS campus_city TEXT,
      ADD COLUMN IF NOT EXISTS campus_address TEXT
  `);

  await bookingDb.query(`
    UPDATE cabins
    SET campus_city = COALESCE(campus_city, 'Уфа'),
        campus_address = COALESCE(campus_address, 'г. Уфа, ул. Заки Валиди, 32/2Б')
    WHERE campus_city IS NULL OR campus_address IS NULL
  `);

  await bookingDb.query(`
    CREATE TABLE IF NOT EXISTS user_bans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason TEXT NOT NULL DEFAULT '',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lifted_at TIMESTAMP
    )
  `);

  await bookingDb.query(`
    CREATE INDEX IF NOT EXISTS idx_user_bans_active
    ON user_bans (user_id, is_active)
  `);

  await bookingDb.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      full_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      admin_reply TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
      answered_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      answered_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await bookingDb.query(`
    CREATE INDEX IF NOT EXISTS support_messages_user_id_idx
    ON support_messages (user_id, created_at DESC)
  `);

  await bookingDb.query(`
    CREATE INDEX IF NOT EXISTS support_messages_status_idx
    ON support_messages (status, created_at DESC)
  `);

  await bookingDb.query(`
    CREATE TABLE IF NOT EXISTS console_bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      full_name TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      platform VARCHAR(30) NOT NULL CHECK (platform IN ('Xbox', 'PlayStation')),
      console_slot INTEGER NOT NULL CHECK (console_slot > 0),
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'released', 'cancelled', 'completed')),
      campus_city TEXT,
      campus_address TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CHECK (end_time > start_time)
    )
  `);

  await bookingDb.query(`
    ALTER TABLE console_bookings
      DROP CONSTRAINT IF EXISTS console_bookings_status_check
  `);

  await bookingDb.query(`
    ALTER TABLE console_bookings
      ADD CONSTRAINT console_bookings_status_check
      CHECK (status IN ('active', 'released', 'cancelled', 'completed'))
  `);

  await bookingDb.query(`
    CREATE INDEX IF NOT EXISTS console_bookings_user_id_idx
    ON console_bookings (user_id, status, end_time)
  `);

  await bookingDb.query(`
    CREATE INDEX IF NOT EXISTS console_bookings_platform_time_idx
    ON console_bookings (platform, status, start_time, end_time)
  `);

  await bookingDb.query(`
    ALTER TABLE console_bookings
      ADD COLUMN IF NOT EXISTS extension_count INTEGER NOT NULL DEFAULT 0
  `);

  await bookingDb.query(`
    ALTER TABLE bookings
      DROP CONSTRAINT IF EXISTS bookings_cabin_id_fkey
  `);

  await bookingDb.query(`
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_cabin_id_fkey
      FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON DELETE RESTRICT
  `);

  await bookingDb.query("CREATE EXTENSION IF NOT EXISTS btree_gist");

  await bookingDb.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_active_time_overlap'
      ) THEN
        ALTER TABLE bookings
          ADD CONSTRAINT bookings_no_active_time_overlap
          EXCLUDE USING gist (
            cabin_id WITH =,
            tsrange(start_time, end_time, '[)') WITH &&
          )
          WHERE (status = 'active');
      END IF;
    END $$;
  `);

  await bookingDb.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'console_bookings_no_active_time_overlap'
      ) THEN
        ALTER TABLE console_bookings
          ADD CONSTRAINT console_bookings_no_active_time_overlap
          EXCLUDE USING gist (
            platform WITH =,
            (COALESCE(campus_city, '')) WITH =,
            console_slot WITH =,
            tsrange(start_time, end_time, '[)') WITH &&
          )
          WHERE (status = 'active');
      END IF;
    END $$;
  `);
}

async function ensureGameLocationSchema() {
  await gameDb.query(`
    ALTER TABLE game_requests
      ADD COLUMN IF NOT EXISTS campus_city TEXT,
      ADD COLUMN IF NOT EXISTS campus_address TEXT,
      ADD COLUMN IF NOT EXISTS console_booking_id INTEGER
  `);

  await gameDb.query(`
    UPDATE game_requests
    SET status = 'completed'
    WHERE status = 'returned'
  `);

  await gameDb.query(`
    ALTER TABLE game_requests
      DROP CONSTRAINT IF EXISTS game_requests_status_check
  `);

  await gameDb.query(`
    ALTER TABLE game_requests
      ADD CONSTRAINT game_requests_status_check
      CHECK (status IN ('created', 'approved', 'not_available', 'not_found', 'cancelled', 'completed'))
  `);
}

async function cleanupExpiredReservations() {
  await bookingDb.query(`
    UPDATE bookings
    SET status = 'completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'active'
      AND end_time <= CURRENT_TIMESTAMP
  `);

  await bookingDb.query(`
    UPDATE console_bookings
    SET status = 'completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'active'
      AND end_time <= CURRENT_TIMESTAMP
  `);
}

function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("9")) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits;
}

function phoneVariants(phone) {
  const clean = normalizePhone(phone);
  const variants = new Set();
  if (clean) {
    variants.add(clean);
    if (clean.length === 11 && clean.startsWith("7")) variants.add(`8${clean.slice(1)}`);
    if (clean.length === 10 && clean.startsWith("9")) variants.add(`7${clean}`);
  }
  const rawDigits = String(phone || "").replace(/\D/g, "");
  if (rawDigits) variants.add(rawDigits);
  return [...variants];
}

function mapReceiveType(value) {
  if (value === "Самовывоз") return "pickup";
  if (value === "Доставка") return "delivery";
  if (value === "pickup" || value === "delivery") return value;
  return "pickup";
}

function mapReceiveTypeRu(value) {
  if (value === "pickup") return "Самовывоз";
  if (value === "delivery") return "Доставка";
  return value || "Самовывоз";
}

function publicUser(row) {
  return {
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    email: row.email,
    role: row.role,
    campus_city: row.campus_city || "",
    campus_address: row.campus_address || "",
    avatar_url: row.avatar_url || "",
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function findUserById(id) {
  const result = await bookingDb.query(
    `
    SELECT id, full_name, phone, email, password_hash, role, is_email_verified, campus_city, campus_address, avatar_url, created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
}

async function findUserByEmail(email) {
  const result = await bookingDb.query(
    `
    SELECT id, full_name, phone, email, password_hash, role, is_email_verified, campus_city, campus_address, avatar_url, created_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    `,
    [email]
  );
  return result.rows[0] || null;
}

async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, JWT_SECRET);

    // Администратор хранится в .env, поэтому для него не обязательно искать запись в users.
    if (
      payload.role === "admin" &&
      String(payload.email || "").toLowerCase() === String(process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase()
    ) {
      req.user = {
        id: 0,
        full_name: "Администратор",
        phone: "",
        email: String(payload.email || process.env.ADMIN_EMAIL).toLowerCase(),
        role: "admin",
        ban: { is_banned: false, banned_until: null, reason: "" },
      };
      return next();
    }

    const user = await findUserById(payload.id);
    req.user = user ? await attachBanStatus(publicUser(user)) : null;
    return next();
  } catch (_) {
    req.user = null;
    return next();
  }
}

async function requireAuth(req, res, next) {
  await optionalAuth(req, res, async () => {
    if (!req.user) {
      return res.status(401).json({ message: "Нужно войти в аккаунт" });
    }
    return next();
  });
}

async function requireAdmin(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступно только администратору" });
    }
    return next();
  });
}

function canManageBooking(user, booking) {
  return user && (user.role === "admin" || Number(booking.user_id) === Number(user.id));
}

function dbActorId(user) {
  const id = Number(user?.id || 0);
  return id > 0 ? id : null;
}

function sameCampusCity(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

async function activeBookingCampusConflict(userId, desiredCity, options = {}) {
  const city = String(desiredCity || "").trim();
  if (!city || !userId) return null;

  const conditions = [];
  const params = [userId, city];

  if (!options.ignoreCabins) {
    conditions.push(`
      SELECT 'cabin' AS kind, campus_city, id
      FROM bookings
      WHERE user_id = $1
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
        AND LOWER(COALESCE(campus_city, '')) <> LOWER($2)
    `);
  }

  if (!options.ignoreConsoles) {
    conditions.push(`
      SELECT 'console' AS kind, campus_city, id
      FROM console_bookings
      WHERE user_id = $1
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
        AND LOWER(COALESCE(campus_city, '')) <> LOWER($2)
    `);
  }

  if (conditions.length === 0) return null;

  const result = await bookingDb.query(
    `
    ${conditions.join("\nUNION ALL\n")}
    LIMIT 1
    `,
    params
  );

  return result.rows[0] || null;
}

function youtubeIdFromInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const direct = raw.match(/^[A-Za-z0-9_-]{11}$/);
  if (direct) return raw;

  const match = raw.match(/[?&]v=([A-Za-z0-9_-]{11})|youtu\.be\/([A-Za-z0-9_-]{11})|embed\/([A-Za-z0-9_-]{11})/);
  return match ? (match[1] || match[2] || match[3]) : null;
}

function normalizeScreenshots(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/\r?\n|,/);

  return [...new Set(list
    .map((item) => String(item || "").trim())
    .filter((item) => /^https?:\/\//i.test(item) || item.startsWith("assets/"))
  )].slice(0, 5);
}


async function getBanStatus(userOrPhone) {
  const userId = Number(typeof userOrPhone === "object" ? userOrPhone?.id : userOrPhone);
  if (!userId) {
    return { is_banned: false, banned_until: null, reason: "" };
  }

  const result = await bookingDb.query(
    `
    SELECT id, reason, created_at
    FROM user_bans
    WHERE user_id = $1 AND is_active = TRUE
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  );

  if (!result.rows.length) {
    return { is_banned: false, banned_until: null, reason: "" };
  }

  return {
    is_banned: true,
    banned_until: null,
    reason: result.rows[0].reason || "Аккаунт заблокирован администратором",
    created_at: result.rows[0].created_at,
  };
}

async function attachBanStatus(user) {
  if (!user || user.role === "admin") {
    return user ? { ...user, ban: { is_banned: false, banned_until: null, reason: "" } } : user;
  }
  return { ...user, ban: await getBanStatus(user) };
}

async function requireNotBanned(req, res, next) {
  if (!req.user || req.user.role === "admin") return next();

  const ban = await getBanStatus(req.user);
  req.user.ban = ban;

  if (ban?.is_banned) {
    return res.status(423).json({
      message: `Аккаунт заблокирован администратором. Причина: ${ban.reason || "не указана"}`,
      ban,
    });
  }
  return next();
}

function adminTargetParams(target) {
  const text = String(target || "").trim();
  return {
    hasTarget: Boolean(text),
    like: `%${text.toLowerCase()}%`,
    email: text.toLowerCase(),
    variants: phoneVariants(text),
  };
}

async function cancelCabinBookingsByTarget(target, adminUser) {
  const client = await bookingDb.connect();
  const params = adminTargetParams(target);

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      WITH selected AS (
        SELECT b.id
        FROM bookings b
        LEFT JOIN users u ON u.id = b.user_id
        WHERE b.status = 'active'
          AND b.end_time > CURRENT_TIMESTAMP
          AND (
            $1::boolean = FALSE
            OR LOWER(COALESCE(b.full_name, '')) LIKE $2
            OR LOWER(COALESCE(u.full_name, '')) LIKE $2
            OR LOWER(COALESCE(u.email, '')) = $3
            OR LOWER(COALESCE(u.email, '')) LIKE $2
            OR regexp_replace(COALESCE(b.phone, ''), '[^0-9]', '', 'g') = ANY($4::text[])
            OR regexp_replace(COALESCE(u.phone, ''), '[^0-9]', '', 'g') = ANY($4::text[])
          )
        FOR UPDATE OF b
      ),
      updated AS (
        UPDATE bookings b
        SET status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
        FROM selected s
        WHERE b.id = s.id
        RETURNING b.id
      ),
      actions AS (
        INSERT INTO booking_actions (booking_id, action_type, comment, created_by)
        SELECT id, 'cancelled', 'Массовая отмена администратором', $5
        FROM updated
        RETURNING id
      )
      SELECT COUNT(*)::int AS cancelled_count
      FROM updated
      `,
      [params.hasTarget, params.like, params.email, params.variants, dbActorId(adminUser)]
    );

    await client.query("COMMIT");
    return Number(result.rows[0]?.cancelled_count || 0);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function cancelGameRequestsByTarget(target, adminUser) {
  const client = await gameDb.connect();
  const params = adminTargetParams(target);

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      WITH selected AS (
        SELECT gr.id, gr.copy_id
        FROM game_requests gr
        LEFT JOIN users u ON u.id = gr.auth_user_id
        WHERE gr.status IN ('created', 'approved')
          AND (
            $1::boolean = FALSE
            OR LOWER(COALESCE(gr.full_name, '')) LIKE $2
            OR LOWER(COALESCE(u.full_name, '')) LIKE $2
            OR LOWER(COALESCE(gr.user_email, '')) = $3
            OR LOWER(COALESCE(gr.user_email, '')) LIKE $2
            OR LOWER(COALESCE(u.email, '')) = $3
            OR LOWER(COALESCE(u.email, '')) LIKE $2
            OR regexp_replace(COALESCE(gr.phone, ''), '[^0-9]', '', 'g') = ANY($4::text[])
            OR regexp_replace(COALESCE(u.phone, ''), '[^0-9]', '', 'g') = ANY($4::text[])
          )
        FOR UPDATE OF gr
      ),
      updated AS (
        UPDATE game_requests gr
        SET status = 'cancelled',
            closed_at = CURRENT_TIMESTAMP
        FROM selected s
        WHERE gr.id = s.id
        RETURNING gr.id, s.copy_id
      ),
      returned AS (
        UPDATE game_copies gc
        SET status = 'available'
        WHERE gc.id IN (SELECT copy_id FROM updated WHERE copy_id IS NOT NULL)
          AND gc.status = 'issued'
        RETURNING gc.id
      ),
      actions AS (
        INSERT INTO admin_actions (admin_id, action_type, target_table, target_id, comment)
        SELECT $5, 'cancel_game_request_many', 'game_requests', id, 'Массовая отмена запросов игр администратором'
        FROM updated
        RETURNING id
      )
      SELECT
        (SELECT COUNT(*)::int FROM updated) AS cancelled_count,
        (SELECT COUNT(*)::int FROM returned) AS returned_count
      `,
      [params.hasTarget, params.like, params.email, params.variants, dbActorId(adminUser)]
    );

    await client.query("COMMIT");
    return {
      cancelled: Number(result.rows[0]?.cancelled_count || 0),
      returned: Number(result.rows[0]?.returned_count || 0),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


app.get("/api/health", async (req, res) => {
  try {
    await bookingDb.query("SELECT 1");
    await gameDb.query("SELECT 1");

    res.json({
      ok: true,
      message: "Backend работает, обе базы подключены",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Ошибка подключения к базе",
      error: error.message,
    });
  }
});

async function registerUserHandler(req, res) {
  try {
    const fullName = String(req.body.full_name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: "Заполните ФИО, телефон, почту и пароль" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
    }

    if (email === String(process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase()) {
      return res.status(409).json({
        message: "Эта почта используется администратором. Перейдите во вкладку Вход.",
      });
    }

    const existingByEmail = await findUserByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({ message: "Пользователь с такой почтой уже есть" });
    }

    const existingByPhone = await bookingDb.query(
      `
      SELECT id
      FROM users
      WHERE phone = $1
      LIMIT 1
      `,
      [phone]
    );

    if (existingByPhone.rows.length > 0) {
      return res.status(409).json({ message: "Пользователь с таким телефоном уже есть" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await bookingDb.query(
      `
      INSERT INTO users (full_name, phone, email, password_hash, role, is_email_verified)
      VALUES ($1, $2, $3, $4, 'guest', TRUE)
      RETURNING id, full_name, phone, email, role, campus_city, campus_address, avatar_url
      `,
      [fullName, phone, email, passwordHash]
    );

    const user = userResult.rows[0];
    const safeUser = await attachBanStatus(publicUser(user));

    res.status(201).json({
      message: "Регистрация завершена",
      token: signToken(user),
      user: safeUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Пользователь с такой почтой или телефоном уже есть" });
    }

    console.error("Register error:", error);
    res.status(500).json({ message: "Ошибка регистрации", error: error.message });
  }
}

app.post("/api/auth/register", registerUserHandler);

// Совместимость: если старый app.js случайно отправит на /register/start,
// сервер всё равно зарегистрирует пользователя без кода подтверждения.
app.post("/api/auth/register/start", registerUserHandler);

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Введите почту и пароль" });
    }

    const envAdminEmail = String(process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || "12345");

    // Админ входит по данным из .env. Не создаём/не обновляем админа в users,
    // чтобы не ловить конфликты по email/phone и старым password_hash.
    if (email === envAdminEmail && password === envAdminPassword) {
      const admin = {
        id: 0,
        full_name: "Администратор",
        phone: "",
        email,
        role: "admin",
      };

      return res.json({
        message: "Вход администратора выполнен",
        token: signToken(admin),
        user: admin,
      });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: "Неверная почта или пароль" });
    }


    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.password_hash);
    } catch (_) {
      ok = false;
    }

    if (!ok) {
      return res.status(401).json({ message: "Неверная почта или пароль" });
    }

    const token = signToken(user);
    const safeUser = await attachBanStatus(publicUser(user));
    res.json({
      message: "Вход выполнен",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка входа", error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const envAdminEmail = String(process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || "12345");

    if (email !== envAdminEmail || password !== envAdminPassword) {
      return res.status(401).json({ message: "Неверная почта или пароль администратора" });
    }

    const admin = {
      id: 0,
      full_name: "Администратор",
      phone: "",
      email,
      role: "admin",
    };

    return res.json({
      message: "Админ-доступ разрешен",
      token: signToken(admin),
      user: admin,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Ошибка входа администратора", error: error.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

app.patch("/api/profile/campus", requireAuth, requireNotBanned, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(400).json({ message: "Администратору кампус не нужен" });
    }

    const campusCity = String(req.body.campus_city || "").trim();
    const campusAddress = String(req.body.campus_address || "").trim();

    if (!campusCity || !campusAddress) {
      return res.status(400).json({ message: "Выберите город и адрес кампуса" });
    }

    const result = await bookingDb.query(
      `
      UPDATE users
      SET campus_city = $1,
          campus_address = $2
      WHERE id = $3
      RETURNING id, full_name, phone, email, role, campus_city, campus_address, avatar_url
      `,
      [campusCity, campusAddress, req.user.id]
    );

    res.json({ message: "Кампус сохранён", user: await attachBanStatus(publicUser(result.rows[0])) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/profile/avatar", requireAuth, requireNotBanned, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(400).json({ message: "Администратору аватар не нужен" });
    }

    const avatarUrl = String(req.body.avatar_url || "").trim();
    if (!/^assets\/avatars\/avatar-\d{2}\.svg$/.test(avatarUrl)) {
      return res.status(400).json({ message: "Выберите аватар из списка" });
    }

    const result = await bookingDb.query(
      `
      UPDATE users
      SET avatar_url = $1
      WHERE id = $2
      RETURNING id, full_name, phone, email, role, campus_city, campus_address, avatar_url
      `,
      [avatarUrl, req.user.id]
    );

    res.json({ message: "Аватар сохранён", user: await attachBanStatus(publicUser(result.rows[0])) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/support/messages", requireAuth, async (req, res) => {
  try {
    const result = await bookingDb.query(
      `
      SELECT id, user_id, full_name, email, phone, message, admin_reply, status, answered_at, created_at, updated_at
      FROM support_messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/support/messages", requireAuth, async (req, res) => {
  try {
    const message = String(req.body.message || "").trim();
    if (message.length < 10) {
      return res.status(400).json({ message: "Опишите вопрос подробнее: минимум 10 символов" });
    }
    if (message.length > 1200) {
      return res.status(400).json({ message: "Сообщение слишком длинное. Максимум 1200 символов" });
    }

    const result = await bookingDb.query(
      `
      INSERT INTO support_messages (user_id, full_name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, full_name, email, phone, message, admin_reply, status, answered_at, created_at, updated_at
      `,
      [req.user.id, req.user.full_name || "", req.user.email || "", req.user.phone || "", message]
    );

    res.status(201).json({ message: "Сообщение отправлено администратору", support_message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/profile", requireAuth, async (req, res) => {
  try {
    const bookings = await bookingDb.query(
      `
      SELECT
        b.id,
        b.full_name,
        b.phone,
        b.people_count,
        b.start_time,
        b.end_time,
        b.status,
        b.campus_city,
        b.campus_address,
        c.id AS cabin_id,
        c.cabin_code,
        c.floor_number,
        c.cabin_number,
        c.cabin_type,
        c.capacity,
        TRUE AS is_owner
      FROM bookings b
      JOIN cabins c ON c.id = b.cabin_id
      WHERE b.user_id = $1
      ORDER BY b.start_time DESC
      `,
      [req.user.id]
    );

    const gameRequests = await gameDb.query(
      `
      SELECT
        gr.id,
        gr.full_name,
        gr.phone,
        COALESCE(g.title, 'Неизвестная игра') AS title,
        gr.platform,
        gr.copy_id,
        gr.copy_number,
        gr.receive_type,
        gr.status,
        gr.campus_city,
        gr.campus_address,
        gr.approved_at,
        gr.closed_at,
        gr.created_at
      FROM game_requests gr
      LEFT JOIN games g ON g.id = gr.game_id
      WHERE gr.auth_user_id = $1 OR gr.user_email = $2 OR gr.phone = $3
      ORDER BY gr.created_at DESC
      `,
      [req.user.id, req.user.email, req.user.phone]
    );

    res.json({
      user: req.user,
      bookings: bookings.rows,
      game_requests: gameRequests.rows.map((row) => ({
        ...row,
        receive_type_ru: mapReceiveTypeRu(row.receive_type),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/cabins", async (req, res) => {
  try {
    const result = await bookingDb.query(
      `
      SELECT id, floor_number, cabin_number, cabin_code, cabin_type, capacity, is_active, campus_city, campus_address
      FROM cabins
      WHERE is_active = TRUE
      ORDER BY floor_number, cabin_number
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/cabins/recommendations", async (req, res) => {
  try {
    const people = Number(req.query.people || 1);
    const startTime = req.query.start_time;
    const endTime = req.query.end_time;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Нужно передать start_time и end_time" });
    }

    const result = await bookingDb.query(
      `
      SELECT
        c.id,
        c.floor_number,
        c.cabin_number,
        c.cabin_code,
        c.cabin_type,
        c.capacity,
        c.campus_city,
        c.campus_address,
        COUNT(b.id) = 0 AS free,
        MIN(b.start_time) AS busy_from,
        MAX(b.end_time) AS busy_until,
        STRING_AGG(b.full_name, ', ' ORDER BY b.start_time) AS busy_by
      FROM cabins c
      LEFT JOIN bookings b
        ON b.cabin_id = c.id
       AND b.status = 'active'
       AND tsrange(b.start_time, b.end_time, '[)') && tsrange($2::timestamp, $3::timestamp, '[)')
      WHERE c.is_active = TRUE
        AND c.capacity >= $1
      GROUP BY c.id, c.floor_number, c.cabin_number, c.cabin_code, c.cabin_type, c.capacity, c.campus_city, c.campus_address
      ORDER BY
        (COUNT(b.id) = 0) DESC,
        c.capacity ASC,
        c.floor_number,
        c.cabin_number
      `,
      [people, startTime, endTime]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/bookings", optionalAuth, async (req, res) => {
  try {
    const result = await bookingDb.query(
      `
      SELECT
        b.id,
        b.user_id,
        b.full_name,
        b.phone,
        b.people_count,
        b.start_time,
        b.end_time,
        b.status,
        b.campus_city,
        b.campus_address,
        c.id AS cabin_id,
        c.cabin_code,
        c.floor_number,
        c.cabin_number,
        c.cabin_type,
        c.capacity
      FROM bookings b
      JOIN cabins c ON c.id = b.cabin_id
      WHERE b.status = 'active'
        AND b.end_time > CURRENT_TIMESTAMP
      ORDER BY b.start_time
      `
    );

    const rows = result.rows.map((row) => ({
      ...row,
      is_owner: req.user ? Number(row.user_id) === Number(req.user.id) : false,
      can_manage: req.user ? req.user.role === "admin" || Number(row.user_id) === Number(req.user.id) : false,
    }));

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/bookings", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();

  try {
    const { cabin_id, people_count, start_time, end_time } = req.body;

    if (!cabin_id || !people_count || !start_time || !end_time) {
      return res.status(400).json({ message: "Не хватает данных для бронирования" });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    if (startDate < new Date()) {
      return res.status(400).json({ message: "Нельзя бронировать прошедшее время" });
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > MAX_BOOKING_DURATION_MINUTES) {
      return res.status(400).json({ message: `Бронь кабинки может длиться не больше ${MAX_BOOKING_DURATION_MINUTES} минут` });
    }

    await client.query("BEGIN");

    if (req.user.role !== "admin") {
      await client.query("SELECT pg_advisory_xact_lock($1)", [Number(req.user.id)]);
      const activeUserBooking = await client.query(
        `
        SELECT id
        FROM bookings
        WHERE (user_id = $1 OR regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g') = ANY($2::text[]))
          AND status = 'active'
          AND end_time > CURRENT_TIMESTAMP
        LIMIT 1
        `,
        [req.user.id, phoneVariants(req.user.phone)]
      );

      if (activeUserBooking.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "У вас уже есть активная бронь кабинки. Сначала отмените или освободите текущую бронь." });
      }
    }

    const cabinResult = await client.query(
      `
      SELECT *
      FROM cabins
      WHERE id = $1 AND is_active = TRUE
      `,
      [cabin_id]
    );

    if (cabinResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Кабинка не найдена" });
    }

    const cabin = cabinResult.rows[0];
    if (cabin.campus_city && req.user.campus_city && !sameCampusCity(cabin.campus_city, req.user.campus_city)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "\u041a\u0430\u0431\u0438\u043d\u043a\u0443 \u043c\u043e\u0436\u043d\u043e \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0432 \u0432\u0430\u0448\u0435\u043c \u0442\u0435\u043a\u0443\u0449\u0435\u043c \u0433\u043e\u0440\u043e\u0434\u0435. \u0421\u043c\u0435\u043d\u0438\u0442\u0435 \u0433\u043e\u0440\u043e\u0434 \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435 \u0438\u043b\u0438 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u0435 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u0431\u0440\u043e\u043d\u0438." });
    }

    const campusConflict = await activeBookingCampusConflict(req.user.id, cabin.campus_city || req.user.campus_city, { ignoreCabins: true });
    if (campusConflict) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "\u0423 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u0430\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u0432 \u0434\u0440\u0443\u0433\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435. \u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u0435 \u0435\u0451 \u0438\u043b\u0438 \u0434\u043e\u0436\u0434\u0438\u0442\u0435\u0441\u044c \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f." });
    }

    if (Number(people_count) > Number(cabin.capacity)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Количество человек больше вместимости кабинки" });
    }

    const bookingResult = await client.query(
      `
      INSERT INTO bookings
      (user_id, cabin_id, full_name, phone, people_count, start_time, end_time, status, campus_city, campus_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9)
      RETURNING *
      `,
      [req.user.id, cabin_id, req.user.full_name, req.user.phone, people_count, start_time, end_time, req.user.campus_city || null, req.user.campus_address || null]
    );

    const booking = bookingResult.rows[0];

    await client.query(
      `
      INSERT INTO booking_actions (booking_id, action_type, comment, created_by)
      VALUES ($1, 'created', 'Бронь создана пользователем', $2)
      `,
      [booking.id, dbActorId(req.user)]
    );

    await client.query(
      `
      INSERT INTO push_notifications (user_id, booking_id, title, message, status, sent_at)
      VALUES ($1, $2, $3, $4, 'sent', CURRENT_TIMESTAMP)
      `,
      [req.user.id, booking.id, "Бронь подтверждена", `Кабинка ${cabin.cabin_code} забронирована`]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Бронь создана", booking });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23P01") {
      return res.status(409).json({ message: "Эта кабинка уже занята на выбранное время" });
    }

    res.status(error.statusCode || 500).json({ message: error.message, ban: error.ban || null });
  } finally {
    client.release();
  }
});

app.patch("/api/bookings/:id/extend", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();

  try {
    const bookingId = req.params.id;
    const extendMinutes = Number(req.body.minutes || 30);

    if (extendMinutes !== BOOKING_EXTENSION_MINUTES) {
      return res.status(400).json({ message: `Продлить бронь можно только на ${BOOKING_EXTENSION_MINUTES} минут` });
    }

    await client.query("BEGIN");

    const bookingResult = await client.query(
      `
      SELECT *
      FROM bookings
      WHERE id = $1 AND status = 'active'
      `,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Активная бронь не найдена" });
    }

    const booking = bookingResult.rows[0];
    if (!canManageBooking(req.user, booking)) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Нельзя продлевать чужую бронь" });
    }

    if (new Date(booking.end_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Время брони уже истекло. Продление недоступно." });
    }

    if (req.user.role !== "admin") {
      const extensionCountResult = await client.query(
        `
        SELECT COUNT(*)::int AS total
        FROM booking_actions
        WHERE booking_id = $1 AND action_type = 'extended'
        `,
        [bookingId]
      );
      const extensionCount = Number(extensionCountResult.rows[0]?.total || 0);
      if (extensionCount >= MAX_BOOKING_EXTENSIONS) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: `Бронь можно продлить только ${MAX_BOOKING_EXTENSIONS} раз` });
      }

      const nextDuration = Math.round((new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / 60000) + extendMinutes;
      if (nextDuration > MAX_BOOKING_DURATION_MINUTES) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: `После продления бронь не может быть длиннее ${MAX_BOOKING_DURATION_MINUTES} минут` });
      }
    }

    const updatedResult = await client.query(
      `
      UPDATE bookings
      SET end_time = end_time + ($2 || ' minutes')::interval,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [bookingId, extendMinutes]
    );

    await client.query(
      `
      INSERT INTO booking_actions (booking_id, action_type, old_end_time, new_end_time, comment, created_by)
      VALUES ($1, 'extended', $2, $3, $4, $5)
      `,
      [bookingId, booking.end_time, updatedResult.rows[0].end_time, `Бронь продлена на ${extendMinutes} минут`, dbActorId(req.user)]
    );

    await client.query("COMMIT");

    res.json({ message: "Бронь продлена", booking: updatedResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23P01") {
      return res.status(409).json({ message: "Продление невозможно: дальше кабинка занята" });
    }

    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/bookings/:id/release", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();

  try {
    const bookingId = req.params.id;
    const actorId = dbActorId(req.user);

    await client.query("BEGIN");

    const bookingResult = await client.query(
      `
      SELECT *, (CURRENT_TIMESTAMP < start_time) AS is_future
      FROM bookings
      WHERE id = $1 AND status = 'active'
      `,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Активная бронь не найдена" });
    }

    const booking = bookingResult.rows[0];

    if (!canManageBooking(req.user, booking)) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Можно отменять только свои брони" });
    }

    if (new Date(booking.end_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Время брони уже истекло. Отмена недоступна." });
    }

    const result = await client.query(
      `
      UPDATE bookings
      SET
        status = CASE
          WHEN CURRENT_TIMESTAMP < start_time THEN 'cancelled'
          ELSE 'released'
        END,
        end_time = CASE
          WHEN CURRENT_TIMESTAMP < start_time THEN end_time
          ELSE CURRENT_TIMESTAMP
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND status = 'active'
      RETURNING *
      `,
      [bookingId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Активная бронь не найдена" });
    }

    const updatedBooking = result.rows[0];
    const actionType = updatedBooking.status === "cancelled" ? "cancelled" : "released";
    const comment = updatedBooking.status === "cancelled"
      ? "Бронь отменена до начала"
      : "Бронь досрочно освобождена";

    await client.query(
      `
      INSERT INTO booking_actions (booking_id, action_type, comment, created_by)
      VALUES ($1, $2, $3, $4)
      `,
      [bookingId, actionType, comment, actorId]
    );

    await client.query("COMMIT");

    res.json({
      message: updatedBooking.status === "cancelled" ? "Бронь отменена" : "Бронь досрочно освобождена",
      booking: updatedBooking,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23P01") {
      return res.status(409).json({ message: `${req.body.platform || "Консоль"} на выбранное время уже занята` });
    }
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/admin/bookings/:id/cancel", requireAdmin, async (req, res) => {
  const client = await bookingDb.connect();

  try {
    const bookingId = req.params.id;

    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE bookings
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'active'
      RETURNING *
      `,
      [bookingId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Активная бронь не найдена" });
    }

    await client.query(
      `
      INSERT INTO booking_actions (booking_id, action_type, comment, created_by)
      VALUES ($1, 'cancelled', 'Бронь отменена администратором', $2)
      `,
      [bookingId, dbActorId(req.user)]
    );

    await client.query("COMMIT");

    res.json({ message: "Бронь отменена администратором", booking: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

async function busyConsoleSlots({ db = bookingDb, platform, campusCity, startTime, endTime }) {
  const result = await db.query(
    `
    SELECT console_slot
    FROM console_bookings
    WHERE platform = $1
      AND status = 'active'
      AND COALESCE(campus_city, '') = COALESCE($2, '')
      AND tsrange(start_time, end_time, '[)') && tsrange($3::timestamp, $4::timestamp, '[)')
    `,
    [platform, campusCity || "", startTime, endTime]
  );
  return new Set(result.rows.map((row) => Number(row.console_slot)));
}

app.get("/api/consoles/recommendations", requireAuth, requireNotBanned, async (req, res) => {
  try {
    const startTime = req.query.start_time;
    const endTime = req.query.end_time;
    const campusCity = req.user.campus_city || "";

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Нужно передать start_time и end_time" });
    }

    const platforms = await Promise.all(Object.entries(CONSOLE_CAPACITY).map(async ([platform, capacity]) => {
      const busy = await busyConsoleSlots({ platform, campusCity, startTime, endTime });
      const slots = Array.from({ length: capacity }, (_, index) => {
        const slot = index + 1;
        return {
          slot,
          label: `${platform} ${slot}`,
          free: !busy.has(slot),
        };
      });
      return {
        platform,
        total: capacity,
        available: slots.filter((slot) => slot.free).length,
        slots,
      };
    }));

    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/console-bookings", requireAuth, async (req, res) => {
  try {
    const result = await bookingDb.query(
      `
      SELECT *
      FROM console_bookings
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/console-bookings", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();
  try {
    const platform = String(req.body.platform || "").trim();
    const startTime = req.body.start_time;
    const endTime = req.body.end_time;
    const campusCity = req.user.campus_city || "";
    const campusAddress = req.user.campus_address || "";

    if (!CONSOLE_CAPACITY[platform] || !startTime || !endTime) {
      return res.status(400).json({ message: "Выберите платформу, начало и длительность брони консоли" });
    }

    const durationMinutes = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
    if (new Date(startTime) < new Date()) {
      return res.status(400).json({ message: "Нельзя бронировать прошедшее время" });
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > MAX_BOOKING_DURATION_MINUTES) {
      return res.status(400).json({ message: `Бронь консоли может длиться не больше ${MAX_BOOKING_DURATION_MINUTES} минут` });
    }

    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [Number(req.user.id)]);
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`console:${campusCity}:${platform}`]);

    const campusConflict = await activeBookingCampusConflict(req.user.id, campusCity, { ignoreConsoles: true });
    if (campusConflict) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "\u0423 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u0430\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u0432 \u0434\u0440\u0443\u0433\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435. \u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u0435 \u0435\u0451 \u0438\u043b\u0438 \u0434\u043e\u0436\u0434\u0438\u0442\u0435\u0441\u044c \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f." });
    }

    const activeBooking = await client.query(
      `
      SELECT id, platform, console_slot, end_time
      FROM console_bookings
      WHERE user_id = $1
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
      LIMIT 1
      `,
      [req.user.id]
    );
    if (activeBooking.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "У вас уже есть активная бронь консоли. Сначала отмените или дождитесь окончания." });
    }

    const busy = await busyConsoleSlots({ db: client, platform, campusCity, startTime, endTime });
    const slot = Array.from({ length: CONSOLE_CAPACITY[platform] }, (_, index) => index + 1).find((item) => !busy.has(item));
    if (!slot) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `${platform} на выбранное время уже заняты` });
    }

    const result = await client.query(
      `
      INSERT INTO console_bookings (user_id, full_name, phone, platform, console_slot, start_time, end_time, campus_city, campus_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [req.user.id, req.user.full_name || "", req.user.phone || "", platform, slot, startTime, endTime, campusCity, campusAddress]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: `Консоль ${platform} ${slot} забронирована`, console_booking: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/console-bookings/:id/extend", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();

  try {
    const bookingId = Number(req.params.id);
    const extendMinutes = Number(req.body.minutes || BOOKING_EXTENSION_MINUTES);

    if (!bookingId) {
      return res.status(400).json({ message: "\u041d\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438" });
    }
    if (extendMinutes !== BOOKING_EXTENSION_MINUTES) {
      return res.status(400).json({ message: `\u041f\u0440\u043e\u0434\u043b\u0438\u0442\u044c \u0431\u0440\u043e\u043d\u044c \u043c\u043e\u0436\u043d\u043e \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 ${BOOKING_EXTENSION_MINUTES} \u043c\u0438\u043d\u0443\u0442` });
    }

    await client.query("BEGIN");

    const bookingResult = await client.query(
      `
      SELECT *
      FROM console_bookings
      WHERE id = $1
        AND status = 'active'
      FOR UPDATE
      `,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "\u0410\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430" });
    }

    const booking = bookingResult.rows[0];
    const isOwner = req.user.role === "admin" || Number(booking.user_id) === Number(req.user.id);
    if (!isOwner) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "\u041d\u0435\u043b\u044c\u0437\u044f \u043f\u0440\u043e\u0434\u043b\u0435\u0432\u0430\u0442\u044c \u0447\u0443\u0436\u0443\u044e \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438" });
    }

    if (new Date(booking.end_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "\u0412\u0440\u0435\u043c\u044f \u0431\u0440\u043e\u043d\u0438 \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u0443\u0436\u0435 \u0438\u0441\u0442\u0435\u043a\u043b\u043e. \u041f\u0440\u043e\u0434\u043b\u0435\u043d\u0438\u0435 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e." });
    }

    const extensionCount = Number(booking.extension_count || 0);
    if (req.user.role !== "admin" && extensionCount >= MAX_BOOKING_EXTENSIONS) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `\u0411\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043c\u043e\u0436\u043d\u043e \u043f\u0440\u043e\u0434\u043b\u0438\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e ${MAX_BOOKING_EXTENSIONS} \u0440\u0430\u0437` });
    }

    const nextDuration = Math.round((new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / 60000) + extendMinutes;
    if (req.user.role !== "admin" && nextDuration > MAX_BOOKING_DURATION_MINUTES) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `\u041f\u043e\u0441\u043b\u0435 \u043f\u0440\u043e\u0434\u043b\u0435\u043d\u0438\u044f \u0431\u0440\u043e\u043d\u044c \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u0434\u043b\u0438\u043d\u043d\u0435\u0435 ${MAX_BOOKING_DURATION_MINUTES} \u043c\u0438\u043d\u0443\u0442` });
    }

    const updatedResult = await client.query(
      `
      UPDATE console_bookings
      SET end_time = end_time + ($2 || ' minutes')::interval,
          extension_count = extension_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [bookingId, extendMinutes]
    );

    await client.query("COMMIT");
    res.json({ message: "\u0411\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043f\u0440\u043e\u0434\u043b\u0435\u043d\u0430", console_booking: updatedResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23P01") {
      return res.status(409).json({ message: "\u041f\u0440\u043e\u0434\u043b\u0435\u043d\u0438\u0435 \u043d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e: \u0434\u0430\u043b\u044c\u0448\u0435 \u044d\u0442\u0430 \u043a\u043e\u043d\u0441\u043e\u043b\u044c \u0437\u0430\u043d\u044f\u0442\u0430" });
    }

    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.post("/api/console-bookings/:id/cancel", requireAuth, requireNotBanned, async (req, res) => {
  const client = await bookingDb.connect();
  const gameClient = await gameDb.connect();
  let bookingStarted = false;
  let gameStarted = false;

  try {
    const bookingId = Number(req.params.id);
    if (!bookingId) return res.status(400).json({ message: "\u041d\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438" });

    await client.query("BEGIN");
    bookingStarted = true;

    const bookingResult = await client.query(
      `
      SELECT *
      FROM console_bookings
      WHERE id = $1
        AND user_id = $2
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
      FOR UPDATE
      `,
      [bookingId, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      bookingStarted = false;
      return res.status(404).json({ message: "\u0410\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430" });
    }

    await gameClient.query("BEGIN");
    gameStarted = true;

    const linkedGames = await gameClient.query(
      `
      SELECT id, copy_id, status
      FROM game_requests
      WHERE console_booking_id = $1
        AND status IN ('created', 'approved')
      FOR UPDATE
      `,
      [bookingId]
    );

    const copyIds = linkedGames.rows
      .filter((row) => row.copy_id && row.status === "approved")
      .map((row) => row.copy_id);

    if (copyIds.length > 0) {
      await gameClient.query(
        `
        UPDATE game_copies
        SET status = 'available'
        WHERE id = ANY($1::int[])
          AND status = 'issued'
        `,
        [copyIds]
      );
    }

    if (linkedGames.rows.length > 0) {
      await gameClient.query(
        `
        UPDATE game_requests
        SET status = 'cancelled',
            closed_at = CURRENT_TIMESTAMP
        WHERE console_booking_id = $1
          AND status IN ('created', 'approved')
        `,
        [bookingId]
      );
    }

    const result = await client.query(
      `
      UPDATE console_bookings
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND user_id = $2
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
      RETURNING *
      `,
      [bookingId, req.user.id]
    );

    await gameClient.query("COMMIT");
    gameStarted = false;
    await client.query("COMMIT");
    bookingStarted = false;

    const cancelledGames = linkedGames.rows.length;
    res.json({
      message: cancelledGames
        ? "\u0411\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430. \u0411\u0440\u043e\u043d\u044c \u0438\u0433\u0440\u044b \u0442\u043e\u0436\u0435 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430."
        : "\u0411\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430",
      console_booking: result.rows[0],
      cancelled_game_requests: cancelledGames,
    });
  } catch (error) {
    if (gameStarted) await gameClient.query("ROLLBACK");
    if (bookingStarted) await client.query("ROLLBACK");
    console.error("Cancel console booking error:", error);
    res.status(500).json({ message: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438" });
  } finally {
    gameClient.release();
    client.release();
  }
});
app.get("/api/games", async (req, res) => {
  try {
    const result = await gameDb.query(
      `
      SELECT
        g.id AS game_id,
        g.title,
        g.image_url,
        g.youtube_id,
        g.screenshots,
        gc.platform,
        COUNT(gc.id)::int AS total_count,
        COUNT(gc.id) FILTER (WHERE gc.status = 'available')::int AS available_count,
        COALESCE(
          json_agg(
            json_build_object(
              'copy_number', gc.copy_number,
              'status', gc.status
            )
            ORDER BY gc.copy_number
          ) FILTER (WHERE gc.id IS NOT NULL),
          '[]'::json
        ) AS copies
      FROM games g
      LEFT JOIN game_copies gc ON gc.game_id = g.id AND gc.is_active = TRUE
      WHERE g.is_active = TRUE
      GROUP BY g.id, g.title, g.image_url, g.youtube_id, g.screenshots, gc.platform
      ORDER BY g.title, gc.platform
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/game-requests", optionalAuth, async (req, res) => {
  try {
    if (!req.user) return res.json([]);

    const params = [];
    let where = "WHERE gr.auth_user_id = $1 OR gr.user_email = $2 OR gr.phone = $3";
    params.push(req.user.id, req.user.email, req.user.phone);

    if (req.user.role === "admin") {
      where = "";
      params.length = 0;
    }

    const result = await gameDb.query(
      `
      SELECT
        gr.id,
        gr.auth_user_id,
        gr.user_email,
        gr.full_name,
        gr.phone,
        COALESCE(g.title, 'Неизвестная игра') AS title,
        gr.platform,
        gr.copy_id,
        gr.copy_number,
        gr.receive_type,
        gr.status,
        gr.campus_city,
        gr.campus_address,
        gr.approved_at,
        gr.closed_at,
        gr.created_at
      FROM game_requests gr
      LEFT JOIN games g ON g.id = gr.game_id
      ${where}
      ORDER BY gr.created_at DESC
      `,
      params
    );

    const rows = result.rows.map((row) => ({
      ...row,
      receive_type_ru: mapReceiveTypeRu(row.receive_type),
    }));

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/game-requests", requireAuth, requireNotBanned, async (req, res) => {
  const client = await gameDb.connect();

  try {
    const { title, platform, copy_number, receive_type, console_booking_id } = req.body;

    if (!title || !platform || !copy_number || !receive_type || !console_booking_id) {
      return res.status(400).json({ message: "Сначала забронируйте консоль, затем выберите игру" });
    }

    const consoleBookingResult = await bookingDb.query(
      `
      SELECT id, platform, console_slot, start_time, end_time, campus_city, campus_address
      FROM console_bookings
      WHERE id = $1
        AND user_id = $2
        AND status = 'active'
        AND end_time > CURRENT_TIMESTAMP
      `,
      [Number(console_booking_id), req.user.id]
    );
    if (consoleBookingResult.rows.length === 0) {
      return res.status(409).json({ message: "Активная бронь консоли не найдена. Сначала забронируйте консоль." });
    }
    const consoleBooking = consoleBookingResult.rows[0];
    if (consoleBooking.platform !== platform) {
      return res.status(409).json({ message: `Эта бронь консоли для ${consoleBooking.platform}. Выберите игру для этой платформы.` });
    }
    if (req.user.campus_city && consoleBooking.campus_city && !sameCampusCity(req.user.campus_city, consoleBooking.campus_city)) {
      return res.status(409).json({ message: "\u0410\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438 \u0441\u043e\u0437\u0434\u0430\u043d\u0430 \u0432 \u0434\u0440\u0443\u0433\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435. \u0427\u0442\u043e\u0431\u044b \u0432\u0437\u044f\u0442\u044c \u0438\u0433\u0440\u0443 \u0432 \u043d\u043e\u0432\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435, \u0441\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u0435 \u0431\u0440\u043e\u043d\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u0438." });
    }

    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [Number(req.user.id)]);

    const activeRequestResult = await client.query(
      `
      SELECT
        gr.id,
        gr.platform,
        gr.copy_number,
        gr.status,
        COALESCE(g.title, 'Игра') AS title
      FROM game_requests gr
      LEFT JOIN games g ON g.id = gr.game_id
      WHERE gr.status IN ('created', 'approved')
        AND (
          gr.auth_user_id = $1
          OR LOWER(COALESCE(gr.user_email, '')) = LOWER($2)
          OR regexp_replace(COALESCE(gr.phone, ''), '[^0-9]', '', 'g') = ANY($3::text[])
        )
      ORDER BY gr.created_at DESC
      LIMIT 1
      `,
      [req.user.id, req.user.email || '', phoneVariants(req.user.phone)]
    );

    if (activeRequestResult.rows.length > 0) {
      const active = activeRequestResult.rows[0];
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: `У вас уже есть активная бронь игры: ${active.title} · ${active.platform}${active.copy_number ? ` · копия ${active.copy_number}` : ""}. Чтобы взять новую игру, отмените текущую бронь в профиле или попросите администратора сбросить её.`,
        active_request: active,
      });
    }

    const gameResult = await client.query(
      `
      SELECT *
      FROM games
      WHERE LOWER(title) = LOWER($1) AND is_active = TRUE
      `,
      [title]
    );

    if (gameResult.rows.length === 0) {
      const requestResult = await client.query(
        `
        INSERT INTO game_requests
        (auth_user_id, user_email, full_name, phone, game_id, copy_id, platform, copy_number, receive_type, status, campus_city, campus_address, console_booking_id)
        VALUES ($1, $2, $3, $4, NULL, NULL, $5, $6, $7, 'not_found', $8, $9, $10)
        RETURNING *
        `,
        [req.user.id, req.user.email, req.user.full_name, req.user.phone, platform, copy_number, mapReceiveType(receive_type), consoleBooking.campus_city || null, consoleBooking.campus_address || null, Number(console_booking_id)]
      );

      await client.query(
        `
        INSERT INTO sms_notifications (request_id, phone, message, status, sent_at)
        VALUES ($1, $2, $3, 'sent', CURRENT_TIMESTAMP)
        `,
        [requestResult.rows[0].id, req.user.phone, `SMS: игры ${title} нет в каталоге.`]
      );

      await client.query("COMMIT");

      return res.status(404).json({ message: `Игры ${title} нет в каталоге`, request: requestResult.rows[0] });
    }

    const game = gameResult.rows[0];

    const copyResult = await client.query(
      `
      SELECT *
      FROM game_copies
      WHERE game_id = $1 AND platform = $2 AND copy_number = $3 AND status = 'available' AND is_active = TRUE
      `,
      [game.id, platform, copy_number]
    );

    if (copyResult.rows.length === 0) {
      const requestResult = await client.query(
        `
        INSERT INTO game_requests
        (auth_user_id, user_email, full_name, phone, game_id, copy_id, platform, copy_number, receive_type, status, campus_city, campus_address, console_booking_id)
        VALUES ($1, $2, $3, $4, $5, NULL, $6, $7, $8, 'not_available', $9, $10, $11)
        RETURNING *
        `,
        [req.user.id, req.user.email, req.user.full_name, req.user.phone, game.id, platform, copy_number, mapReceiveType(receive_type), consoleBooking.campus_city || null, consoleBooking.campus_address || null, Number(console_booking_id)]
      );

      await client.query(
        `
        INSERT INTO sms_notifications (request_id, phone, message, status, sent_at)
        VALUES ($1, $2, $3, 'sent', CURRENT_TIMESTAMP)
        `,
        [requestResult.rows[0].id, req.user.phone, `SMS: игры ${title} сейчас нет в наличии.`]
      );

      await client.query("COMMIT");

      return res.status(409).json({ message: `Игры ${title} сейчас нет в наличии`, request: requestResult.rows[0] });
    }

    const copy = copyResult.rows[0];

    await client.query(
      `
      UPDATE game_copies
      SET status = 'issued'
      WHERE id = $1
      `,
      [copy.id]
    );

    const requestResult = await client.query(
      `
      INSERT INTO game_requests
      (auth_user_id, user_email, full_name, phone, game_id, copy_id, platform, copy_number, receive_type, status, approved_at, campus_city, campus_address, console_booking_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'approved', CURRENT_TIMESTAMP, $10, $11, $12)
      RETURNING *
      `,
      [req.user.id, req.user.email, req.user.full_name, req.user.phone, game.id, copy.id, platform, copy_number, mapReceiveType(receive_type), consoleBooking.campus_city || null, consoleBooking.campus_address || null, Number(console_booking_id)]
    );

    await client.query(
      `
      INSERT INTO sms_notifications (request_id, phone, message, status, sent_at)
      VALUES ($1, $2, $3, 'sent', CURRENT_TIMESTAMP)
      `,
      [requestResult.rows[0].id, req.user.phone, `SMS: игра ${title} есть, выдача оформлена.`]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: `Игра ${title} выдана`, request: requestResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(error.statusCode || 500).json({ message: error.message, ban: error.ban || null });
  } finally {
    client.release();
  }
});


app.patch("/api/game-requests/:id/cancel", requireAuth, requireNotBanned, async (req, res) => {
  const client = await gameDb.connect();

  try {
    const requestId = req.params.id;

    await client.query("BEGIN");

    const requestResult = await client.query(
      `
      SELECT id, auth_user_id, user_email, phone, copy_id, status
      FROM game_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Запрос игры не найден" });
    }

    const request = requestResult.rows[0];
    const isOwner = Number(request.auth_user_id) === Number(req.user.id)
      || String(request.user_email || "").toLowerCase() === String(req.user.email || "").toLowerCase()
      || String(request.phone || "") === String(req.user.phone || "");

    if (req.user.role !== "admin" && !isOwner) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Можно отменять только свои запросы игр" });
    }

    if (request.status === "cancelled") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Запрос уже отменён" });
    }

    if (request.status === "completed") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Завершённый запрос нельзя отменить" });
    }

    if (!["created", "approved"].includes(request.status)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Отменять можно только активный запрос игры" });
    }

    await client.query(
      `
      UPDATE game_requests
      SET status = 'cancelled',
          closed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [requestId]
    );

    if (request.copy_id && request.status === "approved") {
      await client.query(
        `
        UPDATE game_copies
        SET status = 'available'
        WHERE id = $1
          AND status = 'issued'
        `,
        [request.copy_id]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Запрос игры отменён, копия возвращена в наличие" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/admin/game-requests/:id/cancel", requireAdmin, async (req, res) => {
  const client = await gameDb.connect();

  try {
    const requestId = req.params.id;

    await client.query("BEGIN");

    const requestResult = await client.query(
      `
      SELECT id, copy_id, status
      FROM game_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Запрос игры не найден" });
    }

    const request = requestResult.rows[0];

    if (request.status === "cancelled") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Запрос уже отменён" });
    }

    if (request.status === "completed") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Завершённый запрос нельзя отменить" });
    }

    if (!["created", "approved"].includes(request.status)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Отменять можно только активный запрос игры" });
    }

    await client.query(
      `
      UPDATE game_requests
      SET status = 'cancelled',
          closed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [requestId]
    );

    if (request.copy_id && request.status === "approved") {
      await client.query(
        `
        UPDATE game_copies
        SET status = 'available'
        WHERE id = $1
          AND status = 'issued'
        `,
        [request.copy_id]
      );
    }

    await client.query(
      `
      INSERT INTO admin_actions (admin_id, action_type, target_table, target_id, comment)
      VALUES ($1, 'cancel_game_request', 'game_requests', $2, 'Админ отменил запрос на выдачу игры')
      `,
      [dbActorId(req.user), requestId]
    );

    await client.query("COMMIT");

    res.json({ message: "Запрос игры отменён" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.post("/api/admin/games", requireAdmin, async (req, res) => {
  const client = await gameDb.connect();

  try {
    const { title, platform, total, image_url, youtube_id, screenshots, is_active } = req.body;
    const totalCopies = Number(total);
    const cleanYoutubeId = youtubeIdFromInput(youtube_id);
    const cleanScreenshots = normalizeScreenshots(screenshots);

    if (!title || !platform || !Number.isFinite(totalCopies) || totalCopies < 1) {
      return res.status(400).json({ message: "Нужно передать title, platform и total" });
    }

    await client.query("BEGIN");

    const existingGameResult = await client.query(
      "SELECT * FROM games WHERE LOWER(title) = LOWER($1) LIMIT 1",
      [title]
    );

    const gameResult = existingGameResult.rows.length
      ? await client.query(
          `
          UPDATE games
          SET
            title = $1,
            image_url = COALESCE($2, image_url),
            youtube_id = COALESCE($3, youtube_id),
            screenshots = CASE
              WHEN jsonb_array_length($4::jsonb) > 0 THEN $4::jsonb
              ELSE screenshots
            END,
            is_active = $6
          WHERE id = $5
          RETURNING *
          `,
          [title, image_url || null, cleanYoutubeId, JSON.stringify(cleanScreenshots), existingGameResult.rows[0].id, is_active !== false]
        )
      : await client.query(
          `
          INSERT INTO games (title, image_url, youtube_id, screenshots, is_active)
          VALUES ($1, $2, $3, $4::jsonb, $5)
          RETURNING *
          `,
          [title, image_url || null, cleanYoutubeId, JSON.stringify(cleanScreenshots), is_active !== false]
        );

    const game = gameResult.rows[0];

    await client.query(
      `
      UPDATE game_copies
      SET is_active = TRUE
      WHERE game_id = $1 AND platform = $2 AND copy_number <= $3
      `,
      [game.id, platform, totalCopies]
    );

    await client.query(
      `
      UPDATE game_copies
      SET is_active = FALSE
      WHERE game_id = $1 AND platform = $2 AND copy_number > $3
      `,
      [game.id, platform, totalCopies]
    );

    for (let i = 1; i <= totalCopies; i += 1) {
      await client.query(
        `
        INSERT INTO game_copies (game_id, platform, copy_number, status, is_active)
        VALUES ($1, $2, $3, 'available', TRUE)
        ON CONFLICT (game_id, platform, copy_number)
        DO UPDATE SET is_active = TRUE
        `,
        [game.id, platform, i]
      );
    }

    await client.query(
      `
      INSERT INTO admin_actions (admin_id, action_type, target_table, target_id, comment)
      VALUES ($1, 'add_game', 'games', $2, $3)
      `,
      [dbActorId(req.user), game.id, `Добавлена или обновлена игра ${title}`]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Игра добавлена или обновлена", game });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const result = await bookingDb.query(`
      SELECT
        u.id,
        u.full_name,
        u.phone,
        u.email,
        u.role,
        u.campus_city,
        u.campus_address,
        u.avatar_url,
        u.created_at,
        ub.id AS ban_id,
        ub.reason AS ban_reason,
        ub.created_at AS banned_at
      FROM users u
      LEFT JOIN LATERAL (
        SELECT id, reason, created_at
        FROM user_bans
        WHERE user_id = u.id AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 1
      ) ub ON TRUE
      ORDER BY u.created_at DESC
    `);

    res.json(result.rows.map((row) => ({
      ...row,
      ban: row.ban_id ? { is_banned: true, reason: row.ban_reason, created_at: row.banned_at } : { is_banned: false, reason: "" },
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function cancelActiveReservationsForUser(userId) {
  const bookingClient = await bookingDb.connect();
  const gameClient = await gameDb.connect();
  let bookingStarted = false;
  let gameStarted = false;

  try {
    await gameClient.query("BEGIN");
    gameStarted = true;

    const cancelledGames = await gameClient.query(
      `
      WITH cancelled AS (
        UPDATE game_requests
        SET status = 'cancelled',
            closed_at = CURRENT_TIMESTAMP
        WHERE auth_user_id = $1
          AND status IN ('created', 'approved')
        RETURNING copy_id
      ),
      returned AS (
        UPDATE game_copies
        SET status = 'available'
        WHERE id IN (SELECT copy_id FROM cancelled WHERE copy_id IS NOT NULL)
          AND status = 'issued'
        RETURNING id
      )
      SELECT
        (SELECT COUNT(*)::int FROM cancelled) AS cancelled_count,
        (SELECT COUNT(*)::int FROM returned) AS returned_count
      `,
      [userId]
    );

    await bookingClient.query("BEGIN");
    bookingStarted = true;

    const cancelledCabins = await bookingClient.query(
      `
      UPDATE bookings
      SET status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND status = 'active'
      RETURNING id
      `,
      [userId]
    );

    const cancelledConsoles = await bookingClient.query(
      `
      UPDATE console_bookings
      SET status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND status = 'active'
      RETURNING id
      `,
      [userId]
    );

    await gameClient.query("COMMIT");
    gameStarted = false;
    await bookingClient.query("COMMIT");
    bookingStarted = false;

    return {
      cabin_bookings: cancelledCabins.rowCount || 0,
      console_bookings: cancelledConsoles.rowCount || 0,
      game_requests: Number(cancelledGames.rows[0]?.cancelled_count || 0),
      returned_game_copies: Number(cancelledGames.rows[0]?.returned_count || 0),
    };
  } catch (error) {
    if (gameStarted) await gameClient.query("ROLLBACK");
    if (bookingStarted) await bookingClient.query("ROLLBACK");
    throw error;
  } finally {
    gameClient.release();
    bookingClient.release();
  }
}

async function syncGameRequestCampusesFromConsoles() {
  const gameRows = await gameDb.query(
    `
    SELECT id, console_booking_id
    FROM game_requests
    WHERE console_booking_id IS NOT NULL
      AND status IN ('created', 'approved')
    `
  );

  const bookingIds = [...new Set(gameRows.rows.map((row) => Number(row.console_booking_id)).filter(Boolean))];
  if (bookingIds.length === 0) return 0;

  const consoleRows = await bookingDb.query(
    `
    SELECT id, campus_city, campus_address
    FROM console_bookings
    WHERE id = ANY($1::int[])
    `,
    [bookingIds]
  );

  const campusByBookingId = new Map(consoleRows.rows.map((row) => [Number(row.id), row]));
  let updated = 0;

  for (const request of gameRows.rows) {
    const campus = campusByBookingId.get(Number(request.console_booking_id));
    if (!campus) continue;
    const result = await gameDb.query(
      `
      UPDATE game_requests
      SET campus_city = $1,
          campus_address = $2
      WHERE id = $3
        AND (
          COALESCE(campus_city, '') <> COALESCE($1, '')
          OR COALESCE(campus_address, '') <> COALESCE($2, '')
        )
      `,
      [campus.campus_city || null, campus.campus_address || null, request.id]
    );
    updated += result.rowCount || 0;
  }

  return updated;
}

async function normalizeStoredCampusAddresses() {
  const replacements = [
    ["Р‘", "Б"],
    ["Р’", "В"],
    ["Р“", "Г"],
    ["Р”", "Д"],
    ["P`", "Б"],
    ["P'", "Б"],
  ];
  const bookingTables = ["users", "cabins", "bookings", "console_bookings"];

  for (const [from, to] of replacements) {
    for (const table of bookingTables) {
      await bookingDb.query(
        `UPDATE ${table} SET campus_address = REPLACE(campus_address, $1, $2) WHERE campus_address LIKE '%' || $1 || '%'`,
        [from, to]
      );
    }
    await gameDb.query(
      "UPDATE game_requests SET campus_address = REPLACE(campus_address, $1, $2) WHERE campus_address LIKE '%' || $1 || '%'",
      [from, to]
    );
  }
}

app.post("/api/admin/users/:id/ban", requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const reason = String(req.body.reason || "Нарушение правил").trim();
    if (!userId) return res.status(400).json({ message: "Неверный пользователь" });

    await bookingDb.query(
      "UPDATE user_bans SET is_active = FALSE, lifted_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND is_active = TRUE",
      [userId]
    );

    const result = await bookingDb.query(
      `
      INSERT INTO user_bans (user_id, reason, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, reason, dbActorId(req.user)]
    );

    const cancelled = await cancelActiveReservationsForUser(userId);

    res.status(201).json({
      message: "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0437\u0430\u0431\u0430\u043d\u0435\u043d. \u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u0431\u0440\u043e\u043d\u0438 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u044b.",
      ban: result.rows[0],
      cancelled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/admin/users/:id/unban", requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ message: "Неверный пользователь" });

    const result = await bookingDb.query(
      "UPDATE user_bans SET is_active = FALSE, lifted_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND is_active = TRUE",
      [userId]
    );

    res.json({ message: "Бан снят", cleared: result.rowCount || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ message: "Неверный пользователь" });

    await bookingDb.query(
      "UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND status = 'active'",
      [userId]
    );
    await gameDb.query(
      `
      WITH cancelled AS (
        UPDATE game_requests
        SET status = 'cancelled',
            closed_at = CURRENT_TIMESTAMP
        WHERE auth_user_id = $1
          AND status IN ('created', 'approved')
        RETURNING copy_id
      )
      UPDATE game_copies
      SET status = 'available'
      WHERE id IN (SELECT copy_id FROM cancelled WHERE copy_id IS NOT NULL)
        AND status = 'issued'
      `,
      [userId]
    );
    await bookingDb.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "Пользователь удалён" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/admin/cabins", requireAdmin, async (req, res) => {
  try {
    const result = await bookingDb.query(`
      SELECT id, floor_number, cabin_number, cabin_code, cabin_type, capacity, is_active, campus_city, campus_address
      FROM cabins
      ORDER BY floor_number, cabin_number
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/admin/cabins", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.body.id || 0);
    const floor = Number(req.body.floor_number);
    const number = Number(req.body.cabin_number);
    const code = String(req.body.cabin_code || "").trim();
    const type = String(req.body.cabin_type || "").trim();
    const capacity = Number(req.body.capacity);
    const campusCity = String(req.body.campus_city || "").trim();
    const campusAddress = String(req.body.campus_address || "").trim();
    const isActive = req.body.is_active !== false;

    if (!Number.isFinite(floor) || !Number.isFinite(number) || !code || !type || !Number.isFinite(capacity) || capacity < 1 || !campusCity || !campusAddress) {
      return res.status(400).json({ message: "Заполните этаж, номер, код, тип и вместимость кабинки" });
    }

    const result = id
      ? await bookingDb.query(
          `
          UPDATE cabins
          SET floor_number = $1,
              cabin_number = $2,
              cabin_code = $3,
              cabin_type = $4,
              capacity = $5,
              campus_city = $6,
              campus_address = $7,
              is_active = $8
          WHERE id = $9
          RETURNING *
          `,
          [floor, number, code, type, capacity, campusCity, campusAddress, isActive, id]
        )
      : await bookingDb.query(
          `
          INSERT INTO cabins (floor_number, cabin_number, cabin_code, cabin_type, capacity, campus_city, campus_address, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
          `,
          [floor, number, code, type, capacity, campusCity, campusAddress, isActive]
        );

    res.status(id ? 200 : 201).json({ message: "Кабинка сохранена", cabin: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/admin/cabins/:id", requireAdmin, async (req, res) => {
  try {
    const cabinId = Number(req.params.id);
    if (!cabinId) return res.status(400).json({ message: "Неверная кабинка" });

    const usage = await bookingDb.query("SELECT COUNT(*)::int AS total FROM bookings WHERE cabin_id = $1", [cabinId]);
    if (Number(usage.rows[0]?.total || 0) > 0) {
      await bookingDb.query("UPDATE cabins SET is_active = FALSE WHERE id = $1", [cabinId]);
      return res.json({ message: "У кабинки есть история броней, поэтому она скрыта вместо удаления", hidden: true });
    }

    await bookingDb.query("DELETE FROM cabins WHERE id = $1", [cabinId]);
    res.json({ message: "Кабинка удалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/admin/games", requireAdmin, async (req, res) => {
  try {
    const result = await gameDb.query(`
      SELECT
        g.id AS game_id,
        g.title,
        g.image_url,
        g.youtube_id,
        g.screenshots,
        g.is_active,
        COALESCE(COUNT(gc.id) FILTER (WHERE gc.platform = 'Xbox' AND gc.is_active = TRUE), 0)::int AS xbox_total,
        COALESCE(COUNT(gc.id) FILTER (WHERE gc.platform = 'PlayStation' AND gc.is_active = TRUE), 0)::int AS playstation_total
      FROM games g
      LEFT JOIN game_copies gc ON gc.game_id = g.id
      GROUP BY g.id
      ORDER BY g.title
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/admin/games/:id", requireAdmin, async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    if (!gameId) return res.status(400).json({ message: "Неверная игра" });

    await gameDb.query("DELETE FROM games WHERE id = $1", [gameId]);
    res.json({ message: "Игра удалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/admin/support/messages", requireAdmin, async (req, res) => {
  try {
    const result = await bookingDb.query(`
      SELECT id, user_id, full_name, email, phone, message, admin_reply, status, answered_by, answered_at, created_at, updated_at
      FROM support_messages
      ORDER BY
        CASE status WHEN 'open' THEN 0 WHEN 'answered' THEN 1 ELSE 2 END,
        created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/support/messages/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || "answered").trim();
    const reply = String(req.body.admin_reply || "").trim();

    if (!id) return res.status(400).json({ message: "Неверное обращение" });
    if (!["open", "answered", "closed"].includes(status)) {
      return res.status(400).json({ message: "Неверный статус обращения" });
    }
    if (status === "answered" && reply.length < 2) {
      return res.status(400).json({ message: "Напишите ответ пользователю" });
    }

    const result = await bookingDb.query(
      `
      UPDATE support_messages
      SET admin_reply = CASE WHEN $2 = '' THEN admin_reply ELSE $2 END,
          status = $3,
          answered_by = CASE WHEN $2 = '' THEN answered_by ELSE $4 END,
          answered_at = CASE WHEN $2 = '' THEN answered_at ELSE CURRENT_TIMESTAMP END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, user_id, full_name, email, phone, message, admin_reply, status, answered_by, answered_at, created_at, updated_at
      `,
      [id, reply, status, dbActorId(req.user)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Обращение не найдено" });
    }

    res.json({ message: "Обращение обновлено", support_message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/admin/bookings/cancel-many", requireAdmin, async (req, res) => {
  try {
    const target = String(req.body.target || "").trim();
    const cancelled = await cancelCabinBookingsByTarget(target, req.user);
    res.json({
      message: target
        ? `Отменено броней кабинок у пользователя: ${cancelled}`
        : `Отменено активных броней кабинок: ${cancelled}`,
      cancelled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/admin/game-requests/cancel-many", requireAdmin, async (req, res) => {
  try {
    const target = String(req.body.target || "").trim();
    const result = await cancelGameRequestsByTarget(target, req.user);
    res.json({
      message: target
        ? `Отменено броней игр у пользователя: ${result.cancelled}. Возвращено копий: ${result.returned}`
        : `Отменено активных броней игр: ${result.cancelled}. Возвращено копий: ${result.returned}`,
      cancelled: result.cancelled,
      returned: result.returned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function clearSpamBans(pool) {
  const result = await bookingDb.query(
    "UPDATE user_bans SET is_active = FALSE, lifted_at = CURRENT_TIMESTAMP WHERE is_active = TRUE"
  );
  return result.rowCount || 0;
}

app.post("/api/admin/clear-bans", requireAdmin, async (req, res) => {
  try {
    const bookingCount = await clearSpamBans();

    res.json({
      message: "Баны сняты. Пользователи снова могут работать с сайтом.",
      cleared: bookingCount,
    });
  } catch (error) {
    console.error("Clear bans error:", error);
    res.status(500).json({ message: "Не удалось снять баны", error: error.message });
  }
});

app.post("/api/admin/reset-demo", requireAdmin, async (req, res) => {
  try {
    await bookingDb.query("DELETE FROM push_notifications");
    await bookingDb.query("DELETE FROM booking_actions");
    await bookingDb.query("DELETE FROM console_bookings");
    await bookingDb.query("DELETE FROM bookings");
    await bookingDb.query("UPDATE user_bans SET is_active = FALSE, lifted_at = CURRENT_TIMESTAMP WHERE is_active = TRUE");

    await gameDb.query("DELETE FROM sms_notifications");
    await gameDb.query("DELETE FROM game_requests");
    await gameDb.query("UPDATE game_copies SET status = 'available'");

    res.json({ message: "Брони, запросы игр и уведомления очищены" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function startServer() {
  await ensureCoreSchema();
  await ensureGameLocationSchema();
  await ensureGameMediaSchema();
  await normalizeStoredCampusAddresses();
  await syncGameRequestCampusesFromConsoles();
  await cleanupExpiredReservations();
  setInterval(() => {
    cleanupExpiredReservations().catch((error) => {
      console.error("Expired reservations cleanup error:", error);
    });
  }, 60 * 1000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log(`Для других устройств в сети: http://IP_ТВОЕГО_КОМПЬЮТЕРА:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Не удалось запустить сервер:", error);
  process.exit(1);
});
