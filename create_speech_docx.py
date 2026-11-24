# -*- coding: utf-8 -*-
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "Презентация"
OUT_PATH = OUT_DIR / "Текст_выступления_к_презентации.docx"


slides = [
    ("Слайд 1. Титульный", [
        "Здравствуйте. Мы представляем проект сайта для кампуса «Школа 21».",
        "Тема проекта: сайт бронирования кабинок, игровых консолей и выдачи игр.",
        "Работу выполняла команда из семи человек: Хисамов Радмир, Зинов Роман, Муфтеев Дмитрий, Галимов Артемий, Исхакова Руфина, Парфенов Алексей и Баширов А.",
    ]),
    ("Слайд 2. Цель проекта", [
        "Главная цель проекта заключалась в создании единого сервиса, через который пользователь может самостоятельно забронировать кабинку или консоль, выбрать игру, посмотреть свои активные брони и обратиться в поддержку.",
        "Также была важна административная часть: администратор должен видеть пользователей, заявки, ресурсы и управлять ими без ручных таблиц и лишней переписки.",
    ]),
    ("Слайд 3. Проблема и решение", [
        "До внедрения такого сервиса основные действия могли выполняться разрозненно: отдельно брони, отдельно выдача игр, отдельно обращения пользователей.",
        "Из-за этого сложнее контролировать занятость ресурсов и понимать, что сейчас свободно.",
        "После внедрения сайта все основные действия собраны в одном месте: выбор кампуса, бронирование, таймер, выдача игры, история и поддержка. Сервер дополнительно проверяет ограничения и не допускает конфликтующих броней.",
    ]),
    ("Слайд 4. Структура сервиса", [
        "Сервис состоит из нескольких частей.",
        "Пользователь работает с клиентским интерфейсом: выбирает кампус, бронирует кабинку или консоль, открывает каталог игр.",
        "Далее запрос обрабатывает сервер на Express: он проверяет права, город, занятость ресурсов и статусы заявок.",
        "Результат сохраняется в базе данных. Администратор через отдельную панель управляет пользователями, ресурсами, заявками и поддержкой.",
    ]),
    ("Слайд 5. Команда и роли", [
        "Работа была распределена по функциональным зонам.",
        "Хисамов Радмир отвечал за full-stack часть: Express API, клиентскую логику, связи с базой данных, интеграцию модулей и финальную сборку.",
        "Зинов Роман занимался административной панелью.",
        "Муфтеев Дмитрий отвечал за логику бронирования и базу данных.",
        "Галимов Артемий работал над пользовательским интерфейсом.",
        "Исхакова Руфина занималась аналитикой и тестированием пользовательских сценариев.",
        "Парфенов Алексей отвечал за каталог игр и медиа-раздел.",
        "Баширов А. занимался картами, уведомлениями и проверкой локального запуска.",
    ]),
    ("Слайд 6. Регистрация и вход", [
        "На этом слайде показан экран регистрации и входа.",
        "Пользователь может создать аккаунт или войти по почте и паролю. После авторизации сайт открывает доступ к профилю, бронированиям, истории, каталогу игр и поддержке.",
        "Это также первая точка ограничения доступа: без входа пользователь не может бронировать ресурсы.",
    ]),
    ("Слайд 7. Выбор кампуса и маршрут", [
        "После регистрации пользователь выбирает город кампуса «Школы 21».",
        "Город и адрес сохраняются в профиле, поэтому при каждой новой брони их не нужно выбирать заново.",
        "Также на странице показывается карта и кнопки построения маршрута, чтобы пользователь мог быстро открыть нужный навигатор.",
    ]),
    ("Слайд 8. Главная страница пользователя", [
        "Главная страница выступает как центр навигации.",
        "С неё можно перейти к бронированию кабинок, консолей, каталогу игр и профилю.",
        "Также пользователь сразу видит основные показатели: количество свободных кабинок, игр в каталоге и активных броней.",
    ]),
    ("Слайд 9. Бронирование кабинок", [
        "Здесь показан сценарий бронирования кабинок.",
        "Пользователь выбирает дату, время, длительность и количество человек.",
        "Сервер проверяет занятость, город пользователя и активность кабинки. В результате пользователь видит только подходящие свободные варианты.",
    ]),
    ("Слайд 10. Ограничения и таймер брони", [
        "После бронирования активная бронь отображается в профиле.",
        "Пользователь видит оставшееся время, может продлить бронь, но продление ограничено.",
        "Также реализована логика, при которой один пользователь не может одновременно забронировать несколько кабинок. Это нужно, чтобы ресурсы распределялись справедливо.",
    ]),
    ("Слайд 11. Бронирование консоли", [
        "Отдельно реализовано бронирование игровых консолей Xbox и PlayStation.",
        "Пользователь бронирует консоль в выбранном кампусе, и только после этого может запросить игру.",
        "Это важно, потому что игра должна соответствовать платформе и городу активной брони.",
    ]),
    ("Слайд 12. Каталог игр", [
        "Каталог игр содержит карточки с обложками, жанрами, платформами и количеством доступных копий.",
        "Пользователь может выбирать игры по жанрам и сразу понимать, доступна ли игра сейчас.",
        "Доступность считается не просто по названию игры, а по конкретным копиям для Xbox и PlayStation.",
    ]),
    ("Слайд 13. Медиа-раздел игры", [
        "Для игр добавлен медиа-раздел: трейлер, видео или фотографии геймплея.",
        "Это помогает пользователю выбрать игру не только по названию, но и по визуальному представлению.",
        "Администратор может редактировать эти данные и обновлять каталог.",
    ]),
    ("Слайд 14. Выдача игры после консоли", [
        "Запрос на выдачу игры связан с активной бронью консоли.",
        "Система проверяет, чтобы город игры совпадал с городом консоли. Например, нельзя забронировать консоль в одном городе, а игру получить из другого.",
        "Если бронь консоли отменяется, связанная заявка на игру тоже отменяется, а копия снова становится доступной.",
    ]),
    ("Слайд 15. Профиль пользователя", [
        "В профиле собраны данные аккаунта, аватар, выбранный город, активные брони и история действий.",
        "Пользователь может изменить кампус, отменить активную бронь и посмотреть статусы заявок.",
        "Профиль нужен как единое место, где пользователь видит всё, что относится к его действиям на сайте.",
    ]),
    ("Слайд 16. Поддержка и уведомления", [
        "На сайте есть поддержка. Пользователь может отправить сообщение администратору по техническому вопросу или проблеме с бронью.",
        "Администратор отвечает из панели управления, а пользователь получает уведомление об ответе.",
        "Даже заблокированный пользователь может писать в поддержку, чтобы уточнить причину блокировки или решить проблему.",
    ]),
    ("Слайд 17. Административная панель", [
        "Административная панель разделена на категории: пользователи, кабинки, игры, брони, заявки и поддержка.",
        "Администратор может искать записи, фильтровать их, редактировать ресурсы, отменять брони и управлять банами.",
        "Это делает работу с сайтом удобнее, особенно когда данных становится много.",
    ]),
    ("Слайд 18. База данных: пользователи и бронирование", [
        "На этом слайде показана первая база данных.",
        "Она отвечает за пользователей, кампусы, кабинки, бронирования, баны, поддержку и push-уведомления.",
        "Через связи между таблицами сохраняется история действий, статусы броней и ограничения для пользователей.",
    ]),
    ("Слайд 19. База данных: каталог и выдача игр", [
        "Вторая база данных отвечает за каталог игр и выдачу.",
        "Здесь хранятся игры, копии игр, заявки на выдачу, SMS-уведомления и журнал действий администратора.",
        "Такое разделение удобно, потому что логика бронирования кампуса и логика выдачи игр разделены, но при этом работают вместе через пользовательские заявки.",
    ]),
    ("Слайд 20. Спасибо за внимание", [
        "В результате был разработан рабочий сайт, который объединяет пользовательскую часть, административную панель, бронирование кабинок и консолей, каталог игр, поддержку, уведомления, карты и базу данных.",
        "Проект ориентирован на использование с телефона и решает практическую задачу кампуса: упрощает бронирование ресурсов и работу администратора.",
        "Спасибо за внимание.",
    ]),
]


def run(text: str, bold: bool = False) -> str:
    b = "<w:b/>" if bold else ""
    return (
        "<w:r><w:rPr>"
        "<w:rFonts w:ascii=\"Times New Roman\" w:hAnsi=\"Times New Roman\" w:cs=\"Times New Roman\"/>"
        f"<w:sz w:val=\"28\"/><w:szCs w:val=\"28\"/>{b}"
        "</w:rPr>"
        f"<w:t xml:space=\"preserve\">{escape(text)}</w:t></w:r>"
    )


def paragraph(text: str = "", *, bold: bool = False, align: str = "both", first_line: bool = True) -> str:
    jc = {"both": "both", "center": "center", "left": "left"}[align]
    indent = "<w:ind w:firstLine=\"709\"/>" if first_line else "<w:ind w:firstLine=\"0\"/>"
    return (
        "<w:p><w:pPr>"
        f"<w:jc w:val=\"{jc}\"/>"
        f"{indent}"
        "<w:spacing w:line=\"360\" w:lineRule=\"auto\" w:before=\"0\" w:after=\"0\"/>"
        "</w:pPr>"
        f"{run(text, bold)}"
        "</w:p>"
    )


body_parts = [
    paragraph("ТЕКСТ ВЫСТУПЛЕНИЯ К ПРЕЗЕНТАЦИИ", bold=True, align="center", first_line=False),
    paragraph("по проекту «Сайт бронирования кабинок, консолей и выдачи игр»", align="center", first_line=False),
    paragraph("", first_line=False),
]

for title, lines in slides:
    body_parts.append(paragraph(title, bold=True, align="center", first_line=False))
    for line in lines:
        body_parts.append(paragraph(line))
    body_parts.append(paragraph("", first_line=False))

sect_pr = (
    "<w:sectPr>"
    "<w:pgSz w:w=\"11906\" w:h=\"16838\"/>"
    "<w:pgMar w:top=\"1134\" w:right=\"567\" w:bottom=\"1134\" w:left=\"1701\" "
    "w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/>"
    "</w:sectPr>"
)

document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
 xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
 xmlns:v="urn:schemas-microsoft-com:vml"
 xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
 xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
 xmlns:w10="urn:schemas-microsoft-com:office:word"
 xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
 xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
 xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
 xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
 xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
 xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
 mc:Ignorable="w14 w15 wp14">
<w:body>
{''.join(body_parts)}
{sect_pr}
</w:body>
</w:document>
"""

styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults>
<w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:line="360" w:lineRule="auto" w:before="0" w:after="0"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
</w:styles>
"""

content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>
"""

rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"""

doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>
"""

settings = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:zoom w:percent="100"/>
</w:settings>
"""

OUT_DIR.mkdir(parents=True, exist_ok=True)
if OUT_PATH.exists():
    backup = OUT_PATH.with_name(f"{OUT_PATH.stem}_backup.docx")
    backup.write_bytes(OUT_PATH.read_bytes())

with ZipFile(OUT_PATH, "w", ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("word/_rels/document.xml.rels", doc_rels)
    z.writestr("word/document.xml", document_xml)
    z.writestr("word/styles.xml", styles_xml)
    z.writestr("word/settings.xml", settings)

print(OUT_PATH)
