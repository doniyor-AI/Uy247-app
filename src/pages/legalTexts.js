// Uy24/7 — huquqiy hujjatlar: Foydalanish shartlari, Maxfiylik siyosati, Ommaviy oferta (uz / ru / en).
//
// MUHIM: ishga tushirishdan oldin yuristga ko'rsatib chiqing.
// Matnni o'zgartirsangiz — src/lib/legal.js dagi LEGAL_VERSION sanasini yangilang:
// shunda foydalanuvchilardan yangi tahrirga rozilik qayta so'raladi.
//
// Yozish qoidalari:
//   "• " bilan boshlangan qator  — ro'yxat bandi
//   [matn](terms|privacy|offer|about) — boshqa hujjatga havola
//   {email}                       — aloqa pochtasi (src/lib/company.js dan olinadi)
//   {servers}                     — serverlar joylashgan davlatlar (src/lib/company.js → serverCountries)
// Uchala tilda bo'limlar va qatorlar soni bir xil bo'lishi shart (test shuni tekshiradi).

export const LEGAL_DOCS = {
  // =====================================================================
  // FOYDALANISH SHARTLARI
  // =====================================================================
  terms: {
    uz: {
      title: "Foydalanish shartlari",
      intro: "Ushbu shartlar Uy24/7 platformasidan (veb-ilova, rasmiy Telegram kanali va boti — keyingi o'rinlarda «Platforma») foydalanish qoidalarini belgilaydi. Platformadan foydalanish — e'lonlarni ko'rish, raqamni tasdiqlash, e'lon joylash yoki xabar yozish — siz ushbu shartlarga rozi ekaningizni bildiradi. Rozi bo'lmasangiz, Platformadan foydalanmang.",
      sections: [
        { h: "1. Asosiy tushunchalar", p: [
          "• Operator — Platformani boshqaruvchi yuridik shaxs. Uning rekvizitlari sahifa oxirida keltirilgan.",
          "• Foydalanuvchi — Platformadan foydalanayotgan har qanday jismoniy shaxs.",
          "• Uy egasi — ko'chmas mulk egasi yoki egasining rasmiy vakili; e'lon joylaydi.",
          "• Ijarachi — uy, xona yoki o'rin izlayotgan Foydalanuvchi.",
          "• E'lon — uy, xona, o'rin yoki tijorat binosini ijaraga berish haqidagi ma'lumot: matn, rasmlar, narx va joylashuv.",
        ] },
        { h: "2. Platformaning roli", p: [
          "Platforma — Uy egalari va Ijarachilarni to'g'ridan-to'g'ri bog'laydigan e'lonlar xizmati. Operator ijara shartnomasining tarafi, rieltor, agent yoki vositachi emas: mulkni ijaraga bermaydi, ijara haqi yoki depozitni qabul qilmaydi va bitim natijasini kafolatlamaydi.",
          "E'lon joylash, qidirish va xabar almashish bepul. Ijarachilardan hech qanday komissiya olinmaydi. Pullik xizmatlar faqat [Ommaviy oferta](offer) asosida ko'rsatiladi.",
        ] },
        { h: "3. Kim foydalanishi mumkin", p: [
          "Platformadan 18 yoshga to'lgan, to'liq muomala layoqatiga ega shaxslar foydalanishi mumkin.",
          "Egasi bilan bog'lanish va bildirishnomalar olish uchun telefon raqami SMS-kod orqali tasdiqlanadi; Operator e'lon joylash uchun ham tasdiqlangan raqam talab qilishi mumkin. Bitta raqamga — bitta akkaunt. Faqat o'zingizga tegishli raqamdan foydalaning.",
          "Akkauntingizdagi barcha harakatlar uchun o'zingiz javobgarsiz. SMS-kodni hech kimga aytmang — Operator xodimlari uni hech qachon so'ramaydi.",
        ] },
        { h: "4. E'lon joylash qoidalari", p: [
          "E'lonni faqat mulk egasi yoki egasidan ishonchnoma (yozma vakolat) olgan shaxs joylashi mumkin. Rieltorlar, agentliklar va vositachilar e'lon joylashi taqiqlanadi.",
          "E'lon joylab, siz mulkka egalik qilish yoki uni ijaraga berish huquqingiz borligini va barcha ma'lumotlar haqiqiy ekanini tasdiqlaysiz. Operator so'rasa, buni tasdiqlovchi hujjatni ko'rsatishga rozisiz.",
          "E'longa qo'yiladigan talablar:",
          "• haqiqiy narx; qo'shimcha to'lovlar (kommunal, depozit) bo'lsa, tavsifda yozilishi shart;",
          "• kamida 3 ta aynan shu mulkka tegishli haqiqiy rasm; boshqa mulk rasmlari, internetdan olingan rasmlar, suv belgisi, telefon raqami yoki havola yozilgan rasmlar mumkin emas;",
          "• to'g'ri shahar, tuman va xaritadagi joylashuv;",
          "• «Sherik bilan» e'lonlarida xonalar, o'rinlar soni va ularning bandligi haqiqatga mos bo'lishi;",
          "• bitta mulk uchun bitta e'lon — dublikatlar o'chiriladi;",
          "• mulk ijaraga berilgach — «Band» deb belgilang yoki e'lonni o'chiring.",
          "Taqiqlanadi: mavjud bo'lmagan yoki ijaraga berishga huquqingiz bo'lmagan mulk, oldindan to'lov yig'ish uchun soxta e'lonlar, millati, irqi, dini yoki boshqa belgilarga ko'ra kamsitish, haqoratli yoki odobsiz matn, boshqa xizmatlar reklamasi va qonunga zid har qanday maqsad. Umumiy xonadonda o'rinni faqat erkaklar yoki faqat ayollar uchun taklif qilish kamsitish hisoblanmaydi.",
        ] },
        { h: "5. Moderatsiya va bloklash", p: [
          "Har bir e'lon chop etilishidan oldin moderator tomonidan tekshiriladi. Tasdiqlangan e'londa sarlavha, tavsif yoki rasmlar o'zgartirilsa, u qayta tekshiruvga tushadi.",
          "Operator shartlarga zid e'lonni rad etish, yashirish yoki o'chirish, akkauntni esa ogohlantirishsiz bloklash huquqiga ega. Bloklash to'g'risidagi qarorni moderator (inson) qabul qiladi.",
          "Akkaunt bloklanganda uning telefon raqami ham 3 yilgacha bloklanganlar ro'yxatiga kiritiladi: shu raqam bilan ochilgan yangi akkaunt avtomatik bloklanadi. Akkauntni o'chirish blokni bekor qilmaydi.",
          "Qaror bilan rozi bo'lmasangiz yoki raqamingiz xato bloklangan deb hisoblasangiz (masalan, raqamni yaqinda olgan bo'lsangiz), {email} manziliga yozing — murojaat 10 kun ichida ko'rib chiqiladi.",
        ] },
        { h: "6. Muloqot va telefon raqamlari", p: [
          "Ichki chat faqat ijara bo'yicha muloqot uchun. Spam, haqorat, tahdid, boshqa xizmatlar reklamasi va soxta xabarlar taqiqlanadi.",
          "Uy egasining telefon raqami faqat raqami tasdiqlangan Foydalanuvchiga va faqat «Raqamni ko'rsatish» tugmasi bosilganda ko'rsatiladi. Kunlik cheklov amal qiladi; raqamlarni yig'ish, tarqatish yoki reklama uchun ishlatish taqiqlanadi.",
          "Platformadagi ma'lumotlarni avtomatik yig'ish (parsing, skreyping), tizim himoyasini aylanib o'tish yoki uning ishini buzishga urinish taqiqlanadi.",
        ] },
        { h: "7. Xavfsiz ijara bo'yicha maslahatlar", p: [
          "• Uyni ko'rmasdan va egasining shaxsini hamda mulk hujjatlarini tekshirmasdan pul o'tkazmang.",
          "• «Bron uchun oldindan to'lang», «boshqa shahardaman, kalitni pochta orqali yuboraman» kabi gaplar — firibgarlik belgisi. Bunday e'lon haqida darhol xabar bering.",
          "• Ijara shartnomasini yozma tuzing: narx, muddat, depozit va kommunal to'lovlarni kim to'lashini yozing.",
          "• Kalitlar va hisoblagich ko'rsatkichlarini dalolatnoma bilan qabul qiling.",
          "• Shubhali e'lonni bayroqcha tugmasi («Shubhali deb belgilash») orqali, shubhali xabarni esa {email} manziliga yozib bildiring.",
        ] },
        { h: "8. Ijara bitimi bo'yicha majburiyatlar", p: [
          "Ijara shartnomasi Uy egasi va Ijarachi o'rtasida bevosita tuziladi. Shartnomani rasmiylashtirish va qonunchilikda belgilangan tartibda ro'yxatdan o'tkazish, ijaradan olingan daromad uchun soliq to'lash, yashovchilarni vaqtincha turgan joyi bo'yicha ro'yxatga olish va boshqa majburiyatlar tomonlarning o'z zimmasida.",
          "Operator tomonlar o'rtasidagi hisob-kitob, depozit, mulk holati yoki nizolar uchun javobgar emas. Firibgarlik holatlarida Operator qonun doirasida huquqni muhofaza qiluvchi organlarga ma'lumot taqdim etadi.",
        ] },
        { h: "9. Kontent va intellektual mulk", p: [
          "E'lon matni va rasmlari sizga tegishli bo'lishi yoki ulardan qonuniy foydalanish huquqingiz bo'lishi kerak. E'lon joylab, siz Operatorga ularni Platformada va rasmiy Telegram kanalida bepul ko'rsatish hamda ko'rsatish uchun moslashtirish (kichraytirish, kesish) huquqini berasiz. Bu huquq e'lon o'chirilganda tugaydi; Telegram kanalidagi post esa avtomatik o'chmaydi — so'rovingizga ko'ra 10 kun ichida o'chiriladi.",
          "Platforma nomi, logotipi, dizayni va dasturiy kodi Operatorga tegishli va ruxsatsiz ishlatilishi mumkin emas.",
        ] },
        { h: "10. Pullik xizmatlar", p: [
          "«Top e'lon» va bonus kreditlar [Ommaviy oferta](offer) shartlari asosida ko'rsatiladi. To'lovni amalga oshirib, siz oferta shartlarini qabul qilasiz.",
        ] },
        { h: "11. Javobgarlikni cheklash", p: [
          "Platforma «boricha» taqdim etiladi. Texnik ishlar, uzilishlar va uchinchi tomon xizmatlarida (SMS, Telegram, xarita, to'lov tizimlari) nosozliklar bo'lishi mumkin; Operator ularni imkon qadar tez bartaraf etadi.",
          "Operator Foydalanuvchilar joylagan ma'lumotlarni tekshirish choralarini ko'radi, ammo ularning to'g'riligini to'liq kafolatlay olmaydi. Qonunchilikda boshqacha belgilanmagan bo'lsa, Operatorning javobgarligi Foydalanuvchi tegishli pullik xizmat uchun to'lagan summa bilan cheklanadi; bu cheklov Operator qasddan yoki qo'pol ehtiyotsizlik bilan yetkazgan zararga taalluqli emas.",
        ] },
        { h: "12. Akkauntni o'chirish", p: [
          "Akkauntni istalgan vaqtda Sozlamalar → «Profilni o'chirish» orqali o'chirishingiz mumkin. E'lonlar, rasmlar, xabarlar va boshqa ma'lumotlar darhol o'chiriladi (Telegram kanalidagi postlar — so'rovingizga ko'ra); firibgarlikka qarshi saqlanadigan qisqa yozuv haqida [Maxfiylik siyosati](privacy)da batafsil yozilgan.",
        ] },
        { h: "13. Shartlarni o'zgartirish", p: [
          "Operator ushbu shartlarni o'zgartirishi mumkin. Yangi tahrir shu sahifada e'lon qilingan kundan kuchga kiradi; muhim o'zgarishlar haqida ilovada xabar beriladi. O'zgarishlardan keyin Platformadan foydalanishni davom ettirish yangi tahrirga rozilikni bildiradi.",
        ] },
        { h: "14. Nizolarni hal qilish", p: [
          "Ushbu shartlar O'zbekiston Respublikasi qonunchiligi bilan tartibga solinadi. Nizolar avvalo muzokara yo'li bilan hal qilinadi: {email} manziliga yozing, javob 10 kun ichida beriladi. Kelishuvga erishilmasa, nizo O'zbekiston Respublikasining vakolatli sudida ko'rib chiqiladi.",
        ] },
      ],
    },
    ru: {
      title: "Правила пользования",
      intro: "Настоящие Правила определяют порядок использования платформы Uy24/7 (веб-приложение, официальный Telegram-канал и бот — далее «Платформа»). Пользуясь Платформой — просматривая объявления, подтверждая номер, размещая объявления или отправляя сообщения, — вы соглашаетесь с настоящими Правилами. Если вы не согласны, не пользуйтесь Платформой.",
      sections: [
        { h: "1. Основные понятия", p: [
          "• Оператор — юридическое лицо, управляющее Платформой. Его реквизиты указаны в конце страницы.",
          "• Пользователь — любое физическое лицо, пользующееся Платформой.",
          "• Владелец — собственник недвижимости или его официальный представитель, размещающий объявление.",
          "• Арендатор — Пользователь, который ищет жильё, комнату или койко-место.",
          "• Объявление — информация о сдаче в аренду жилья, комнаты, койко-места или коммерческого помещения: текст, фотографии, цена и местоположение.",
        ] },
        { h: "2. Роль Платформы", p: [
          "Платформа — сервис объявлений, который напрямую связывает Владельцев и Арендаторов. Оператор не является стороной договора аренды, риелтором, агентом или посредником: он не сдаёт недвижимость, не принимает арендную плату или залог и не гарантирует результат сделки.",
          "Размещение объявлений, поиск и переписка бесплатны. Арендаторы не платят никаких комиссий. Платные услуги оказываются только на условиях [Публичной оферты](offer).",
        ] },
        { h: "3. Кто может пользоваться Платформой", p: [
          "Платформой могут пользоваться лица, достигшие 18 лет и обладающие полной дееспособностью.",
          "Для связи с владельцем и получения уведомлений нужно подтвердить номер телефона SMS-кодом; Оператор может требовать подтверждённый номер и для размещения объявлений. Один номер — один аккаунт. Используйте только свой номер.",
          "Вы отвечаете за все действия, совершённые в вашем аккаунте. Никому не сообщайте SMS-код — сотрудники Оператора никогда его не запрашивают.",
        ] },
        { h: "4. Правила размещения объявлений", p: [
          "Размещать объявления может только собственник или лицо, получившее от него доверенность (письменное полномочие). Риелторам, агентствам и посредникам размещение запрещено.",
          "Размещая объявление, вы подтверждаете, что владеете объектом или имеете право сдавать его в аренду и что все сведения достоверны. По запросу Оператора вы обязуетесь предъявить подтверждающий документ.",
          "Требования к объявлению:",
          "• реальная цена; дополнительные платежи (коммунальные услуги, залог) должны быть указаны в описании;",
          "• не менее 3 настоящих фотографий именно этого объекта; запрещены фото чужих объектов, изображения из интернета, а также фото с водяными знаками, номерами телефонов или ссылками;",
          "• правильные город, район и точка на карте;",
          "• в объявлениях «С соседями» количество комнат, мест и их занятость должны соответствовать действительности;",
          "• одно объявление на один объект — дубликаты удаляются;",
          "• когда объект сдан — отметьте его «Сдано» или удалите объявление.",
          "Запрещены: несуществующие объекты или объекты, которые вы не вправе сдавать, фиктивные объявления для сбора предоплаты, дискриминация по национальности, расе, религии и иным признакам, оскорбительные или непристойные тексты, реклама сторонних сервисов и любые цели, противоречащие закону. Предложение мест в общей квартире только для мужчин или только для женщин дискриминацией не считается.",
        ] },
        { h: "5. Модерация и блокировка", p: [
          "Каждое объявление проверяется модератором до публикации. Если в одобренном объявлении изменить заголовок, описание или фотографии, оно снова отправляется на проверку.",
          "Оператор вправе отклонить, скрыть или удалить объявление, нарушающее Правила, а аккаунт — заблокировать без предупреждения. Решение о блокировке принимает модератор (человек).",
          "При блокировке аккаунта его номер телефона на срок до 3 лет вносится в список заблокированных: новый аккаунт с этим номером блокируется автоматически. Удаление аккаунта не снимает блокировку.",
          "Если вы не согласны с решением или считаете, что номер заблокирован по ошибке (например, вы недавно получили этот номер), напишите на {email} — обращение будет рассмотрено в течение 10 дней.",
        ] },
        { h: "6. Переписка и номера телефонов", p: [
          "Внутренний чат предназначен только для общения по поводу аренды. Запрещены спам, оскорбления, угрозы, реклама сторонних сервисов и фиктивные сообщения.",
          "Номер телефона Владельца показывается только Пользователю с подтверждённым номером и только после нажатия «Показать номер». Действует дневной лимит; собирать номера, распространять их или использовать для рекламы запрещено.",
          "Запрещено автоматически собирать данные Платформы (парсинг, скрейпинг), обходить защиту системы или пытаться нарушить её работу.",
        ] },
        { h: "7. Советы по безопасной аренде", p: [
          "• Не переводите деньги, пока не увидите жильё и не проверите личность владельца и документы на объект.",
          "• Фразы «внесите предоплату за бронь», «я в другом городе, вышлю ключи почтой» — признаки мошенничества. Сразу сообщите о таком объявлении.",
          "• Заключайте договор аренды в письменной форме: укажите цену, срок, залог и кто оплачивает коммунальные услуги.",
          "• Принимайте ключи и показания счётчиков по акту.",
          "• О подозрительном объявлении сообщайте кнопкой с флажком («Пожаловаться на объявление»), о подозрительном сообщении — письмом на {email}.",
        ] },
        { h: "8. Обязательства по сделке аренды", p: [
          "Договор аренды заключается напрямую между Владельцем и Арендатором. Оформление договора и его регистрация в установленном законом порядке, уплата налога с дохода от аренды, регистрация проживающих по месту пребывания и иные обязанности лежат на самих сторонах.",
          "Оператор не отвечает за расчёты между сторонами, залог, состояние объекта и споры между ними. В случаях мошенничества Оператор в рамках закона предоставляет сведения правоохранительным органам.",
        ] },
        { h: "9. Контент и интеллектуальная собственность", p: [
          "Текст и фотографии объявления должны принадлежать вам или использоваться вами на законном основании. Размещая объявление, вы безвозмездно предоставляете Оператору право показывать их на Платформе и в официальном Telegram-канале, а также адаптировать для показа (уменьшать, обрезать). Это право прекращается при удалении объявления; пост в Telegram-канале автоматически не удаляется — его удалят по вашему запросу в течение 10 дней.",
          "Название, логотип, дизайн и программный код Платформы принадлежат Оператору и не могут использоваться без разрешения.",
        ] },
        { h: "10. Платные услуги", p: [
          "«Топ-объявление» и бонусные кредиты предоставляются на условиях [Публичной оферты](offer). Совершая оплату, вы принимаете условия оферты.",
        ] },
        { h: "11. Ограничение ответственности", p: [
          "Платформа предоставляется «как есть». Возможны технические работы, перебои и неполадки сторонних сервисов (SMS, Telegram, карты, платёжные системы); Оператор устраняет их в кратчайшие сроки.",
          "Оператор принимает меры для проверки сведений, размещённых Пользователями, но не может полностью гарантировать их достоверность. Если иное не установлено законодательством, ответственность Оператора ограничена суммой, уплаченной Пользователем за соответствующую платную услугу; это ограничение не распространяется на вред, причинённый Оператором умышленно или по грубой неосторожности.",
        ] },
        { h: "12. Удаление аккаунта", p: [
          "Удалить аккаунт можно в любой момент: Настройки → «Удалить профиль». Объявления, фотографии, сообщения и другие данные удаляются сразу (посты в Telegram-канале — по вашему запросу); о краткой записи, которая хранится для защиты от мошенничества, подробно сказано в [Политике конфиденциальности](privacy).",
        ] },
        { h: "13. Изменение Правил", p: [
          "Оператор может изменять настоящие Правила. Новая редакция вступает в силу со дня публикации на этой странице; о существенных изменениях мы сообщаем в приложении. Продолжение использования Платформы после изменений означает согласие с новой редакцией.",
        ] },
        { h: "14. Разрешение споров", p: [
          "Настоящие Правила регулируются законодательством Республики Узбекистан. Споры решаются прежде всего путём переговоров: напишите на {email}, ответ будет дан в течение 10 дней. Если договориться не удалось, спор рассматривается в компетентном суде Республики Узбекистан.",
        ] },
      ],
    },
    en: {
      title: "Terms of Use",
      intro: "These Terms govern the use of the Uy24/7 platform (the web app and its official Telegram channel and bot — the “Platform”). By using the Platform — browsing listings, verifying your number, posting a listing or sending a message — you agree to these Terms. If you do not agree, please do not use the Platform.",
      sections: [
        { h: "1. Definitions", p: [
          "• Operator — the legal entity that runs the Platform. Its details are listed at the end of this page.",
          "• User — any individual using the Platform.",
          "• Owner — a property owner, or the owner's official representative, who posts a listing.",
          "• Renter — a User looking for a home, a room or a bed.",
          "• Listing — information about renting out a home, room, bed or commercial space: text, photos, price and location.",
        ] },
        { h: "2. What the Platform does", p: [
          "The Platform is a listings service that connects Owners and Renters directly. The Operator is not a party to any lease and is not a realtor, agent or intermediary: it does not rent out property, does not accept rent or deposits, and does not guarantee the outcome of any deal.",
          "Posting listings, searching and messaging are free. Renters pay no commission. Paid services are provided only under the [Public Offer](offer).",
        ] },
        { h: "3. Who can use the Platform", p: [
          "You must be at least 18 years old and have full legal capacity.",
          "To contact owners and receive notifications, you verify your phone number with an SMS code; the Operator may also require a verified number to post listings. One number — one account. Use only your own number.",
          "You are responsible for everything done through your account. Never share your SMS code — the Operator's staff will never ask for it.",
        ] },
        { h: "4. Listing rules", p: [
          "Listings may be posted only by the owner or by a person holding the owner's power of attorney (written authorisation). Realtors, agencies and intermediaries may not post.",
          "By posting a listing, you confirm that you own the property or have the right to rent it out, and that all details are true. You agree to show supporting documents if the Operator asks.",
          "Every listing must have:",
          "• the real price; any extra charges (utilities, deposit) must be stated in the description;",
          "• at least 3 genuine photos of this very property; photos of other properties, images from the internet, watermarks, phone numbers or links on photos are not allowed;",
          "• the correct city, district and map location;",
          "• for “Shared” listings, accurate numbers of rooms and beds and their occupancy;",
          "• one listing per property — duplicates are removed;",
          "• once the property is rented out, mark it “Rented out” or delete the listing.",
          "Prohibited: properties that don't exist or that you have no right to rent out, fake listings used to collect prepayments, discrimination based on ethnicity, race, religion or other grounds, offensive or indecent content, advertising of other services, and any unlawful purpose. Offering beds in a shared flat to men only or women only is not considered discrimination.",
        ] },
        { h: "5. Moderation and blocking", p: [
          "Every listing is reviewed by a moderator before it goes live. If you change the title, description or photos of an approved listing, it is reviewed again.",
          "The Operator may reject, hide or remove listings that break these Terms and may block accounts without notice. Blocking decisions are made by a human moderator.",
          "When an account is blocked, its phone number is added to the block list for up to 3 years: a new account opened with that number is blocked automatically. Deleting your account does not lift a block.",
          "If you disagree with a decision or believe your number was blocked by mistake (for example, you got this number recently), write to {email} — requests are reviewed within 10 days.",
        ] },
        { h: "6. Messages and phone numbers", p: [
          "The in-app chat is for rental-related communication only. Spam, insults, threats, advertising of other services and fake messages are prohibited.",
          "An Owner's phone number is shown only to Users with a verified number, and only after they tap “Show phone number”. A daily limit applies; collecting or sharing numbers, or using them for advertising, is prohibited.",
          "Automated collection of Platform data (parsing, scraping), circumventing security measures or attempting to disrupt the Platform is prohibited.",
        ] },
        { h: "7. Safe renting tips", p: [
          "• Don't send money before you have seen the place and checked the owner's identity and the property documents.",
          "• “Pay a deposit to hold it” or “I'm in another city, I'll post you the keys” are signs of fraud. Report such listings right away.",
          "• Sign a written lease that states the rent, term, deposit and who pays the utilities.",
          "• Receive the keys and record the meter readings in a signed handover report.",
          "• Report a suspicious listing with the flag button (“Report this listing”), and a suspicious message by writing to {email}.",
        ] },
        { h: "8. Obligations under the lease", p: [
          "The lease is concluded directly between the Owner and the Renter. Drawing up the lease and registering it as required by law, paying tax on rental income, registering residents at their place of stay and any other legal obligations are the parties' own responsibility.",
          "The Operator is not responsible for payments between the parties, deposits, the condition of the property or disputes between them. In cases of fraud, the Operator provides information to law enforcement within the limits of the law.",
        ] },
        { h: "9. Content and intellectual property", p: [
          "The text and photos in your listing must be yours or used lawfully. By posting a listing, you grant the Operator a free right to show them on the Platform and in its official Telegram channel and to adapt them for display (resize, crop). This right ends when the listing is deleted; the Telegram channel post is not removed automatically — it is removed within 10 days at your request.",
          "The Platform's name, logo, design and code belong to the Operator and may not be used without permission.",
        ] },
        { h: "10. Paid services", p: [
          "Boosts and bonus credits are provided under the [Public Offer](offer). By paying, you accept the terms of the offer.",
        ] },
        { h: "11. Limitation of liability", p: [
          "The Platform is provided “as is”. Maintenance, outages and failures of third-party services (SMS, Telegram, maps, payment systems) may occur; the Operator fixes them as quickly as possible.",
          "The Operator takes steps to check information posted by Users but cannot fully guarantee its accuracy. Unless the law provides otherwise, the Operator's liability is limited to the amount the User paid for the relevant paid service; this limit does not apply to harm caused by the Operator intentionally or through gross negligence.",
        ] },
        { h: "12. Deleting your account", p: [
          "You can delete your account at any time in Settings → “Delete profile”. Listings, photos, messages and other data are deleted immediately (Telegram channel posts — at your request); the short record kept for fraud prevention is described in the [Privacy Policy](privacy).",
        ] },
        { h: "13. Changes to these Terms", p: [
          "The Operator may change these Terms. A new version takes effect on the day it is published on this page; we announce significant changes in the app. Continuing to use the Platform after changes means you accept the new version.",
        ] },
        { h: "14. Disputes", p: [
          "These Terms are governed by the laws of the Republic of Uzbekistan. Disputes are first resolved through negotiation: write to {email} and we will reply within 10 days. If no agreement is reached, the dispute is heard by a competent court of the Republic of Uzbekistan.",
        ] },
      ],
    },
  },

  // =====================================================================
  // MAXFIYLIK SIYOSATI
  // =====================================================================
  privacy: {
    uz: {
      title: "Maxfiylik siyosati",
      intro: "Ushbu siyosat Uy24/7 platformasi qanday shaxsga doir ma'lumotlarni yig'ishi, ular nima uchun ishlatilishi, kimga ko'rinishi, qancha saqlanishi va qanday himoya qilinishini tushuntiradi. Siyosat «Shaxsga doir ma'lumotlar to'g'risida»gi O'zbekiston Respublikasi Qonuniga (2019-yil 2-iyuldagi O'RQ-547-son, keyingi o'zgartishlar bilan) muvofiq ishlab chiqilgan.",
      sections: [
        { h: "1. Ma'lumotlaringizga kim ishlov beradi", p: [
          "Shaxsga doir ma'lumotlar bazasining mulkdori va operatori — Operator (rekvizitlari sahifa oxirida). Shaxsga doir ma'lumotlar bo'yicha murojaatlar: {email}.",
          "Telefon raqamini tasdiqlash oynasida yoki e'lon joylash formasida rozilik belgisini qo'yib, siz ushbu siyosatda ko'rsatilgan ma'lumotlarga ko'rsatilgan maqsadlarda ishlov berilishiga, jumladan 6-bo'limda yozilgan transchegaraviy uzatishga rozilik berasiz. Rozilik qayd etiladi: qaysi tahrirga va qachon rozi bo'lganingiz saqlanadi.",
        ] },
        { h: "2. Qanday ma'lumotlarni yig'amiz", p: [
          "Siz beradigan ma'lumotlar:",
          "• telefon raqami — SMS-kod orqali tasdiqlash va kirish uchun;",
          "• ism va familiya — e'lon joylashda; faqat tekshiruv uchun, e'londa ko'rsatilmaydi;",
          "• e'lon ma'lumotlari: sarlavha, tavsif, narx, shahar va tuman, xaritada siz belgilagan nuqta, rasmlar, xonalar va o'rinlar, band kunlar;",
          "• chat xabarlari, shikoyatlar, sevimlilar va saqlangan qidiruvlar;",
          "• Telegramni ulasangiz — Telegram chat identifikatori, bildirishnoma sozlamalari va tili.",
          "Avtomatik yig'iladigan ma'lumotlar:",
          "• anonim identifikator — ilovani birinchi ochganingizda beriladi; sevimlilar va qidiruvlar shunga bog'lanadi;",
          "• xavfsizlik jurnali: qaysi e'lon egasining raqamini qachon ko'rganingiz, oxirgi faollik vaqti;",
          "• referal dastur ma'lumotlari, bonus kreditlar va pullik xizmatlar tarixi (summa, to'lov tizimi, holat);",
          "• texnik ma'lumotlar: IP-manzil, brauzer va qurilma turi, xatolar jurnali;",
          "• brauzer xotirasida (localStorage): kirish sessiyasi, tanlangan til, o'qilgan xabarlar belgisi. Reklama yoki kuzatuv cookie-fayllaridan foydalanmaymiz.",
          "Biz pasport, biometrik va genetik ma'lumotlarni, millat, din yoki sog'liq haqidagi ma'lumotlarni so'ramaymiz. Bank karta ma'lumotlari bizga kelmaydi — ularga to'lov tizimlari ishlov beradi. E'lon va chatlarda bunday ma'lumotlarni yozmang.",
        ] },
        { h: "3. Maqsadlar va asoslar", p: [
          "• akkaunt yaratish va unga kirish;",
          "• e'lonlarni joylash, tekshirish (moderatsiya) va ko'rsatish;",
          "• Uy egasi va Ijarachini bog'lash: chat va raqamni ko'rsatish;",
          "• siz yoqqan bildirishnomalar (Telegram, SMS);",
          "• firibgarlik, spam va qoidabuzarliklarning oldini olish, bloklangan foydalanuvchilarni aniqlash;",
          "• pullik xizmatlarni ko'rsatish, hisobini yuritish va soliq majburiyatlarini bajarish;",
          "• murojaat va shikoyatlarni ko'rib chiqish;",
          "• qonunda nazarda tutilgan hollarda davlat organlarining so'rovlarini bajarish;",
          "• xizmatni yaxshilash uchun umumlashtirilgan, shaxsni aniqlab bo'lmaydigan statistika.",
          "Asoslar: sizning roziligingiz, siz bilan tuzilgan shartnomani ([Foydalanish shartlari](terms) va [Ommaviy oferta](offer)) bajarish, Operatorning qonuniy majburiyatlari, shuningdek Foydalanuvchilarni firibgarlikdan himoya qilish kabi qonuniy manfaatlar.",
          "Sizga nisbatan huquqiy oqibat keltiradigan qarorlar faqat avtomatik tarzda qabul qilinmaydi: e'lonni rad etish va akkauntni bloklashni moderator (inson) hal qiladi. Bloklangan raqam bilan ochilgan yangi akkaunt shu qaror asosida avtomatik bloklanadi.",
        ] },
        { h: "4. Ma'lumotlaringizni kim ko'radi", p: [
          "• Barcha foydalanuvchilar: tasdiqlangan e'lon — sarlavha, tavsif, narx, shahar va tuman, xaritadagi nuqta, rasmlar. Tasdiqlangan e'lonlar rasmiy Telegram kanalimizda ham chop etiladi (ism va raqamsiz).",
          "• Raqami tasdiqlangan foydalanuvchi: Uy egasining telefon raqami — faqat «Raqamni ko'rsatish» bosilganda, kunlik cheklov bilan.",
          "• Suhbatdoshingiz: chatdagi xabarlaringiz. Ijarachining raqami Uy egasiga ko'rsatilmaydi.",
          "• Operator moderatorlari: e'lonlar, shikoyatlar va zarur hollarda — shikoyat yoki firibgarlik shubhasi bo'yicha — tegishli yozishmalar.",
          "• Xizmat ko'rsatuvchilar — faqat bizning topshirig'imiz bilan va o'z vazifasi doirasida: Supabase (ma'lumotlar bazasi, kirish, rasmlar ombori), Vercel (hosting va server funksiyalari), Eskiz.uz (SMS), Telegram (bot va kanal), Payme va Click (to'lovlar).",
          "• Sahifani ochganingizda xarita va shriftlar Yandex Xaritalar yoki OpenStreetMap hamda Google Fonts serverlaridan yuklanadi — ular IP-manzilingiz va brauzeringiz haqidagi ma'lumotni ko'radi.",
          "• Davlat organlari — qonunda nazarda tutilgan hollarda, rasmiy so'rov asosida yoki Operator firibgarlik holati yuzasidan o'zi murojaat qilganda.",
          "Biz ma'lumotlaringizni sotmaymiz va reklama maqsadida uchinchi shaxslarga bermaymiz.",
        ] },
        { h: "5. Saqlash muddatlari", p: [
          "• Akkaunt, e'lonlar, chatlar, sevimlilar va qidiruvlar — akkaunt mavjud bo'lgan davrda yoki siz ularni o'chirguningizcha.",
          "• Raqam ko'rish jurnali — 1 yil.",
          "• Akkaunt o'chirilganda profil, e'lonlar, rasmlar, xabarlar, sevimlilar, qidiruvlar, raqam ko'rish jurnali va Telegram ulanishi darhol o'chiriladi. Firibgarlikning oldini olish va nizolarni hal qilish uchun faqat qisqa yozuv — telefon raqami, ism, ro'yxatdan o'tish va o'chirish sanalari, bloklash holati va sababi, e'lonlar va shikoyatlar soni, rozilik berilgan hujjat tahriri — 1 yil saqlanadi, so'ng avtomatik o'chiriladi.",
          "• Rasmiy Telegram kanalidagi post e'lon yoki akkaunt o'chirilganda avtomatik o'chmaydi — {email} orqali so'rasangiz, 10 kun ichida o'chiriladi.",
          "• Qoidabuzarlik uchun bloklangan telefon raqamlari — blok bekor qilinguncha, biroq 3 yildan oshmagan muddatda (Fuqarolik kodeksidagi umumiy da'vo muddati).",
          "• Pullik xizmatlar haqidagi yozuvlar (summa, sana, to'lov tizimi) shaxsingizga bog'lanmagan holda buxgalteriya va soliq qonunchiligida belgilangan muddat davomida saqlanadi.",
          "• Server jurnallari — xizmat ko'rsatuvchilar belgilagan qisqa muddat davomida.",
        ] },
        { h: "6. Ma'lumotlar qayerda saqlanadi", p: [
          "Platforma serverlari O'zbekistondan tashqarida — {servers}da joylashgan. Platforma biometrik va genetik ma'lumotlarga ishlov bermaydi va telekommunikatsiya operatori hisoblanmaydi, ya'ni O'zbekiston hududida majburiy saqlanishi lozim bo'lgan toifadagi ma'lumotlarni yig'maydi.",
          "Sizning roziligingiz ma'lumotlarni ushbu davlatlarga transchegaraviy uzatishni ham qamrab oladi. Biz faqat ma'lumotlarni himoya qilish bo'yicha tegishli shartlarga ega yirik xizmat ko'rsatuvchilardan foydalanamiz.",
        ] },
        { h: "7. Huquqlaringiz", p: [
          "Siz quyidagi huquqlarga egasiz:",
          "• qaysi ma'lumotlaringizga, qanday maqsadda ishlov berilayotgani va ular kimga berilgani haqida ma'lumot olish;",
          "• noto'g'ri ma'lumotlarni tuzatish yoki to'ldirishni talab qilish — 3 kun ichida bajariladi;",
          "• e'lonlaringizni istalgan vaqtda o'zgartirish yoki o'chirish, Telegram bildirishnomalarini Sozlamalarda o'chirish;",
          "• akkaunt va ma'lumotlarni o'chirish — Sozlamalar → «Profilni o'chirish» (darhol) yoki {email} orqali;",
          "• rozilikni qaytarib olish — akkauntni o'chirish yoki yozma murojaat orqali; shundan so'ng chat, e'lon joylash va bildirishnomalardan foydalanib bo'lmaydi;",
          "• vakolatli davlat organiga yoki sudga shikoyat qilish.",
          "Murojaatlarga 10 kun ichida javob beramiz. Shaxsingizni tasdiqlash uchun qo'shimcha ma'lumot so'rashimiz mumkin.",
        ] },
        { h: "8. Ma'lumotlarni himoya qilish", p: [
          "• barcha ulanishlar shifrlangan (HTTPS/TLS);",
          "• ma'lumotlar bazasida qator darajasidagi ruxsatlar: har bir Foydalanuvchi faqat o'z ma'lumotlarini ko'radi va o'zgartiradi;",
          "• admin paneliga kirish ikki bosqichli autentifikatsiya bilan himoyalangan;",
          "• raqamlarni ommaviy yig'ishga qarshi kunlik cheklovlar va jurnal;",
          "• maxfiy xizmat kalitlari faqat serverda saqlanadi.",
          "Ma'lumotlar sizib chiqqani aniqlansa, daxldor Foydalanuvchilarni va qonunda nazarda tutilgan hollarda vakolatli organni kechiktirmasdan xabardor qilamiz.",
        ] },
        { h: "9. Voyaga yetmaganlar", p: [
          "Platforma 18 yoshga to'lmaganlar uchun mo'ljallanmagan. Voyaga yetmagan shaxsning ma'lumotlari kiritilganini bilsak, ularni o'chiramiz.",
        ] },
        { h: "10. Siyosatni o'zgartirish", p: [
          "Yangi tahrir shu sahifada e'lon qilinadi va kuchga kirgan sana yangilanadi. Muhim o'zgarishlar haqida ilovada xabar beramiz va zarur bo'lsa rozilikni qayta so'raymiz.",
        ] },
      ],
    },
    ru: {
      title: "Политика конфиденциальности",
      intro: "Настоящая Политика объясняет, какие персональные данные собирает платформа Uy24/7, для чего они используются, кому видны, сколько хранятся и как защищаются. Политика разработана в соответствии с Законом Республики Узбекистан «О персональных данных» (№ ЗРУ-547 от 2 июля 2019 года с последующими изменениями).",
      sections: [
        { h: "1. Кто обрабатывает ваши данные", p: [
          "Собственником и оператором базы персональных данных является Оператор (реквизиты — в конце страницы). Обращения по вопросам персональных данных: {email}.",
          "Отмечая согласие в окне подтверждения номера телефона или в форме размещения объявления, вы соглашаетесь на обработку указанных в Политике данных в указанных целях, включая трансграничную передачу, описанную в разделе 6. Согласие фиксируется: мы храним, с какой редакцией и когда вы согласились.",
        ] },
        { h: "2. Какие данные мы собираем", p: [
          "Данные, которые вы предоставляете:",
          "• номер телефона — для подтверждения SMS-кодом и входа;",
          "• имя и фамилия — при размещении объявления; только для проверки, в объявлении не показываются;",
          "• данные объявления: заголовок, описание, цена, город и район, отмеченная вами точка на карте, фотографии, комнаты и места, занятые даты;",
          "• сообщения в чате, жалобы, избранное и сохранённые поиски;",
          "• если вы подключили Telegram — идентификатор чата Telegram, настройки и язык уведомлений.",
          "Данные, которые собираются автоматически:",
          "• анонимный идентификатор — выдаётся при первом открытии приложения; к нему привязываются избранное и поиски;",
          "• журнал безопасности: чей номер и когда вы открыли, время последней активности;",
          "• данные реферальной программы, бонусные кредиты и история платных услуг (сумма, платёжная система, статус);",
          "• технические данные: IP-адрес, тип браузера и устройства, журнал ошибок;",
          "• в памяти браузера (localStorage): сессия входа, выбранный язык, отметки о прочитанных сообщениях. Мы не используем рекламные и отслеживающие cookie.",
          "Мы не запрашиваем паспортные, биометрические и генетические данные, сведения о национальности, религии или здоровье. Данные банковских карт к нам не поступают — их обрабатывают платёжные системы. Не указывайте такие сведения в объявлениях и в чате.",
        ] },
        { h: "3. Цели и основания обработки", p: [
          "• создание аккаунта и вход в него;",
          "• размещение, проверка (модерация) и показ объявлений;",
          "• связь Владельца и Арендатора: чат и показ номера;",
          "• уведомления, которые вы включили (Telegram, SMS);",
          "• предотвращение мошенничества, спама и нарушений, выявление заблокированных пользователей;",
          "• оказание платных услуг, их учёт и исполнение налоговых обязанностей;",
          "• рассмотрение обращений и жалоб;",
          "• исполнение запросов государственных органов в случаях, предусмотренных законом;",
          "• обобщённая обезличенная статистика для улучшения сервиса.",
          "Основания: ваше согласие, исполнение заключённого с вами договора ([Правила пользования](terms) и [Публичная оферта](offer)), законные обязанности Оператора, а также законные интересы — например, защита Пользователей от мошенничества.",
          "Решения, влекущие для вас правовые последствия, не принимаются исключительно автоматически: решения об отклонении объявлений и блокировке аккаунтов принимает модератор (человек). Новый аккаунт с заблокированным номером блокируется автоматически на основании этого решения.",
        ] },
        { h: "4. Кто видит ваши данные", p: [
          "• Все пользователи: одобренное объявление — заголовок, описание, цена, город и район, точка на карте, фотографии. Одобренные объявления также публикуются в нашем официальном Telegram-канале (без имени и номера).",
          "• Пользователь с подтверждённым номером: номер телефона Владельца — только после нажатия «Показать номер», с дневным лимитом.",
          "• Ваш собеседник: ваши сообщения в чате. Номер Арендатора Владельцу не показывается.",
          "• Модераторы Оператора: объявления, жалобы и при необходимости — при жалобе или подозрении на мошенничество — соответствующая переписка.",
          "• Поставщики услуг — только по нашему поручению и в пределах своей задачи: Supabase (база данных, вход, хранилище фото), Vercel (хостинг и серверные функции), Eskiz.uz (SMS), Telegram (бот и канал), Payme и Click (платежи).",
          "• Когда вы открываете страницу, карты и шрифты загружаются с серверов Яндекс Карт или OpenStreetMap и Google Fonts — они видят ваш IP-адрес и сведения о браузере.",
          "• Государственные органы — в случаях, предусмотренных законом, по официальному запросу или при обращении самого Оператора по факту мошенничества.",
          "Мы не продаём ваши данные и не передаём их третьим лицам в рекламных целях.",
        ] },
        { h: "5. Сроки хранения", p: [
          "• Аккаунт, объявления, чаты, избранное и поиски — пока существует аккаунт или пока вы их не удалите.",
          "• Журнал просмотров номеров — 1 год.",
          "• При удалении аккаунта профиль, объявления, фотографии, сообщения, избранное, поиски, журнал просмотров номеров и подключение Telegram удаляются сразу. Для предотвращения мошенничества и разрешения споров 1 год хранится только краткая запись — номер телефона, имя, даты регистрации и удаления, статус и причина блокировки, количество объявлений и жалоб, принятая редакция документов, — после чего она удаляется автоматически.",
          "• Пост в официальном Telegram-канале не удаляется автоматически при удалении объявления или аккаунта — напишите на {email}, и мы удалим его в течение 10 дней.",
          "• Номера, заблокированные за нарушения, — до снятия блокировки, но не более 3 лет (общий срок исковой давности по Гражданскому кодексу).",
          "• Записи о платных услугах (сумма, дата, платёжная система) хранятся без привязки к вашей личности в течение сроков, установленных бухгалтерским и налоговым законодательством.",
          "• Серверные журналы — в течение коротких сроков, установленных поставщиками услуг.",
        ] },
        { h: "6. Где хранятся данные", p: [
          "Серверы Платформы находятся за пределами Узбекистана — {servers}. Платформа не обрабатывает биометрические и генетические данные и не является оператором связи, то есть не собирает данные тех категорий, которые подлежат обязательному хранению на территории Узбекистана.",
          "Ваше согласие распространяется и на трансграничную передачу данных в эти страны. Мы пользуемся только крупными поставщиками с надлежащими условиями защиты данных.",
        ] },
        { h: "7. Ваши права", p: [
          "Вы вправе:",
          "• получать сведения о том, какие ваши данные обрабатываются, с какой целью и кому они передавались;",
          "• требовать исправления или дополнения неточных данных — выполняется в течение 3 дней;",
          "• в любое время изменять или удалять объявления, отключать уведомления Telegram в Настройках;",
          "• удалить аккаунт и данные — Настройки → «Удалить профиль» (сразу) или через {email};",
          "• отозвать согласие — удалив аккаунт или письменным обращением; после этого чат, размещение объявлений и уведомления будут недоступны;",
          "• обжаловать действия Оператора в уполномоченном государственном органе или в суде.",
          "Мы отвечаем на обращения в течение 10 дней. Для подтверждения личности мы можем запросить дополнительные сведения.",
        ] },
        { h: "8. Защита данных", p: [
          "• все соединения зашифрованы (HTTPS/TLS);",
          "• построчные права доступа в базе данных: каждый Пользователь видит и изменяет только свои данные;",
          "• вход в панель администратора защищён двухфакторной аутентификацией;",
          "• дневные лимиты и журнал против массового сбора номеров;",
          "• секретные ключи сервисов хранятся только на сервере.",
          "При обнаружении утечки данных мы без промедления уведомим затронутых Пользователей и, в случаях, предусмотренных законом, уполномоченный орган.",
        ] },
        { h: "9. Несовершеннолетние", p: [
          "Платформа не предназначена для лиц младше 18 лет. Если мы узнаем, что были внесены данные несовершеннолетнего, мы их удалим.",
        ] },
        { h: "10. Изменение Политики", p: [
          "Новая редакция публикуется на этой странице, а дата вступления в силу обновляется. О существенных изменениях мы сообщаем в приложении и при необходимости запрашиваем согласие повторно.",
        ] },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro: "This Policy explains what personal data the Uy24/7 platform collects, why it is used, who can see it, how long it is kept and how it is protected. It has been prepared in accordance with the Law of the Republic of Uzbekistan “On Personal Data” (No. ZRU-547 of 2 July 2019, as amended).",
      sections: [
        { h: "1. Who processes your data", p: [
          "The owner and operator of the personal data database is the Operator (details at the end of this page). Personal data requests: {email}.",
          "By ticking the consent box when you verify your phone number or post a listing, you agree to the processing of the data described in this Policy for the purposes described, including the cross-border transfer described in section 6. Your consent is recorded: we store which version you accepted and when.",
        ] },
        { h: "2. What data we collect", p: [
          "Data you provide:",
          "• phone number — for SMS verification and sign-in;",
          "• first and last name — when you post a listing; used only for verification and never shown on the listing;",
          "• listing details: title, description, price, city and district, the map point you set, photos, rooms and beds, booked dates;",
          "• chat messages, reports, saved listings and saved searches;",
          "• if you connect Telegram — your Telegram chat ID, notification settings and language.",
          "Data collected automatically:",
          "• an anonymous ID — assigned when you first open the app; your saved listings and searches are linked to it;",
          "• a security log: whose number you revealed and when, and your last activity time;",
          "• referral data, bonus credits and paid-service history (amount, payment system, status);",
          "• technical data: IP address, browser and device type, error logs;",
          "• browser storage (localStorage): your sign-in session, chosen language and read-message markers. We do not use advertising or tracking cookies.",
          "We do not ask for passport, biometric or genetic data, or for information about ethnicity, religion or health. Bank card details never reach us — they are processed by the payment systems. Please don't include such information in listings or chats.",
        ] },
        { h: "3. Purposes and legal grounds", p: [
          "• creating your account and signing you in;",
          "• posting, reviewing (moderating) and showing listings;",
          "• connecting Owners and Renters: chat and phone number reveal;",
          "• notifications you have turned on (Telegram, SMS);",
          "• preventing fraud, spam and violations, and identifying blocked users;",
          "• providing paid services, keeping records of them and meeting tax obligations;",
          "• handling requests and complaints;",
          "• complying with requests from public authorities where the law requires it;",
          "• aggregated, anonymised statistics to improve the service.",
          "Legal grounds: your consent, performance of our contract with you (the [Terms of Use](terms) and the [Public Offer](offer)), the Operator's legal obligations, and legitimate interests such as protecting Users from fraud.",
          "No decision with legal effects on you is made solely by automated means: rejecting listings and blocking accounts is decided by a human moderator. A new account opened with a blocked number is blocked automatically on the basis of that decision.",
        ] },
        { h: "4. Who can see your data", p: [
          "• Everyone: approved listings — title, description, price, city and district, map point and photos. Approved listings are also posted to our official Telegram channel (without name or number).",
          "• Users with a verified number: the Owner's phone number — only after tapping “Show phone number”, subject to a daily limit.",
          "• The person you are chatting with: your chat messages. A Renter's number is not shown to the Owner.",
          "• The Operator's moderators: listings, reports and, where necessary — after a report or on suspicion of fraud — the relevant conversations.",
          "• Service providers, only on our instructions and only for their task: Supabase (database, sign-in, photo storage), Vercel (hosting and server functions), Eskiz.uz (SMS), Telegram (bot and channel), Payme and Click (payments).",
          "• When you open a page, maps and fonts are loaded from Yandex Maps or OpenStreetMap and Google Fonts servers — they can see your IP address and browser details.",
          "• Public authorities — where the law requires it, upon an official request, or when the Operator itself reports a case of fraud.",
          "We do not sell your data or share it with third parties for advertising.",
        ] },
        { h: "5. How long we keep data", p: [
          "• Account, listings, chats, saved listings and searches — for as long as your account exists or until you delete them.",
          "• Phone-reveal log — 1 year.",
          "• When you delete your account, your profile, listings, photos, messages, saved listings, searches, phone-reveal log and Telegram connection are deleted immediately. To prevent fraud and resolve disputes, we keep only a short record for 1 year — phone number, name, sign-up and deletion dates, block status and reason, number of listings and reports, and the document version you accepted — after which it is deleted automatically.",
          "• A post in our official Telegram channel is not removed automatically when a listing or account is deleted — write to {email} and we will remove it within 10 days.",
          "• Numbers blocked for violations — until the block is lifted, but no longer than 3 years (the general limitation period under the Civil Code).",
          "• Paid-service records (amount, date, payment system) are kept without being linked to you for the periods required by accounting and tax law.",
          "• Server logs — for the short periods set by our service providers.",
        ] },
        { h: "6. Where your data is stored", p: [
          "The Platform's servers are located outside Uzbekistan — {servers}. The Platform does not process biometric or genetic data and is not a telecom operator, so it does not collect the categories of data that must be stored in Uzbekistan.",
          "Your consent also covers the cross-border transfer of your data to these countries. We use only major providers with appropriate data protection terms.",
        ] },
        { h: "7. Your rights", p: [
          "You have the right to:",
          "• know what data of yours is processed, why, and to whom it has been disclosed;",
          "• have inaccurate data corrected or completed — done within 3 days;",
          "• edit or delete your listings at any time and turn off Telegram notifications in Settings;",
          "• delete your account and data — Settings → “Delete profile” (immediately) or via {email};",
          "• withdraw your consent — by deleting your account or by written request; after that, chat, posting and notifications will no longer be available;",
          "• complain to the competent public authority or a court.",
          "We respond to requests within 10 days. We may ask for additional information to confirm your identity.",
        ] },
        { h: "8. How we protect data", p: [
          "• all connections are encrypted (HTTPS/TLS);",
          "• row-level access rules in the database: each User can see and change only their own data;",
          "• admin access is protected by two-factor authentication;",
          "• daily limits and a log against mass collection of phone numbers;",
          "• secret service keys are kept on the server only.",
          "If we detect a data breach, we will notify the affected Users without delay and, where the law requires it, the competent authority.",
        ] },
        { h: "9. Minors", p: [
          "The Platform is not intended for anyone under 18. If we learn that a minor's data has been submitted, we will delete it.",
        ] },
        { h: "10. Changes to this Policy", p: [
          "A new version is published on this page with an updated effective date. We announce significant changes in the app and ask for your consent again where required.",
        ] },
      ],
    },
  },

  // =====================================================================
  // OMMAVIY OFERTA
  // =====================================================================
  offer: {
    uz: {
      title: "Ommaviy oferta",
      intro: "Ushbu hujjat O'zbekiston Respublikasi Fuqarolik kodeksining 369-moddasiga muvofiq ommaviy oferta hisoblanadi: Operator uni qabul qilgan har qanday shaxsga Uy24/7 platformasining pullik xizmatlarini quyidagi shartlarda ko'rsatishni taklif qiladi.",
      sections: [
        { h: "1. Atamalar", p: [
          "• Operator — xizmatlarni ko'rsatuvchi yuridik shaxs; rekvizitlari sahifa oxirida.",
          "• Mijoz — Platformada e'lon joylagan va pullik xizmatdan foydalanayotgan, 18 yoshga to'lgan Foydalanuvchi.",
          "• Top e'lon — e'lonni tanlangan muddat davomida ro'yxat va qidiruv natijalarining yuqori qismida ko'rsatish hamda «TOP» belgisi bilan ajratish xizmati.",
          "• Bonus kredit — referal dastur bo'yicha beriladigan, bir marta 7 kunlik Top e'lon olish huquqi.",
          "Boshqa atamalar [Foydalanish shartlari](terms)dagi ma'noda qo'llaniladi.",
        ] },
        { h: "2. Ofertani qabul qilish (aksept)", p: [
          "Mijozning xizmat uchun to'lovni amalga oshirishi yoki bonus kreditdan foydalanishi ofertaning to'liq va so'zsiz aksepti hisoblanadi (Fuqarolik kodeksining 370-moddasi). Aksept qilingan paytdan boshlab Operator va Mijoz o'rtasida xizmat ko'rsatish shartnomasi yozma shaklda tuzilgan hisoblanadi.",
          "To'lovdan oldin Mijoz ushbu oferta, [Foydalanish shartlari](terms) va [Maxfiylik siyosati](privacy) bilan tanishib chiqishi lozim; ular ofertaning ajralmas qismi hisoblanadi.",
        ] },
        { h: "3. Xizmatlar va narxlar", p: [
          "Top e'lon 7 yoki 30 kunga ko'rsatiladi. Amaldagi narxlar to'lov oynasida to'lovdan oldin ko'rsatiladi; to'lov paytidagi narx qo'llaniladi. Narxlar O'zbekiston so'mida ko'rsatiladi va barcha soliqlarni o'z ichiga oladi.",
          "Top faqat moderatsiyadan o'tgan e'longa qo'llaniladi. Bir vaqtda bir nechta Top e'lon bo'lsa, ular Platforma belgilagan tartibda ko'rsatiladi, shu sababli aniq bir o'rin kafolatlanmaydi.",
          "Top ko'rishlar yoki qo'ng'iroqlar sonini, mulk ijaraga berilishini kafolatlamaydi — u faqat e'lonning ko'rinishini oshiradi.",
          "E'lon joylash, qidiruv, chat va bildirishnomalar bepul va ushbu oferta bilan tartibga solinmaydi.",
        ] },
        { h: "4. To'lov va faollashtirish", p: [
          "Mijoz e'lonni, muddatni va to'lov tizimini (Payme yoki Click) tanlab, to'lovni amalga oshiradi. Bank karta ma'lumotlariga to'lov tizimi ishlov beradi, ular Operatorga berilmaydi.",
          "To'lov tasdiqlangach xizmat 24 soat ichida faollashtiriladi; muddat faollashtirilgan paytdan hisoblanadi. E'lon allaqachon Topda bo'lsa, yangi muddat (bonus kredit bilan ham) joriy muddat oxiriga qo'shiladi. E'lon tahrirlangani sababli qayta tekshiruvda bo'lganda yoki «Band» deb belgilanganda muddat to'xtamaydi.",
          "To'lovni tasdiqlovchi elektron chek to'lov tizimi orqali beriladi. Top holati va qolgan muddat ilovaning «Profil» bo'limida ko'rsatiladi.",
        ] },
        { h: "5. Bonus kreditlar", p: [
          "Taklif havolangiz orqali kelgan yangi Foydalanuvchi telefon raqamini tasdiqlasa, sizga ham, unga ham bittadan bonus kredit beriladi.",
          "Bonus kreditning pul qiymati yo'q: u pulga almashtirilmaydi, qaytarilmaydi va boshqa shaxsga o'tkazilmaydi. Akkaunt o'chirilganda kreditlar bekor bo'ladi.",
          "Soxta yoki o'zingizga tegishli qo'shimcha akkauntlar orqali olingan kreditlar bekor qilinadi, akkaunt esa bloklanishi mumkin.",
          "Operator referal dastur shartlarini o'zgartirishi yoki uni to'xtatishi mumkin; bu halol yo'l bilan olingan kreditlarga ta'sir qilmaydi.",
        ] },
        { h: "6. Pulni qaytarish", p: [
          "• To'lov qilingan, lekin xizmat hali faollashtirilmagan bo'lsa — Mijoz buyurtmadan voz kechib, to'lovni to'liq qaytarib olishi mumkin.",
          "• Xizmat Operator aybi bilan ko'rsatilmasa yoki uzilish 24 soatdan oshsa — Mijozning tanloviga ko'ra muddat uzaytiriladi yoki tegishli summa qaytariladi.",
          "• Mijoz faollashgan xizmatdan o'z xohishi bilan voz kechsa — foydalanilmagan to'liq kunlarga mutanosib summa qaytariladi.",
          "• E'lon Mijoz [Foydalanish shartlari](terms)ni buzgani uchun bloklansa yoki o'chirilsa — xizmat ko'rsatilgan hisoblanadi va to'lov qaytarilmaydi.",
          "Pulni qaytarish uchun {email} manziliga to'lov sanasi, summasi, to'lov tizimidagi tranzaksiya raqami va e'lon nomini yozing. Murojaat 10 kun ichida ko'rib chiqiladi; mablag' to'lov qilingan usulda qaytariladi, kartaga tushish muddati bank qoidalariga bog'liq.",
        ] },
        { h: "7. Tomonlarning huquq va majburiyatlari", p: [
          "Operator: to'lov tasdiqlangach xizmatni o'z vaqtida faollashtiradi; xizmat holatini Mijozga ko'rsatadi; Mijoz ma'lumotlarini [Maxfiylik siyosati](privacy)ga muvofiq himoya qiladi; murojaatlarga 10 kun ichida javob beradi.",
          "Operator haqli: narxlarni o'zgartirishga (bu oldin to'langan xizmatlarga ta'sir qilmaydi); qoidabuzarlik aniqlanganda e'lonni to'xtatishga va Topni bekor qilishga.",
          "Mijoz: to'g'ri ma'lumot beradi, Foydalanish shartlariga rioya qiladi va faqat o'ziga tegishli to'lov vositasidan foydalanadi.",
        ] },
        { h: "8. Javobgarlik", p: [
          "Operator to'lov tizimlari, banklar, aloqa operatorlari va boshqa uchinchi shaxslar nosozliklari uchun javobgar emas, ammo muammoni hal qilishda Mijozga yordam beradi.",
          "Qonunchilikda boshqacha belgilanmagan bo'lsa, Operatorning javobgarligi Mijoz tegishli xizmat uchun to'lagan summa bilan cheklanadi; bu cheklov qasddan yoki qo'pol ehtiyotsizlik bilan yetkazilgan zararga taalluqli emas.",
          "Tomonlar yengib bo'lmaydigan kuch (fors-major) holatlari sababli majburiyatlarni bajarmaganlik uchun javobgar bo'lmaydi.",
        ] },
        { h: "9. Amal qilish muddati va o'zgartirish", p: [
          "Oferta shu sahifada e'lon qilingan kundan kuchga kiradi va Operator uni chaqirib olguncha amal qiladi. O'zgarishlar e'lon qilingan kundan kuchga kiradi va oldin to'langan xizmatlarga ta'sir qilmaydi.",
          "Shartnoma xizmat muddati tugashi yoki to'lov qaytarilishi bilan bajarilgan hisoblanadi.",
        ] },
        { h: "10. Nizolarni hal qilish", p: [
          "Nizolar muzokara yo'li bilan hal qilinadi: {email} manziliga yozma talabnoma (pretenziya) yuboring, javob 10 kun ichida beriladi. Kelishuvga erishilmasa, nizo O'zbekiston Respublikasi qonunchiligiga muvofiq vakolatli sudda ko'rib chiqiladi.",
        ] },
      ],
    },
    ru: {
      title: "Публичная оферта",
      intro: "Настоящий документ в соответствии со статьёй 369 Гражданского кодекса Республики Узбекистан является публичной офертой: Оператор предлагает любому лицу, принявшему её условия, платные услуги платформы Uy24/7 на изложенных ниже условиях.",
      sections: [
        { h: "1. Термины", p: [
          "• Оператор — юридическое лицо, оказывающее услуги; реквизиты указаны в конце страницы.",
          "• Клиент — Пользователь, достигший 18 лет, разместивший объявление на Платформе и пользующийся платной услугой.",
          "• Топ-объявление — услуга показа объявления в верхней части списка и результатов поиска в течение выбранного срока с отметкой «TOP».",
          "• Бонусный кредит — право на одно 7-дневное Топ-объявление, начисляемое по реферальной программе.",
          "Прочие термины используются в значении, указанном в [Правилах пользования](terms).",
        ] },
        { h: "2. Акцепт оферты", p: [
          "Полным и безоговорочным акцептом оферты является оплата Клиентом услуги или использование бонусного кредита (статья 370 Гражданского кодекса). С момента акцепта договор оказания услуг между Оператором и Клиентом считается заключённым в письменной форме.",
          "До оплаты Клиент обязан ознакомиться с настоящей офертой, [Правилами пользования](terms) и [Политикой конфиденциальности](privacy), которые являются её неотъемлемой частью.",
        ] },
        { h: "3. Услуги и цены", p: [
          "Топ-объявление предоставляется на 7 или 30 дней. Действующие цены указываются в окне оплаты до оплаты; применяется цена на момент оплаты. Цены указаны в узбекских сумах и включают все налоги.",
          "Топ применяется только к объявлению, прошедшему модерацию. Если одновременно действуют несколько Топ-объявлений, они показываются в порядке, определяемом Платформой, поэтому конкретная позиция не гарантируется.",
          "Топ не гарантирует количество просмотров или звонков и сдачу объекта — он лишь повышает заметность объявления.",
          "Размещение объявлений, поиск, чат и уведомления бесплатны и настоящей офертой не регулируются.",
        ] },
        { h: "4. Оплата и активация", p: [
          "Клиент выбирает объявление, срок и платёжную систему (Payme или Click) и производит оплату. Данные банковской карты обрабатываются платёжной системой и Оператору не передаются.",
          "После подтверждения оплаты услуга активируется в течение 24 часов; срок отсчитывается с момента активации. Если объявление уже находится в Топе, новый срок (в том числе по бонусному кредиту) добавляется к окончанию текущего. Пока объявление проходит повторную проверку после редактирования или отмечено «Сдано», срок не приостанавливается.",
          "Электронный чек, подтверждающий оплату, выдаётся через платёжную систему. Статус Топа и оставшийся срок отображаются в разделе «Профиль» приложения.",
        ] },
        { h: "5. Бонусные кредиты", p: [
          "Если новый Пользователь, пришедший по вашей пригласительной ссылке, подтвердит номер телефона, вы оба получите по одному бонусному кредиту.",
          "Бонусный кредит не имеет денежной стоимости: он не обменивается на деньги, не возвращается и не передаётся другим лицам. При удалении аккаунта кредиты аннулируются.",
          "Кредиты, полученные через фиктивные или дополнительные собственные аккаунты, аннулируются, а аккаунт может быть заблокирован.",
          "Оператор может изменить условия реферальной программы или прекратить её; это не затрагивает кредиты, полученные честным путём.",
        ] },
        { h: "6. Возврат средств", p: [
          "• Если оплата прошла, но услуга ещё не активирована, Клиент может отказаться от заказа и получить полный возврат.",
          "• Если услуга не оказана по вине Оператора или перерыв в её оказании превысил 24 часа, по выбору Клиента срок продлевается или возвращается соответствующая сумма.",
          "• Если Клиент по своему желанию отказывается от уже активированной услуги, возвращается сумма, пропорциональная неиспользованным полным дням.",
          "• Если объявление заблокировано или удалено из-за нарушения Клиентом [Правил пользования](terms), услуга считается оказанной и оплата не возвращается.",
          "Для возврата напишите на {email}, указав дату и сумму платежа, номер транзакции в платёжной системе и название объявления. Обращение рассматривается в течение 10 дней; средства возвращаются тем же способом, которым была произведена оплата, а срок зачисления зависит от правил банка.",
        ] },
        { h: "7. Права и обязанности сторон", p: [
          "Оператор: своевременно активирует услугу после подтверждения оплаты; показывает Клиенту статус услуги; защищает данные Клиента в соответствии с [Политикой конфиденциальности](privacy); отвечает на обращения в течение 10 дней.",
          "Оператор вправе: изменять цены (это не затрагивает уже оплаченные услуги); приостанавливать объявление и отменять Топ при выявлении нарушений.",
          "Клиент: предоставляет достоверные сведения, соблюдает Правила пользования и использует только собственные платёжные средства.",
        ] },
        { h: "8. Ответственность", p: [
          "Оператор не отвечает за сбои платёжных систем, банков, операторов связи и иных третьих лиц, но помогает Клиенту решить проблему.",
          "Если иное не установлено законодательством, ответственность Оператора ограничена суммой, уплаченной Клиентом за соответствующую услугу; это ограничение не распространяется на вред, причинённый умышленно или по грубой неосторожности.",
          "Стороны освобождаются от ответственности за неисполнение обязательств вследствие непреодолимой силы (форс-мажора).",
        ] },
        { h: "9. Срок действия и изменение оферты", p: [
          "Оферта вступает в силу со дня публикации на этой странице и действует до её отзыва Оператором. Изменения вступают в силу со дня публикации и не затрагивают ранее оплаченные услуги.",
          "Договор считается исполненным по окончании срока услуги или после возврата оплаты.",
        ] },
        { h: "10. Разрешение споров", p: [
          "Споры решаются путём переговоров: направьте письменную претензию на {email}, ответ будет дан в течение 10 дней. Если договориться не удалось, спор рассматривается в компетентном суде в соответствии с законодательством Республики Узбекистан.",
        ] },
      ],
    },
    en: {
      title: "Public Offer",
      intro: "Pursuant to Article 369 of the Civil Code of the Republic of Uzbekistan, this document is a public offer: the Operator offers the paid services of the Uy24/7 platform, on the terms below, to anyone who accepts them.",
      sections: [
        { h: "1. Definitions", p: [
          "• Operator — the legal entity providing the services; its details are at the end of this page.",
          "• Client — a User aged 18 or over who has posted a listing on the Platform and uses a paid service.",
          "• Boost — a service that shows a listing at the top of the list and search results for the chosen period, marked “TOP”.",
          "• Bonus credit — the right to one 7-day Boost, granted under the referral programme.",
          "Other terms have the meaning given in the [Terms of Use](terms).",
        ] },
        { h: "2. Acceptance", p: [
          "Payment for a service, or use of a bonus credit, by the Client is full and unconditional acceptance of this offer (Article 370 of the Civil Code). From the moment of acceptance, a service contract between the Operator and the Client is deemed concluded in writing.",
          "Before paying, the Client must read this offer, the [Terms of Use](terms) and the [Privacy Policy](privacy), which form an integral part of it.",
        ] },
        { h: "3. Services and prices", p: [
          "A Boost is available for 7 or 30 days. Current prices are shown in the payment window before you pay; the price at the time of payment applies. Prices are in Uzbek soums and include all taxes.",
          "A Boost applies only to a listing that has passed moderation. When several Boosts are active at once, they are shown in an order set by the Platform, so no specific position is guaranteed.",
          "A Boost does not guarantee a number of views or calls, or that the property will be rented — it only increases the listing's visibility.",
          "Posting listings, searching, chat and notifications are free and are not governed by this offer.",
        ] },
        { h: "4. Payment and activation", p: [
          "The Client chooses the listing, the period and the payment system (Payme or Click) and makes the payment. Bank card details are processed by the payment system and are not passed to the Operator.",
          "Once payment is confirmed, the service is activated within 24 hours; the period runs from activation. If the listing is already boosted, the new period (including one from a bonus credit) is added to the end of the current one. The period keeps running while the listing is being re-reviewed after an edit or is marked “Rented out”.",
          "An electronic receipt confirming the payment is issued through the payment system. The Boost status and remaining time are shown in the app's “Profile” section.",
        ] },
        { h: "5. Bonus credits", p: [
          "If a new User who joined via your invite link verifies their phone number, you each receive one bonus credit.",
          "Bonus credits have no monetary value: they cannot be exchanged for money, refunded or transferred to anyone else. Credits are cancelled when the account is deleted.",
          "Credits obtained through fake or additional accounts of your own are cancelled, and the account may be blocked.",
          "The Operator may change or end the referral programme; this does not affect credits already obtained fairly.",
        ] },
        { h: "6. Refunds", p: [
          "• If you have paid but the service has not been activated yet, you may cancel the order and get a full refund.",
          "• If the service is not provided through the Operator's fault, or an outage exceeds 24 hours, the period is extended or the corresponding amount refunded, at the Client's choice.",
          "• If the Client voluntarily cancels a service that is already active, an amount proportional to the unused full days is refunded.",
          "• If the listing is blocked or removed because the Client broke the [Terms of Use](terms), the service is deemed provided and no refund is due.",
          "To request a refund, write to {email} with the payment date, amount, the payment system's transaction number and the listing title. Requests are reviewed within 10 days; the money is returned by the original payment method, and the time it takes to arrive depends on your bank.",
        ] },
        { h: "7. Rights and obligations", p: [
          "The Operator activates the service promptly once payment is confirmed, shows the Client the service status, protects the Client's data under the [Privacy Policy](privacy) and responds to requests within 10 days.",
          "The Operator may change prices (this does not affect services already paid for) and may suspend a listing and cancel its Boost if a violation is found.",
          "The Client provides accurate information, follows the Terms of Use and uses only their own means of payment.",
        ] },
        { h: "8. Liability", p: [
          "The Operator is not liable for failures of payment systems, banks, telecom operators or other third parties, but will help the Client resolve the issue.",
          "Unless the law provides otherwise, the Operator's liability is limited to the amount the Client paid for the relevant service; this limit does not apply to harm caused intentionally or through gross negligence.",
          "Neither party is liable for failure to perform its obligations due to force majeure.",
        ] },
        { h: "9. Term and changes", p: [
          "This offer takes effect on the day it is published on this page and remains valid until withdrawn by the Operator. Changes take effect on publication and do not affect services already paid for.",
          "The contract is fulfilled when the service period ends or the payment is refunded.",
        ] },
        { h: "10. Disputes", p: [
          "Disputes are resolved through negotiation: send a written claim to {email} and we will reply within 10 days. If no agreement is reached, the dispute is heard by a competent court under the laws of the Republic of Uzbekistan.",
        ] },
      ],
    },
  },
};
