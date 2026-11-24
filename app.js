const OLD_STORAGE_KEY = "slc_reservation_site_v1";
const THEME_KEY = "slc_theme";
const AUTH_KEY = "slc_auth_v2";
const ADMIN_SESSION_KEY = "slc_admin_authenticated";

// Удаляем старые демо-данные, которые раньше хранились в браузере.
localStorage.removeItem(OLD_STORAGE_KEY);

const API = "";
const now = () => new Date();
const minutes = (value) => value * 60 * 1000;

const coverImages = {
  "Fortnite": "assets/covers/fortnite.jpg",
  "Call of Duty": "assets/covers/call-of-duty.jpg",
  "Grand Theft Auto V": "assets/covers/grand-theft-auto-v.jpg",
  "Minecraft": "assets/covers/minecraft.jpg",
  "Roblox": "assets/covers/roblox.jpg",
  "Forza Horizon 5": "assets/covers/forza-horizon-5.jpg",
  "NBA 2K26": "assets/covers/nba-2k26.jpg",
  "EA Sports FC 26": "assets/covers/ea-sports-fc-26.jpg",
  "Battlefield 6": "assets/covers/battlefield-6.jpg",
  "Clair Obscur: Expedition 33": "assets/covers/clair-obscur-expedition-33.jpg",
  "Ghost of Yotei": "assets/covers/ghost-of-yotei.jpg",
  "Call of Duty: Black Ops 7": "assets/covers/call-of-duty-black-ops-7.jpg",
  "ARC Raiders": "assets/covers/arc-raiders.jpg",
  "Escape the Backrooms": "assets/covers/escape-the-backrooms.jpg",
  "Red Dead Redemption 2": "assets/covers/red-dead-redemption-2.jpg",
  "Rainbow Six Siege": "assets/covers/rainbow-six-siege.jpg",
  "Rocket League": "assets/covers/rocket-league.jpg",
  "Apex Legends": "assets/covers/apex-legends.jpg",
  "Marvel Rivals": "assets/covers/marvel-rivals.jpg",
  "Overwatch 2": "assets/covers/overwatch-2.jpg",
};

const gameMedia = {
  "Fortnite": { youtubeId: "2gUtfBmw86Y", videoQuery: "Fortnite official gameplay trailer" },
  "Call of Duty": { youtubeId: "uUo5gnaYB_w", videoQuery: "Call of Duty official gameplay trailer" },
  "Grand Theft Auto V": { youtubeId: "N-xHcvug3WI", videoQuery: "Grand Theft Auto V official gameplay trailer" },
  "Minecraft": { youtubeId: "MmB9b5njVbA", videoQuery: "Minecraft official trailer gameplay" },
  "Roblox": { youtubeId: "eAvXhNlO-rA", videoQuery: "Roblox official trailer gameplay" },
  "Forza Horizon 5": { youtubeId: "FYH9n37B7Yw", videoQuery: "Forza Horizon 5 official gameplay trailer" },
  "NBA 2K26": { youtubeId: "Mh57YWNaQC4", videoQuery: "NBA 2K26 official gameplay trailer" },
  "EA Sports FC 26": { youtubeId: "TSi0iJYSQ24", videoQuery: "EA Sports FC 26 official gameplay trailer" },
  "Battlefield 6": { youtubeId: "pgNCgJG0vnY", videoQuery: "Battlefield 6 official gameplay trailer" },
  "Clair Obscur: Expedition 33": { youtubeId: "RWZ-xf1dslw", videoQuery: "Clair Obscur Expedition 33 official gameplay trailer" },
  "Ghost of Yotei": { youtubeId: "7z7kqwuf0a8", videoQuery: "Ghost of Yotei official gameplay trailer" },
  "Call of Duty: Black Ops 7": { youtubeId: "uUo5gnaYB_w", videoQuery: "Call of Duty Black Ops 7 official gameplay trailer" },
  "ARC Raiders": { youtubeId: "e0SmtwPkshA", videoQuery: "ARC Raiders official gameplay trailer" },
  "Escape the Backrooms": { youtubeId: "6xbnqo48K2c", videoQuery: "Escape the Backrooms official gameplay trailer" },
  "Red Dead Redemption 2": { youtubeId: "eaW0tYpxyp0", videoQuery: "Red Dead Redemption 2 official gameplay trailer" },
  "Rainbow Six Siege": { youtubeId: "6wlvYh0h63k", videoQuery: "Rainbow Six Siege official gameplay trailer" },
  "Rocket League": { youtubeId: "SgSX3gOrj60", videoQuery: "Rocket League official gameplay trailer" },
  "Apex Legends": { youtubeId: "innmNewjkuk", videoQuery: "Apex Legends official gameplay trailer" },
  "Marvel Rivals": { youtubeId: "DA4iVv4MARE", videoQuery: "Marvel Rivals official gameplay trailer" },
  "Overwatch 2": { youtubeId: "dZl1yGUetjI", videoQuery: "Overwatch 2 official gameplay trailer" },
};

const gameGenres = {
  "Fortnite": ["battle-royale", "shooter", "multiplayer"],
  "Call of Duty": ["shooter", "action", "multiplayer"],
  "Grand Theft Auto V": ["action", "adventure", "open-world"],
  "Minecraft": ["sandbox", "adventure", "multiplayer"],
  "Roblox": ["sandbox", "multiplayer"],
  "Forza Horizon 5": ["racing", "sport"],
  "NBA 2K26": ["sport", "basketball"],
  "EA Sports FC 26": ["sport", "football"],
  "Battlefield 6": ["shooter", "action", "multiplayer"],
  "Clair Obscur: Expedition 33": ["rpg", "adventure"],
  "Ghost of Yotei": ["action", "adventure"],
  "Call of Duty: Black Ops 7": ["shooter", "action", "multiplayer"],
  "ARC Raiders": ["shooter", "action", "multiplayer"],
  "Escape the Backrooms": ["horror", "adventure"],
  "Red Dead Redemption 2": ["action", "adventure", "open-world"],
  "Rainbow Six Siege": ["shooter", "tactical", "multiplayer"],
  "Rocket League": ["sport", "racing", "multiplayer"],
  "Apex Legends": ["battle-royale", "shooter", "multiplayer"],
  "Marvel Rivals": ["action", "shooter", "multiplayer"],
  "Overwatch 2": ["shooter", "action", "multiplayer"],
};

const gameGenreOptions = [
  ["all", "Все жанры"],
  ["action", "Экшен"],
  ["shooter", "Шутеры"],
  ["adventure", "Приключения"],
  ["open-world", "Открытый мир"],
  ["rpg", "RPG"],
  ["sandbox", "Песочницы"],
  ["racing", "Гонки"],
  ["sport", "Спорт"],
  ["football", "Футбол"],
  ["basketball", "Баскетбол"],
  ["horror", "Хоррор"],
  ["battle-royale", "Королевская битва"],
  ["tactical", "Тактика"],
  ["multiplayer", "Мультиплеер"],
];

const gameGenreLabels = Object.fromEntries(gameGenreOptions);

const schoolCampuses = [
  { city: "Москва", address: "г. Москва, ул. Вятская, д. 27, стр. 42" },
  { city: "Новосибирск", address: "Кампус Школы 21, Новосибирск. Адрес уточняется администратором" },
  { city: "Казань", address: "Кампус Школы 21, Казань. Адрес уточняется администратором" },
  { city: "Белгород", address: "Кампус Школы 21, Белгород. Адрес уточняется администратором" },
  { city: "Южно-Сахалинск", address: "Кампус Школы 21, Южно-Сахалинск. Адрес уточняется администратором" },
  { city: "Ярославль", address: "Кампус Школы 21, Ярославль. Адрес уточняется администратором" },
  { city: "Сургут", address: "Кампус Школы 21, Сургут. Адрес уточняется администратором" },
  { city: "Липецк", address: "Кампус Школы 21, Липецк. Адрес уточняется администратором" },
  { city: "Магас", address: "Кампус Школы 21, Магас. Адрес уточняется администратором" },
  { city: "Уфа", address: "Кампус Школы 21, Уфа. Адрес уточняется администратором" },
  { city: "Великий Новгород", address: "Кампус Школы 21, Великий Новгород. Адрес уточняется администратором" },
  { city: "Ставрополь", address: "Кампус Школы 21, Ставрополь. Адрес уточняется администратором" },
  { city: "Волгоград", address: "Кампус Школы 21, Волгоград. Адрес уточняется администратором" },
  { city: "Магадан", address: "Кампус Школы 21, Магадан. Адрес уточняется администратором" },
  { city: "Нижний Новгород", address: "Кампус Школы 21, Нижний Новгород. Адрес уточняется администратором" },
  { city: "Челябинск", address: "Кампус Школы 21, Челябинск. Адрес уточняется администратором" },
  { city: "Пермь", address: "Кампус Школы 21, Пермь. Адрес уточняется администратором" },
  { city: "Ижевск", address: "Кампус Школы 21, Ижевск. Адрес уточняется администратором" },
  { city: "Хабаровск", address: "Кампус Школы 21, Хабаровск. Адрес уточняется администратором" },
  { city: "Владивосток", address: "Кампус Школы 21, Владивосток. Адрес уточняется администратором" },
  { city: "Якутск", address: "Кампус Школы 21, Якутск. Адрес уточняется администратором" },
  { city: "Омск", address: "Кампус Школы 21, Омск. Адрес уточняется администратором" },
  { city: "Анадырь", address: "Кампус Школы 21, Анадырь. Адрес уточняется администратором" },
  { city: "Улан-Удэ", address: "Кампус Школы 21, Улан-Удэ. Адрес уточняется администратором" },
];

const campusAddressOverrides = {
  "Москва": "г. Москва, ул. Вятская, д. 27, стр. 42",
  "Казань": "г. Казань, ул. Спартаковская, д. 2, корп. 2",
  "Новосибирск": "г. Новосибирск, пл. Карла Маркса, д. 7",
  "Сургут": "г. Сургут, ул. Иосифа Каролинского, д. 14/1",
  "Великий Новгород": "г. Великий Новгород, ул. Великая, д. 18А",
  "Якутск": "г. Якутск, ул. Ойунского, д. 35",
  "Ярославль": "г. Ярославль, ул. Победы, д. 14А",
  "Липецк": "г. Липецк, ул. Зегеля, д. 1",
  "Южно-Сахалинск": "г. Южно-Сахалинск, ул. Леонова, д. 38, БЦ «Айхор»",
  "Нижний Новгород": "г. Нижний Новгород, ул. Тургенева, д. 30",
  "Пермь": "г. Пермь, шоссе Космонавтов, д. 111Д",
  "Ижевск": "г. Ижевск, ул. Красная, д. 105",
  "Улан-Удэ": "г. Улан-Удэ, ул. Хоца Намсараева, д. 7",
  "Ставрополь": "г. Ставрополь, ул. Ивана Щипакина, д. 8",
  "Магас": "г. Магас, ул. Никиты Хрущева, д. 10",
  "Челябинск": "г. Челябинск, пр. Ленина, д. 76а",
  "Владивосток": "г. Владивосток, ул. Алеутская, д. 65б",
  "Магадан": "г. Магадан, ул. Кольцевая, д. 3/8",
  "Белгород": "г. Белгород, пр. Ватутина, д. 1Г",
  "Анадырь": "г. Анадырь, ул. Студенческая, д. 3",
  "Хабаровск": "г. Хабаровск, ул. Тихоокеанская, д. 134",
  "Уфа": "г. Уфа, ул. Заки Валиди, д. 32/2Б",
  "Волгоград": "г. Волгоград, ул. Социалистическая, д. 15",
  "Омск": "г. Омск, ул. Ленина, д. 26Б",
};

schoolCampuses.forEach((campus) => {
  if (campusAddressOverrides[campus.city]) campus.address = campusAddressOverrides[campus.city];
});
const officialCampusCities = new Set(Object.keys(campusAddressOverrides));
for (let index = schoolCampuses.length - 1; index >= 0; index -= 1) {
  if (!officialCampusCities.has(schoolCampuses[index].city)) schoolCampuses.splice(index, 1);
}

const profileAvatars = Array.from({ length: 6 }, (_, index) => `assets/avatars/avatar-${String(index + 1).padStart(2, "0")}.svg`);
let adminBookingVisibleCount = 12;
let adminGameRequestVisibleCount = 12;
let gamesCatalogVisibleCount = 12;

function loadSavedAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null") || { token: "", user: null };
  } catch (_) {
    return { token: "", user: null };
  }
}

const savedAuth = loadSavedAuth();

const state = {
  token: savedAuth.token || "",
  user: savedAuth.user || null,
  role: savedAuth.user?.role || "guest",
  cabins: [],
  recommendations: [],
  bookings: [],
  consoleAvailability: [],
  consoleBookings: [],
  games: [],
  requests: [],
  adminUsers: [],
  adminCabins: [],
  adminGames: [],
  supportMessages: [],
  adminSupportMessages: [],
  profile: null,
  booting: true,
};

// Пока сервер проверяет токен и бан, запрещаем клики по сайту.
// Это убирает мигание админки и окно в несколько секунд для забаненных пользователей после перезагрузки.
document.body.classList.add("app-booting");
if (savedAuth.user?.role !== "admin" && savedAuth.user?.ban?.is_banned) {
  document.body.classList.add("account-banned");
}

function createAuthUi() {
  const nav = document.querySelector(".nav-tabs");
  if (nav && !document.querySelector('[data-view="profile"]')) {
    nav.insertAdjacentHTML("beforeend", `<button class="nav-tab" data-view="profile" type="button">Профиль</button>`);
  }

  const main = document.querySelector("main");
  if (main && !document.querySelector("#profile")) {
    main.insertAdjacentHTML(
      "beforeend",
      `
      <section class="view" id="profile">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Аккаунт</p>
            <h2>Профиль пользователя</h2>
          </div>
          <span id="profileStatus" class="status-pill">Регистрация и история</span>
        </div>
        <div id="profileContent"></div>
      </section>
      `,
    );
  }
}

createAuthUi();

function createAdminGameRequestsUi() {
  const adminSection = document.querySelector("#admin");
  if (!adminSection || document.querySelector("#adminGameRequestsList")) return;

  adminSection.insertAdjacentHTML(
    "beforeend",
    `
    <div id="adminBulkCancelPanel" class="panel table-panel admin-only">
      <div class="panel-heading">
        <h3>Массовая отмена</h3>
        <span>Можно отменить все или только по конкретному пользователю</span>
      </div>
      <label>
        Пользователь для отмены
        <input id="adminBulkTarget" placeholder="Телефон, email или ФИО. Пусто = все пользователи" />
      </label>
      <div class="row-actions bulk-actions">
        <button class="danger" data-admin-bulk-cancel="cabins" type="button">Отменить брони кабинок</button>
        <button class="danger" data-admin-bulk-cancel="games" type="button">Отменить брони игр</button>
        <button class="danger" data-admin-bulk-cancel="all" type="button">Отменить всё</button>
      </div>
      <p class="form-note">Если поле пустое, действие применяется ко всем активным броням. Если заполнено — только к найденному пользователю.</p>
    </div>

    <div class="panel table-panel admin-only">
      <div class="panel-heading">
        <h3>Отмена запросов игр</h3>
        <span>Админ может отменить выдачу игры и вернуть копию в наличие</span>
      </div>
      <label>
        Поиск по запросам
        <input id="adminGameRequestFilter" placeholder="Игра, ФИО, телефон, консоль или статус" />
      </label>
      <div id="adminGameRequestsList" class="list"></div>
    </div>
    `,
  );
}

createAdminGameRequestsUi();

function createAdminManagementUi() {
  const adminSection = document.querySelector("#admin");
  if (!adminSection || document.querySelector("#adminUsersList")) return;

  adminSection.insertAdjacentHTML(
    "beforeend",
    `
    <div class="panel table-panel admin-only">
      <div class="panel-heading">
        <h3>Пользователи</h3>
        <span>Ручные баны и разбаны</span>
      </div>
      <div class="admin-filter-grid">
        <label>Поиск<input id="adminUserSearch" placeholder="ФИО, телефон или почта" /></label>
        <label>Статус
          <select id="adminUserStatusFilter">
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="banned">Забаненные</option>
          </select>
        </label>
        <label>Город<select id="adminUserCityFilter"><option value="all">Все города</option></select></label>
        <label>Сортировка
          <select id="adminUserSort">
            <option value="new">Новые сверху</option>
            <option value="name">По ФИО</option>
            <option value="city">По городу</option>
            <option value="status">По статусу</option>
          </select>
        </label>
      </div>
      <div id="adminUsersList" class="list"></div>
    </div>

    <div class="work-grid admin-only">
      <form id="adminCabinForm" class="panel">
        <h3>Кабинка</h3>
        <input name="id" type="hidden" />
        <div class="two-cols">
          <label>Этаж<input name="floor_number" required type="number" /></label>
          <label>Номер<input name="cabin_number" required type="number" /></label>
        </div>
        <label>Код<input name="cabin_code" required placeholder="F1-C1" /></label>
        <label>Тип<input name="cabin_type" required placeholder="Переговорная" /></label>
        <label>Вместимость<input name="capacity" required min="1" type="number" /></label>
        <label>Город<select name="campus_city">${campusOptionsHtml()}</select></label>
        <label class="inline-check"><input name="is_active" type="checkbox" checked /> Активна</label>
        <div class="row-actions">
          <button class="primary" type="submit">Сохранить кабинку</button>
          <button id="adminCabinNew" class="secondary" type="button">Новая</button>
        </div>
      </form>
      <div class="panel">
        <h3>Список кабинок</h3>
        <div class="admin-filter-grid">
          <label>Поиск<input id="adminCabinSearch" placeholder="Код, номер или тип" /></label>
          <label>Этаж<select id="adminCabinFloorFilter"><option value="all">Все этажи</option></select></label>
          <label>Город<select id="adminCabinCityFilter"><option value="all">Все города</option></select></label>
          <label>Вместимость<select id="adminCabinCapacityFilter"><option value="all">Любая</option></select></label>
          <label>Статус
            <select id="adminCabinActiveFilter">
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="inactive">Скрытые</option>
            </select>
          </label>
        </div>
        <div id="adminCabinsList" class="list compact-list"></div>
      </div>
    </div>

    <div class="panel table-panel admin-only">
      <div class="panel-heading">
        <h3>Редактирование игр</h3>
        <span>Выберите игру из списка, измените форму выше и сохраните</span>
      </div>
      <div class="admin-filter-grid">
        <label>Поиск<input id="adminGameSearch" placeholder="Название игры" /></label>
        <label>Платформа
          <select id="adminGamePlatformFilter">
            <option value="all">Все платформы</option>
            <option value="xbox">Xbox</option>
            <option value="playstation">PlayStation</option>
          </select>
        </label>
        <label>Статус
          <select id="adminGameActiveFilter">
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="inactive">Скрытые</option>
          </select>
        </label>
        <label>Сортировка
          <select id="adminGameSort">
            <option value="title">По названию</option>
            <option value="platform">По платформам</option>
            <option value="active">По статусу</option>
          </select>
        </label>
      </div>
      <div id="adminGamesList" class="list"></div>
    </div>
    `,
  );
}

createAdminManagementUi();

const adminBulkCancelPanel = document.querySelector("#adminBulkCancelPanel");
if (adminBulkCancelPanel && adminBulkCancelPanel.parentElement) {
  adminBulkCancelPanel.parentElement.appendChild(adminBulkCancelPanel);
}

const adminBookingsListNode = document.querySelector("#adminBookingsList");
if (adminBookingsListNode && !document.querySelector("#adminBookingFilter")) {
  adminBookingsListNode.insertAdjacentHTML(
    "beforebegin",
    `<label class="admin-list-filter">Поиск по броням кабинок<input id="adminBookingFilter" placeholder="ФИО, телефон, кабинка, город" /></label>`
  );
}

function createAdminTabsUi() {
  const adminSection = document.querySelector("#admin");
  if (!adminSection || document.querySelector("#adminTabs")) return;

  const heading = adminSection.querySelector(".section-heading");
  heading?.insertAdjacentHTML(
    "afterend",
    `
    <div id="adminTabs" class="admin-tabs admin-only">
      <button class="active" data-admin-tab="users" type="button">Пользователи</button>
      <button data-admin-tab="cabins" type="button">Кабинки</button>
      <button data-admin-tab="games" type="button">Игры</button>
      <button data-admin-tab="bookings" type="button">Брони</button>
      <button data-admin-tab="support" type="button">Поддержка</button>
      <button data-admin-tab="settings" type="button">Настройки</button>
    </div>
    `
  );

  document.querySelector("#adminUsersList")?.closest(".panel")?.setAttribute("data-admin-section", "users");
  document.querySelector("#adminCabinForm")?.closest(".work-grid")?.setAttribute("data-admin-section", "cabins");
  document.querySelector("#adminGamesList")?.closest(".panel")?.setAttribute("data-admin-section", "games");
  document.querySelector("#addGameForm")?.closest(".work-grid")?.setAttribute("data-admin-section", "games");
  document.querySelector("#adminBookingsList")?.closest(".panel")?.setAttribute("data-admin-section", "bookings");
  document.querySelector("#adminGameRequestsList")?.closest(".panel")?.setAttribute("data-admin-section", "bookings");
  if (!document.querySelector("#adminSupportList")) {
    adminSection.insertAdjacentHTML(
      "beforeend",
      `
      <div class="panel table-panel admin-only" data-admin-section="support">
        <div class="panel-heading">
          <h3>Поддержка</h3>
          <span>Вопросы пользователей, включая забаненные аккаунты</span>
        </div>
        <label class="admin-list-filter">Поиск по обращениям<input id="adminSupportFilter" placeholder="ФИО, почта, телефон, сообщение или статус" /></label>
        <div id="adminSupportList" class="list"></div>
      </div>
      `,
    );
  }
  document.querySelector("#adminBulkCancelPanel")?.setAttribute("data-admin-section", "settings");

  const quickPanel = document.querySelector("#clearBans")?.closest(".panel");
  if (quickPanel) {
    quickPanel.setAttribute("data-admin-section", "settings");
    adminSection.appendChild(quickPanel);
  }
}

createAdminTabsUi();

function setAdminTab(tab = "users") {
  document.querySelectorAll("#adminTabs [data-admin-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === tab);
  });
  document.querySelectorAll("#admin [data-admin-section]").forEach((section) => {
    section.classList.toggle("hidden", section.dataset.adminSection !== tab);
  });
}

setAdminTab("users");

const initialAddGameForm = document.querySelector("#addGameForm");
if (initialAddGameForm && !initialAddGameForm.elements.is_active) {
  initialAddGameForm.querySelector('button[type="submit"]')?.insertAdjacentHTML(
    "beforebegin",
    `<label class="inline-check"><input name="is_active" type="checkbox" checked /> Игра активна</label>`
  );
}

if (document.querySelector("#gameCategoryFilter")) {
  document.querySelector("#gameCategoryFilter").innerHTML = gameGenreOptions
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  const genreLabel = document.querySelector('label:has(#gameCategoryFilter)');
  if (genreLabel?.firstChild) genreLabel.firstChild.textContent = "Жанр";
}

function createAuthGateUi() {
  if (!document.querySelector("#authGateStyles")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style id="authGateStyles">
        .auth-gate {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: none;
          place-items: center;
          padding: 18px;
          background: rgba(7, 17, 15, 0.64);
          backdrop-filter: blur(14px);
        }

        .auth-gate.active {
          display: grid;
        }

        .auth-gate-card {
          width: min(920px, 100%);
          max-height: calc(100vh - 36px);
          overflow: auto;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .auth-gate-hero {
          display: grid;
          grid-template-columns: minmax(240px, 0.85fr) minmax(280px, 1.15fr);
          gap: 0;
        }

        .auth-gate-info {
          padding: 28px;
          color: white;
          background:
            radial-gradient(circle at 20% 20%, rgba(46, 229, 207, 0.24), transparent 30%),
            linear-gradient(135deg, #102b27, #183d38);
        }

        .auth-gate-info h2 {
          margin: 10px 0 12px;
          font-size: clamp(28px, 4vw, 44px);
        }

        .auth-gate-info p {
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.55;
        }

        .auth-gate-info .tag {
          color: #102b27;
          background: rgba(255, 255, 255, 0.88);
        }

        .auth-gate-body {
          padding: 24px;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 18px;
          padding: 5px;
          border-radius: 10px;
          background: var(--surface-2);
        }

        .auth-tabs button {
          min-height: 40px;
          border-radius: 8px;
          color: var(--muted);
          background: transparent;
          font-weight: 800;
        }

        .auth-tabs button.active {
          color: var(--ink);
          background: var(--surface);
          box-shadow: 0 6px 18px rgba(18, 33, 29, 0.08);
        }

        .auth-panel.hidden {
          display: none;
        }

        .auth-note {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.45;
        }

        @media (max-width: 760px) {
          .auth-gate-hero {
            grid-template-columns: 1fr;
          }
        }
      </style>
      `,
    );
  }

  if (document.querySelector("#authGate")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="authGate" class="auth-gate" role="dialog" aria-modal="true" aria-labelledby="authGateTitle">
      <div class="auth-gate-card">
        <div class="auth-gate-hero">
          <div class="auth-gate-info">
            <p class="eyebrow">Центр кабинок и игр</p>
            <h2 id="authGateTitle">Создайте аккаунт</h2>
            <p id="authGateSubtitle">После регистрации у вас появится профиль, история броней и защита от управления чужими бронями.</p>
            <div class="meta" style="margin-top: 18px;">
              <span class="tag">Свои брони</span>
              <span class="tag">История</span>
              <span class="tag">Игры</span>
              <span class="tag">Админ-доступ</span>
            </div>
          </div>

          <div class="auth-gate-body">
            <div class="auth-tabs" role="group" aria-label="Вход или регистрация">
              <button id="authGateRegisterTab" class="active" type="button">Регистрация</button>
              <button id="authGateLoginTab" type="button">Вход</button>
            </div>

            <form id="authGateRegisterForm" class="auth-panel">
              <h3>Регистрация пользователя</h3>
              <label>ФИО<input name="full_name" required placeholder="Иванов Иван Иванович" /></label>
              <label>Телефон<input name="phone" required inputmode="tel" maxlength="18" autocomplete="tel" placeholder="+7 900 000-00-00" /></label>
              <label>Почта<input name="email" type="email" required autocomplete="username" placeholder="name@gmail.com" /></label>
              <label>Пароль<input name="password" type="password" required autocomplete="new-password" placeholder="Минимум 6 символов" /></label>
              <button class="primary wide" type="submit">Зарегистрироваться</button>
              <p class="auth-note">После регистрации вход будет выполнен автоматически. Дальше вы сможете видеть свои брони и историю в профиле.</p>
            </form>

            <form id="authGateLoginForm" class="auth-panel hidden">
              <h3>Вход в аккаунт</h3>
              <label>Почта<input name="email" type="email" required autocomplete="username" placeholder="name@gmail.com" /></label>
              <label>Пароль<input name="password" type="password" required autocomplete="current-password" placeholder="Введите пароль" /></label>
              <button class="primary wide" type="submit">Войти</button>
              <p class="auth-note">Администратор тоже входит здесь через свою почту и пароль.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
    `,
  );
}

createAuthGateUi();

function campusOptionsHtml(selectedCity = "") {
  return schoolCampuses
    .map((campus) => `<option value="${escapeHtml(campus.city)}" ${campus.city === selectedCity ? "selected" : ""}>${escapeHtml(campus.city)}</option>`)
    .join("");
}

function campusByCity(city) {
  return schoolCampuses.find((campus) => campus.city === city) || schoolCampuses[0];
}

function normalizeCampusAddress(address) {
  return String(address || "")
    .replaceAll("Р‘", "Б")
    .replaceAll("Р’", "В")
    .replaceAll("Р“", "Г")
    .replaceAll("Р”", "Д")
    .replaceAll("P`", "Б")
    .replaceAll("P'", "Б")
    .trim();
}

function campusAddressIncludesCity(city, address) {
  const normalizedCity = String(city || "").trim().toLowerCase();
  const normalizedAddress = normalizeCampusAddress(address).toLowerCase();
  return Boolean(normalizedCity && normalizedAddress.includes(normalizedCity));
}

function campusDisplayAddress(city, address) {
  const cleanAddress = normalizeCampusAddress(address);
  if (!city) return cleanAddress;
  if (!cleanAddress) return city;
  return campusAddressIncludesCity(city, cleanAddress) ? cleanAddress : `${city}, ${cleanAddress}`;
}

function mapQueryForCampus(campus) {
  return campusDisplayAddress(campus.city, campus.address);
}

function campusMapUrl(campus) {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(mapQueryForCampus(campus))}`;
}

function campusRouteUrl(campus) {
  return campusGoogleRouteUrl(campus);
}

function campusGoogleRouteUrl(campus) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQueryForCampus(campus))}`;
}

function twoGisCitySlug(campus) {
  const slugs = {
    "Анадырь": "anadyr",
    "Белгород": "belgorod",
    "Великий Новгород": "veliky_novgorod",
    "Владивосток": "vladivostok",
    "Волгоград": "volgograd",
    "Ижевск": "izhevsk",
    "Казань": "kazan",
    "Липецк": "lipetsk",
    "Магадан": "magadan",
    "Магас": "magas",
    "Москва": "moscow",
    "Нижний Новгород": "n_novgorod",
    "Новосибирск": "novosibirsk",
    "Омск": "omsk",
    "Пермь": "perm",
    "Ставрополь": "stavropol",
    "Сургут": "surgut",
    "Улан-Удэ": "ulanude",
    "Уфа": "ufa",
    "Хабаровск": "habarovsk",
    "Челябинск": "chelyabinsk",
    "Южно-Сахалинск": "yuzhno_sakhalinsk",
    "Якутск": "yakutsk",
    "Ярославль": "yaroslavl",
  };
  return slugs[campus.city] || "";
}

function campusTwoGisRouteUrl(campus) {
  const query = encodeURIComponent(mapQueryForCampus(campus));
  const city = twoGisCitySlug(campus);
  return city
    ? `https://2gis.ru/${city}/search/${query}/routeTab/rsType/car`
    : `https://2gis.ru/search/${query}`;
}

function campusMapWidgetUrl(campus) {
  return `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(mapQueryForCampus(campus))}`;
}

function campusMapHtml(campus) {
  return `
    <div class="campus-map">
      <iframe src="${escapeHtml(campusMapWidgetUrl(campus))}" title="Карта кампуса ${escapeHtml(campus.city)}" loading="lazy"></iframe>
      <div class="row-actions">
        <a class="button-link secondary" href="${escapeHtml(campusMapUrl(campus))}" target="_blank" rel="noopener">Яндекс Карты</a>
        <a class="button-link primary" href="${escapeHtml(campusRouteUrl(campus))}" target="_blank" rel="noopener">Google маршрут</a>
        <a class="button-link ghost" href="${escapeHtml(campusTwoGisRouteUrl(campus))}" target="_blank" rel="noopener">2ГИС маршрут</a>
      </div>
    </div>
  `;
}

function currentCampus() {
  return {
    city: state.user?.campus_city || "",
    address: state.user?.campus_address || "",
  };
}

function createCampusGateUi() {
  if (document.querySelector("#campusGate")) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="campusGate" class="auth-gate" role="dialog" aria-modal="true">
      <div class="auth-gate-card campus-gate-card">
        <div class="auth-gate-body">
          <form id="campusGateForm" class="panel campus-form">
            <p class="eyebrow">Школа 21</p>
            <h3>Выберите свой город</h3>
            <label>
              Город кампуса
              <select name="campus_city" id="campusGateSelect">${campusOptionsHtml()}</select>
            </label>
            <p id="campusGateAddress" class="form-note"></p>
            <div id="campusGateMap"></div>
            <button class="primary wide" type="submit">Сохранить город</button>
          </form>
        </div>
      </div>
    </div>
    `,
  );
}

createCampusGateUi();

function updateCampusAddress(select, target) {
  const campus = campusByCity(select?.value);
  if (target && campus) target.textContent = campusDisplayAddress(campus.city, campus.address);
  const mapTarget = target?.closest("form")?.querySelector("[data-campus-map], #campusGateMap");
  if (mapTarget && campus) mapTarget.innerHTML = campusMapHtml(campus);
}

updateCampusAddress(document.querySelector("#campusGateSelect"), document.querySelector("#campusGateAddress"));

function showCampusGate() {
  const gate = document.querySelector("#campusGate");
  const select = document.querySelector("#campusGateSelect");
  const address = document.querySelector("#campusGateAddress");
  if (select) select.value = currentCampus().city || schoolCampuses[0].city;
  updateCampusAddress(select, address);
  gate?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function hideCampusGate() {
  document.querySelector("#campusGate")?.classList.remove("active");
  document.body.style.overflow = "";
}

async function saveCampus(city) {
  const campus = campusByCity(city);
  const response = await api("/api/profile/campus", {
    method: "PATCH",
    body: JSON.stringify({ campus_city: campus.city, campus_address: normalizeCampusAddress(campus.address) }),
  });
  saveAuth(state.token, response.user);
  if (state.profile) state.profile.user = response.user;
  hideCampusGate();
  renderAuthState();
  return response.user;
}

async function saveAvatar(avatarUrl) {
  const response = await api("/api/profile/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar_url: avatarUrl }),
  });
  saveAuth(state.token, response.user);
  if (state.profile) state.profile.user = response.user;
  renderAuthState();
  return response.user;
}

const els = {
  roleButtons: document.querySelectorAll("[data-role]"),
  cabinSelect: document.querySelector("#cabinSelect"),
  gameSelect: document.querySelector("#gameSelect"),
  gameCategoryFilter: document.querySelector("#gameCategoryFilter"),
  selectedGameSummary: document.querySelector("#selectedGameSummary"),
  selectedGamePreview: document.querySelector("#selectedGamePreview"),
  gamesCatalogPanel: document.querySelector("#gamesCatalogPanel"),
  gamesCatalogCount: document.querySelector("#gamesCatalogCount"),
  gamesCatalogToggle: document.querySelector("#gamesCatalogToggle"),
  gameDetailModal: document.querySelector("#gameDetailModal"),
  gameDetailTitle: document.querySelector("#gameDetailTitle"),
  gameDetailContent: document.querySelector("#gameDetailContent"),
  closeGameDetail: document.querySelector("#closeGameDetail"),
  adminBulkTarget: document.querySelector("#adminBulkTarget"),
  adminBookingFilter: document.querySelector("#adminBookingFilter"),
  adminGameRequestFilter: document.querySelector("#adminGameRequestFilter"),
  adminSupportFilter: document.querySelector("#adminSupportFilter"),
  campusGate: document.querySelector("#campusGate"),
  campusGateForm: document.querySelector("#campusGateForm"),
  campusGateSelect: document.querySelector("#campusGateSelect"),
  campusGateAddress: document.querySelector("#campusGateAddress"),
  recommendations: document.querySelector("#recommendations"),
  bookingForm: document.querySelector("#bookingForm"),
  consoleBookingForm: document.querySelector("#consoleBookingForm"),
  consolePlatformSelect: document.querySelector("#consolePlatformSelect"),
  consoleRecommendations: document.querySelector("#consoleRecommendations"),
  activeConsoleSummary: document.querySelector("#activeConsoleSummary"),
  bookingsList: document.querySelector("#bookingsList"),
  gamesCatalog: document.querySelector("#gamesCatalog"),
  gameRequestForm: document.querySelector("#gameRequestForm"),
  requestsList: document.querySelector("#requestsList"),
  addGameForm: document.querySelector("#addGameForm"),
  adminBookingsList: document.querySelector("#adminBookingsList"),
  adminGameRequestsList: document.querySelector("#adminGameRequestsList"),
  adminUsersList: document.querySelector("#adminUsersList"),
  adminUserSearch: document.querySelector("#adminUserSearch"),
  adminUserStatusFilter: document.querySelector("#adminUserStatusFilter"),
  adminUserCityFilter: document.querySelector("#adminUserCityFilter"),
  adminUserSort: document.querySelector("#adminUserSort"),
  adminCabinForm: document.querySelector("#adminCabinForm"),
  adminCabinsList: document.querySelector("#adminCabinsList"),
  adminCabinSearch: document.querySelector("#adminCabinSearch"),
  adminCabinFloorFilter: document.querySelector("#adminCabinFloorFilter"),
  adminCabinCityFilter: document.querySelector("#adminCabinCityFilter"),
  adminCabinCapacityFilter: document.querySelector("#adminCabinCapacityFilter"),
  adminCabinActiveFilter: document.querySelector("#adminCabinActiveFilter"),
  adminGamesList: document.querySelector("#adminGamesList"),
  adminSupportList: document.querySelector("#adminSupportList"),
  adminGameSearch: document.querySelector("#adminGameSearch"),
  adminGamePlatformFilter: document.querySelector("#adminGamePlatformFilter"),
  adminGameActiveFilter: document.querySelector("#adminGameActiveFilter"),
  adminGameSort: document.querySelector("#adminGameSort"),
  adminSection: document.querySelector("#admin"),
  adminLock: document.querySelector("#adminLock"),
  notifyButton: document.querySelector("#notifyButton"),
  clearBans: document.querySelector("#clearBans"),
  resetDemo: document.querySelector("#resetDemo"),
  freeCabinsMetric: document.querySelector("#freeCabinsMetric"),
  gamesMetric: document.querySelector("#gamesMetric"),
  activeBookingsMetric: document.querySelector("#activeBookingsMetric"),
  bookingHint: document.querySelector("#bookingHint"),
  requestHint: document.querySelector("#requestHint"),
  toastStack: document.querySelector("#toastStack"),
  themeToggle: document.querySelector("#themeToggle"),
  themeTogglePanel: document.querySelector("#themeTogglePanel"),
  themeLabelPanel: document.querySelector("#themeLabelPanel"),
  themeIcon: document.querySelector("#themeIcon"),
  adminLoginModal: document.querySelector("#adminLoginModal"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  closeAdminLogin: document.querySelector("#closeAdminLogin"),
  profileContent: document.querySelector("#profileContent"),
  profileStatus: document.querySelector("#profileStatus"),
  footerCampus: document.querySelector("#footerCampus"),
};

async function api(path, options = {}) {
  const { retries = 0, retryDelay = 900, ...fetchOptions } = options;
  let response;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      response = await fetch(`${API}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
          ...(fetchOptions.headers || {}),
        },
        ...fetchOptions,
      });
      break;
    } catch (error) {
      if (attempt >= retries) {
        const networkError = new Error("Связь с сервером нестабильна. Проверьте туннель Pinggy и попробуйте еще раз.");
        networkError.cause = error;
        throw networkError;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    if ((response.status === 423 || response.status === 429) && data?.ban && state.user) {
      state.user = { ...state.user, ban: data.ban };
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token: state.token, user: state.user }));
      renderBanBanner();
    }

    const error = new Error(data?.message || "Ошибка запроса к серверу");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function toast(message, type = "success") {
  const item = document.createElement("div");
  item.className = `toast ${type === "error" ? "error" : ""}`;
  item.textContent = message;
  els.toastStack.append(item);
  setTimeout(() => item.remove(), 4600);
}

function push(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(title, { body });
}

function parseRussianPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("9")) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!/^79\d{9}$/.test(digits)) return null;

  return {
    digits,
    formatted: `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`,
  };
}

function formatRussianPhoneInput(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("9")) digits = `7${digits}`;
  if (!digits.startsWith("7") && digits.length > 0) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const parts = ["+7"];
  if (digits.length > 1) parts.push(` ${digits.slice(1, 4)}`);
  if (digits.length > 4) parts.push(` ${digits.slice(4, 7)}`);
  if (digits.length > 7) parts.push(`-${digits.slice(7, 9)}`);
  if (digits.length > 9) parts.push(`-${digits.slice(9, 11)}`);
  return parts.join("");
}

function formatLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sqlDateTimeFromInputValue(value) {
  return String(value || "").replace("T", " ") + ":00";
}

function addMinutesToInputValue(value, duration) {
  const date = new Date(value);
  return formatLocalDateTime(new Date(date.getTime() + minutes(duration)));
}

function getFormRange(form) {
  const data = new FormData(form);
  const startValue = data.get("start") || formatLocalDateTime(now());
  const duration = Number(data.get("duration") || 60);
  const endValue = addMinutesToInputValue(startValue, duration);
  return { startValue, endValue, duration };
}

function mapCabin(row) {
  return {
    id: row.id,
    floor: row.floor_number,
    number: row.cabin_number,
    code: row.cabin_code,
    type: row.cabin_type,
    capacity: row.capacity,
    campusCity: row.campus_city || row.campusCity || "",
    campusAddress: row.campus_address || row.campusAddress || "",
    is_active: row.is_active !== false && row.is_active !== "false",
    free: row.free !== false && row.free !== "false",
    busyFrom: row.busy_from || null,
    busyUntil: row.busy_until || null,
    busyBy: row.busy_by || "",
  };
}

function mapBooking(row) {
  return {
    id: row.id,
    userId: row.user_id,
    isOwner: Boolean(row.is_owner),
    canManage: Boolean(row.can_manage || row.is_owner),
    name: row.full_name,
    phone: row.phone,
    people: row.people_count,
    start: row.start_time,
    end: row.end_time,
    status: row.status,
    campusCity: row.campus_city || "",
    campusAddress: row.campus_address || "",
    cabinId: row.cabin_id,
    cabin: {
      id: row.cabin_id,
      code: row.cabin_code,
      floor: row.floor_number,
      number: row.cabin_number,
      type: row.cabin_type,
      capacity: row.capacity,
    },
  };
}

function mapConsoleBooking(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.full_name,
    phone: row.phone,
    platform: row.platform,
    slot: Number(row.console_slot),
    start: row.start_time,
    end: row.end_time,
    status: row.status,
    extensionCount: Number(row.extension_count || 0),
    campusCity: row.campus_city || "",
    campusAddress: row.campus_address || "",
  };
}

function mapGame(row) {
  const copies = Array.isArray(row.copies) ? row.copies : [];
  const screenshots = Array.isArray(row.screenshots) ? row.screenshots : [];
  return {
    gameId: row.game_id,
    title: row.title,
    console: row.platform,
    total: Number(row.total_count || 0),
    available: Number(row.available_count || 0),
    imageUrl: row.image_url || "",
    youtubeId: row.youtube_id || "",
    screenshots,
    copies: copies.map((copy) => ({
      copy_number: Number(copy.copy_number),
      status: copy.status,
    })).filter((copy) => Number.isFinite(copy.copy_number)),
  };
}

function mapRequest(row) {
  return {
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    title: row.title || "Игра не найдена",
    console: row.platform,
    copy: row.copy_number,
    delivery: row.receive_type === "delivery" ? "Доставка" : "Самовывоз",
    status: row.status,
    createdAt: row.created_at,
    campusCity: row.campus_city || "",
    campusAddress: row.campus_address || "",
  };
}

function cabinLabel(cabin) {
  return `${cabin.code}: этаж ${cabin.floor}, каб. ${cabin.number}, ${cabin.type}, до ${cabin.capacity} чел.`;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function bookingTimeState(endValue) {
  const diff = new Date(endValue).getTime() - Date.now();
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 3600000);
  const minutesLeft = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  const time = hours > 0
    ? `${hours} \u0447 ${String(minutesLeft).padStart(2, "0")} мин`
    : `${minutesLeft} мин ${String(seconds).padStart(2, "0")} сек`;
  return {
    expired: diff <= 0,
    time,
    text: diff <= 0 ? `Время вышло ${time} назад` : `Осталось ${time}`,
  };
}

function bookingTimerHtml(endValue) {
  const state = bookingTimeState(endValue);
  return `
    <div class="time-notice ${state.expired ? "overdue" : ""}" data-booking-timer="${escapeHtml(endValue)}">
      <strong>${state.text}</strong>
      <span>${state.expired ? "Пожалуйста, освободите кабинку или продлите бронь, если продление ещё доступно." : "Таймер идёт, пока кабинка забронирована за вами."}</span>
    </div>
  `;
}

function gameRequestNoticeHtml(request) {
  if (request.status === "approved") {
    return `
      <div class="time-notice game-return">
        <strong>Игра сейчас у вас</strong>
        <span>Пожалуйста, верните игру администратору после использования.</span>
      </div>
    `;
  }
  if (request.status === "created") {
    return `
      <div class="time-notice">
        <strong>Запрос ожидает выдачи</strong>
        <span>Администратор увидит запрос и подготовит игру.</span>
      </div>
    `;
  }
  return "";
}

function updateLiveTimers() {
  document.querySelectorAll("[data-booking-timer]").forEach((timer) => {
    const state = bookingTimeState(timer.dataset.bookingTimer);
    const wasOverdue = timer.classList.contains("overdue");
    timer.classList.toggle("overdue", state.expired);
    const strong = timer.querySelector("strong");
    const text = timer.querySelector("span");
    if (strong) strong.textContent = state.text;
    if (text) {
      text.textContent = state.expired
        ? "Пожалуйста, освободите кабинку или продлите бронь, если продление ещё доступно."
        : "Таймер идёт, пока кабинка забронирована за вами.";
    }
    if (state.expired && !wasOverdue && timer.dataset.notified !== "true") {
      timer.dataset.notified = "true";
      toast("Время брони вышло. Пожалуйста, освободите кабинку или продлите бронь.", "error");
    }
  });
}

function formatRequestStatus(status) {
  const statuses = {
    created: "Создан",
    approved: "Одобрено",
    not_available: "Нет в наличии",
    not_found: "Не найдена",
    cancelled: "Отменено",
    completed: "Завершено",
  };
  return statuses[status] || status || "Неизвестно";
}

function formatSupportStatus(status) {
  const statuses = {
    open: "Открыто",
    answered: "Есть ответ",
    closed: "Закрыто",
  };
  return statuses[status] || status || "Открыто";
}

function canCancelGameRequest(request) {
  return isActiveGameRequest(request);
}
function isActiveGameRequest(request) {
  return request && ["created", "approved"].includes(request.status);
}

function isActiveConsoleBooking(booking) {
  return booking && booking.status === "active" && new Date(booking.end) > new Date();
}

function requestCampusCity(request) {
  return request?.campusCity || request?.campus_city || "";
}

function consoleBookingProfileHtml(booking) {
  return `
    <article class="row-item active-console-booking">
      <strong>Консоль ${escapeHtml(booking.platform)} ${escapeHtml(String(booking.slot || ""))}</strong>
      <div class="meta">
        <span class="tag">${formatDateTime(booking.start)}</span>
        <span class="tag">до ${formatTime(booking.end)}</span>
        ${booking.campusCity ? `<span class="tag">${escapeHtml(booking.campusCity)}</span>` : ""}
        <span class="tag success">Активна</span>
      </div>
      <div class="time-notice">
        <strong>Консоль забронирована</strong>
        <span>Игра выбирается только для этой активной брони консоли.</span>
      </div>
      ${bookingTimerHtml(booking.end)}
      <div class="row-actions">
        <button data-extend-console-booking="${booking.id}" type="button" ${isAccountBanned() || Number(booking.extensionCount || 0) >= 1 ? "disabled" : ""}>Продлить на 30 минут (1 раз)</button>
        <button class="danger" data-cancel-console-booking="${booking.id}" type="button" ${isAccountBanned() ? "disabled" : ""}>Отменить бронь консоли</button>
      </div>
    </article>
  `;
}

function gameRequestProfileHtml(request) {
  return `
    <article class="row-item active-game-request">
      <strong>${escapeHtml(request.title || "Игра")}</strong>
      <div class="meta">
        <span class="tag">${escapeHtml(request.platform || "")}</span>
        ${request.copy_number ? `<span class="tag">Копия ${escapeHtml(String(request.copy_number))}</span>` : ""}
        <span class="tag">${request.receive_type === "delivery" ? "Доставка" : "Самовывоз"}</span>
        ${requestCampusCity(request) ? `<span class="tag">${escapeHtml(requestCampusCity(request))}</span>` : ""}
        <span class="tag success">${formatRequestStatus(request.status)}</span>
        <span class="tag">${formatDateTime(request.created_at)}</span>
      </div>
      ${gameRequestNoticeHtml(request)}
      ${canCancelGameRequest(request) ? `
        <div class="row-actions">
          <button class="danger" data-user-cancel-game-request="${request.id}" type="button" ${isAccountBanned() ? "disabled" : ""}>Отменить запрос игры</button>
        </div>
      ` : ""}
    </article>
  `;
}

function activeGameRequestText() {
  const source = state.profile?.game_requests || state.requests || [];
  const active = source.find((request) => isActiveGameRequest(request));
  if (!active) return "";
  const title = active.title || active.name || "игра";
  const platform = active.platform || active.console || "консоль";
  const copy = active.copy_number || active.copy || "";
  return `У вас уже есть активная бронь игры: ${title} · ${platform}${copy ? ` · копия ${copy}` : ""}. Чтобы взять новую игру, отмените текущую бронь в профиле или попросите администратора сбросить её.`;
}

function activeCabinBookingText() {
  const profileBookings = state.profile?.bookings || [];
  const active = profileBookings.find((booking) => booking.status === "active" && new Date(booking.end_time || booking.end) > new Date());
  if (!active) return "";
  const cabin = active.cabin_code || active.cabin?.code || "кабинка";
  const until = active.end_time || active.end;
  return `У вас уже есть активная бронь кабинки: ${cabin}${until ? ` до ${formatTime(until)}` : ""}. Сначала отмените или освободите текущую бронь.`;
}


function activeConsoleBooking() {
  return (state.consoleBookings || []).find((booking) => (
    booking.status === "active" && new Date(booking.end) > new Date()
  ));
}

function activeConsoleBookingText() {
  const active = activeConsoleBooking();
  if (!active) return "";
  return `${active.platform} ${active.slot}, до ${formatTime(active.end)}`;
}

function renderActiveConsoleState() {
  const active = activeConsoleBooking();
  const gameForm = els.gameRequestForm;
  if (els.activeConsoleSummary) {
    els.activeConsoleSummary.textContent = active
      ? `Ваша консоль: ${activeConsoleBookingText()}. Теперь можно выбрать игру для этой платформы.`
      : "Сначала забронируйте консоль. После этого сайт покажет игры для нее.";
  }

  if (!gameForm) return;
  const controls = Array.from(gameForm.querySelectorAll("select, button"));
  controls.forEach((control) => {
    if (control.id === "selectedGamePreview") return;
    control.disabled = isAccountBanned() || !active;
  });
  if (active && gameForm.elements.console) {
    gameForm.elements.console.value = active.platform;
    gameForm.elements.console.disabled = true;
  }
  const submitButton = gameForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = isAccountBanned() || !active || Boolean(activeGameRequestText());
}

function currentBan() {
  return state.profile?.ban || state.user?.ban || { is_banned: false, banned_until: null, reason: "" };
}

function isAccountBanned() {
  return state.user?.role !== "admin" && Boolean(currentBan()?.is_banned);
}

function accountBanText() {
  const ban = currentBan();
  if (!ban?.is_banned) return "";
  const until = ban.banned_until ? formatDateTime(ban.banned_until) : "\u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e\u0433\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0438";
  return `\u0410\u043a\u043a\u0430\u0443\u043d\u0442 \u0437\u0430\u0431\u0430\u043d\u0435\u043d \u0434\u043e ${until}. \u041f\u043e\u043a\u0430 \u0431\u0430\u043d \u0430\u043a\u0442\u0438\u0432\u0435\u043d, \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043a\u0430\u0431\u0438\u043d\u043e\u043a, \u043a\u043e\u043d\u0441\u043e\u043b\u0435\u0439 \u0438 \u0438\u0433\u0440 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u0438\u043b\u0438 \u0432\u044b\u0439\u0442\u0438 \u0438\u0437 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430.`;
}

function ensureBanBanner() {
  const dashboard = document.querySelector("#dashboard");
  if (!dashboard || document.querySelector("#banNotice")) return;
  const heading = dashboard.querySelector(".home-heading") || dashboard;
  heading.insertAdjacentHTML(
    "afterend",
    `
    <div id="banNotice" class="ban-notice hidden" role="alert">
      <strong>Аккаунт забанен</strong>
      <p id="banNoticeText"></p>
      <button id="banLogoutButton" class="danger" type="button">Выйти из аккаунта</button>
    </div>
    `,
  );
}

function lockInterfaceForBan(banned) {
  document.body.classList.toggle("account-banned", banned);

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    if (banned && !["dashboard", "profile"].includes(tab.dataset.view)) {
      tab.dataset.banHidden = "true";
      tab.style.display = "none";
    } else if (!banned && tab.dataset.banHidden === "true") {
      tab.style.display = "";
      delete tab.dataset.banHidden;
    }
  });

  const homeActions = document.querySelector(".home-actions");
  if (homeActions) homeActions.style.display = banned ? "none" : "";

  if (banned) {
    [els.bookingForm, els.consoleBookingForm, els.gameRequestForm].forEach((form) => {
      if (!form) return;
      form.querySelectorAll("input, select, button").forEach((control) => {
        control.disabled = true;
      });
    });
  } else {
    renderActiveConsoleState();
  }

  if (banned) {
    const activeView = document.querySelector(".view.active");
    if (!activeView || !["dashboard", "profile"].includes(activeView.id)) switchView("profile");
  } else {
    updateAdminMenuVisibility();
  }
}

function renderBanBanner() {
  ensureBanBanner();
  const notice = document.querySelector("#banNotice");
  const text = document.querySelector("#banNoticeText");
  const banned = isAccountBanned();

  if (notice) notice.classList.toggle("hidden", !banned);
  if (text) text.textContent = banned ? accountBanText() : "";

  lockInterfaceForBan(banned);
}

function renderFooter() {
  if (!els.footerCampus) return;
  if (state.user?.role === "admin") {
    els.footerCampus.textContent = "Администратор управляет всеми кампусами";
    return;
  }
  if (state.user?.campus_city && state.user?.campus_address) {
    els.footerCampus.textContent = campusDisplayAddress(state.user.campus_city, state.user.campus_address);
    return;
  }
  els.footerCampus.textContent = "Кампус выбирается после регистрации";
}

function guardBannedAction() {
  if (!isAccountBanned()) return false;
  toast(accountBanText() || "Аккаунт забанен", "error");
  return true;
}


function saveAuth(token, user) {
  state.token = token || "";
  state.user = user || null;
  state.role = user?.role || "guest";
  state.profile = null;

  if (state.token && state.user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: state.token, user: state.user }));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }

  if (state.role === "admin") sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function logout() {
  saveAuth("", null);
  state.requests = [];
  state.supportMessages = [];
  state.adminSupportMessages = [];
  state.profile = null;
  renderAuthState();
  reloadBookingData();
  reloadGameData();
  showAuthGate("login");
  toast("Р’С‹ вышли из аккаунта");
}

function fillAccountFields() {
  // ФИО и телефон теперь берутся из аккаунта на backend.
  // Р’ формах брони и выдачи игр эти поля больше не показываются.
}

function renderCabinOptions() {
  els.cabinSelect.innerHTML = state.cabins.map((cabin) => `<option value="${cabin.id}">${cabinLabel(cabin)}</option>`).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function gameRowsByTitle(title) {
  return state.games.filter((game) => game.title === title);
}

function stockInfoForTitle(title) {
  const rows = gameRowsByTitle(title);
  const get = (platform) => rows.find((game) => game.console === platform) || { available: 0, total: 0, copies: [] };
  const xbox = get("Xbox");
  const ps = get("PlayStation");
  const label = (game) => Number(game.available) > 0 ? `есть ${game.available}/${game.total}` : "нет у консоли";

  return {
    xbox,
    ps,
    xboxLabel: label(xbox),
    psLabel: label(ps),
    totalAvailable: Number(xbox.available || 0) + Number(ps.available || 0),
    totalCopies: Number(xbox.total || 0) + Number(ps.total || 0),
  };
}

function stockSummaryForTitle(title) {
  const info = stockInfoForTitle(title);
  return `Xbox: ${info.xboxLabel} · PlayStation: ${info.psLabel}`;
}

function genresForTitle(title) {
  return gameGenres[title] || ["action"];
}

function genreTagsForTitle(title) {
  return genresForTitle(title)
    .slice(0, 3)
    .map((genre) => `<span class="tag">${escapeHtml(gameGenreLabels[genre] || genre)}</span>`)
    .join("");
}

function pluralRu(number, one, few, many) {
  const n = Math.abs(Number(number)) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

function updateSelectedGameSummary() {
  if (!els.selectedGameSummary) return;
  const title = els.gameSelect?.value;
  if (!title) {
    els.selectedGameSummary.textContent = "Выберите игру из списка.";
    return;
  }

  const info = stockInfoForTitle(title);
  const total = info.totalAvailable;
  els.selectedGameSummary.innerHTML = `
    <span>${genreTagsForTitle(title)}</span>
    <span>${escapeHtml(stockSummaryForTitle(title))}</span>
    <strong>${total > 0 ? `Свободно ${total}` : "Свободных копий нет"}</strong>
  `;
}

function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function gameplayImageUrl(title, index) {
  const query = `${title} gameplay screenshot ${index}`;
  return `https://tse.mm.bing.net/th?q=${encodeURIComponent(query)}&w=640&h=360&c=7&rs=1&p=0`;
}

function mediaForTitle(title) {
  const rows = state.games.filter((game) => game.title === title);
  const dbMedia = rows.find((game) => game.youtubeId || game.imageUrl || game.screenshots?.length) || {};
  const media = {
    ...(gameMedia[title] || {}),
    ...(dbMedia.youtubeId ? { youtubeId: dbMedia.youtubeId } : {}),
    ...(dbMedia.imageUrl ? { cover: dbMedia.imageUrl } : {}),
    ...(dbMedia.screenshots?.length ? { screenshots: dbMedia.screenshots } : {}),
  };
  const cover = media.cover || coverImages[title] || gameplayImageUrl(title, 1);
  const screenshots = media.screenshots?.length
    ? media.screenshots.slice(0, 5)
    : [cover, 2, 3, 4, 5].map((item) => (typeof item === "string" ? item : gameplayImageUrl(title, item)));

  while (screenshots.length < 5) screenshots.push(gameplayImageUrl(title, screenshots.length + 1));
  return { ...media, screenshots: screenshots.slice(0, 5), cover };
}

function renderPlatformStock(title) {
  const info = stockInfoForTitle(title);
  const items = [
    ["Xbox", info.xbox],
    ["PlayStation", info.ps],
  ];

  return items.map(([platform, game]) => {
    const available = Number(game.available || 0) > 0;
    const text = available ? `${platform}: есть ${game.available}/${game.total}` : `${platform}: нет у консоли`;
    return `<span class="tag ${available ? "success" : "danger"}">${escapeHtml(text)}</span>`;
  }).join("");
}

function openGameDetail(title, preferredConsole = "") {
  if (!els.gameDetailModal || !els.gameDetailContent || !title) return;

  const media = mediaForTitle(title);
  const videoQuery = media.videoQuery || `${title} official gameplay trailer`;
  const videoHtml = media.youtubeId
    ? `<iframe title="${escapeHtml(`${title} трейлер`)}" src="https://www.youtube.com/embed/${escapeHtml(media.youtubeId)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`
    : `
      <div class="game-video-placeholder">
        <img src="${escapeHtml(media.cover)}" alt="${escapeHtml(title)}" />
        <div>
          <strong>Трейлер готов к подключению</strong>
          <span>Добавь YouTube ID в gameMedia, либо открой официальный ролик отдельно.</span>
          <a href="${escapeHtml(youtubeSearchUrl(videoQuery))}" target="_blank" rel="noopener">Найти трейлер</a>
        </div>
      </div>
    `;

  els.gameDetailTitle.textContent = title;
  els.gameDetailContent.innerHTML = `
    <div class="game-detail-media">${videoHtml}</div>
    <div class="game-detail-stock">${renderPlatformStock(title)}</div>
    <div class="game-photo-preview">
      <img src="${escapeHtml(media.screenshots[0])}" alt="${escapeHtml(`${title}: выбранный кадр`)}" />
    </div>
    <div class="game-gallery" aria-label="Кадры геймплея">
      ${media.screenshots.map((src, index) => `
        <button class="game-shot ${index === 0 ? "selected" : ""}" type="button" data-preview-image="${escapeHtml(src)}" aria-label="Открыть кадр ${index + 1}">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(`${title}: кадр ${index + 1}`)}" loading="lazy" />
        </button>
      `).join("")}
    </div>
    <div class="game-detail-actions">
      <button class="primary wide" type="button" data-reserve-game="${escapeHtml(title)}" data-reserve-console="${escapeHtml(preferredConsole)}">Забронировать игру</button>
    </div>
  `;

  els.gameDetailModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGameDetail() {
  if (!els.gameDetailModal) return;
  els.gameDetailModal.classList.add("hidden");
  if (els.gameDetailContent) els.gameDetailContent.innerHTML = "";
  document.body.style.overflow = "";
}

function gameTitleMatchesCategory(title, category) {
  if (!category || category === "all") return true;
  return genresForTitle(title).includes(category);
}

function getFilteredGameTitles() {
  const category = els.gameCategoryFilter?.value || "all";
  const activePlatform = activeConsoleBooking()?.platform || "";
  return [...new Set(state.games.map((game) => game.title))]
    .filter((title) => gameTitleMatchesCategory(title, category))
    .filter((title) => !activePlatform || state.games.some((game) => game.title === title && game.console === activePlatform))
    .sort((a, b) => a.localeCompare(b, "ru"));
}

function renderGameTilePicker() {
  // Плитки больше не используются: выбор игры снова сделан через выпадающий список.
}

function selectGameTitle(title, showToast = false) {
  if (!title || !els.gameSelect) return;
  els.gameSelect.value = title;
  renderConsoleAndCopyOptions();
  renderGameTilePicker();
  renderGames();
  if (showToast) toast("Игра выбрана");
}

function ensureCopySelect() {
  const current = els.gameRequestForm.elements.copy;
  if (!current || current.tagName.toLowerCase() === "select") return current;

  const select = document.createElement("select");
  select.name = "copy";
  select.id = "copySelect";
  select.required = true;
  current.replaceWith(select);
  return select;
}

function renderConsoleAndCopyOptions() {
  const title = els.gameSelect.value;
  const consoleSelect = els.gameRequestForm.elements.console;
  const copySelect = ensureCopySelect();
  const activeConsole = activeConsoleBooking();
  const previousConsole = activeConsole?.platform || consoleSelect.value;

  const platforms = ["Xbox", "PlayStation"].map((platform) => (
    state.games.find((game) => game.title === title && game.console === platform) || {
      title,
      console: platform,
      total: 0,
      available: 0,
      copies: [],
    }
  ));

  consoleSelect.innerHTML = platforms.map((game) => {
    const label = game.available > 0
      ? `${game.console} — есть ${game.available}/${game.total}`
      : `${game.console} — нет у консоли`;
    return `<option value="${escapeHtml(game.console)}">${escapeHtml(label)}</option>`;
  }).join("");

  if (platforms.some((game) => game.console === previousConsole)) {
    consoleSelect.value = previousConsole;
  } else if (platforms[0]) {
    consoleSelect.value = platforms[0].console;
  }
  consoleSelect.disabled = !activeConsole || isAccountBanned();

  const selectedGame = state.games.find((game) => game.title === title && game.console === consoleSelect.value);
  const copies = (selectedGame?.copies || []).slice().sort((a, b) => a.copy_number - b.copy_number);
  const availableCopies = copies.filter((copy) => copy.status === "available");

  if (!copySelect) return;

  if (!copies.length) {
    copySelect.innerHTML = `<option value="" selected disabled>Копий нет</option>`;
    copySelect.disabled = true;
    return;
  }

  copySelect.disabled = !activeConsole || isAccountBanned();
  const placeholder = availableCopies.length ? "" : `<option value="" selected disabled>Свободных копий нет</option>`;
  copySelect.innerHTML = placeholder + copies.map((copy) => {
    const available = copy.status === "available";
    const statusText = available ? "есть" : "занята";
    return `<option value="${copy.copy_number}" ${available ? "" : "disabled"}>Копия ${copy.copy_number} — ${statusText}</option>`;
  }).join("");

  const firstAvailable = availableCopies[0];
  if (firstAvailable) copySelect.value = String(firstAvailable.copy_number);
}

function renderGameOptions() {
  const currentTitle = els.gameSelect.value;
  const titles = getFilteredGameTitles();

  if (!titles.length) {
    els.gameSelect.innerHTML = `<option value="" selected disabled>Нет игр в этой категории</option>`;
    renderConsoleAndCopyOptions();
    updateSelectedGameSummary();
    return;
  }

  els.gameSelect.innerHTML = titles
    .map((title) => `<option value="${escapeHtml(title)}">${escapeHtml(title)}</option>`)
    .join("");

  if (titles.includes(currentTitle)) els.gameSelect.value = currentTitle;
  else els.gameSelect.value = titles[0];

  renderConsoleAndCopyOptions();
  updateSelectedGameSummary();
}

async function renderRecommendations() {
  const people = Number(new FormData(els.bookingForm).get("people") || 1);
  const { startValue, endValue } = getFormRange(els.bookingForm);
  const selectedCabinId = els.cabinSelect.value;

  try {
    const params = new URLSearchParams({
      people: String(people),
      start_time: sqlDateTimeFromInputValue(startValue),
      end_time: sqlDateTimeFromInputValue(endValue),
    });

    const rows = await api(`/api/cabins/recommendations?${params}`);
    state.recommendations = rows.map(mapCabin);
  } catch (error) {
    state.recommendations = [];
    toast(error.message, "error");
  }

  els.recommendations.innerHTML = state.recommendations.length
    ? state.recommendations
        .map((cabin) => {
          const selected = String(cabin.id) === String(selectedCabinId);
          const statusText = cabin.free
            ? "Свободна"
            : `Занята до ${formatTime(cabin.busyUntil)}`;
          const periodText = cabin.free
            ? "Можно выбрать на это время"
            : `Занята ${formatTime(cabin.busyFrom)}–${formatTime(cabin.busyUntil)}`;

          return `
            <article class="recommendation ${selected ? "selected" : ""} ${cabin.free ? "free" : "busy"}" data-select-cabin="${cabin.id}" role="button" tabindex="0">
              <strong>${cabin.code}</strong>
              <div class="meta">
                <span class="tag">Этаж ${cabin.floor}</span>
                <span class="tag">${cabin.type}</span>
                <span class="tag">До ${cabin.capacity} чел.</span>
                <span class="tag ${cabin.free ? "success" : "warning"}">${statusText}</span>
                <span class="tag">${periodText}</span>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">Нет кабинок под выбранное количество человек.</div>`;
}

async function renderConsoleRecommendations() {
  if (!els.consoleBookingForm || !els.consoleRecommendations) return;
  if (!state.token || isAccountBanned()) {
    state.consoleAvailability = [];
    els.consoleRecommendations.innerHTML = `<div class="empty">Войдите в аккаунт, чтобы увидеть свободные консоли.</div>`;
    renderActiveConsoleState();
    return;
  }

  const { startValue, endValue } = getFormRange(els.consoleBookingForm);
  const selectedPlatform = els.consolePlatformSelect?.value || "Xbox";
  try {
    const params = new URLSearchParams({
      start_time: sqlDateTimeFromInputValue(startValue),
      end_time: sqlDateTimeFromInputValue(endValue),
    });
    state.consoleAvailability = await api(`/api/consoles/recommendations?${params}`);
  } catch (error) {
    state.consoleAvailability = [];
    els.consoleRecommendations.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
    renderActiveConsoleState();
    return;
  }

  const active = activeConsoleBooking();
  const rows = state.consoleAvailability
    .filter((row) => row.platform === selectedPlatform)
    .flatMap((row) => row.slots.map((slot) => ({ ...slot, platform: row.platform, total: row.total, available: row.available })));

  els.consoleRecommendations.innerHTML = `
    ${active ? `
      <div class="notice-card">
        <strong>У вас уже есть активная бронь консоли: ${escapeHtml(activeConsoleBookingText())}</strong>
        <button data-extend-console-booking="${active.id}" type="button" ${Number(active.extensionCount || 0) >= 1 ? "disabled" : ""}>Продлить на 30 минут (1 раз)</button>
        <button class="danger" data-cancel-console-booking="${active.id}" type="button">Отменить бронь консоли</button>
      </div>
    ` : ""}
    ${rows.length ? rows.map((slot) => `
      <button class="recommendation ${slot.free ? "free" : "busy"}" type="button" ${slot.free ? "" : "disabled"}>
        <strong>${escapeHtml(slot.label)}</strong>
        <span>${slot.free ? "Свободна на выбранное время" : "Занята на выбранное время"}</span>
      </button>
    `).join("") : `<div class="empty">Нет данных по выбранной платформе.</div>`}
  `;
  renderActiveConsoleState();
}

function renderAdminBookingRow(booking) {
  const cabin = booking.cabin || state.cabins.find((item) => String(item.id) === String(booking.cabinId));
  return `
    <article class="row-item">
      <strong>${escapeHtml(booking.name)}</strong>
      <div class="meta">
        <span class="tag">${escapeHtml(cabin?.code || "Кабинка")}</span>
        <span class="tag">${formatDateTime(booking.start)}</span>
        <span class="tag">до ${formatTime(booking.end)}</span>
        <span class="tag">${booking.people} чел.</span>
        <span class="tag">${escapeHtml(booking.phone || "Телефон в профиле")}</span>
        ${booking.campusCity ? `<span class="tag">${escapeHtml(booking.campusCity)}</span>` : ""}
      </div>
      <div class="row-actions">
        <button class="danger" data-cancel="${booking.id}" type="button">Отменить бронь</button>
      </div>
    </article>
  `;
}

function renderBookings() {
  const html = state.bookings
    .map((booking) => {
      const cabin = booking.cabin || state.cabins.find((item) => String(item.id) === String(booking.cabinId));
      const canUserManage = booking.canManage || state.role === "admin";
      return `
        <article class="row-item">
          <strong>${booking.name}</strong>
          <div class="meta">
            <span class="tag">${cabin?.code || "Кабинка"}</span>
            <span class="tag">${formatDateTime(booking.start)}</span>
            <span class="tag">до ${formatTime(booking.end)}</span>
            <span class="tag">${booking.people} чел.</span>
            <span class="tag">${booking.phone || "Телефон в профиле"}</span>
            ${booking.isOwner ? `<span class="tag">Моя бронь</span>` : ""}
          </div>
          ${bookingTimerHtml(booking.end)}
          <div class="row-actions">
            ${canUserManage ? `<button data-extend="${booking.id}" type="button">Продлить на 30 минут (1 раз)</button>` : ""}
            ${canUserManage ? `<button data-release="${booking.id}" type="button">Освободить досрочно</button>` : ""}
            ${state.role === "admin" ? `<button class="danger" data-cancel="${booking.id}" type="button">Отменить</button>` : ""}
          </div>
        </article>
      `;
    })
    .join("");

  if (els.bookingHint) {
    els.bookingHint.textContent = state.bookings.length ? "Свои брони можно продлить или освободить досрочно" : "";
  }

  // Блок "Текущие брони" на странице кабинок убран, поэтому bookingsList может отсутствовать.
  if (els.bookingsList) {
    els.bookingsList.innerHTML = html || `<div class="empty">Активных броней пока нет.</div>`;
  }

  if (els.adminBookingsList) {
    const query = els.adminBookingFilter?.value?.trim().toLowerCase() || "";
    const filtered = query
      ? state.bookings.filter((booking) => [
          booking.name,
          booking.phone,
          booking.campusCity,
          booking.campusAddress,
          booking.cabin?.code,
        ].some((value) => String(value || "").toLowerCase().includes(query)))
      : state.bookings;
    const visible = filtered.slice(0, adminBookingVisibleCount);
    els.adminBookingsList.innerHTML = filtered.length
      ? `
        ${visible.map(renderAdminBookingRow).join("")}
        ${filtered.length > visible.length ? `<button class="secondary wide" data-show-more-admin-bookings type="button">Показать ещё ${Math.min(12, filtered.length - visible.length)}</button>` : ""}
      `
      : `<div class="empty">Нет броней для отмены.</div>`;
  }
}

function renderGames() {
  renderConsoleAndCopyOptions();
  updateSelectedGameSummary();
  const selectedTitle = els.gameSelect.value;
  const activeConsole = activeConsoleBooking();
  const selectedConsole = activeConsole?.platform || els.gameRequestForm.elements.console.value;
  const category = els.gameCategoryFilter?.value || "all";
  const activeText = activeGameRequestText();
  const submitButton = els.gameRequestForm?.querySelector('button[type="submit"]');
  if (els.gameCategoryFilter) els.gameCategoryFilter.disabled = isAccountBanned() || !activeConsole;
  if (els.gameSelect) els.gameSelect.disabled = isAccountBanned() || !activeConsole;
  if (els.gameRequestForm?.elements.delivery) els.gameRequestForm.elements.delivery.disabled = isAccountBanned() || !activeConsole;
  if (submitButton) submitButton.disabled = isAccountBanned() || !activeConsole || Boolean(activeText);

  const gamesToShow = state.games
    .filter((game) => gameTitleMatchesCategory(game.title, category))
    .filter((game) => !activeConsole || game.console === activeConsole.platform)
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, "ru") || a.console.localeCompare(b.console, "ru"));
  const visibleGames = gamesToShow.slice(0, gamesCatalogVisibleCount);

  if (els.gamesCatalogCount) {
    els.gamesCatalogCount.textContent = `${gamesToShow.length} ${pluralRu(gamesToShow.length, "позиция", "позиции", "позиций")}`;
  }

  els.gamesCatalog.innerHTML = `
    ${activeText ? `<div class="notice-card warning-text">${escapeHtml(activeText)}</div>` : ""}
    ${gamesToShow.length ? visibleGames
      .map((game) => {
        const fallback = `https://tse.mm.bing.net/th?q=${encodeURIComponent(`${game.title} game cover art`)}&w=300&h=160&c=7&rs=1&p=0`;
        const selected = game.title === selectedTitle && game.console === selectedConsole;
        const isAvailable = game.available > 0;
        const consoleLabel = isAvailable ? `${game.console} — есть ${game.available}/${game.total}` : `${game.console} — нет у консоли`;
        return `
          <article class="game-card ${selected ? "selected" : ""} ${isAvailable ? "" : "unavailable"}" data-select-game="${escapeHtml(game.title)}" data-select-console="${escapeHtml(game.console)}" role="button" tabindex="0">
            <div class="cover">
              <img src="${coverImages[game.title] || fallback}" data-fallback="${fallback}" alt="${escapeHtml(game.title)}" onerror="this.onerror=null;this.src=this.dataset.fallback" />
              <span>${escapeHtml(game.title.slice(0, 1))}</span>
            </div>
            <div>
              <strong>${escapeHtml(game.title)}</strong>
              <div class="meta">
                ${genreTagsForTitle(game.title)}
                <span class="tag ${isAvailable ? "success" : "danger"}">${escapeHtml(consoleLabel)}</span>
                <span class="tag">Доступно ${game.available}</span>
                <span class="tag">Всего ${game.total}</span>
              </div>
            </div>
            <span class="tag ${isAvailable ? "success" : "danger"}">${isAvailable ? "Есть" : "Нет у консоли"}</span>
          </article>
        `;
      })
      .join("") : `<div class="empty">Р’ выбранной категории игр нет.</div>`}
    ${gamesToShow.length > visibleGames.length ? `<button class="secondary wide" data-show-more-games type="button">Показать ещё ${Math.min(12, gamesToShow.length - visibleGames.length)}</button>` : ""}
  `;
}

function applyGameRequestAvailability() {
  renderActiveConsoleState();
}

function renderRequests() {
  els.requestHint.textContent = state.user ? "Ваши последние запросы" : "Войдите, чтобы видеть историю";
  els.requestsList.innerHTML = state.requests.length
    ? state.requests
        .map(
          (request) => `
          <article class="row-item">
            <strong>${request.name}</strong>
            <div class="meta">
              <span class="tag">${request.title}</span>
              <span class="tag">${request.console}</span>
              <span class="tag">Копия ${request.copy}</span>
              <span class="tag">${request.delivery}</span>
              <span class="tag">${request.phone}</span>
              <span class="tag ${request.status === "cancelled" ? "danger" : ""}">${formatRequestStatus(request.status)}</span>
            </div>
          </article>
        `,
        )
        .join("")
    : `<div class="empty">${state.user ? "Запросов на выдачу пока нет." : "Войдите в аккаунт, чтобы оформлять и смотреть запросы."}</div>`;

  renderAdminGameRequests();
}

function renderAdminGameRequests() {
  if (!els.adminGameRequestsList) return;

  if (state.role !== "admin") {
    els.adminGameRequestsList.innerHTML = `<div class="empty">Доступно только администратору.</div>`;
    return;
  }

  const query = els.adminGameRequestFilter?.value?.trim().toLowerCase() || "";
  const filteredRequests = query
    ? state.requests.filter((request) => [
        request.title,
        request.name,
        request.phone,
        request.console,
        request.delivery,
        formatRequestStatus(request.status),
      ].some((value) => String(value || "").toLowerCase().includes(query)))
    : state.requests;
  const visibleRequests = filteredRequests.slice(0, adminGameRequestVisibleCount);

  els.adminGameRequestsList.innerHTML = filteredRequests.length
    ? `
        ${filteredRequests.length > visibleRequests.length ? `<button class="secondary wide" data-show-more-admin-game-requests type="button">Показать ещё ${Math.min(12, filteredRequests.length - visibleRequests.length)}</button>` : ""}
        ${visibleRequests
        .map((request) => {
          const canCancel = canCancelGameRequest(request);
          return `
            <article class="row-item">
              <strong>${request.title}</strong>
              <div class="meta">
                <span class="tag">${request.name}</span>
                <span class="tag">${request.phone}</span>
                <span class="tag">${request.console}</span>
                <span class="tag">Копия ${request.copy}</span>
                <span class="tag">${request.delivery}</span>
                <span class="tag ${request.status === "cancelled" ? "danger" : ""}">${formatRequestStatus(request.status)}</span>
              </div>
              ${canCancel ? `
                <div class="row-actions">
                  <button class="danger" data-cancel-game-request="${request.id}" type="button">Отменить выдачу игры</button>
                </div>
              ` : ""}
            </article>
          `;
        })
        .join("")}
      `
    : `<div class="empty">${query ? "По этому поиску запросов нет." : "Запросов игр пока нет."}</div>`;
}

function setSelectOptions(select, options, fallbackValue = "all") {
  if (!select) return;
  const current = select.value || fallbackValue;
  select.innerHTML = options
    .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
    .join("");
  select.value = options.some(([value]) => value === current) ? current : fallbackValue;
}

function renderAdminFilterOptions() {
  setSelectOptions(els.adminUserCityFilter, [
    ["all", "Все города"],
    ...[...new Set(state.adminUsers.map((user) => user.campus_city).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "ru"))
      .map((city) => [city, city]),
  ]);

  setSelectOptions(els.adminCabinFloorFilter, [
    ["all", "Все этажи"],
    ...[...new Set(state.adminCabins.map((cabin) => String(cabin.floor_number)).filter(Boolean))]
      .sort((a, b) => Number(a) - Number(b))
      .map((floor) => [floor, `${floor} этаж`]),
  ]);

  setSelectOptions(els.adminCabinCityFilter, [
    ["all", "Все города"],
    ...[...new Set(state.adminCabins.map((cabin) => cabin.campus_city).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "ru"))
      .map((city) => [city, city]),
  ]);

  setSelectOptions(els.adminCabinCapacityFilter, [
    ["all", "Любая"],
    ...[...new Set(state.adminCabins.map((cabin) => String(cabin.capacity)).filter(Boolean))]
      .sort((a, b) => Number(a) - Number(b))
      .map((capacity) => [capacity, `${capacity} чел.`]),
  ]);
}

function matchesAdminSearch(values, query) {
  if (!query) return true;
  return values.some((value) => String(value || "").toLowerCase().includes(query));
}

function renderAdminManagement() {
  if (state.role !== "admin") return;
  renderAdminFilterOptions();

  if (els.adminUsersList) {
    const query = els.adminUserSearch?.value?.trim().toLowerCase() || "";
    const status = els.adminUserStatusFilter?.value || "all";
    const city = els.adminUserCityFilter?.value || "all";
    const sort = els.adminUserSort?.value || "new";
    const users = state.adminUsers
      .filter((user) => {
        const banned = Boolean(user.ban?.is_banned);
        if (status === "active" && banned) return false;
        if (status === "banned" && !banned) return false;
        if (city !== "all" && user.campus_city !== city) return false;
        return matchesAdminSearch([user.full_name, user.phone, user.email, user.campus_city], query);
      })
      .sort((a, b) => {
        if (sort === "name") return String(a.full_name || "").localeCompare(String(b.full_name || ""), "ru");
        if (sort === "city") return String(a.campus_city || "Я").localeCompare(String(b.campus_city || "Я"), "ru");
        if (sort === "status") return Number(Boolean(b.ban?.is_banned)) - Number(Boolean(a.ban?.is_banned));
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });

    els.adminUsersList.innerHTML = users.length
      ? users.map((user) => {
          const banned = Boolean(user.ban?.is_banned);
          return `
            <article class="row-item">
              <div class="user-row-head">
                <img class="mini-avatar" src="${escapeHtml(user.avatar_url || profileAvatars[0])}" alt="" />
                <strong>${escapeHtml(user.full_name)}</strong>
              </div>
              <div class="meta">
                <span class="tag">${escapeHtml(user.phone || "Телефон не указан")}</span>
                <span class="tag">${escapeHtml(user.email || "Почта не указана")}</span>
                ${user.campus_city ? `<span class="tag">${escapeHtml(user.campus_city)}</span>` : ""}
                <span class="tag ${banned ? "danger" : "success"}">${banned ? `Забанен: ${escapeHtml(user.ban.reason || "")}` : "Активен"}</span>
              </div>
              <div class="row-actions">
                ${banned
                  ? `<button data-admin-unban-user="${user.id}" type="button">Разбанить</button>`
                  : `<button class="danger" data-admin-ban-user="${user.id}" type="button">Забанить</button>`}
              </div>
            </article>
          `;
        }).join("")
      : `<div class="empty">${state.adminUsers.length ? "По выбранным фильтрам пользователей нет." : "Пользователей пока нет."}</div>`;
  }

  if (els.adminCabinsList) {
    const query = els.adminCabinSearch?.value?.trim().toLowerCase() || "";
    const floor = els.adminCabinFloorFilter?.value || "all";
    const city = els.adminCabinCityFilter?.value || "all";
    const capacity = els.adminCabinCapacityFilter?.value || "all";
    const active = els.adminCabinActiveFilter?.value || "all";
    const cabins = state.adminCabins
      .filter((cabin) => {
        if (floor !== "all" && String(cabin.floor_number) !== floor) return false;
        if (city !== "all" && cabin.campus_city !== city) return false;
        if (capacity !== "all" && String(cabin.capacity) !== capacity) return false;
        if (active === "active" && !cabin.is_active) return false;
        if (active === "inactive" && cabin.is_active) return false;
        return matchesAdminSearch([cabin.cabin_code, cabin.cabin_number, cabin.cabin_type, cabin.campus_city], query);
      })
      .sort((a, b) => Number(a.floor_number) - Number(b.floor_number) || Number(a.cabin_number) - Number(b.cabin_number));

    els.adminCabinsList.innerHTML = cabins.length
      ? cabins.map((cabin) => `
        <article class="row-item">
          <strong>${escapeHtml(cabin.cabin_code)}</strong>
          <div class="meta">
            <span class="tag">Этаж ${cabin.floor_number}</span>
            <span class="tag">Каб. ${cabin.cabin_number}</span>
            ${cabin.campus_city ? `<span class="tag">${escapeHtml(cabin.campus_city)}</span>` : ""}
            <span class="tag">${escapeHtml(cabin.cabin_type)}</span>
            <span class="tag">До ${cabin.capacity} чел.</span>
            <span class="tag ${cabin.is_active ? "success" : "danger"}">${cabin.is_active ? "Активна" : "Скрыта"}</span>
          </div>
          <div class="row-actions">
            <button data-edit-cabin="${cabin.id}" type="button">Редактировать</button>
          </div>
        </article>
      `).join("")
      : `<div class="empty">${state.adminCabins.length ? "По выбранным фильтрам кабинок нет." : "Кабинок пока нет."}</div>`;
  }

  if (els.adminGamesList) {
    const query = els.adminGameSearch?.value?.trim().toLowerCase() || "";
    const platform = els.adminGamePlatformFilter?.value || "all";
    const active = els.adminGameActiveFilter?.value || "all";
    const sort = els.adminGameSort?.value || "title";
    const games = state.adminGames
      .filter((game) => {
        if (platform === "xbox" && Number(game.xbox_total || 0) <= 0) return false;
        if (platform === "playstation" && Number(game.playstation_total || 0) <= 0) return false;
        if (active === "active" && !game.is_active) return false;
        if (active === "inactive" && game.is_active) return false;
        return matchesAdminSearch([game.title], query);
      })
      .sort((a, b) => {
        if (sort === "platform") return (Number(b.xbox_total || 0) + Number(b.playstation_total || 0)) - (Number(a.xbox_total || 0) + Number(a.playstation_total || 0));
        if (sort === "active") return Number(Boolean(b.is_active)) - Number(Boolean(a.is_active)) || String(a.title || "").localeCompare(String(b.title || ""), "ru");
        return String(a.title || "").localeCompare(String(b.title || ""), "ru");
      });

    els.adminGamesList.innerHTML = games.length
      ? games.map((game) => `
        <article class="row-item">
          <strong>${escapeHtml(game.title)}</strong>
          <div class="meta">
            <span class="tag">Xbox: ${game.xbox_total}</span>
            <span class="tag">PlayStation: ${game.playstation_total}</span>
            <span class="tag ${game.is_active ? "success" : "danger"}">${game.is_active ? "Активна" : "Скрыта"}</span>
          </div>
          <div class="row-actions">
            <button data-edit-game="${game.game_id}" type="button">Редактировать</button>
          </div>
        </article>
      `).join("")
      : `<div class="empty">${state.adminGames.length ? "По выбранным фильтрам игр нет." : "Игр пока нет."}</div>`;
  }

  if (els.adminSupportList) {
    const query = els.adminSupportFilter?.value?.trim().toLowerCase() || "";
    const messages = query
      ? state.adminSupportMessages.filter((item) => [
          item.full_name,
          item.email,
          item.phone,
          item.message,
          item.admin_reply,
          formatSupportStatus(item.status),
        ].some((value) => String(value || "").toLowerCase().includes(query)))
      : state.adminSupportMessages;

    els.adminSupportList.innerHTML = messages.length
      ? messages.map((item) => `
        <article class="row-item support-message ${item.status === "open" ? "support-open" : ""}">
          <div class="support-message-head">
            <strong>${escapeHtml(item.full_name || "Пользователь")}</strong>
            <span class="tag ${item.status === "open" ? "warning" : item.status === "answered" ? "success" : ""}">${formatSupportStatus(item.status)}</span>
          </div>
          <div class="meta">
            <span class="tag">${escapeHtml(item.phone || "Телефон не указан")}</span>
            <span class="tag">${escapeHtml(item.email || "Почта не указана")}</span>
            <span class="tag">${formatDateTime(item.created_at)}</span>
          </div>
          <p>${escapeHtml(item.message)}</p>
          ${item.admin_reply ? `
            <div class="support-reply">
              <strong>Ответ</strong>
              <p>${escapeHtml(item.admin_reply)}</p>
            </div>
          ` : ""}
          <form class="support-reply-form" data-support-reply="${item.id}">
            <textarea name="admin_reply" rows="3" placeholder="Ответ пользователю">${escapeHtml(item.admin_reply || "")}</textarea>
            <div class="row-actions">
              <button class="primary" name="status" value="answered" type="submit">Ответить</button>
              <button class="secondary" name="status" value="closed" type="submit">Закрыть</button>
            </div>
          </form>
        </article>
      `).join("")
      : `<div class="empty">${state.adminSupportMessages.length ? "По этому поиску обращений нет." : "Обращений пока нет."}</div>`;
  }
  enhanceAdminDeleteButtons();
}

function enhanceAdminDeleteButtons() {
  document.querySelectorAll("[data-admin-ban-user], [data-admin-unban-user]").forEach((button) => {
    const id = button.dataset.adminBanUser || button.dataset.adminUnbanUser;
    const actions = button.closest(".row-actions");
    if (actions && id && !actions.querySelector(`[data-admin-delete-user="${id}"]`)) {
      actions.insertAdjacentHTML("beforeend", `<button class="danger" data-admin-delete-user="${id}" type="button">Удалить</button>`);
    }
  });

  document.querySelectorAll("[data-edit-cabin]").forEach((button) => {
    const id = button.dataset.editCabin;
    const actions = button.closest(".row-actions");
    if (actions && id && !actions.querySelector(`[data-delete-cabin="${id}"]`)) {
      actions.insertAdjacentHTML("beforeend", `<button class="danger" data-delete-cabin="${id}" type="button">Удалить</button>`);
    }
  });

  document.querySelectorAll("[data-edit-game]").forEach((button) => {
    const id = button.dataset.editGame;
    const actions = button.closest(".row-actions");
    if (actions && id && !actions.querySelector(`[data-delete-game="${id}"]`)) {
      actions.insertAdjacentHTML("beforeend", `<button class="danger" data-delete-game="${id}" type="button">Удалить</button>`);
    }
  });
}

function renderMetrics() {
  const current = now();
  const busyCabins = new Set(
    state.bookings
      .filter((booking) => new Date(booking.start) <= current && new Date(booking.end) > current)
      .map((booking) => String(booking.cabinId))
  );
  els.freeCabinsMetric.textContent = Math.max(0, state.cabins.length - busyCabins.size);
  els.gamesMetric.textContent = new Set(state.games.map((game) => game.title)).size;
  els.activeBookingsMetric.textContent = state.bookings.length;
}

function renderAdminAccess() {
  const locked = state.role !== "admin";
  els.adminSection.classList.toggle("admin-locked", locked);
  els.adminLock.textContent = locked ? "Доступно только администратору" : "Админ-доступ активен";
  els.adminLock.classList.toggle("danger", locked);
}


function setAuthGateMode(mode) {
  const isLogin = mode === "login";
  const registerForm = document.querySelector("#authGateRegisterForm");
  const loginForm = document.querySelector("#authGateLoginForm");
  const registerTab = document.querySelector("#authGateRegisterTab");
  const loginTab = document.querySelector("#authGateLoginTab");
  const title = document.querySelector("#authGateTitle");
  const subtitle = document.querySelector("#authGateSubtitle");

  registerForm?.classList.toggle("hidden", isLogin);
  loginForm?.classList.toggle("hidden", !isLogin);
  registerTab?.classList.toggle("active", !isLogin);
  loginTab?.classList.toggle("active", isLogin);

  if (title) {
    title.textContent = isLogin ? "Войдите в аккаунт" : "Создайте аккаунт";
  }
  if (subtitle) {
    subtitle.textContent = isLogin
      ? "Введите почту и пароль, чтобы открыть профиль, брони и историю запросов."
      : "После регистрации у вас появится профиль, история броней и защита от управления чужими бронями.";
  }
}

function showAuthGate(mode = "register") {
  setAuthGateMode(mode);
  const gate = document.querySelector("#authGate");
  gate?.classList.add("active");
  document.body.style.overflow = "hidden";
  const firstInput = document.querySelector(mode === "login" ? "#authGateLoginForm input" : "#authGateRegisterForm input");
  setTimeout(() => firstInput?.focus(), 50);
}

function hideAuthGate() {
  const gate = document.querySelector("#authGate");
  gate?.classList.remove("active");
  document.body.style.overflow = "";
}

function updateAuthGate() {
  if (!state.user) {
    hideCampusGate();
    showAuthGate("register");
    return;
  }

  hideAuthGate();
  if (isAccountBanned()) {
    hideCampusGate();
    return;
  }
  if (state.user.role !== "admin" && !state.user.campus_city) {
    showCampusGate();
  } else {
    hideCampusGate();
  }
}

function renderProfile() {
  if (!els.profileContent) return;
  els.profileStatus.textContent = state.user ? `${state.user.full_name} · ${state.user.role === "admin" ? "Админ" : "Пользователь"}` : "Вход или регистрация";
  renderBanBanner();

  if (!state.user) {
    els.profileContent.innerHTML = `
      <div class="work-grid">
        <form id="loginForm" class="panel">
          <h3>Вход</h3>
          <label>Почта<input name="email" type="email" required autocomplete="username" placeholder="name@gmail.com" /></label>
          <label>Пароль<input name="password" type="password" required autocomplete="current-password" placeholder="Введите пароль" /></label>
          <button class="primary wide" type="submit">Войти</button>
        </form>
        <form id="registerForm" class="panel">
          <h3>Регистрация</h3>
          <label>ФИО<input name="full_name" required placeholder="Иванов Иван Иванович" /></label>
          <label>Телефон<input name="phone" required inputmode="tel" maxlength="18" autocomplete="tel" placeholder="+7 900 000-00-00" /></label>
          <label>Почта<input name="email" type="email" required autocomplete="username" placeholder="name@gmail.com" /></label>
          <label>Пароль<input name="password" type="password" required autocomplete="new-password" placeholder="Минимум 6 символов" /></label>
          <button class="primary wide" type="submit">Зарегистрироваться</button>
        </form>
      </div>
    `;
    return;
  }

  if (state.user.role === "admin") {
    els.profileContent.innerHTML = `
      <div class="panel">
        <h3>Аккаунт администратора</h3>
        <div class="meta">
          <span class="tag">${escapeHtml(state.user.full_name || "Администратор")}</span>
          <span class="tag">${escapeHtml(state.user.email || "")}</span>
          <span class="tag">Администратор</span>
        </div>
        <div class="row-actions" style="margin-top: 16px;">
          <button id="logoutButton" class="danger" type="button">Выйти</button>
        </div>
      </div>
    `;
    return;
  }

  const profile = state.profile || { bookings: [], game_requests: [] };
  const active = (profile.bookings || []).filter((booking) => booking.status === "active");
  const history = profile.bookings || [];
  const gamesHistory = profile.game_requests || [];
  const activeConsoleBookings = (state.consoleBookings || []).filter(isActiveConsoleBooking);
  const activeGameRequests = gamesHistory.filter(isActiveGameRequest);
  const supportHistory = state.supportMessages || [];

  els.profileContent.innerHTML = `
    <div class="work-grid">
      <div class="panel">
        <h3>Данные аккаунта</h3>
        <div class="meta">
          <span class="tag">${state.user.full_name}</span>
          <span class="tag">${state.user.phone}</span>
          <span class="tag">${state.user.email}</span>
          <span class="tag">${state.user.role === "admin" ? "Администратор" : "Пользователь"}</span>
          ${isAccountBanned() ? `<span class="tag danger">Аккаунт забанен</span>` : ""}
        </div>
        ${state.user.role !== "admin" ? `
          <form id="profileAvatarForm" class="avatar-form">
            <div class="profile-avatar-current">
              <img src="${escapeHtml(state.user.avatar_url || profileAvatars[0])}" alt="Аватар профиля" />
              <div>
                <strong>Аватар профиля</strong>
                <p class="form-note">Выберите один из готовых вариантов.</p>
              </div>
            </div>
            <div class="avatar-grid">
              ${profileAvatars.map((avatar) => `
                <label class="avatar-choice ${avatar === (state.user.avatar_url || profileAvatars[0]) ? "selected" : ""}">
                  <input name="avatar_url" type="radio" value="${avatar}" ${avatar === (state.user.avatar_url || profileAvatars[0]) ? "checked" : ""} />
                  <img src="${avatar}" alt="Вариант аватара" />
                </label>
              `).join("")}
            </div>
            <button class="secondary" type="submit">Сохранить аватар</button>
          </form>
        ` : ""}
        ${state.user.role !== "admin" ? `
          <form id="profileCampusForm" class="campus-form" style="margin-top: 16px;">
            <label>
              Ваш город Школы 21
              <select name="campus_city">${campusOptionsHtml(state.user.campus_city || "")}</select>
            </label>
            <button class="secondary" type="submit">Сохранить город</button>
            <p class="form-note">${escapeHtml(state.user.campus_address ? campusDisplayAddress(state.user.campus_city, state.user.campus_address) : "Выберите город, чтобы сохранить кампус для броней.")}</p>
          </form>
        ` : ""}
        <div class="row-actions" style="margin-top: 16px;">
          <button id="logoutButton" class="danger" type="button">Выйти</button>
        </div>
      </div>
      <div class="panel">
        <h3>Активные брони</h3>
        <div class="list">
          ${active.length ? active.map((booking) => {
            const bookingExpired = new Date(booking.end_time) <= new Date();
            return `
            <article class="row-item">
              <strong>${booking.cabin_code}</strong>
              <div class="meta">
                <span class="tag">${formatDateTime(booking.start_time)}</span>
                <span class="tag">до ${formatTime(booking.end_time)}</span>
                <span class="tag">${booking.people_count} чел.</span>
                <span class="tag">${booking.status}</span>
              </div>
              ${bookingTimerHtml(booking.end_time)}
              ${bookingExpired ? "" : `<div class="row-actions">
                <button data-extend="${booking.id}" type="button" ${isAccountBanned() ? "disabled" : ""}>Продлить на 30 минут (1 раз)</button>
                <button class="danger" data-release="${booking.id}" type="button" ${isAccountBanned() ? "disabled" : ""}>Отменить бронь</button>
              </div>`}
            </article>
          `;
          }).join("") : ""}
          ${activeConsoleBookings.map(consoleBookingProfileHtml).join("")}
          ${activeGameRequests.map(gameRequestProfileHtml).join("")}
          ${!active.length && !activeConsoleBookings.length && !activeGameRequests.length ? `<div class="empty">Активных броней нет.</div>` : ""}
        </div>
      </div>
    </div>

    <div class="panel table-panel support-panel">
      <div class="panel-heading">
        <div>
          <h3>Поддержка</h3>
          <span>Напишите вопрос администратору по брони, игре или технической проблеме</span>
        </div>
      </div>
      <form id="supportForm" class="support-form">
        <label>
          Сообщение
          <textarea name="message" rows="4" maxlength="1200" required placeholder="Опишите проблему или вопрос"></textarea>
        </label>
        <button class="primary" type="submit">Отправить в поддержку</button>
      </form>
      <div class="list support-list">
        ${supportHistory.length ? supportHistory.map((item) => `
          <article class="row-item support-message ${item.status === "open" ? "support-open" : ""}">
            <div class="support-message-head">
              <strong>${formatSupportStatus(item.status)}</strong>
              <span>${formatDateTime(item.created_at)}</span>
            </div>
            <p>${escapeHtml(item.message)}</p>
            ${item.admin_reply ? `
              <div class="support-reply">
                <strong>Ответ администратора</strong>
                <p>${escapeHtml(item.admin_reply)}</p>
                ${item.answered_at ? `<span>${formatDateTime(item.answered_at)}</span>` : ""}
              </div>
            ` : `<div class="support-reply muted">Администратор ещё не ответил</div>`}
          </article>
        `).join("") : `<div class="empty">Обращений пока нет.</div>`}
      </div>
    </div>

    <details class="panel table-panel history-dropdown">
      <summary>
        <span>История бронирований</span>
        <strong>${history.length}</strong>
      </summary>
      <div class="list dropdown-list">
        ${history.length ? history.map((booking) => `
          <article class="row-item">
            <strong>${booking.cabin_code}</strong>
            <div class="meta">
              <span class="tag">${formatDateTime(booking.start_time)}</span>
              <span class="tag">до ${formatTime(booking.end_time)}</span>
              <span class="tag">${booking.people_count} чел.</span>
              <span class="tag">${booking.status}</span>
            </div>
          </article>
        `).join("") : `<div class="empty">Истории бронирований пока нет.</div>`}
      </div>
    </details>

    <details class="panel table-panel history-dropdown">
      <summary>
        <span>История запросов игр</span>
        <strong>${gamesHistory.length}</strong>
      </summary>
      <div class="list dropdown-list">
        ${gamesHistory.length ? gamesHistory.map((request) => `
          <article class="row-item ${isActiveGameRequest(request) ? "active-game-request" : ""}">
            <strong>${request.title}</strong>
            <div class="meta">
              <span class="tag">${request.platform}</span>
              <span class="tag">Копия ${request.copy_number}</span>
              <span class="tag">${request.receive_type === "delivery" ? "Доставка" : "Самовывоз"}</span>
              ${requestCampusCity(request) ? `<span class="tag">${escapeHtml(requestCampusCity(request))}</span>` : ""}
              <span class="tag ${request.status === "cancelled" ? "danger" : isActiveGameRequest(request) ? "success" : ""}">${formatRequestStatus(request.status)}</span>
              <span class="tag">${formatDateTime(request.created_at)}</span>
            </div>
            ${gameRequestNoticeHtml(request)}
            ${canCancelGameRequest(request) ? `
              <div class="row-actions">
                <button class="danger" data-user-cancel-game-request="${request.id}" type="button" ${isAccountBanned() ? "disabled" : ""}>Отменить запрос игры</button>
              </div>
            ` : ""}
          </article>
        `).join("") : `<div class="empty">Запросов игр пока нет.</div>`}
      </div>
    </details>
  `;

  const profileCampusForm = document.querySelector("#profileCampusForm");
  if (profileCampusForm && !profileCampusForm.querySelector("[data-campus-map]")) {
    const note = profileCampusForm.querySelector(".form-note");
    note?.insertAdjacentHTML("afterend", `<div data-campus-map></div>`);
    updateCampusAddress(profileCampusForm.querySelector('select[name="campus_city"]'), note);
  }
}


function updateAdminMenuVisibility() {
  const adminButton = document.querySelector('.nav-tab[data-view="admin"]');
  const isAdmin = state.user && state.user.role === "admin";
  document.body.dataset.adminReady = isAdmin ? "true" : "false";

  if (adminButton) {
    adminButton.classList.toggle("hidden", !isAdmin);
    adminButton.style.display = isAdmin ? "" : "none";
  }

  document.querySelectorAll('.nav-tab[data-view="dashboard"], .nav-tab[data-view="cabins"], .nav-tab[data-view="games"]').forEach((button) => {
    button.classList.toggle("hidden", Boolean(isAdmin));
    button.style.display = isAdmin ? "none" : "";
  });

  const adminView = document.querySelector("#admin");
  const activeView = document.querySelector(".view.active");
  if (isAdmin && activeView && !["admin", "profile"].includes(activeView.id)) {
    switchView("admin");
  }
  if (!isAdmin && adminView && adminView.classList.contains("active")) {
    switchView("dashboard");
  }
}

function renderAuthState() {
  state.role = state.user?.role || "guest";
  updateAdminMenuVisibility();
  renderBanBanner();
  els.roleButtons.forEach((button) => button.classList.toggle("active", button.dataset.role === state.role));
  fillAccountFields();
  renderAdminAccess();
  renderProfile();
  renderFooter();
  updateAuthGate();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  els.themeToggle.title = theme === "dark" ? "Включить светлую тему" : "Включить темную тему";
  els.themeToggle.setAttribute("aria-label", els.themeToggle.title);
  els.themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  if (els.themeTogglePanel) {
    els.themeTogglePanel.setAttribute("aria-pressed", String(theme === "dark"));
    els.themeTogglePanel.title = els.themeToggle.title;
    els.themeTogglePanel.setAttribute("aria-label", els.themeToggle.title);
  }
  if (els.themeLabelPanel) {
    els.themeLabelPanel.textContent = theme === "dark" ? "Темная" : "Светлая";
  }
}

function openAdminLogin() {
  if (!els.adminLoginModal || !els.adminLoginForm) {
    showAuthGate("login");
    return;
  }
  els.adminLoginModal.classList.remove("hidden");
  els.adminLoginForm.elements.email.focus();
}

function closeAdminLogin() {
  if (!els.adminLoginModal || !els.adminLoginForm) return;
  els.adminLoginModal.classList.add("hidden");
  els.adminLoginForm.reset();
}

function switchView(id) {
  if (isAccountBanned() && !["dashboard", "profile"].includes(id)) {
    id = "profile";
  }

  if (id === "admin" && (!state.user || state.user.role !== "admin")) {
    id = "dashboard";
  }

  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === id));
}

async function loadCabins() {
  const rows = await api("/api/cabins");
  state.cabins = rows.map(mapCabin);
}

async function loadBookings() {
  const rows = await api("/api/bookings");
  state.bookings = rows.map(mapBooking);
}

async function loadConsoleBookings() {
  if (!state.token) {
    state.consoleBookings = [];
    return;
  }
  const rows = await api("/api/console-bookings");
  state.consoleBookings = rows.map(mapConsoleBooking);
}

async function loadGames() {
  const rows = await api("/api/games");
  state.games = rows.map(mapGame);
}

async function loadRequests() {
  const rows = await api("/api/game-requests");
  state.requests = rows.map(mapRequest);
}

async function loadSupportMessages() {
  if (!state.token) {
    state.supportMessages = [];
    return;
  }
  state.supportMessages = await api("/api/support/messages");
}

async function loadAdminSupportMessages() {
  if (state.role !== "admin") {
    state.adminSupportMessages = [];
    return;
  }
  state.adminSupportMessages = await api("/api/admin/support/messages");
}

async function loadAdminData() {
  if (state.role !== "admin") {
    state.adminUsers = [];
    state.adminCabins = [];
    state.adminGames = [];
    state.adminSupportMessages = [];
    return;
  }

  const [users, cabins, games, supportMessages] = await Promise.all([
    api("/api/admin/users"),
    api("/api/admin/cabins"),
    api("/api/admin/games"),
    api("/api/admin/support/messages"),
  ]);
  state.adminUsers = users;
  state.adminCabins = cabins;
  state.adminGames = games;
  state.adminSupportMessages = supportMessages;
}

async function loadProfile() {
  if (!state.token) {
    state.profile = null;
    return;
  }
  state.profile = await api("/api/profile");
  if (state.profile?.user && state.user) {
    state.user = { ...state.user, ...state.profile.user };
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: state.token, user: state.user }));
  }
}

async function loadMe() {
  if (!state.token) return;
  try {
    const data = await api("/api/auth/me");
    saveAuth(state.token, data.user);
  } catch (_) {
    saveAuth("", null);
  }
}

function supportMessagesSignature(messages) {
  return JSON.stringify((messages || []).map((item) => ({
    id: item.id,
    status: item.status,
    admin_reply: item.admin_reply || "",
    updated_at: item.updated_at || "",
  })));
}

function supportReplyCount(messages) {
  return (messages || []).filter((item) => item.admin_reply || item.status === "answered").length;
}

function supportOpenCount(messages) {
  return (messages || []).filter((item) => item.status === "open").length;
}

let supportPollInFlight = false;
async function refreshSupportMessages() {
  if (supportPollInFlight || !state.token || !state.user) return;
  supportPollInFlight = true;

  const oldUserSignature = supportMessagesSignature(state.supportMessages);
  const oldReplyCount = supportReplyCount(state.supportMessages);
  const oldAdminSignature = supportMessagesSignature(state.adminSupportMessages);
  const oldAdminOpenCount = supportOpenCount(state.adminSupportMessages);

  try {
    await loadSupportMessages();
    const newUserSignature = supportMessagesSignature(state.supportMessages);
    if (newUserSignature !== oldUserSignature) {
      const activeView = document.querySelector(".view.active")?.id;
      const typingSupportMessage = Boolean(document.activeElement?.closest?.("#supportForm"));
      if (activeView === "profile" && !typingSupportMessage) renderProfile();
      if (oldUserSignature && supportReplyCount(state.supportMessages) > oldReplyCount) {
        push("Поддержка ответила", "Администратор ответил на ваше обращение.");
        toast("В поддержке появился новый ответ");
      }
    }

    if (state.role === "admin") {
      await loadAdminSupportMessages();
      const newAdminSignature = supportMessagesSignature(state.adminSupportMessages);
      if (newAdminSignature !== oldAdminSignature) {
        const typingReply = Boolean(document.activeElement?.closest?.(".support-reply-form"));
        if (!typingReply) renderAdminManagement();
        if (oldAdminSignature && supportOpenCount(state.adminSupportMessages) > oldAdminOpenCount) {
          toast("\u041d\u043e\u0432\u043e\u0435 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443");
          push("\u041d\u043e\u0432\u043e\u0435 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435", "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u043d\u0430\u043f\u0438\u0441\u0430\u043b \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443.");
        }
      }
    }
  } catch (_) {
    // Тихо ждём следующий опрос: туннель или сеть могут кратко моргнуть.
  } finally {
    supportPollInFlight = false;
  }
}

async function reloadBookingData() {
  await loadBookings();
  await loadAdminData();
  renderBookings();
  renderAdminManagement();
  renderMetrics();
  await renderRecommendations();
  renderMetrics();
  if (state.user) {
    await loadProfile();
    renderProfile();
  }
}

async function reloadGameData() {
  await loadGames();
  await loadRequests();
  await loadConsoleBookings();
  await loadAdminData();
  renderGameOptions();
  renderActiveConsoleState();
  await renderConsoleRecommendations();
  renderGames();
  renderActiveConsoleState();
  renderRequests();
  renderAdminManagement();
  renderMetrics();
  if (state.user) {
    await loadProfile();
    renderProfile();
  }
}

async function renderAll() {
  renderAuthState();
  renderCabinOptions();
  renderGameOptions();
  renderActiveConsoleState();
  await renderRecommendations();
  await renderConsoleRecommendations();
  renderBookings();
  renderGames();
  renderActiveConsoleState();
  renderRequests();
  renderAdminManagement();
  renderMetrics();
  renderBanBanner();
}

function setDefaultStart() {
  const input = els.bookingForm.elements.start;
  const start = new Date(Date.now() + minutes(30));
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  input.value = formatLocalDateTime(start);
}

function setDefaultConsoleStart() {
  if (!els.consoleBookingForm?.elements.start) return;
  const input = els.consoleBookingForm.elements.start;
  const start = new Date(Date.now() + minutes(30));
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  input.value = formatLocalDateTime(start);
}

let recommendationTimer = null;
function scheduleRecommendations() {
  clearTimeout(recommendationTimer);
  recommendationTimer = setTimeout(async () => {
    await renderRecommendations();
    renderMetrics();
  }, 250);
}

let consoleRecommendationTimer = null;
function scheduleConsoleRecommendations() {
  clearTimeout(consoleRecommendationTimer);
  consoleRecommendationTimer = setTimeout(async () => {
    await renderConsoleRecommendations();
  }, 250);
}

document.addEventListener("click", async (event) => {
  if (event.target.closest("#authGateRegisterTab")) {
    setAuthGateMode("register");
    return;
  }

  if (event.target.closest("#authGateLoginTab")) {
    setAuthGateMode("login");
    return;
  }

  if (event.target.closest("#authGateBackToRegister")) {
    setAuthGateMode("register");
    return;
  }

  const cabinCard = event.target.closest("[data-select-cabin]");
  if (cabinCard) {
    els.cabinSelect.value = cabinCard.dataset.selectCabin;
    await renderRecommendations();
    toast("Кабинка выбрана");
  }

  const gameTile = event.target.closest("[data-pick-game]");
  if (gameTile) {
    selectGameTitle(gameTile.dataset.pickGame, true);
    return;
  }

  const gameCard = event.target.closest("[data-select-game]");
  if (gameCard) {
    openGameDetail(gameCard.dataset.selectGame, gameCard.dataset.selectConsole);
    return;
  }

  const reserveGame = event.target.closest("[data-reserve-game]");
  if (reserveGame) {
    const activeConsole = activeConsoleBooking();
    els.gameSelect.value = reserveGame.dataset.reserveGame;
    if (!activeConsole) {
      if (reserveGame.dataset.reserveConsole && els.consolePlatformSelect) {
        els.consolePlatformSelect.value = reserveGame.dataset.reserveConsole;
      }
      closeGameDetail();
      await renderConsoleRecommendations();
      els.consoleBookingForm?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast("Сначала забронируйте консоль для этой игры", "error");
      return;
    }
    els.gameRequestForm.elements.console.value = activeConsole.platform;
    renderConsoleAndCopyOptions();
    renderGameTilePicker();
    renderGames();
    closeGameDetail();
    els.gameRequestForm.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Игра выбрана для брони");
    return;
  }

  const previewImage = event.target.closest("[data-preview-image]");
  if (previewImage) {
    const image = els.gameDetailContent?.querySelector(".game-photo-preview img");
    if (image) image.src = previewImage.dataset.previewImage;
    els.gameDetailContent?.querySelectorAll(".game-shot").forEach((button) => {
      button.classList.toggle("selected", button === previewImage);
    });
    return;
  }

  const cancelConsoleBooking = event.target.closest("[data-cancel-console-booking]");
  if (cancelConsoleBooking) {
    try {
      const response = await api(`/api/console-bookings/${cancelConsoleBooking.dataset.cancelConsoleBooking}/cancel`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      toast(response.message || "Бронь консоли отменена");
      await Promise.all([loadConsoleBookings(), loadRequests(), loadProfile(), loadGames()]);
      renderProfile();
      renderGameOptions();
      renderActiveConsoleState();
      await renderConsoleRecommendations();
      renderGames();
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const extendConsoleBooking = event.target.closest("[data-extend-console-booking]");
  if (extendConsoleBooking) {
    if (guardBannedAction()) return;
    try {
      const response = await api(`/api/console-bookings/${extendConsoleBooking.dataset.extendConsoleBooking}/extend`, {
        method: "PATCH",
        body: JSON.stringify({ minutes: 30 }),
      });
      toast(response.message || "Бронь консоли продлена");
      await Promise.all([loadConsoleBookings(), loadProfile(), loadGames(), loadRequests()]);
      renderProfile();
      renderGameOptions();
      renderActiveConsoleState();
      await renderConsoleRecommendations();
      renderGames();
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    if (isAccountBanned() && !["dashboard", "profile"].includes(viewButton.dataset.view)) {
      switchView("profile");
      if (viewButton.dataset.view !== "profile") {
        toast(accountBanText(), "error");
      }
      return;
    }

    if (viewButton.dataset.view === "admin" && state.role !== "admin") {
      switchView("profile");
      toast("Войдите как администратор", "error");
    } else {
      switchView(viewButton.dataset.view);
      if (viewButton.dataset.view === "profile" && state.user) {
        await Promise.all([loadProfile(), loadConsoleBookings()]);
        renderProfile();
      }
    }
  }

  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    if (roleButton.dataset.role === "guest") {
      if (state.user) logout();
      else switchView("profile");
      return;
    }

    if (roleButton.dataset.role === "admin" && state.role !== "admin") {
      switchView("profile");
      toast("Войдите в админ-аккаунт", "error");
      return;
    }
  }

  if (event.target.closest("#logoutButton") || event.target.closest("#banLogoutButton")) {
    logout();
    return;
  }

  const adminTabButton = event.target.closest("[data-admin-tab]");
  if (adminTabButton) {
    setAdminTab(adminTabButton.dataset.adminTab);
    return;
  }

  if (event.target.closest("[data-show-more-admin-bookings]")) {
    adminBookingVisibleCount += 12;
    renderBookings();
    return;
  }

  if (event.target.closest("[data-show-more-admin-game-requests]")) {
    adminGameRequestVisibleCount += 12;
    renderAdminGameRequests();
    return;
  }

  if (event.target.closest("[data-show-more-games]")) {
    gamesCatalogVisibleCount += 12;
    renderGames();
    return;
  }

  const banUserId = event.target.dataset.adminBanUser;
  if (banUserId && state.role === "admin") {
    const reason = prompt("Причина бана", "Нарушение правил");
    if (!reason) return;
    try {
      const response = await api(`/api/admin/users/${banUserId}/ban`, { method: "POST", body: JSON.stringify({ reason }) });
      await Promise.all([loadAdminData(), loadBookings(), loadRequests(), loadConsoleBookings(), loadGames()]);
      renderAdminManagement();
      renderBookings();
      renderGames();
      toast(response.message || "Пользователь забанен");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const unbanUserId = event.target.dataset.adminUnbanUser;
  if (unbanUserId && state.role === "admin") {
    try {
      await api(`/api/admin/users/${unbanUserId}/unban`, { method: "POST", body: JSON.stringify({}) });
      await loadAdminData();
      renderAdminManagement();
      toast("Бан снят");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const deleteUserId = event.target.dataset.adminDeleteUser;
  if (deleteUserId && state.role === "admin") {
    if (!confirm("Удалить пользователя? Его активные брони будут отменены.")) return;
    try {
      await api(`/api/admin/users/${deleteUserId}`, { method: "DELETE" });
      await loadAdminData();
      await reloadBookingData();
      await reloadGameData();
      renderAdminManagement();
      toast("Пользователь удалён");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const editCabinId = event.target.dataset.editCabin;
  if (editCabinId && els.adminCabinForm) {
    const cabin = state.adminCabins.find((item) => String(item.id) === String(editCabinId));
    if (cabin) {
      els.adminCabinForm.elements.id.value = cabin.id;
      els.adminCabinForm.elements.floor_number.value = cabin.floor_number;
      els.adminCabinForm.elements.cabin_number.value = cabin.cabin_number;
      els.adminCabinForm.elements.cabin_code.value = cabin.cabin_code;
      els.adminCabinForm.elements.cabin_type.value = cabin.cabin_type;
      els.adminCabinForm.elements.capacity.value = cabin.capacity;
      els.adminCabinForm.elements.campus_city.value = cabin.campus_city || schoolCampuses[0].city;
      els.adminCabinForm.elements.is_active.checked = Boolean(cabin.is_active);
      els.adminCabinForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (event.target.closest("#adminCabinNew") && els.adminCabinForm) {
    els.adminCabinForm.reset();
    els.adminCabinForm.elements.id.value = "";
    els.adminCabinForm.elements.campus_city.value = schoolCampuses[0].city;
    els.adminCabinForm.elements.is_active.checked = true;
    return;
  }

  const deleteCabinId = event.target.dataset.deleteCabin;
  if (deleteCabinId && state.role === "admin") {
    if (!confirm("Удалить кабинку? Если у неё есть история броней, она будет скрыта.")) return;
    try {
      const response = await api(`/api/admin/cabins/${deleteCabinId}`, { method: "DELETE" });
      await loadCabins();
      await loadAdminData();
      renderCabinOptions();
      renderAdminManagement();
      await renderRecommendations();
      toast(response.message || "Кабинка удалена");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const editGameId = event.target.dataset.editGame;
  if (editGameId && els.addGameForm) {
    const game = state.adminGames.find((item) => String(item.game_id) === String(editGameId));
    if (game) {
      els.addGameForm.elements.title.value = game.title || "";
      els.addGameForm.elements.image_url.value = game.image_url || "";
      els.addGameForm.elements.youtube_id.value = game.youtube_id || "";
      els.addGameForm.elements.screenshots.value = Array.isArray(game.screenshots) ? game.screenshots.join("\n") : "";
      els.addGameForm.elements.total.value = Number(game.xbox_total || game.playstation_total || 1);
      if (els.addGameForm.elements.is_active) els.addGameForm.elements.is_active.checked = Boolean(game.is_active);
      els.addGameForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  const deleteGameId = event.target.dataset.deleteGame;
  if (deleteGameId && state.role === "admin") {
    if (!confirm("Удалить игру из каталога?")) return;
    try {
      await api(`/api/admin/games/${deleteGameId}`, { method: "DELETE" });
      await reloadGameData();
      toast("Игра удалена");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const releaseId = event.target.dataset.release;
  if (releaseId) {
    if (guardBannedAction()) return;
    try {
      await api(`/api/bookings/${releaseId}/release`, { method: "PATCH", body: JSON.stringify({}) });
      toast("Бронь досрочно погашена");
      await reloadBookingData();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const extendId = event.target.dataset.extend;
  if (extendId) {
    if (guardBannedAction()) return;
    try {
      await api(`/api/bookings/${extendId}/extend`, { method: "PATCH", body: JSON.stringify({ minutes: 30 }) });
      toast("Бронь продлена на 30 минут");
      await reloadBookingData();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const cancelId = event.target.dataset.cancel;
  if (cancelId && state.role === "admin") {
    try {
      await api(`/api/admin/bookings/${cancelId}/cancel`, { method: "PATCH", body: JSON.stringify({}) });
      toast("Администратор отменил бронь");
      await reloadBookingData();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const userCancelGameRequestId = event.target.dataset.userCancelGameRequest;
  if (userCancelGameRequestId) {
    if (guardBannedAction()) return;
    try {
      await api(`/api/game-requests/${userCancelGameRequestId}/cancel`, { method: "PATCH", body: JSON.stringify({}) });
      toast("Запрос игры отменён, копия возвращена в наличие");
      await reloadGameData();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const cancelGameRequestId = event.target.dataset.cancelGameRequest;
  if (cancelGameRequestId && state.role === "admin") {
    try {
      await api(`/api/admin/game-requests/${cancelGameRequestId}/cancel`, { method: "PATCH", body: JSON.stringify({}) });
      toast("Запрос игры отменён, копия возвращена в наличие");
      await reloadGameData();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const bulkButton = event.target.closest("[data-admin-bulk-cancel]");
  if (bulkButton) {
    if (state.role !== "admin") return toast("Доступно только администратору", "error");
    const mode = bulkButton.dataset.adminBulkCancel;
    const target = els.adminBulkTarget?.value?.trim() || "";
    const confirmText = target
      ? `Отменить ${mode === "cabins" ? "брони кабинок" : mode === "games" ? "брони игр" : "все брони"} у пользователя: ${target}?`
      : `Отменить ${mode === "cabins" ? "все брони кабинок" : mode === "games" ? "все брони игр" : "все брони игр и кабинок"}?`;
    if (!confirm(confirmText)) return;

    try {
      if (mode === "cabins" || mode === "all") {
        const response = await api("/api/admin/bookings/cancel-many", {
          method: "POST",
          body: JSON.stringify({ target }),
        });
        toast(response.message || "Брони кабинок отменены");
      }

      if (mode === "games" || mode === "all") {
        const response = await api("/api/admin/game-requests/cancel-many", {
          method: "POST",
          body: JSON.stringify({ target }),
        });
        toast(response.message || "Брони игр отменены");
      }

      await reloadBookingData();
      await reloadGameData();
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }
});


async function afterSuccessfulAuth(response, successMessage) {
  saveAuth(response.token, response.user);
  hideAuthGate();
  await Promise.all([loadBookings(), loadRequests(), loadConsoleBookings(), loadProfile(), loadSupportMessages()]);
  await loadAdminData();
  await renderAll();
  toast(response.message || successMessage);
}

document.addEventListener("submit", async (event) => {
  const supportForm = event.target.closest("#supportForm");
  if (supportForm) {
    event.preventDefault();
    if (!state.user) return toast("Сначала войдите в аккаунт", "error");
    const data = new FormData(supportForm);
    try {
      const response = await api("/api/support/messages", {
        method: "POST",
        body: JSON.stringify({ message: data.get("message") }),
      });
      supportForm.reset();
      await loadSupportMessages();
      renderProfile();
      toast(response.message || "Сообщение отправлено администратору");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const supportReplyForm = event.target.closest(".support-reply-form");
  if (supportReplyForm) {
    event.preventDefault();
    if (state.role !== "admin") return toast("Доступно только администратору", "error");
    const data = new FormData(supportReplyForm);
    const status = event.submitter?.value || "answered";
    try {
      const response = await api(`/api/admin/support/messages/${supportReplyForm.dataset.supportReply}`, {
        method: "PATCH",
        body: JSON.stringify({
          admin_reply: data.get("admin_reply"),
          status,
        }),
      });
      await loadAdminData();
      await loadSupportMessages();
      renderAdminManagement();
      toast(response.message || "Обращение обновлено");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const campusForm = event.target.closest("#campusGateForm, #profileCampusForm");
  if (campusForm) {
    event.preventDefault();
    const data = new FormData(campusForm);
    try {
      await saveCampus(data.get("campus_city"));
      await loadProfile();
      renderProfile();
      toast("Город сохранён");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const avatarForm = event.target.closest("#profileAvatarForm");
  if (avatarForm) {
    event.preventDefault();
    const data = new FormData(avatarForm);
    try {
      await saveAvatar(data.get("avatar_url"));
      await loadProfile();
      renderProfile();
      toast("Аватар сохранён");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const adminCabinForm = event.target.closest("#adminCabinForm");
  if (adminCabinForm) {
    event.preventDefault();
    if (state.role !== "admin") return toast("Доступно только администратору", "error");
    const data = new FormData(adminCabinForm);
    const campus = campusByCity(data.get("campus_city"));
    try {
      await api("/api/admin/cabins", {
        method: "POST",
        body: JSON.stringify({
          id: data.get("id") || null,
          floor_number: Number(data.get("floor_number")),
          cabin_number: Number(data.get("cabin_number")),
          cabin_code: data.get("cabin_code").trim(),
          cabin_type: data.get("cabin_type").trim(),
          capacity: Number(data.get("capacity")),
          campus_city: campus.city,
          campus_address: normalizeCampusAddress(campus.address),
          is_active: data.get("is_active") === "on",
        }),
      });
      adminCabinForm.reset();
      adminCabinForm.elements.id.value = "";
      adminCabinForm.elements.campus_city.value = schoolCampuses[0].city;
      adminCabinForm.elements.is_active.checked = true;
      await loadCabins();
      await loadAdminData();
      renderCabinOptions();
      renderAdminManagement();
      toast("Кабинка сохранена");
    } catch (error) {
      toast(error.message, "error");
    }
    return;
  }

  const loginForm = event.target.closest("#loginForm, #authGateLoginForm");
  if (loginForm) {
    event.preventDefault();
    if (loginForm.dataset.submitting === "true") return;
    loginForm.dataset.submitting = "true";
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Входим...";
    }
    const data = new FormData(loginForm);
    try {
      const response = await api("/api/auth/login", {
        method: "POST",
        retries: 2,
        retryDelay: 1100,
        body: JSON.stringify({ email: data.get("email").trim(), password: data.get("password") }),
      });
      await afterSuccessfulAuth(response, "Вход выполнен");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      loginForm.dataset.submitting = "false";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
    return;
  }

  const registerForm = event.target.closest("#registerForm, #authGateRegisterForm");
  if (registerForm) {
    event.preventDefault();
    const data = new FormData(registerForm);
    const phone = parseRussianPhone(data.get("phone"));
    if (!phone) return toast("Введите российский мобильный номер в формате +7 900 000-00-00", "error");
    try {
      const response = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: data.get("full_name").trim(),
          phone: phone.formatted,
          email: data.get("email").trim(),
          password: data.get("password"),
        }),
      });
      await afterSuccessfulAuth(response, "Регистрация завершена");
      registerForm.reset();
    } catch (error) {
      toast(error.message, "error");
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const selectable = event.target.closest("[data-select-cabin], [data-select-game], [data-pick-game]");
  if (!selectable) return;
  event.preventDefault();
  selectable.click();
});

els.bookingForm.addEventListener("input", scheduleRecommendations);
els.consoleBookingForm?.addEventListener("input", scheduleConsoleRecommendations);
els.consoleBookingForm?.addEventListener("change", scheduleConsoleRecommendations);
document.querySelectorAll('input[name="phone"]').forEach((input) => {
  input.addEventListener("input", () => {
    input.value = formatRussianPhoneInput(input.value);
  });
});

document.addEventListener("input", (event) => {
  if (event.target.matches('input[name="phone"]')) {
    event.target.value = formatRussianPhoneInput(event.target.value);
  }

  if (event.target.matches("#campusGateSelect")) {
    updateCampusAddress(event.target, document.querySelector("#campusGateAddress"));
  }

  if (event.target.matches('#profileCampusForm select[name="campus_city"]')) {
    updateCampusAddress(event.target, event.target.closest("form")?.querySelector(".form-note"));
  }

  if (event.target.matches("#adminGameRequestFilter")) {
    adminGameRequestVisibleCount = 12;
    renderAdminGameRequests();
  }

  if (event.target.matches("#adminBookingFilter")) {
    adminBookingVisibleCount = 12;
    renderBookings();
  }

  if (event.target.matches("#adminSupportFilter")) {
    renderAdminManagement();
  }

  if (event.target.matches("#adminUserSearch, #adminCabinSearch, #adminGameSearch")) {
    renderAdminManagement();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#adminUserStatusFilter, #adminUserCityFilter, #adminUserSort, #adminCabinFloorFilter, #adminCabinCityFilter, #adminCabinCapacityFilter, #adminCabinActiveFilter, #adminGamePlatformFilter, #adminGameActiveFilter, #adminGameSort")) {
    renderAdminManagement();
  }
});

els.bookingForm.elements.cabin.addEventListener("change", scheduleRecommendations);
els.gameRequestForm.elements.game.addEventListener("change", () => {
  renderGames();
  renderActiveConsoleState();
});
els.gameRequestForm.elements.console.addEventListener("change", () => {
  renderGames();
  renderActiveConsoleState();
});
if (els.gameCategoryFilter) {
  els.gameCategoryFilter.addEventListener("change", () => {
    gamesCatalogVisibleCount = 12;
    renderGameOptions();
    renderGames();
    renderActiveConsoleState();
  });
}

if (els.gamesCatalogToggle && els.gamesCatalogPanel) {
  els.gamesCatalogToggle.addEventListener("click", () => {
    const isOpen = els.gamesCatalogPanel.classList.toggle("catalog-open");
    els.gamesCatalogToggle.setAttribute("aria-expanded", String(isOpen));
    els.gamesCatalogToggle.textContent = isOpen ? "Скрыть каталог" : "Показать каталог";
  });
}

els.selectedGamePreview?.addEventListener("click", () => {
  const title = els.gameSelect?.value;
  if (!title) return toast("Сначала выберите игру", "error");
  openGameDetail(title, els.gameRequestForm.elements.console.value);
});

els.themeToggle.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

els.themeTogglePanel?.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

els.closeAdminLogin?.addEventListener("click", closeAdminLogin);
els.adminLoginModal?.addEventListener("click", (event) => {
  if (event.target === els.adminLoginModal) closeAdminLogin();
});

els.closeGameDetail?.addEventListener("click", closeGameDetail);
els.gameDetailModal?.addEventListener("click", (event) => {
  if (event.target === els.gameDetailModal) closeGameDetail();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.adminLoginModal && !els.adminLoginModal.classList.contains("hidden")) closeAdminLogin();
  if (event.key === "Escape" && !els.gameDetailModal?.classList.contains("hidden")) closeGameDetail();
});

els.adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  try {
    const response = await api("/api/auth/login", {
      method: "POST",
      retries: 2,
      retryDelay: 1100,
      body: JSON.stringify({ email: data.get("email").trim(), password: data.get("password") }),
    });
    saveAuth(response.token, response.user);
    closeAdminLogin();
    await Promise.all([loadBookings(), loadRequests(), loadConsoleBookings(), loadProfile(), loadSupportMessages()]);
    await loadAdminData();
    await renderAll();
    toast(response.user.role === "admin" ? "Админ-доступ активен" : "Вход выполнен, но это не админ-аккаунт");
  } catch (error) {
    toast(error.message, "error");
  }
});

els.bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!state.user) {
    showAuthGate("register");
    return toast("Сначала войдите или зарегистрируйтесь", "error");
  }

  if (guardBannedAction()) return;
  if (state.user.role !== "admin" && !state.user.campus_city) {
    showCampusGate();
    return toast("Сначала выберите город Школы 21", "error");
  }

  if (state.user.role !== "admin") {
    try {
      await loadProfile();
      const activeText = activeCabinBookingText();
      if (activeText) {
        renderProfile();
        return toast(activeText, "error");
      }
    } catch (error) {
      return toast(error.message, "error");
    }
  }

  const data = new FormData(form);
  const { startValue, endValue } = getFormRange(form);
  if (new Date(startValue) < now()) return toast("Нельзя бронировать прошедшее время", "error");

  try {
    const response = await api("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        cabin_id: Number(data.get("cabin")),
        people_count: Number(data.get("people")),
        start_time: sqlDateTimeFromInputValue(startValue),
        end_time: sqlDateTimeFromInputValue(endValue),
      }),
    });

    toast(response.message || "Бронь создана");
    push("Бронь подтверждена", "Кабинка забронирована");
    form.reset();
    setDefaultStart();
    fillAccountFields();
    await reloadBookingData();
  } catch (error) {
    toast(error.message, "error");
  }
});

els.consoleBookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!state.user) {
    showAuthGate("register");
    return toast("Сначала войдите или зарегистрируйтесь", "error");
  }

  if (guardBannedAction()) return;
  if (state.user.role !== "admin" && !state.user.campus_city) {
    showCampusGate();
    return toast("Сначала выберите город Школы 21", "error");
  }

  if (activeConsoleBooking()) {
    renderActiveConsoleState();
    return toast(`У вас уже есть активная бронь консоли: ${activeConsoleBookingText()}`, "error");
  }

  const data = new FormData(form);
  const { startValue, endValue } = getFormRange(form);
  if (new Date(startValue) < now()) return toast("Нельзя бронировать прошедшее время", "error");

  try {
    const response = await api("/api/console-bookings", {
      method: "POST",
      body: JSON.stringify({
        platform: data.get("platform"),
        start_time: sqlDateTimeFromInputValue(startValue),
        end_time: sqlDateTimeFromInputValue(endValue),
      }),
    });

    toast(response.message || "Консоль забронирована");
    await loadConsoleBookings();
    renderGameOptions();
    renderActiveConsoleState();
    await renderConsoleRecommendations();
    renderGames();
  } catch (error) {
    toast(error.message, "error");
    await renderConsoleRecommendations();
  }
});

els.gameRequestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) {
    showAuthGate("register");
    return toast("Сначала войдите или зарегистрируйтесь", "error");
  }

  if (guardBannedAction()) return;
  if (state.user.role !== "admin" && !state.user.campus_city) {
    showCampusGate();
    return toast("Сначала выберите город Школы 21", "error");
  }

  const activeText = activeGameRequestText();
  if (activeText) return toast(activeText, "error");
  const activeConsole = activeConsoleBooking();
  if (!activeConsole) return toast("Сначала забронируйте консоль, потом выберите игру для нее", "error");
  if (state.user.campus_city && activeConsole.campusCity && state.user.campus_city !== activeConsole.campusCity) {
    return toast(`Консоль забронирована в городе ${activeConsole.campusCity}. Чтобы взять игру в другом городе, сначала отмените эту бронь консоли.`, "error");
  }

  const form = event.currentTarget;
  const data = new FormData(form);
  const title = data.get("game");
  const copyNumber = Number(data.get("copy"));

  if (!copyNumber) {
    return toast("На выбранной консоли нет свободной копии этой игры", "error");
  }

  try {
    const response = await api("/api/game-requests", {
      method: "POST",
      body: JSON.stringify({
        title,
        platform: activeConsole.platform,
        copy_number: copyNumber,
        receive_type: data.get("delivery"),
        console_booking_id: activeConsole.id,
      }),
    });

    toast(response.message || `SMS: игра ${title} есть, выдача оформлена.`);
    form.reset();
    fillAccountFields();
    await reloadGameData();
  } catch (error) {
    toast(error.message, "error");
    await reloadGameData();
  }
});

els.addGameForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.role !== "admin") return toast("Добавлять игры может только администратор", "error");

  const form = event.currentTarget;
  const data = new FormData(form);

  try {
    await api("/api/admin/games", {
      method: "POST",
      body: JSON.stringify({
        title: data.get("title").trim(),
        platform: data.get("console"),
        total: Number(data.get("total")),
        image_url: data.get("image_url")?.trim() || null,
        youtube_id: data.get("youtube_id")?.trim() || null,
        screenshots: data.get("screenshots") || "",
        is_active: data.get("is_active") === "on",
      }),
    });

    toast("Игра добавлена или обновлена в каталоге");
    form.reset();
    if (form.elements.is_active) form.elements.is_active.checked = true;
    await reloadGameData();
    await loadAdminData();
    renderAdminManagement();
  } catch (error) {
    toast(error.message, "error");
  }
});

els.notifyButton.addEventListener("click", async () => {
  if (!("Notification" in window)) return toast("Браузер не поддерживает пуш-уведомления", "error");
  const permission = await Notification.requestPermission();
  toast(permission === "granted" ? "Пуш-уведомления включены" : "Пуш-уведомления не разрешены", permission === "granted" ? "success" : "error");
});

els.clearBans.addEventListener("click", async () => {
  if (state.role !== "admin") return toast("Снимать баны может только администратор", "error");
  try {
    const response = await api("/api/admin/clear-bans", { method: "POST", body: JSON.stringify({}) });
    toast(response.message || "Баны по спаму сняты");
    await loadMe();
    if (state.user) await loadProfile();
    renderAuthState();
    renderBanBanner();
  } catch (error) {
    toast(error.message, "error");
  }
});

els.resetDemo.addEventListener("click", async () => {
  if (state.role !== "admin") return toast("Сбрасывать данные может только администратор", "error");
  try {
    if (!confirm("Очистить текущие брони, запросы игр и уведомления? Пользователи, игры и кабинки останутся.")) return;
    const response = await api("/api/admin/reset-demo", { method: "POST", body: JSON.stringify({}) });
    toast(response.message || "Демо-данные сброшены");
    await reloadBookingData();
    await reloadGameData();
  } catch (error) {
    toast(error.message, "error");
  }
});

async function init() {
  try {
    setDefaultStart();
    setDefaultConsoleStart();
    applyTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");

    // Быстро применяем сохранённую роль/бан до ответов сервера, чтобы не было мигания админки.
    renderAuthState();

    await loadMe();
    await Promise.all([loadCabins(), loadBookings(), loadGames(), loadRequests(), loadConsoleBookings(), loadSupportMessages()]);
    await loadAdminData();
    if (state.user) await loadProfile();
    await renderAll();
  } catch (error) {
    toast(`Ошибка загрузки данных: ${error.message}`, "error");
  } finally {
    state.booting = false;
    document.body.classList.remove("app-booting");
    renderAuthState();
  }
}

init();
setInterval(updateLiveTimers, 1000);
setInterval(refreshSupportMessages, 8000);
