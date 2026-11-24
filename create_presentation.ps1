$ErrorActionPreference = 'Stop'

$root = 'C:\Users\Acer\Desktop\САЙТ'
$presentationDir = Join-Path $root 'Презентация'
$outPath = Join-Path $presentationDir 'Презентация_сайт_Школа_21.pptx'

$img = @{
  Thanks = Join-Path $presentationDir 'Спасибо за внимание.png'
  DbCabins = Join-Path $presentationDir 'Схема БД\cabins_booking_db.png'
  DbGames = Join-Path $presentationDir 'Схема БД\game_rental_db.png'

  Login = Join-Path $root 'Отчет\Скриншоты_Галимов\01_registraciya_i_vhod.png'
  Home = Join-Path $root 'Отчет\Скриншоты_Галимов\02_glavnaya_polzovatelya.png'
  Profile = Join-Path $root 'Отчет\Скриншоты_Галимов\03_profil_i_kampus.png'

  Campus = Join-Path $root 'Отчет\Скриншоты_Баширов\03_bashirov_map_routes.png'
  Support = Join-Path $root 'Отчет\Скриншоты_Баширов\04_bashirov_support_notifications.png'

  CabinForm = Join-Path $root 'Отчет\Скриншоты_Муфтеев\01_forma_bronirovaniya_kabinok.png'
  CabinTimer = Join-Path $root 'Отчет\Скриншоты_Муфтеев\03_aktivnye_broni_tajmer_prodlenie.png'
  ConsoleBooking = Join-Path $root 'Отчет\Скриншоты_Муфтеев\04_bronirovanie_konsoli_dostupnost.png'
  GameAfterConsole = Join-Path $root 'Отчет\Скриншоты_Муфтеев\05_vybor_igry_posle_broni_konsoli.png'

  GamesCatalog = Join-Path $root 'Отчет\Скриншоты_Парфенов\02_parfenov_games_catalog_cards.png'
  GameMedia = Join-Path $root 'Отчет\Скриншоты_Парфенов\04_parfenov_trailer_gallery_modal.png'

  AdminMain = Join-Path $root 'Отчет\Скриншоты_Хисамов\05_admin_panel_upravlenie.png'
  AdminUsers = Join-Path $root 'Отчет\Скриншоты_Зинов\01_admin_polzovateli_filtry_bany.png'
  AdminCabins = Join-Path $root 'Отчет\Скриншоты_Зинов\02_admin_kabinki_redaktirovanie.png'
  AdminGames = Join-Path $root 'Отчет\Скриншоты_Зинов\03_admin_igry_media_kopii.png'
}

foreach ($key in $img.Keys) {
  if (-not (Test-Path -LiteralPath $img[$key])) {
    throw "Не найден файл изображения для ${key}: $($img[$key])"
  }
}

$pp = $null
$pres = $null

function Add-TextBox {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Text,
    [double] $Left,
    [double] $Top,
    [double] $Width,
    [double] $Height,
    [double] $FontSize = 20,
    [int] $Color = 0,
    [bool] $Bold = $false,
    [int] $Align = 1
  )

  $shape = $Slide.Shapes.AddTextbox(1, $Left, $Top, $Width, $Height)
  $shape.TextFrame.TextRange.Text = $Text
  $shape.TextFrame.TextRange.Font.Name = 'Arial'
  $shape.TextFrame.TextRange.Font.Size = $FontSize
  $shape.TextFrame.TextRange.Font.Color.RGB = $Color
  $shape.TextFrame.TextRange.Font.Bold = $(if ($Bold) { -1 } else { 0 })
  $shape.TextFrame.TextRange.ParagraphFormat.Alignment = $Align
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  return $shape
}

function Add-ImageFit {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Path,
    [double] $Left,
    [double] $Top,
    [double] $BoxWidth,
    [double] $BoxHeight,
    [bool] $Border = $true
  )

  Add-Type -AssemblyName System.Drawing
  $bitmap = [System.Drawing.Image]::FromFile($Path)
  $ratio = $bitmap.Width / $bitmap.Height
  $bitmap.Dispose()

  $w = $BoxWidth
  $h = $w / $ratio
  if ($h -gt $BoxHeight) {
    $h = $BoxHeight
    $w = $h * $ratio
  }

  $x = $Left + (($BoxWidth - $w) / 2)
  $y = $Top + (($BoxHeight - $h) / 2)
  $pic = $Slide.Shapes.AddPicture($Path, 0, -1, $x, $y, $w, $h)
  if ($Border) {
    $pic.Line.Visible = -1
    $pic.Line.ForeColor.RGB = 0x24BFAE
    $pic.Line.Weight = 1.25
  }
  return $pic
}

function Add-Chrome {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Title,
    [int] $Number
  )

  $dark = 0x082F27
  $teal = 0x24BFAE
  $Slide.FollowMasterBackground = 0
  $Slide.Background.Fill.ForeColor.RGB = 0xF4FAF8

  $bar = $Slide.Shapes.AddShape(1, 0, 0, 960, 58)
  $bar.Fill.ForeColor.RGB = $dark
  $bar.Line.Visible = 0
  Add-TextBox $Slide $Title 34 14 760 34 21 0xFFFFFF $true 1 | Out-Null

  $badge = $Slide.Shapes.AddShape(5, 852, 14, 74, 30)
  $badge.Fill.ForeColor.RGB = $teal
  $badge.Line.Visible = 0
  Add-TextBox $Slide ("{0:00}/20" -f $Number) 868 20 44 16 10 0xFFFFFF $true 2 | Out-Null

  $foot = $Slide.Shapes.AddShape(1, 0, 516, 960, 24)
  $foot.Fill.ForeColor.RGB = 0xE6F2EF
  $foot.Line.Visible = 0
  Add-TextBox $Slide 'Сайт бронирования кабинок, консолей и выдачи игр • Школа 21' 34 522 650 12 8 0x50756D $false 1 | Out-Null
}

function Add-Bullets {
  param(
    [Parameter(Mandatory)] $Slide,
    [string[]] $Items,
    [double] $Left,
    [double] $Top,
    [double] $Width,
    [double] $Height,
    [double] $FontSize = 16
  )
  $text = ($Items | ForEach-Object { "– $_" }) -join "`r"
  Add-TextBox $Slide $text $Left $Top $Width $Height $FontSize 0x123C35 $false 1 | Out-Null
}

function Add-InfoCard {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Header,
    [Parameter(Mandatory)] [string] $Body,
    [double] $Left,
    [double] $Top,
    [double] $Width,
    [double] $Height
  )
  $card = $Slide.Shapes.AddShape(5, $Left, $Top, $Width, $Height)
  $card.Fill.ForeColor.RGB = 0xFFFFFF
  $card.Line.ForeColor.RGB = 0xCFE4DF
  $card.Line.Weight = 1
  Add-TextBox $Slide $Header ($Left + 18) ($Top + 12) ($Width - 36) 20 13 0x24BFAE $true 1 | Out-Null
  Add-TextBox $Slide $Body ($Left + 18) ($Top + 37) ($Width - 36) ($Height - 46) 13 0x123C35 $false 1 | Out-Null
}

function Add-FeatureTile {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Title,
    [Parameter(Mandatory)] [string] $Body,
    [Parameter(Mandatory)] [string] $Mark,
    [double] $Left,
    [double] $Top,
    [double] $Width,
    [double] $Height
  )
  $tile = $Slide.Shapes.AddShape(5, $Left, $Top, $Width, $Height)
  $tile.Fill.ForeColor.RGB = 0xFFFFFF
  $tile.Line.ForeColor.RGB = 0xCFE4DF
  $tile.Line.Weight = 1.2

  $circle = $Slide.Shapes.AddShape(9, ($Left + 20), ($Top + 20), 48, 48)
  $circle.Fill.ForeColor.RGB = 0xE6F2EF
  $circle.Line.Visible = 0
  Add-TextBox $Slide $Mark ($Left + 20) ($Top + 27) 48 22 18 0x24BFAE $true 2 | Out-Null
  Add-TextBox $Slide $Title ($Left + 84) ($Top + 22) ($Width - 108) 28 18 0x082F27 $true 1 | Out-Null
  if ($Height -lt 150) {
    Add-TextBox $Slide $Body ($Left + 40) ($Top + 70) ($Width - 70) ($Height - 74) 11.5 0x123C35 $false 1 | Out-Null
  }
  else {
    Add-TextBox $Slide $Body ($Left + 24) ($Top + 82) ($Width - 48) ($Height - 96) 14 0x123C35 $false 1 | Out-Null
  }
}

function Add-ProcessNode {
  param(
    [Parameter(Mandatory)] $Slide,
    [Parameter(Mandatory)] [string] $Title,
    [Parameter(Mandatory)] [string] $Body,
    [double] $Left,
    [double] $Top,
    [double] $Width,
    [double] $Height,
    [int] $Fill = 0xFFFFFF
  )
  $node = $Slide.Shapes.AddShape(5, $Left, $Top, $Width, $Height)
  $node.Fill.ForeColor.RGB = $Fill
  $node.Line.ForeColor.RGB = 0x24BFAE
  $node.Line.Weight = 1.25
  Add-TextBox $Slide $Title ($Left + 14) ($Top + 14) ($Width - 28) 36 15 0x082F27 $true 2 | Out-Null
  Add-TextBox $Slide $Body ($Left + 16) ($Top + 54) ($Width - 32) ($Height - 62) 10.5 0x50756D $false 2 | Out-Null
}

function Add-ArrowLine {
  param(
    [Parameter(Mandatory)] $Slide,
    [double] $X1,
    [double] $Y1,
    [double] $X2,
    [double] $Y2
  )
  $line = $Slide.Shapes.AddLine($X1, $Y1, $X2, $Y2)
  $line.Line.ForeColor.RGB = 0x24BFAE
  $line.Line.Weight = 2.2
  $line.Line.EndArrowheadStyle = 3
}

function New-BlankSlide {
  param([Parameter(Mandatory)] $Presentation)
  return $Presentation.Slides.Add($Presentation.Slides.Count + 1, 12)
}

function Add-ScreenshotSlide {
  param(
    [Parameter(Mandatory)] $Presentation,
    [string] $Title,
    [int] $Number,
    [string[]] $Bullets,
    [string] $ImagePath
  )
  $slide = New-BlankSlide $Presentation
  Add-Chrome $slide $Title $Number

  $frame = $slide.Shapes.AddShape(5, 510, 82, 398, 392)
  $frame.Fill.ForeColor.RGB = 0xEAF7F4
  $frame.Line.ForeColor.RGB = 0x24BFAE
  $frame.Line.Weight = 1.25
  Add-ImageFit $slide $ImagePath 532 100 354 354 $true | Out-Null

  $labels = @('Что показывает', 'Как работает', 'Зачем нужно')
  for ($i = 0; $i -lt 3; $i++) {
    Add-InfoCard $slide $labels[$i] $Bullets[$i] 44 (90 + ($i * 122)) 420 96
  }
  return $slide
}

function Add-DbSlide {
  param(
    [Parameter(Mandatory)] $Presentation,
    [string] $Title,
    [int] $Number,
    [string] $ImagePath,
    [string] $Note
  )
  $slide = New-BlankSlide $Presentation
  Add-Chrome $slide $Title $Number
  Add-ImageFit $slide $ImagePath 34 78 892 392 $true | Out-Null
  $noteBox = $slide.Shapes.AddShape(5, 82, 474, 796, 34)
  $noteBox.Fill.ForeColor.RGB = 0xFFFFFF
  $noteBox.Line.ForeColor.RGB = 0xCFE4DF
  Add-TextBox $slide $Note 104 481 752 18 12 0x123C35 $false 2 | Out-Null
  return $slide
}

try {
  $pp = New-Object -ComObject PowerPoint.Application
  $pp.Visible = -1
  $pres = $pp.Presentations.Add()
  $pres.PageSetup.SlideWidth = 960
  $pres.PageSetup.SlideHeight = 540

  $dark = 0x082F27
  $teal = 0x24BFAE

  # 1
  $s = New-BlankSlide $pres
  $s.FollowMasterBackground = 0
  $s.Background.Fill.ForeColor.RGB = 0xF4FAF8
  $bar = $s.Shapes.AddShape(1, 0, 0, 960, 78)
  $bar.Fill.ForeColor.RGB = $dark
  $bar.Line.Visible = 0
  Add-TextBox $s 'Итоговый проект' 54 22 420 28 21 0xFFFFFF $true 1 | Out-Null
  $badge = $s.Shapes.AddShape(5, 800, 20, 106, 34)
  $badge.Fill.ForeColor.RGB = $teal
  $badge.Line.Visible = 0
  Add-TextBox $s 'Школа 21' 818 28 70 14 12 0xFFFFFF $true 2 | Out-Null

  $titleCard = $s.Shapes.AddShape(5, 66, 124, 828, 178)
  $titleCard.Fill.ForeColor.RGB = 0xFFFFFF
  $titleCard.Line.ForeColor.RGB = 0xCFE4DF
  $titleCard.Line.Weight = 1.2
  Add-TextBox $s 'Сайт бронирования кабинок, консолей и выдачи игр' 104 158 760 76 34 $dark $true 2 | Out-Null
  Add-TextBox $s 'Проект для кампуса «Школа 21»: пользовательская часть, админ-панель, база данных, карты, уведомления и поддержка.' 132 244 696 34 15 0x123C35 $false 2 | Out-Null

  Add-TextBox $s 'Команда проекта' 76 338 808 22 18 $teal $true 2 | Out-Null
  Add-TextBox $s 'Хисамов Радмир • Зинов Роман • Муфтеев Дмитрий • Галимов Артемий • Исхакова Руфина • Парфенов Алексей • Баширов А.' 96 380 768 48 16 0x123C35 $false 2 | Out-Null
  Add-TextBox $s 'Уфа, 2026' 388 474 184 18 14 0x50756D $false 2 | Out-Null

  # 2
  $s = New-BlankSlide $pres
  Add-Chrome $s 'Цель проекта' 2
  Add-TextBox $s 'Создать единый сервис для бронирования кабинок, игровых консолей и выдачи игр в кампусе «Школа 21».' 54 88 850 58 24 $dark $true 2 | Out-Null
  Add-FeatureTile $s 'Для пользователя' 'Быстро выбрать кампус, увидеть свободные кабинки и консоли, запросить игру и следить за активными бронями в профиле.' '01' 54 172 260 230
  Add-FeatureTile $s 'Для администратора' 'Управлять пользователями, банами, кабинками, играми, заявками, поддержкой и статусами выдачи из одной панели.' '02' 350 172 260 230
  Add-FeatureTile $s 'Для кампуса' 'Снизить ручную нагрузку, сохранить историю действий, избежать конфликтов бронирования и быстрее отвечать на обращения.' '03' 646 172 260 230
  Add-TextBox $s 'Главная идея: пользователь делает всё самостоятельно, а администратор контролирует процесс без ручных таблиц и переписок.' 82 438 796 34 16 0x123C35 $true 2 | Out-Null

  # 3
  $s = New-BlankSlide $pres
  Add-Chrome $s 'Проблема и решение' 3
  Add-TextBox $s 'До внедрения' 70 104 330 30 23 $dark $true 2 | Out-Null
  Add-FeatureTile $s 'Разрозненные действия' 'Брони, выдача игр и обращения могли фиксироваться отдельно, из-за чего сложнее видеть общую картину.' '!' 62 150 342 108
  Add-FeatureTile $s 'Нет прозрачной занятости' 'Пользователь заранее не понимает, свободна ли кабинка, консоль или копия нужной игры.' '?' 62 280 342 108

  Add-TextBox $s 'После внедрения' 560 104 330 30 23 $dark $true 2 | Out-Null
  Add-FeatureTile $s 'Единый сценарий' 'Выбор кампуса, бронь, таймер, выдача игры, история и поддержка собраны в одном сайте.' '✓' 556 150 342 108
  Add-FeatureTile $s 'Контроль ресурсов' 'Сервер проверяет ограничения, город, активность ресурсов и не допускает конфликтующих броней.' '✓' 556 280 342 108

  Add-ArrowLine $s 430 246 530 246
  Add-ArrowLine $s 430 332 530 332
  Add-TextBox $s 'Результат: меньше ручной работы, понятнее статус ресурсов, быстрее обработка заявок.' 110 432 740 30 17 0x123C35 $true 2 | Out-Null

  # 4
  $s = New-BlankSlide $pres
  Add-Chrome $s 'Структура сервиса' 4
  Add-ProcessNode $s 'Пользователь' 'регистрируется, выбирает кампус, бронирует кабинку или консоль' 54 150 180 112
  Add-ProcessNode $s 'Клиентский интерфейс' 'показывает формы, каталог игр, профиль, таймеры и поддержку' 282 150 180 112
  Add-ProcessNode $s 'Express API' 'проверяет правила, роли, город, занятость и статусы заявок' 510 150 180 112
  Add-ProcessNode $s 'База данных' 'хранит пользователей, брони, игры, баны, сообщения и уведомления' 738 150 168 112
  Add-ArrowLine $s 234 206 282 206
  Add-ArrowLine $s 462 206 510 206
  Add-ArrowLine $s 690 206 738 206

  Add-ProcessNode $s 'Администратор' 'управляет пользователями, ресурсами, заявками и поддержкой' 168 332 205 102 0xF8FCFB
  Add-ProcessNode $s 'Проверки логики' 'запрет нескольких броней, возврат копий, отмена связанных заявок' 424 332 205 102 0xF8FCFB
  Add-ProcessNode $s 'Уведомления' 'пользователь и администратор получают сообщения о важных событиях' 680 332 205 102 0xF8FCFB
  Add-ArrowLine $s 420 318 520 262
  Add-ArrowLine $s 604 318 604 262
  Add-TextBox $s 'Сайт построен как цепочка: интерфейс собирает действие, сервер проверяет правила, база сохраняет результат.' 80 464 800 22 15 0x123C35 $true 2 | Out-Null

  # 5
  $s = New-BlankSlide $pres
  Add-Chrome $s 'Команда и роли' 5
  Add-TextBox $s 'Работа была разделена по функциональным зонам сайта, чтобы каждый участник отвечал за отдельный результат.' 64 84 830 30 16 0x123C35 $true 2 | Out-Null
  Add-InfoCard $s 'Хисамов Радмир' 'Full-stack: Express API, клиентская логика, связи с БД, интеграция модулей, проверка сценариев и финальная сборка.' 54 132 255 86
  Add-InfoCard $s 'Зинов Роман' 'Административная панель: пользователи, баны, ресурсы, заявки и поддержка.' 352 132 255 86
  Add-InfoCard $s 'Муфтеев Дмитрий' 'Бронирование, ограничения, проверки занятости, продления и работа с базой данных.' 650 132 255 86
  Add-InfoCard $s 'Галимов Артемий' 'Пользовательский интерфейс, мобильная адаптация, формы и навигация.' 54 250 255 86
  Add-InfoCard $s 'Исхакова Руфина' 'Анализ пользовательских сценариев, тестирование входа, брони, профиля и поддержки.' 352 250 255 86
  Add-InfoCard $s 'Парфенов Алексей' 'Каталог игр, жанры, карточки, трейлеры, фотографии и медиа-раздел.' 650 250 255 86
  Add-InfoCard $s 'Баширов А.' 'Выбор кампуса, карты, маршруты, push-уведомления и проверка локального запуска.' 204 368 552 76

  # 6-17
  Add-ScreenshotSlide $pres 'Регистрация и вход' 6 @(
    'Экран показывает два сценария: создание нового аккаунта и вход существующего пользователя по почте и паролю.',
    'После авторизации сервер возвращает профиль, роль пользователя и доступные разделы: брони, история, игры и поддержка.',
    'Это первая точка безопасности: без входа нельзя бронировать ресурсы, а забаненный пользователь ограничен во всех действиях кроме поддержки.'
  ) $img.Login | Out-Null
  Add-ScreenshotSlide $pres 'Выбор кампуса и маршрут' 7 @(
    'Пользователь выбирает город Школы 21, видит точный адрес кампуса и карту рядом с профилем.',
    'Выбранный кампус сохраняется в профиле и автоматически подставляется при бронировании кабинок, консолей и игр.',
    'Так пользователь не выбирает город каждый раз, но может изменить его при переезде или работе в другом кампусе.'
  ) $img.Campus | Out-Null
  Add-ScreenshotSlide $pres 'Главная страница пользователя' 8 @(
    'Главная страница собирает основные сервисы: бронирование кабинок, получение игры, профиль и текущие показатели.',
    'Карточки ведут к конкретным действиям, поэтому пользователь быстро попадает в нужный сценарий с телефона.',
    'Главная работает как навигационный центр и снижает количество лишних переходов по сайту.'
  ) $img.Home | Out-Null
  Add-ScreenshotSlide $pres 'Бронирование кабинок' 9 @(
    'Форма позволяет выбрать дату, время, длительность и количество участников для переговорной кабинки.',
    'Сервер проверяет занятость, город пользователя, активность кабинки и предлагает только подходящие свободные варианты.',
    'Это убирает конфликт бронирований: две группы не могут занять одну кабинку в одно и то же время.'
  ) $img.CabinForm | Out-Null
  Add-ScreenshotSlide $pres 'Ограничения и таймер брони' 10 @(
    'В профиле отображается активная бронь, время окончания и оставшееся время до освобождения кабинки.',
    'Пользователь может продлить бронь только ограниченное количество раз, а несколько активных кабинок одновременно запрещены.',
    'Таймер помогает вовремя освободить ресурс, а ограничения делают распределение кабинок справедливым.'
  ) $img.CabinTimer | Out-Null
  Add-ScreenshotSlide $pres 'Бронирование консоли' 11 @(
    'Отдельный сценарий отвечает за бронирование Xbox или PlayStation в выбранном кампусе.',
    'Активная бронь консоли фиксирует город, время и тип платформы, после чего пользователь может выбирать игру.',
    'Это важно для логики выдачи: игра должна быть доступна именно под эту консоль и именно в этом городе.'
  ) $img.ConsoleBooking | Out-Null
  Add-ScreenshotSlide $pres 'Каталог игр' 12 @(
    'Каталог показывает игры с обложками, жанрами, платформами и количеством доступных копий.',
    'Фильтрация по жанрам помогает быстро найти интересующую игру, а наличие считается по реальным копиям.',
    'Пользователь заранее понимает, что можно получить сейчас, а что недоступно.'
  ) $img.GamesCatalog | Out-Null
  Add-ScreenshotSlide $pres 'Медиа-раздел игры' 13 @(
    'У выбранной игры можно открыть трейлер, геймплейное видео и фотографии.',
    'Администратор добавляет и редактирует медиа, чтобы каталог выглядел полноценным и понятным.',
    'Медиа-раздел помогает пользователю выбрать игру не только по названию, но и по реальному виду геймплея.'
  ) $img.GameMedia | Out-Null
  Add-ScreenshotSlide $pres 'Выдача игры после консоли' 14 @(
    'Запрос игры создаётся только при активной брони консоли и привязывается к конкретной копии игры.',
    'Система проверяет платформу и город: нельзя забронировать консоль в Уфе, а игру получить из другого кампуса.',
    'При отмене консоли связанная заявка на игру отменяется, а копия снова становится доступной.'
  ) $img.GameAfterConsole | Out-Null
  Add-ScreenshotSlide $pres 'Профиль пользователя' 15 @(
    'Профиль показывает данные аккаунта, аватар, выбранный кампус, активные брони и историю действий.',
    'Здесь пользователь меняет город, отменяет активные брони и отслеживает статус заявок.',
    'Профиль объединяет всё, что важно после бронирования: где ресурс, сколько осталось времени и что уже было сделано.'
  ) $img.Profile | Out-Null
  Add-ScreenshotSlide $pres 'Поддержка и уведомления' 16 @(
    'Пользователь может написать администратору по техническому вопросу или проблеме с бронью.',
    'Ответы приходят в поддержку, а push-уведомление сообщает о новом сообщении без ручного обновления страницы.',
    'Поддержка доступна даже забаненному пользователю, чтобы он мог уточнить причину блокировки.'
  ) $img.Support | Out-Null
  Add-ScreenshotSlide $pres 'Административная панель' 17 @(
    'Админка разделена на пользователей, кабинки, игры, брони, заявки и поддержку, чтобы не перегружать один экран.',
    'Администратор может искать записи, фильтровать их, банить пользователей, редактировать ресурсы и отменять брони.',
    'Панель закрывает рабочие задачи сотрудников кампуса: контроль ресурсов, выдача игр и помощь пользователям.'
  ) $img.AdminMain | Out-Null

  # 18-19
  Add-DbSlide $pres 'База данных: пользователи и бронирование' 18 $img.DbCabins 'Первая база хранит пользователей, кампусы, кабинки, брони, баны, поддержку и уведомления.' | Out-Null
  Add-DbSlide $pres 'База данных: каталог и выдача игр' 19 $img.DbGames 'Вторая база отвечает за игры, копии, заявки на выдачу, SMS-уведомления и журнал действий администратора.' | Out-Null

  # 20
  $s = New-BlankSlide $pres
  $s.FollowMasterBackground = 0
  $s.Background.Fill.ForeColor.RGB = $dark
  Add-ImageFit $s $img.Thanks 0 0 960 540 $false | Out-Null

  if (Test-Path -LiteralPath $outPath) {
    $backup = Join-Path $presentationDir ("Презентация_сайт_Школа_21_backup_{0}.pptx" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
    Copy-Item -LiteralPath $outPath -Destination $backup
  }

  $pres.SaveAs($outPath, 24)
  $pres.Close()
  $pp.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pres) | Out-Null
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null
  Write-Output "Создана презентация: $outPath"
}
catch {
  if ($pres -ne $null) { $pres.Close() | Out-Null }
  if ($pp -ne $null) { $pp.Quit() | Out-Null; [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null }
  throw
}
