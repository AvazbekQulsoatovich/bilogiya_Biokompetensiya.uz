# -*- coding: utf-8 -*-
"""Mavzularga mos test savollari va mavzu matnlari.
Apostroflar oddiy ' bilan yozilgan; fix_data.py oxirida ularni oʻ, gʻ, ʼ ga aylantiradi."""

def Q(q, ok, *wrong):
    assert len(wrong) == 3, q
    return (q, ok, list(wrong))

BANK = []  # (grade, title, markdown, [questions])

# ───────────────────────────── 5-SINF ─────────────────────────────
BANK.append((5, "Tirik tabiat va biologiya fani", """## Biologiya nimani o'rganadi?

**Biologiya** — tirik organizmlarni, ularning tuzilishi, hayot faoliyati va yashash muhitini o'rganuvchi fan. Uning yo'nalishlari: **botanika** (o'simliklar), **zoologiya** (hayvonlar), **mikrobiologiya** (mikroorganizmlar).

## Tirik organizmlarning umumiy xususiyatlari

- oziqlanadi va nafas oladi;
- o'sadi va rivojlanadi;
- ko'payadi;
- tashqi ta'sirga javob beradi;
- hujayralardan tuzilgan.

## O'rganish usullari

Olimlar **kuzatish**, **tajriba** va **o'lchash** usullaridan foydalanadi. Mikroskop kichik obyektlarni kattalashtiradi, termometr haroratni, tarozi massani, chizg'ich uzunlikni o'lchaydi.""", [
    Q("Biologiya qanday fan?", "Tirik organizmlarni o'rganuvchi fan", "Yer qobig'ini o'rganuvchi fan", "Yulduzlarni o'rganuvchi fan", "Moddalar tarkibini o'rganuvchi fan"),
    Q("Quyidagilardan qaysi biri barcha tirik organizmlarga xos xususiyat?", "Oziqlanish, nafas olish, o'sish va ko'payish", "Faqat harakatlanish", "Faqat tovush chiqarish", "Faqat rangini o'zgartirish"),
    Q("Botanika nimani o'rganadi?", "O'simliklarni", "Hayvonlarni", "Zamburug'larni", "Odam tanasini"),
    Q("Zoologiya nimani o'rganadi?", "Hayvonlarni", "O'simliklarni", "Tuproqni", "Iqlimni"),
    Q("Quyidagilardan qaysi biri jonsiz tabiat jismi?", "Tosh", "Daraxt", "Qurbaqa", "Zamburug'"),
    Q("Barcha tirik organizmlarning tuzilish birligi nima?", "Hujayra", "Atom", "Molekula", "Tosh"),
    Q("Kichik obyektlarni kattalashtirib ko'rsatadigan asbob qaysi?", "Mikroskop", "Termometr", "Tarozi", "Chizg'ich"),
    Q("Haroratni o'lchaydigan asbob qaysi?", "Termometr", "Mikroskop", "Tarozi", "Lupa"),
    Q("Jism massasini o'lchaydigan asbob qaysi?", "Tarozi", "Termometr", "Chizg'ich", "Mikroskop"),
    Q("Tabiatni kuzatish va tajriba o'tkazish nima uchun kerak?", "Qonuniyatlarni aniqlash va dalillarni to'plash uchun", "Faqat vaqtni o'tkazish uchun", "Rasm chizish uchun", "Hayvonlarni ovlash uchun"),
]))

BANK.append((5, "Hujayra tuzilishi", """## Hujayra — hayotning birligi

Barcha tirik organizmlar **hujayralardan** tuzilgan. Hujayrani oddiy ko'z bilan ko'rib bo'lmaydi, uni **mikroskop** orqali kuzatamiz.

## Asosiy qismlar

- **Hujayra membranasi** — moddalarni tanlab o'tkazadigan yupqa parda.
- **Sitoplazma** — hujayra ichidagi yarim suyuq muhit.
- **Yadro** — hujayrani boshqaradi, irsiy axborotni saqlaydi.
- **Mitoxondriya** — energiya hosil qiladi.

## Faqat o'simlik hujayrasiga xos qismlar

- **Hujayra devori** (sellyulozadan);
- **Xloroplastlar** — tarkibidagi xlorofill fotosintezni ta'minlaydi;
- yirik **vakuola** — hujayra shirasi saqlanadi.

Tuzilishi va vazifasi bir xil hujayralar to'plami **to'qima** deyiladi.""", [
    Q("Quyidagilardan qaysi biri faqat o'simlik hujayrasiga xos?", "Xloroplast", "Yadro", "Sitoplazma", "Hujayra membranasi"),
    Q("Hujayra faoliyatini boshqaradigan va irsiy axborotni saqlaydigan qism qaysi?", "Yadro", "Vakuola", "Hujayra devori", "Sitoplazma"),
    Q("Fotosintez hujayraning qaysi organoidida boradi?", "Xloroplastda", "Mitoxondriyada", "Yadroda", "Vakuolada"),
    Q("Hujayra uchun energiya hosil qiladigan organoid qaysi?", "Mitoxondriya", "Xloroplast", "Hujayra devori", "Vakuola"),
    Q("Hujayra shirasi saqlanadigan bo'shliq nima deyiladi?", "Vakuola", "Yadrocha", "Membrana", "Plastida"),
    Q("Hujayrani tashqi muhitdan ajratib, moddalarni tanlab o'tkazadigan parda nima?", "Hujayra membranasi", "Hujayra devori", "Yadro", "Sitoplazma"),
    Q("O'simlik hujayrasi devori asosan nimadan iborat?", "Sellyuloza", "Oqsil", "Yog'", "Xlorofill"),
    Q("Xloroplastga yashil rang beradigan modda qaysi?", "Xlorofill", "Karotin", "Gemoglobin", "Sellyuloza"),
    Q("Quyidagilardan qaysi biri bir hujayrali organizm?", "Amyoba", "Archa", "Qurbaqa", "Qo'ng'iz"),
    Q("Tuzilishi va vazifasi bir xil hujayralar to'plami nima deb ataladi?", "To'qima", "Organoid", "Organizm", "Tizim"),
]))

BANK.append((5, "O'simlik organlari: ildiz, poya, barg", """## Vegetativ organlar

**Ildiz**, **poya** va **barg** o'simlikning o'sishi va oziqlanishini ta'minlaydi, shuning uchun ular *vegetativ organlar* deyiladi.

- **Ildiz** o'simlikni tuproqqa mahkamlaydi, suv va mineral moddalarni shimadi. Suvni asosan **ildiz tukchalari** so'radi.
- **Poya** tayanch bo'lib xizmat qiladi va moddalarni tashiydi: suv va mineral moddalar **ksilema** bo'ylab ko'tariladi.
- **Barg** fotosintez va gaz almashinuvini bajaradi; suv bug'lanishi **og'izchalar** orqali o'tadi (transpiratsiya).

## Generativ organlar

**Gul**, **meva** va **urug'** o'simlikning ko'payishini ta'minlaydi.""", [
    Q("Ildizning asosiy vazifasi nima?", "O'simlikni tuproqqa mahkamlash, suv va mineral moddalarni shimish", "Fotosintez qilish", "Urug' hosil qilish", "Changlanishni ta'minlash"),
    Q("Fotosintez asosan qaysi organda boradi?", "Bargda", "Ildizda", "Urug'da", "Po'stloqda"),
    Q("Poyaning vazifasi nima?", "Tayanch bo'lish va moddalarni tashish", "Suvni bug'latish", "Urug' hosil qilish", "Faqat oziq zaxirasini saqlash"),
    Q("Bargda gaz almashinuvi qaysi tuzilma orqali boradi?", "Og'izchalar", "Ildiz tukchalari", "Gultojibarg", "Tuganak"),
    Q("Ildizda suvni asosan qaysi qismi so'radi?", "Ildiz tukchalari", "Ildiz qini", "Ildiz po'stlog'i", "O'sish konusi"),
    Q("Vegetativ organlarga qaysilar kiradi?", "Ildiz, poya, barg", "Gul, meva, urug'", "Gul, barg, meva", "Urug', ildiz, gul"),
    Q("Generativ organlarga qaysilar kiradi?", "Gul, meva, urug'", "Ildiz, poya", "Faqat barg", "Poya va barg"),
    Q("Suv va mineral moddalar poyada qaysi naylar bo'ylab ko'tariladi?", "Ksilema (yog'och naylari)", "Floema (elak naylari)", "Og'izchalar", "Kutikula"),
    Q("Kartoshka tuganagi o'simlikning qaysi organi o'zgargan shakli?", "Poya", "Ildiz", "Barg", "Gul"),
    Q("Barg og'izchalari orqali suv bug'ining chiqishi nima deyiladi?", "Transpiratsiya", "Fotosintez", "Changlanish", "Urug'lanish"),
]))

BANK.append((5, "Fotosintez va nafas olish", """## Fotosintez

**Fotosintez** — yashil o'simliklarning yorug'lik energiyasi yordamida karbonat angidrid va suvdan organik modda (glyukoza) hosil qilishi. Jarayon xloroplastlarda, **xlorofill** ishtirokida boradi va natijada **kislorod** ajraladi.

> karbonat angidrid + suv + yorug'lik → glyukoza + kislorod

## Nafas olish

O'simliklar ham kechayu kunduz nafas oladi: kislorodni yutib, organik moddalarni parchalaydi va energiya oladi, karbonat angidrid ajratadi.

## Ahamiyati

Fotosintez tufayli atmosferada kislorod to'planadi va barcha tirik mavjudotlar oziq bilan ta'minlanadi.""", [
    Q("Fotosintez uchun nima kerak?", "Yorug'lik, suv va karbonat angidrid", "Faqat suv", "Kislorod va azot", "Tuz va yog'"),
    Q("Fotosintez natijasida qaysi gaz ajraladi?", "Kislorod", "Karbonat angidrid", "Azot", "Vodorod"),
    Q("Fotosintez natijasida qanday organik modda hosil bo'ladi?", "Glyukoza (qand)", "Oqsil", "Tuz", "Mum"),
    Q("Fotosintezda yorug'likni yutadigan pigment qaysi?", "Xlorofill", "Gemoglobin", "Melanin", "Insulin"),
    Q("O'simliklar nafas olishda qaysi gazni yutadi?", "Kislorod", "Karbonat angidrid", "Azot", "Geliy"),
    Q("O'simliklar qachon nafas oladi?", "Kechayu kunduz", "Faqat kechasi", "Faqat kunduzi", "Faqat yozda"),
    Q("Yashil o'simliklar organik moddalarni qayerdan oladi?", "Fotosintez orqali o'zlari hosil qiladi", "Tuproqdan tayyor holda so'radi", "Hayvonlardan oladi", "Havodan tayyor holda yutadi"),
    Q("Yorug'lik kuchaysa (ma'lum chegaragacha) fotosintez tezligi qanday o'zgaradi?", "Ortadi", "Kamayadi", "O'zgarmaydi", "To'xtaydi"),
    Q("Atmosferada kislorod to'planishiga asosan nima sabab bo'lgan?", "Yashil o'simliklar va suv o'tlarining fotosintezi", "Vulqonlar otilishi", "Yomg'ir yog'ishi", "Shamol esishi"),
    Q("Elodeya shoxchasidan ajralayotgan pufakchalar qaysi gaz?", "Kislorod", "Karbonat angidrid", "Azot", "Suv bug'i"),
]))

BANK.append((5, "Gul, meva va urug'", """## Gulning tuzilishi

Gulning qismlari: **gulkosabarg** (kurtakni himoya qiladi), **gultojibarg** (hasharotlarni jalb qiladi), **changchi** (otaliq organ) va **urug'chi** (onaliq organ).

- Changchi: chang qopchasi va ipcha.
- Urug'chi: tumshuqcha, ustuncha, tuguncha.

## Changlanish va urug'lanish

**Changlanish** — chang donachasining changchidan urug'chi tumshuqchasiga tushishi. Chang hasharotlar yoki shamol orqali tarqaladi. **Urug'lanishdan** so'ng urug'kurtakdan **urug'**, tugunchadan **meva** rivojlanadi.

Yopiq urug'li o'simliklarning urug'i meva ichida, ochiq urug'lilarniki (masalan, archa) qubbalarda ochiq holda yetiladi.""", [
    Q("Gulning otaliq jinsiy organi qaysi?", "Changchi", "Urug'chi", "Gulkosabarg", "Gultojibarg"),
    Q("Gulning onaliq jinsiy organi qaysi?", "Urug'chi", "Changchi", "Gulkosabarg", "Gul o'rni"),
    Q("Changlanish nima?", "Chang donachasining changchidan urug'chi tumshuqchasiga tushishi", "Urug'ning unib chiqishi", "Mevaning pishishi", "Bargning to'kilishi"),
    Q("Urug'lanishdan so'ng urug'chi tugunchasidan nima rivojlanadi?", "Meva", "Gultojibarg", "Ildiz", "Changchi"),
    Q("Urug'kurtakdan nima rivojlanadi?", "Urug'", "Meva", "Barg", "Gulkosabarg"),
    Q("Hasharotlarni o'ziga jalb qiladigan gul qismi qaysi?", "Gultojibarg", "Gulkosabarg", "Tuguncha", "Ustuncha"),
    Q("Gulni kurtak holatida tashqaridan himoya qiladigan qism qaysi?", "Gulkosabarg", "Changchi", "Urug'chi", "Tumshuqcha"),
    Q("Quyidagilardan qaysi biri shamol yordamida changlanadi?", "Makkajo'xori", "Olma", "Nok", "Behi"),
    Q("Yopiq urug'li o'simliklarning urug'i qayerda yetiladi?", "Meva ichida", "Qubbada ochiq holda", "Ildizda", "Bargda"),
    Q("Quyidagilardan qaysi biri ochiq urug'li o'simlik?", "Archa", "Olma", "Bug'doy", "Gilos"),
]))

BANK.append((5, "Urug'ning unib chiqishi", """## Urug'ning tuzilishi

Urug' **po'st**, **murtak** va oziq moddalar zaxirasidan iborat. Murtak ildizcha, poyacha, kurtakcha va urug' pallalaridan tuzilgan. Loviya — ikki pallali o'simlik.

## Unish uchun zarur sharoit

Urug' unishi uchun **suv**, **havo** (kislorod) va **yetarli issiqlik** kerak. Yorug'lik unish uchun shart emas, ko'pchilik urug' qorong'ida ham unadi; yorug'lik keyinchalik, fotosintez uchun zarur.

## Nazorat tajribasi

Omillarning ta'sirini aniqlash uchun bir nechta idish olinadi: ularda faqat **bitta** sharoit o'zgartiriladi, qolganlari bir xil saqlanadi. Birinchi bo'lib **ildizcha** chiqadi.""", [
    Q("Urug'ning unib chiqishi uchun nima zarur?", "Suv, havo va yetarli issiqlik", "Faqat yorug'lik", "Faqat tuproq", "Faqat past harorat"),
    Q("Urug' unishi uchun yorug'lik shartmi?", "Yo'q, ko'pchilik urug' qorong'ida ham unadi", "Ha, yorug'liksiz hech qanday urug' unmaydi", "Faqat quyosh nuri kerak", "Faqat sun'iy chiroq kerak"),
    Q("Urug' unganda birinchi bo'lib qaysi qism chiqadi?", "Ildizcha", "Barg", "Gul", "Meva"),
    Q("Quruq urug' nima uchun unmaydi?", "Suv yetishmaydi", "Havo ortiqcha", "Yorug'lik kam", "Tuproq yo'q"),
    Q("Suvga to'liq botirilgan urug' nima uchun unmaydi?", "Havo (kislorod) yetishmaydi", "Suv ortiqcha issiq", "Yorug'lik tushmaydi", "Tuz yetishmaydi"),
    Q("Past haroratda urug' qanday unadi?", "Juda sekin yoki umuman unmaydi", "Tezroq unadi", "Haroratga bog'liq emas", "Faqat qorong'ida unadi"),
    Q("Nazorat tajribasida nima qilinadi?", "Faqat bitta omil o'zgartiriladi, qolganlari bir xil saqlanadi", "Barcha omillar birdaniga o'zgartiriladi", "Hech narsa o'zgartirilmaydi", "Har gal tasodifiy sharoit tanlanadi"),
    Q("Urug' pallalarining vazifasi nima?", "Murtakni oziq moddalar bilan ta'minlash", "Fotosintez qilish", "Changlanishni ta'minlash", "Suvni bug'latish"),
    Q("Loviya urug'i nechta pallaga ega?", "Ikkita", "Bitta", "Uchta", "To'rtta"),
    Q("Qorong'ida o'sgan niholning poyasi qanday bo'ladi?", "Rangsiz (oqargan) va cho'zilgan", "To'q yashil va kalta", "Qizil va yo'g'on", "Hech o'smaydi"),
]))

BANK.append((5, "Suv va uning xossalari", """## Suvning holatlari

Suv uch holatda uchraydi: **qattiq** (muz), **suyuq** (suv) va **gaz** (bug'). Muz **0 °C** da eriydi, suv normal atmosfera bosimida **100 °C** da qaynaydi. Qaynash vaqtida isitish davom etsa ham harorat o'zgarmaydi: issiqlik suvni bug'ga aylantirishga sarflanadi.

## Suvning aylanishi

Suv bug'lanadi, bulutlarga aylanadi (**kondensatsiya**), yog'in bo'lib yerga qaytadi. Bu tabiatda suvning doimiy aylanishi.

## Osmos

Suv yarim o'tkazuvchan parda orqali konsentratsiyasi past eritmadan konsentratsiyasi yuqori eritma tomonga o'tadi. Toza suvda hujayra suv shimib taranglashadi (**turgor**), konsentrlangan tuz eritmasida esa suv yo'qotib, **plazmoliz** yuz beradi.""", [
    Q("Suv normal atmosfera bosimida qanday haroratda qaynaydi?", "100 °C", "0 °C", "50 °C", "90 °C"),
    Q("Muz qanday haroratda eriydi?", "0 °C", "10 °C", "-10 °C", "100 °C"),
    Q("Suv qanday holatlarda bo'ladi?", "Qattiq, suyuq va gaz", "Faqat suyuq", "Faqat muz", "Faqat bug'"),
    Q("Suv qaynayotgan paytda uning harorati qanday o'zgaradi?", "Deyarli o'zgarmaydi", "Doimiy ko'tariladi", "Doimiy pasayadi", "Avval pasayib, keyin ko'tariladi"),
    Q("Suv bug'ining sovib, suv tomchilariga aylanishi nima deyiladi?", "Kondensatsiya", "Bug'lanish", "Erish", "Qotish"),
    Q("Suvning tabiatda aylanishi nima?", "Suvning doimiy bug'lanib, yog'inga aylanib qaytishi", "Suvning faqat dengizga oqishi", "Suvning yo'qolib ketishi", "Suvning muzga aylanishi"),
    Q("Osmosda suv qaysi tomonga o'tadi?", "Konsentratsiyasi yuqori eritma tomonga", "Konsentratsiyasi past eritma tomonga", "Hech qayoqqa o'tmaydi", "Faqat yuqoriga"),
    Q("Konsentrlangan tuz eritmasiga solingan kartoshka massasi qanday o'zgaradi?", "Kamayadi", "Ortadi", "O'zgarmaydi", "Ikki barobar oshadi"),
    Q("Distillangan suvga solingan o'simlik hujayrasida nima yuz beradi?", "Suv shimib taranglashadi (turgor)", "Plazmoliz", "Fotosintez to'xtaydi", "Hujayra yo'qoladi"),
    Q("Yer yuzining eng katta qismini nima qoplaydi?", "Suv", "Quruqlik", "Muz qatlami", "O'rmon"),
]))

BANK.append((5, "Ekotizim va oziq zanjiri", """## Ekotizim

**Ekotizim** — tirik organizmlar va ularning jonsiz muhiti (suv, havo, tuproq) birligi.

## Oziq zanjiri

Oziq zanjiri **ishlab chiqaruvchidan** boshlanadi — bu fotosintez qiluvchi yashil o'simliklar. Ularni **o'txo'r** hayvonlar (1-tartibli iste'molchilar) yeydi, o'txo'rlarni esa **yirtqichlar** (2- va 3-tartibli iste'molchilar). Qoldiqlarni **parchalovchilar** (bakteriyalar, zamburug'lar) minerallashtiradi.

> O'simlik → chigirtka → qurbaqa → ilon → burgut

Strelka energiya va moddalar yo'nalishini bildiradi: yeyilgandan yeguvchiga. Har bir keyingi bo'g'inga energiyaning taxminan **10 %** i o'tadi, shuning uchun zanjir uzun bo'lmaydi.""", [
    Q("Oziq zanjiri qaysi organizmdan boshlanadi?", "Yashil o'simlikdan", "Yirtqichdan", "Parchalovchidan", "O'txo'rdan"),
    Q("Ishlab chiqaruvchilar kimlar?", "Fotosintez qiluvchi yashil o'simliklar", "Yirtqich hayvonlar", "Bakteriyalar", "O'txo'r hayvonlar"),
    Q("O'txo'r hayvonlar oziq zanjirida qaysi bo'g'in hisoblanadi?", "1-tartibli iste'molchi", "Ishlab chiqaruvchi", "Parchalovchi", "3-tartibli iste'molchi"),
    Q("Quyidagilardan qaysi biri to'g'ri tuzilgan oziq zanjiri?", "O'simlik → chigirtka → qurbaqa → ilon", "Ilon → qurbaqa → chigirtka → o'simlik", "Qurbaqa → o'simlik → ilon", "Chigirtka → ilon → o'simlik"),
    Q("Oziq zanjiridagi strelka nimani bildiradi?", "Yeyilgan organizmdan yeguvchiga energiya va moddalar o'tishini", "Kim kimdan qochishini", "Organizmning yoshini", "Yashash joyini"),
    Q("Parchalovchilarga qaysilar kiradi?", "Bakteriyalar va zamburug'lar", "Burgut va bo'ri", "Quyon va sichqon", "Archa va qarag'ay"),
    Q("Har bir keyingi oziq bo'g'iniga energiyaning taxminan qancha qismi o'tadi?", "Taxminan 10 %", "Taxminan 90 %", "Hammasi (100 %)", "Hech narsa o'tmaydi"),
    Q("Ekotizim nima?", "Tirik organizmlar va ularning jonsiz muhiti birligi", "Faqat hayvonlar to'plami", "Faqat o'simliklar to'plami", "Faqat suv havzasi"),
    Q("Quyidagilardan qaysi biri yirtqich?", "Burgut", "Quyon", "Sigir", "Chigirtka"),
    Q("Qizil kitob nima?", "Yo'qolib borayotgan o'simlik va hayvon turlari ro'yxati", "Eng mashhur o'simliklar ro'yxati", "Darslik nomi", "Qimmatbaho toshlar ro'yxati"),
]))

# ───────────────────────────── 6-SINF ─────────────────────────────
BANK.append((6, "Hayvonlar olamining tasnifi", """## Hayvonlarning katta guruhlari

Hayvonlar **umurtqasiz** va **umurtqali** guruhlarga bo'linadi. Umurtqalilar xordalilar tipiga kiradi: ularda hayot davomida yoki rivojlanishning ma'lum bosqichida **xorda** (o'q skelet) bo'ladi.

## Asosiy tiplar va sinflar

- **Ichakbo'shliqlilar** — gidra, meduza;
- **Chuvalchanglar** — yassi, to'garak, halqali;
- **Mollyuskalar** — yumshoq tanali, ko'pincha chig'anoqli;
- **Bo'g'imoyoqlilar** — hasharotlar, o'rgimchaksimonlar, qisqichbaqasimonlar;
- **Xordalilar** — baliqlar, amfibiyalar, sudralib yuruvchilar, qushlar, sutemizuvchilar.

Hayvonlar o'simliklardan farqli ravishda tayyor organik moddalar bilan oziqlanadi.""", [
    Q("Hayvonlar qaysi ikki katta guruhga bo'linadi?", "Umurtqasiz va umurtqali", "O'txo'r va yirtqich", "Quruqlik va suv", "Yirik va mayda"),
    Q("Umurtqali hayvonlar sinflarini ko'rsating.", "Baliqlar, amfibiyalar, sudralib yuruvchilar, qushlar, sutemizuvchilar", "Hasharotlar, mollyuskalar, chuvalchanglar", "Faqat qushlar va baliqlar", "Gidra, meduza, amyoba"),
    Q("Quyidagilardan qaysi biri umurtqasiz hayvon?", "Chigirtka", "Ilon", "Baliq", "Qurbaqa"),
    Q("Xordalilarga xos belgi qaysi?", "Tanasida xorda (o'q skelet) bo'lishi", "Tanasida chig'anoq bo'lishi", "Faqat suvda yashashi", "Uchib yurishi"),
    Q("Hayvonlarning o'simliklardan asosiy farqi nimada?", "Tayyor organik moddalar bilan oziqlanadi", "Fotosintez qiladi", "Hujayralari yo'q", "Nafas olmaydi"),
    Q("Gidra qaysi tipga kiradi?", "Ichakbo'shliqlilar", "Chuvalchanglar", "Mollyuskalar", "Xordalilar"),
    Q("Yomg'ir chuvalchangi qaysi guruhga mansub?", "Halqali chuvalchanglar", "Yassi chuvalchanglar", "Mollyuskalar", "Hasharotlar"),
    Q("Mollyuskalarning tanasi qanday?", "Yumshoq, ko'pincha chig'anoq bilan qoplangan", "Xitin qoplamli, bo'g'imli", "Tangachalar bilan qoplangan", "Pat bilan qoplangan"),
    Q("Hayvonlarni o'rganuvchi fan qaysi?", "Zoologiya", "Botanika", "Ekologiya", "Anatomiya"),
    Q("Quyidagilardan qaysi biri bo'g'imoyoqlilarga kiradi?", "O'rgimchak", "Meduza", "Baliq", "Kit"),
]))

BANK.append((6, "Bir hujayrali hayvonlar", """## Bir hujayrali hayvonlar (sodda hayvonlar)

Tanasi **bitta hujayradan** iborat, ammo bu hujayra mustaqil organizm sifatida barcha hayotiy vazifalarni bajaradi.

- **Amyoba** — **soxta oyoqlar** yordamida harakatlanadi va oziqni o'rab oladi; oziq **hazm vakuolasida** hazm bo'ladi, ortiqcha suv **qisqaruvchi vakuola** orqali chiqariladi.
- **Infuzoriya-tufelka** — tanasi **kipriklar** bilan qoplangan; ikkita yadrosi bor: katta va kichik.
- **Yashil evglena** — **xivchin** yordamida harakatlanadi; yorug'likda fotosintez qiladi, qorong'ida tayyor oziq bilan oziqlanadi.

Ular ko'pincha ikkiga bo'linib ko'payadi va chuchuk suvda hamda nam tuproqda yashaydi.""", [
    Q("Amyoba qanday harakatlanadi?", "Soxta oyoqlar yordamida", "Kipriklar yordamida", "Xivchin yordamida", "Qanotlari bilan"),
    Q("Infuzoriya-tufelka qanday harakatlanadi?", "Kipriklar yordamida", "Soxta oyoqlar yordamida", "Xivchin yordamida", "Suzgichlari bilan"),
    Q("Yashil evglena qanday harakatlanadi?", "Xivchin yordamida", "Soxta oyoqlar yordamida", "Kipriklar yordamida", "Oyoqlari yordamida"),
    Q("Amyobada ortiqcha suv qaysi organoid orqali chiqariladi?", "Qisqaruvchi vakuola", "Hazm vakuolasi", "Yadro", "Soxta oyoq"),
    Q("Amyoba oziqni qanday o'zlashtiradi?", "Soxta oyoqlari bilan o'rab oladi, hazm vakuolasida hazm qiladi", "Og'iz orqali yutadi", "Fotosintez qiladi", "Ildiz bilan so'radi"),
    Q("Infuzoriya-tufelkada nechta yadro bor?", "Ikkita (katta va kichik)", "Bitta", "Uchta", "Yadrosi yo'q"),
    Q("Evglenaning o'ziga xos xususiyati nima?", "Yorug'likda fotosintez qiladi, qorong'ida tayyor oziq bilan oziqlanadi", "Faqat yirtqichlik qiladi", "Faqat parazit yashaydi", "Hech qachon harakatlanmaydi"),
    Q("Bir hujayrali hayvonlar asosan qanday ko'payadi?", "Ikkiga bo'linib", "Tuxum qo'yib", "Urug' orqali", "Kurtaklanib faqat"),
    Q("Bir hujayrali hayvonlar qayerda yashaydi?", "Chuchuk suvda va nam tuproqda", "Faqat cho'lda", "Faqat havoda", "Faqat muzda"),
    Q("Quyidagilardan qaysi biri bir hujayrali hayvon?", "Tufelka", "Gidra", "Meduza", "Baliq"),
]))

BANK.append((6, "Hasharotlar va bo'g'imoyoqlilar", """## Bo'g'imoyoqlilar

Tanasi **xitin qoplami** bilan o'ralgan, oyoqlari bo'g'imli hayvonlar. Xitin ularning tashqi skeleti vazifasini bajaradi.

## Hasharotlar

Tanasi **bosh, ko'krak va qorin** qismlardan iborat; **6 ta oyoq** va ko'pincha 2 juft qanoti bor. O'rgimchaksimonlarda esa 8 ta oyoq va ikki tana qismi bo'ladi.

## Rivojlanish

- **To'liq o'zgarish**: tuxum → lichinka → g'umbak → voyaga yetgan hasharot (kapalak, qo'ng'iz, asalari).
- **Chala o'zgarish**: tuxum → lichinka → voyaga yetgan hasharot, g'umbak bosqichi yo'q (chigirtka).

Hasharotlar hayvonlar orasida tur soni bo'yicha eng ko'p sinfdir. Asalari va kapalaklar o'simliklarni changlatadi.""", [
    Q("Hasharotlar tanasi nechta qismdan iborat?", "Uchta: bosh, ko'krak, qorin", "Ikkita: bosh va tana", "To'rtta", "Bitta"),
    Q("Hasharotlarning nechta oyog'i bor?", "6 ta", "4 ta", "8 ta", "10 ta"),
    Q("O'rgimchakning nechta oyog'i bor?", "8 ta", "6 ta", "4 ta", "10 ta"),
    Q("Quyidagilardan qaysi biri hasharot emas?", "O'rgimchak", "Kapalak", "Chumoli", "Asalari"),
    Q("To'liq o'zgarish bilan rivojlanishda bosqichlar tartibini ko'rsating.", "Tuxum → lichinka → g'umbak → voyaga yetgan hasharot", "Tuxum → g'umbak → lichinka → voyaga yetgan hasharot", "Lichinka → tuxum → g'umbak", "Tuxum → voyaga yetgan hasharot"),
    Q("Quyidagilardan qaysi biri to'liq o'zgarish bilan rivojlanadi?", "Kapalak", "Chigirtka", "Tarakan", "O'rgimchak"),
    Q("Chigirtka qanday rivojlanadi?", "To'liq o'zgarishsiz (g'umbak bosqichisiz)", "To'liq o'zgarish bilan", "Tug'ib", "Metamorfozsiz tuxumsiz"),
    Q("Bo'g'imoyoqlilarning tashqi skeleti nimadan iborat?", "Xitin qoplamidan", "Suyakdan", "Sellyulozadan", "Tangachalardan"),
    Q("Asalarining tabiatdagi foydasi nima?", "O'simliklarni changlatadi", "Tuproqni yumshatadi", "Suvni tozalaydi", "Havoni isitadi"),
    Q("Hayvonlar orasida tur soni bo'yicha eng ko'p sinf qaysi?", "Hasharotlar", "Sutemizuvchilar", "Qushlar", "Baliqlar"),
]))

BANK.append((6, "Baliqlar, amfibiyalar va sudralib yuruvchilar", """## Baliqlar

Suvda yashaydi, **jabralar** bilan nafas oladi, **suzgichlar** yordamida suzadi, tanasi tangachalar bilan qoplangan.

## Amfibiyalar (suvda va quruqlikda yashovchilar)

Qurbaqa kabi hayvonlar tuxumini **suvda** qo'yadi. Lichinkasi (**itbaliq**) jabra bilan nafas oladi; voyaga yetganda o'pka va teri orqali nafas oladi.

## Sudralib yuruvchilar

Ilon, kaltakesak, toshbaqa. Tanasi **quruq tangachalar** (yoki kosa) bilan qoplangan, tuxumini quruqlikda, himoya po'sti bilan qo'yadi. Ular tana harorati muhit haroratiga bog'liq (sovuqqonli) hayvonlardir.""", [
    Q("Baliqlar nima yordamida nafas oladi?", "Jabralar", "O'pka", "Teri orqali faqat", "Traxeya"),
    Q("Baliq tanasi nima bilan qoplangan?", "Tangachalar", "Pat", "Jun", "Xitin"),
    Q("Quyidagilardan qaysi biri amfibiya?", "Qurbaqa", "Ilon", "Timsoh", "Toshbaqa"),
    Q("Qurbaqaning lichinkasi nima deyiladi?", "Itbaliq", "G'umbak", "Qurt", "Nimfa"),
    Q("Quyidagilardan qaysi biri sudralib yuruvchi?", "Kaltakesak", "Qurbaqa", "Delfin", "Baliq"),
    Q("Sudralib yuruvchilar tanasi qanday qoplangan?", "Quruq tangachalar yoki kosa bilan", "Nam yalang'och teri bilan", "Pat bilan", "Jun bilan"),
    Q("Amfibiyalar tuxumini qayerda qo'yadi?", "Suvda", "Qumda", "Daraxt ustida", "Uyasida, quruqlikda"),
    Q("Sudralib yuruvchilarning tuxumi qanday bo'ladi?", "Quruqlikda rivojlanadi, himoya po'stiga ega", "Suvda rivojlanadi, po'sti yo'q", "Tuxum qo'ymaydi", "Faqat tanada rivojlanadi"),
    Q("Baliqlarning suzgichlari qanday vazifani bajaradi?", "Harakatlanish va muvozanatni saqlash", "Nafas olish", "Oziq hazm qilish", "Ko'payish"),
    Q("Toshbaqa qaysi sinfga kiradi?", "Sudralib yuruvchilar", "Amfibiyalar", "Baliqlar", "Sutemizuvchilar"),
]))

BANK.append((6, "Qushlar", """## Qushlarning tuzilishi

Qushlarning tanasi **pat** bilan qoplangan, oldingi oyoqlari **qanotga** aylangan. Ular **issiqqonli** — tana harorati doimiy.

## Uchishga moslashuvlar

- yengil, ichi g'ovak suyaklar;
- patlar va kuchli ko'krak muskullari;
- tishlarning yo'qligi: oziq **muskulli oshqozonda** ezib maydalanadi.

## Xilma-xillik

Tumshuq shakli qushning oziqlanish usuliga mos: yirtqichlarda kancasimon, o'rdakda yassi. **Boyqush** — tungi yirtqich, **laylak** — ko'chib yuruvchi, **pingvin** esa uchmaydi, lekin yaxshi suzadi.""", [
    Q("Qushlarning tanasi nima bilan qoplangan?", "Pat", "Jun", "Tangacha", "Xitin"),
    Q("Qushlarning qanotlari qaysi a'zoning o'zgargan shakli?", "Oldingi oyoqlar", "Orqa oyoqlar", "Dum", "Ko'krak suyagi"),
    Q("Qushlarning uchishga moslashuvi qaysi?", "Yengil, g'ovak suyaklar", "Og'ir suyaklar", "Tangachali teri", "Qalin jun"),
    Q("Qushlar qanday hayvonlar hisoblanadi?", "Issiqqonli", "Sovuqqonli", "Tana harorati o'zgaruvchan", "Faqat qishda issiqqonli"),
    Q("Quyidagilardan qaysi qush uchmaydi?", "Pingvin", "Burgut", "Laylak", "Chumchuq"),
    Q("Tungi yirtqich qushni toping.", "Boyqush", "Kaptar", "Qaldirg'och", "Tovuq"),
    Q("Qushlarning tumshuq shakli nimaga bog'liq?", "Oziqlanish usuliga", "Tuxum sonidan", "Rangiga", "Yoshiga"),
    Q("Qushlarda oziq qayerda ezib maydalanadi?", "Muskulli oshqozonda", "Tishlarda", "Jag'da", "Qizilo'ngachda"),
    Q("Quyidagilardan qaysi biri ko'chib yuruvchi qush?", "Laylak", "Chumchuq", "Kaptar", "Tovuq"),
    Q("Qushlar ko'payishi qanday amalga oshadi?", "Tuxum qo'yib, bosib chiqaradi", "Tirik tug'adi", "Kurtaklanib", "Ikkiga bo'linib"),
]))

BANK.append((6, "Sutemizuvchilar", """## Sutemizuvchilarning belgilari

- bolalarini **sut bilan** boqadi;
- tanasi **jun** (soch) bilan qoplangan;
- **issiqqonli**; yuragi to'rt kamerali;
- ko'pchiligi bolasini **tirik tug'adi**; homila **yo'ldosh** (platsenta) orqali ona organizmidan oziqlanadi.

## Xilma-xillik

Quruqlikda (sigir, bo'ri, maymun), suvda (**kit**, **delfin** — baliq emas!) va havoda (**ko'rshapalak**) yashaydigan turlari bor. **Ko'k kit** Yerdagi eng yirik hayvondir.

Tishlari oziqlanishga mos: yirtqichlarda **qoziq tishlar** rivojlangan, o'txo'rlarda **oziq tishlar**.""", [
    Q("Sutemizuvchilar bolalarini qanday boqadi?", "Sut bilan", "Hasharot bilan", "Suv bilan", "O't bilan"),
    Q("Sutemizuvchilar tanasi nima bilan qoplangan?", "Jun (soch)", "Pat", "Tangacha", "Xitin"),
    Q("Eng yirik sutemizuvchi qaysi?", "Ko'k kit", "Fil", "Jirafa", "Karkidon"),
    Q("Kit qaysi sinfga kiradi?", "Sutemizuvchilar", "Baliqlar", "Amfibiyalar", "Sudralib yuruvchilar"),
    Q("Yo'ldosh (platsenta) nima uchun xizmat qiladi?", "Homila ona organizmi bilan moddalar almashadigan organ", "Tuxumni himoya qiladi", "Sut ishlab chiqaradi", "Nafas olishga yordam beradi"),
    Q("Quyidagilardan qaysi biri yirtqich sutemizuvchi?", "Bo'ri", "Sigir", "Quyon", "Ot"),
    Q("Haqiqiy ucha oladigan yagona sutemizuvchi qaysi?", "Ko'rshapalak", "Sincap", "Qush", "Uchar baliq"),
    Q("Primatlarga qaysi hayvon kiradi?", "Maymun", "Bo'ri", "Sigir", "Delfin"),
    Q("Sutemizuvchilar yuragi nechta kamerali?", "To'rt kamerali", "Ikki kamerali", "Uch kamerali", "Bir kamerali"),
    Q("Quyidagilardan qaysi biri o'txo'r sutemizuvchi?", "Sigir", "Sher", "Bo'ri", "Yo'lbars"),
]))

BANK.append((6, "Hujayra, DNK va irsiyat", """## DNK nima?

**DNK** (dezoksiribonuklein kislota) — irsiy axborotni saqlovchi molekula. U **qo'sh spiral** shaklida bo'lib, hujayra yadrosidagi **xromosomalarda** joylashgan.

## Tuzilishi

DNKda to'rt xil azotli asos bor: **adenin (A)**, **timin (T)**, **guanin (G)**, **sitozin (S)**. Asoslar qat'iy juft bo'lib bog'lanadi: **A–T** va **G–S** (komplementarlik).

## Gen va irsiyat

**Gen** — ma'lum belgi haqidagi axborotni saqlovchi DNK bo'lagi. Belgilarning avloddan avlodga o'tishi **irsiyat** deyiladi. DNK modelini 1953-yilda Dj. Uotson va F. Krik taklif qilgan.""", [
    Q("DNK nimaning qisqartmasi?", "Dezoksiribonuklein kislota", "Dinamik nuklein komponent", "Dastlabki nafas kislotasi", "Distillangan nuklein kislota"),
    Q("DNKning asosiy vazifasi nima?", "Irsiy axborotni saqlash va avlodlarga o'tkazish", "Energiya hosil qilish", "Suvni tashish", "Fotosintez qilish"),
    Q("DNK molekulasi qanday shaklga ega?", "Qo'sh spiral", "Bitta to'g'ri chiziq", "Kub", "Halqa va bitta zanjir"),
    Q("DNKda nechta xil azotli asos bor?", "To'rt xil", "Ikki xil", "Uch xil", "Olti xil"),
    Q("Adenin (A) qaysi asos bilan juft hosil qiladi?", "Timin (T)", "Guanin (G)", "Sitozin (S)", "Adenin (A)"),
    Q("Guanin (G) qaysi asos bilan juft hosil qiladi?", "Sitozin (S)", "Adenin (A)", "Timin (T)", "Guanin (G)"),
    Q("Hujayra yadrosida DNK qaysi tuzilmalarda joylashgan?", "Xromosomalarda", "Ribosomalarda", "Vakuolada", "Membranada"),
    Q("Gen nima?", "Ma'lum belgi haqidagi axborotni saqlovchi DNK bo'lagi", "Hujayra devori qismi", "Oqsil nomi", "Mitoxondriya turi"),
    Q("DNKning qo'sh spiral modelini kimlar taklif qilgan?", "Dj. Uotson va F. Krik", "Ch. Darvin va G. Mendel", "L. Pasteur va R. Kox", "K. Linney va J. Lamark"),
    Q("Belgilarning avloddan avlodga o'tishi nima deyiladi?", "Irsiyat", "O'zgaruvchanlik", "Moslashuv", "Tabiiy tanlanish"),
]))

BANK.append((6, "Mikroskop va laboratoriya ishlari", """## Mikroskop

Mikroskop kichik obyektlarni kattalashtirib ko'rsatadi. Umumiy kattalashtirish **okulyar** va **obyektiv** kattalashtirishlarining ko'paytmasiga teng (masalan, 10 × 40 = 400 marta). Tasvir **vint** yordamida aniqlashtiriladi, yoritish uchun **ko'zgu** yoki chiroq ishlatiladi.

## Preparat tayyorlash

Buyum oynasiga obyekt (masalan, elodeya bargi) qo'yiladi, bir tomchi suv tomiziladi va **qoplagich oyna** bilan yopiladi. Elodeya hujayralarida yashil **xloroplastlar** ko'rinadi.

## O'lchash va xavfsizlik

Chizg'ich bilan o'lchashda obyekt chetini **0 belgisiga** moslang. Spirtovka yonib turganda unga qo'l tekkizmang, qaynoq idishni tutqichdan ushlang.""", [
    Q("Mikroskopning umumiy kattalashtirishi qanday topiladi?", "Okulyar va obyektiv kattalashtirishlari ko'paytiriladi", "Ular qo'shiladi", "Faqat obyektivga teng", "Faqat okulyarga teng"),
    Q("Okulyar ×10, obyektiv ×40 bo'lsa, umumiy kattalashtirish qancha?", "400 marta", "50 marta", "40 marta", "4000 marta"),
    Q("Mikroskopda tasvirni aniqlashtirish uchun nima ishlatiladi?", "Vint (makro- va mikrovint)", "Ko'zgu", "Buyum oynasi", "Tutqich"),
    Q("Preparatni yopish uchun nima ishlatiladi?", "Qoplagich oyna", "Pinset", "Probirka", "Lupa"),
    Q("Elodeya bargi hujayralarida ko'rinadigan yashil donachalar nima?", "Xloroplastlar", "Yadrolar", "Mitoxondriyalar", "Ribosomalar"),
    Q("Mikroskopda ko'rish maydonini yoritish uchun nima kerak?", "Ko'zgu yoki yoritgich", "Qoplagich oyna", "Termometr", "Tarozi"),
    Q("Chizg'ich bilan uzunlikni o'lchaganda obyektning bir cheti qayerda bo'lishi kerak?", "0 belgisida", "10 belgisida", "Ixtiyoriy joyda", "Chizg'ich oxirida"),
    Q("Lupa nima uchun ishlatiladi?", "Obyektlarni kichik darajada kattalashtirib ko'rish uchun", "Haroratni o'lchash uchun", "Massani aniqlash uchun", "Suvni qizdirish uchun"),
    Q("Spirtovka bilan ishlaganda qanday xavfsizlik qoidasi muhim?", "Yonib turganda qo'l tekkizmaslik, qaynoq idishni tutqichdan ushlash", "Yonib turgan spirtovkani ko'chirish", "Qaynoq idishni yalang'och qo'l bilan ushlash", "Spirtovkani suv bilan o'chirish"),
    Q("Preparat tayyorlashda to'g'ri ketma-ketlikni ko'rsating.", "Buyum oynasi → obyekt → suv tomchisi → qoplagich oyna", "Qoplagich oyna → obyekt → suv", "Suv → qoplagich oyna → obyekt", "Obyekt → qoplagich oyna → buyum oynasi"),
]))
