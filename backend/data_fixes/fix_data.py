# -*- coding: utf-8 -*-
import sqlite3, sys, re, json, uuid, time, shutil, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(__file__))
from content_bank import BANK

DB = sys.argv[1]
shutil.copy(DB, DB + '.bak-before-fix-%d' % int(time.time()))
c = sqlite3.connect(DB)
now = int(time.time() * 1000)
COURSE = {5: 'ffd87f13-f573-489e-9b10-ec689ec66b5b', 6: '6230c4e6-f61b-4d03-9616-a18c0a9c928a'}


def sql(q, *a):
    return c.execute(q, a)

# ───────── 1. Matn xatolari (apostroflar ASCII holatida) ─────────
REPL = [
    ("askariada", "askarida"),
    ("ochiqqanda", "och qolganda"),
    ("chinniyigul", "chinnigul"),
    ("hatti-harakat", "xatti-harakat"),
    ("Qoziqtish, kuraktish va oqlov tishlar", "Qoziq, kurak va oziq tishlar"),
    ("oziqanish", "oziqlanish"),
    ("Ayor o'rmon", "Ayyor o'rmon"),
    ("Qoqigul (dastarbosh)", "Qoqigul (qoqio't)"),
    ("3 xil turli xil daraxt", "3 xil daraxt"),
    ("tsiklini", "siklini"),
    (" -> ", " → "),
    ("gulkosacha", "gulkosa"),
    ("Hasharotlarning qoplag'ichi", "Hasharotlar tanasini qoplab turuvchi qattiq modda"),
    ("Ildiz orqali o'simlik suv ichadi.", "Ildiz orqali o'simlik suv va mineral moddalarni shimadi."),
    ("Uni issiq va yorug' joyda saqlang.", "Uni iliq joyda saqlang."),
    ("Qushlar va hasharotlar yordamida changlanish", "Hasharotlar yordamida changlanish"),
    ("Zog'ora gul (Makkajo'xori) tuzilishini o'rganish", "Makkajo'xori gullarining tuzilishini o'rganish"),
    ("O'simlik poyasida suvning harakati (Osmos)", "O'simlik hujayralarida suvning harakati (Osmos)"),
    ("(suv, yorug'lik, issiqlik)", "(suv, havo, issiqlik)"),
    ("Urug'larni yorug' va iliq joyga qo'yib uni sug'oring.", "Urug'larni nam va iliq joyga qo'yib, sug'oring."),
    ("ildizcha va murtak unib chiqqanini", "ildizcha va poyacha unib chiqqanini"),
    ("\"title\":\"Gultojbarg\"", "\"title\":\"Gultojibarg\""),
    ("yetuk zot o'rtasidagi harakatsiz bosqichi", "voyaga yetgan hasharot o'rtasidagi harakatsiz bosqichi"),
]
TEXT = {}
for (t,) in sql("select name from sqlite_master where type='table' and name not like '_prisma%'").fetchall():
    TEXT[t] = [r[1] for r in sql(f'pragma table_info("{t}")') if r[2].upper() in ('TEXT', 'VARCHAR') and r[1] not in ('id', 'passwordHash')]

changed = 0
for t, cols in TEXT.items():
    for col in cols:
        for old, new in REPL:
            n = sql(f'update "{t}" set "{col}"=replace("{col}",?,?) where "{col}" like ?', old, new, f'%{old}%').rowcount
            changed += n
# Gultojbarg bosh harf holati (stepsJson boʻshliqli ham boʻlishi mumkin)
for old, new in [('"title": "Gultojbarg"', '"title": "Gultojibarg"'), ('Gultojbarg', 'Gultojibarg')]:
    sql("update Lab set stepsJson=replace(stepsJson,?,?)", old, new)
# Harorat birliklari: "0 C" → "0 °C"
for col in ('content', 'options', 'correctAnswer'):
    for rid, v in sql(f'select id,"{col}" from Question where "{col}" like "% C%"').fetchall():
        nv = re.sub(r'(?<=\d) C(?![A-Za-z])', ' °C', v)
        if nv != v:
            sql(f'update Question set "{col}"=? where id=?', nv, rid)
sql("update CrosswordItem set word='OZIQ' where word='OZYQ'")
print('replacements:', changed)

# ───────── 2. Faktlar: ilmiy aniqlik ─────────
FACTS = {
    "Tabiatdagi eng qari daraxt": ("Eng keksa daraxtlar", "Kaliforniyadagi Oq tog'larda o'sadigan qoraqarag'ay (Pinus longaeva) ning ayrim daraxtlari 4800 yildan ortiq yashagan: bu ma'lum bo'lgan eng keksa yakka daraxtlardir. Sekvoya daraxtlari ham 3000 yildan ortiq yashashi mumkin."),
    "10 000 yillik zamburug'": ("Eng yirik tirik organizmlardan biri", "Oregon shtatidagi Armillaria ostoyae zamburug'ining yer ostidagi mitseliysi taxminan 965 gektar maydonni egallaydi va yoshi bir necha ming yil (taxminan 2000–8000 yil) deb baholanadi."),
    "Yerning o'pkasi": ("Amazonka o'rmonlari — «Yer o'pkasi»mi?", "Amazonka o'rmonlari juda ko'p karbonat angidridni yutadi, yog'ingarchilik va iqlimni tartibga solishda katta rol o'ynaydi, shuning uchun uni «Yer o'pkasi» deb atashadi. Biroq o'rmon ishlab chiqargan kislorodning deyarli hammasi o'sha yerdagi tirik organizmlarning nafas olishiga sarflanadi. Atmosfera kislorodining katta qismini okeandagi suv o'tlari beradi."),
    "Suv o'tlarining kislorodi": ("Suv o'tlarining kislorodi", "Yer yuzidagi kislorodning katta qismini (taxminan yarmidan ko'prog'ini) okean va dengizlarda yashovchi suv o'tlari va fitoplankton fotosintez orqali ishlab chiqaradi."),
    "O'simliklardagi qon o'xshashi": ("Xlorofill va gemoglobin", "Xlorofill molekulasining tuzilishi odam qonidagi gemoglobinning gem qismiga o'xshash. Farqi shundaki, xlorofill markazida magniy, gemda esa temir atomi joylashgan."),
    "Gullarning soat kabi harakati": ("Gul soati", "Karl Linney «gul soati» g'oyasini ilgari surgan: turli o'simliklarning gullari kun davomida muayyan soatlarda ochiladi va yopiladi, shu sababli ularga qarab taxminiy vaqtni aniqlash mumkin."),
    "Moxlarning ildizi yo'q": ("Moxlarning ildizi yo'q", "Moxlarda haqiqiy ildiz bo'lmaydi. Ular suvni butun tanasi bilan shimadi va tuproqqa rizoidlari orqali birikadi."),
    "Xurmo daraxti - hayot daraxti": ("Xurmo — cho'l daraxti", "Xurmo cho'l sharoitida yashaydigan qimmatli o'simlik. Mevasi ozuqaviy qiymati yuqori; barglaridan to'qima va savat to'qishda foydalaniladi."),
    "Lishaynik - tabiat barometri": ("Lishayniklar — havo tozaligi ko'rsatkichi", "Ko'pgina lishayniklar havo ifloslanishiga sezgir. Agar shaharda ular uchramasa, havo ifloslangan bo'lishi mumkin."),
    "Gippopotamning pushtirang teri shirasi": ("Begemotning «qizil teri» ajralmasi", "Begemot terisidan quyoshdan himoya qiluvchi qizg'ish-to'q sariq shilimshiq modda ajraladi. Unda quyosh nurini yutuvchi va bakteriyalarga qarshi ta'sir qiluvchi pigmentlar borligi aniqlangan."),
    "Tufelkaning qobig'i": ("Tufelkaning kipriklari", "Infuzoriya-tufelka mikroskopik bir hujayrali hayvon. Tanasi minglab mayda kipriklar bilan qoplangan: ular muvofiqlashgan harakat qilib, uni suzdiradi."),
    "Toshbaqa kiyimi": ("Toshbaqaning kosasi", "Toshbaqaning kosasi uning skeletining bir qismi (qovurg'alar va umurtqa suyaklarining o'zgargan shakli) hisoblanadi. Toshbaqa o'z kosasidan chiqib keta olmaydi."),
    "Suv otlarining asl nomi": ("Dengiz otchasi", "Dengiz otchasi suyakli baliqlarga kiradi. Erkak otcha bolalarini qornidagi maxsus xaltachada ko'tarib yuradi."),
    "Uchuvchi itlar": ("Ko'rshapalaklar", "Ko'rshapalaklar sutemizuvchilar ichida haqiqiy ucha oladigan yagona hayvonlardir. Ularning qanotlari barmoqlari orasiga tortilgan yupqa teri pardasidan iborat."),
    "Asalarilar besh ko'zli": ("Asalarining beshta ko'zi bor", "Asalarining boshining yon tomonlarida ikkita katta murakkab ko'zi, tepasida esa uchta kichik oddiy ko'zi bo'ladi."),
    "Qanotsiz hasharotlar": ("Burganing sakrashi", "Burgalar qanotsiz bo'lsa-da, o'z bo'yidan taxminan 100–150 barobar balandlikka sakray oladi."),
    "Yomg'ir chuvalchangi qayta tiklanadimi?": ("Chuvalchangning tiklanish qobiliyati", "Ba'zi yomg'ir chuvalchangi turlari tanasining orqa qismini qayta tiklay oladi. Bosh qismi saqlangan bo'lak yashab qolishi mumkin, dum qismidan esa odatda yangi organizm hosil bo'lmaydi."),
    "Qushlarning tishlari bormi?": ("Qushlarning tishlari bormi?", "Zamonaviy qushlarning tishlari yo'q. Ular oziqni chaynamaydi: oziq muskulli oshqozonda yutilgan mayda toshchalar yordamida ezib maydalanadi."),
    "Sakkizoyoqning uchta yuragi": ("Sakkizoyoqning uchta yuragi", "Sakkizoyoqlarda uchta yurak bor. Qonida kislorodni tashuvchi gemotsianin pigmenti tarkibida mis bo'lgani uchun qoni ko'k rangda bo'ladi."),
    "Eng ko'p uxlash chempioni": ("Eng ko'p uxlaydigan hayvonlardan biri", "Koalalar sutkasiga 18–22 soat uxlaydi. Ularning ozuqasi evkalipt barglari bo'lib, energiyasi kam va tarkibida zaharli moddalar bor."),
    "Kartoshka - inqilobiy oziq-ovqat": ("Kartoshka — muhim oziq-ovqat", "Kartoshka aslida poyaning shakli o'zgargan tuganagidir. U Yevropaga keltirilgach, aholini oziq-ovqat bilan ta'minlashda muhim rol o'ynagan."),
    "Timsohlar ko'zyoshi": ("Timsohlarning ko'z yoshi", "Timsohlar ovqat yeyayotgan paytda ko'z yoshi ajratadi. Lekin bu yig'lash emas: chaynov muskullarining harakati yosh bezlarini siqib chiqaradi."),
}
for old, (nt, nc) in FACTS.items():
    n = sql("update Fact set title=?, content=? where title=?", nt, nc, old).rowcount
    if not n:
        print('FACT NOT FOUND', old)

# ───────── 3. Lugʻat: qoʻshimcha atamalar ─────────
GLOSS = [
    ("Mitoxondriya", "Hujayra ichidagi organoid: organik moddalarni parchalab, hayot uchun zarur energiya hosil qiladi."),
    ("Hujayra devori", "O'simlik hujayrasini tashqaridan o'rab turuvchi sellyulozali qalin qobiq; hujayraga shakl beradi va himoya qiladi."),
    ("Xlorofill", "Xloroplastlardagi yashil pigment; yorug'lik energiyasini yutib, fotosintezni ta'minlaydi."),
    ("Osmos", "Suvning yarim o'tkazuvchan parda orqali konsentratsiyasi past eritmadan konsentratsiyasi yuqori eritma tomonga o'tishi."),
    ("Turgor", "O'simlik hujayrasining suv bilan to'lib, taranglashgan holati."),
    ("Plazmoliz", "Konsentrlangan eritmada hujayra suv yo'qotib, protoplastning hujayra devoridan ajralishi."),
    ("Mikroskop", "Kichik obyektlarni ko'p marta kattalashtirib ko'rsatadigan optik asbob."),
    ("Preparat", "Mikroskopda kuzatish uchun buyum oynasiga joylashtirilgan va qoplagich oyna bilan yopilgan obyekt."),
    ("Oziq zanjiri", "Organizmlar o'rtasidagi «kim kimni yeydi» munosabati: oziq moddalar va energiya yeyilgandan yeguvchiga o'tadi."),
    ("Ishlab chiqaruvchilar", "Fotosintez orqali anorganik moddalardan organik modda hosil qiluvchi yashil o'simliklar."),
    ("Iste'molchilar", "Tayyor organik moddalar bilan oziqlanadigan organizmlar (o'txo'r va yirtqich hayvonlar)."),
    ("Parchalovchilar", "O'lik organizmlar qoldig'ini parchalab, mineral moddalarga aylantiruvchi bakteriyalar va zamburug'lar."),
    ("DNK", "Dezoksiribonuklein kislota: irsiy axborotni saqlovchi qo'sh spiralli molekula."),
    ("Gen", "Ma'lum belgi haqidagi irsiy axborotni saqlovchi DNK bo'lagi."),
    ("Xromosoma", "Hujayra yadrosidagi DNK va oqsillardan tuzilgan, irsiy axborotni saqlovchi tuzilma."),
    ("Gultojibarg", "Gulning yorqin rangli barglari; changlatuvchi hasharotlarni jalb qiladi."),
    ("Gulkosabarg", "Gulning eng tashqi, odatda yashil barglari; kurtakdagi gulni himoya qiladi."),
    ("Tuguncha", "Urug'chining pastki kengaygan qismi; urug'lanishdan so'ng undan meva rivojlanadi."),
    ("Og'izchalar", "Bargning pastki epidermisidagi tirqishlar; gaz almashinuvi va suv bug'lanishini boshqaradi."),
    ("Elodeya", "Suvda o'sadigan o'simlik; hujayralari xloroplastlarga boy bo'lgani uchun mikroskopda kuzatish uchun qulay."),
    ("Ksilema", "O'simlikda suv va mineral moddalarni ildizdan barglarga ko'taruvchi naylar."),
    ("Floema", "O'simlikda barglarda hosil bo'lgan organik moddalarni boshqa organlarga tashuvchi naylar."),
    ("Ko'rshapalak", "Haqiqiy ucha oladigan yagona sutemizuvchi hayvon."),
    ("Amfibiyalar", "Suvda va quruqlikda yashovchi umurtqali hayvonlar (qurbaqa, tritonlar); tuxumini suvda qo'yadi."),
]
existing = {r[0].lower() for r in sql("select term from Glossary")}
added_g = 0
for term, d in GLOSS:
    if term.lower() in existing:
        continue
    sql("insert into Glossary(id,term,definition) values(?,?,?)", str(uuid.uuid4()), term, d)
    added_g += 1
sql("update Glossary set definition=? where term='Osmos' and 0", "")
print('glossary added', added_g)

# ───────── 4. Oʻyinlar ─────────
def setgame(prefix, data):
    n = sql("update Game set contentJson=? where title like ?", json.dumps(data, ensure_ascii=False), prefix + '%').rowcount
    assert n == 1, prefix

setgame("1. Xotira", [
    {"id": 1, "name": "Yadro", "emoji": "🧬"}, {"id": 2, "name": "Ribosoma", "emoji": "🟡"},
    {"id": 3, "name": "Lizosoma", "emoji": "🔴"}, {"id": 4, "name": "Mitoxondriya", "emoji": "⚡"},
    {"id": 5, "name": "Vakuola", "emoji": "💧"}, {"id": 6, "name": "Xloroplast", "emoji": "🌿"},
    {"id": 7, "name": "Hujayra devori", "emoji": "🧱"}, {"id": 8, "name": "Membrana", "emoji": "🛡️"},
])
setgame("2. Xotira", [
    {"id": 1, "name": "Sher", "emoji": "🦁"}, {"id": 2, "name": "Yo'lbars", "emoji": "🐅"},
    {"id": 3, "name": "Fil", "emoji": "🐘"}, {"id": 4, "name": "Jirafa", "emoji": "🦒"},
    {"id": 5, "name": "Maymun", "emoji": "🐒"}, {"id": 6, "name": "Ayiq", "emoji": "🐻"},
    {"id": 7, "name": "Delfin", "emoji": "🐬"}, {"id": 8, "name": "Burgut", "emoji": "🦅"},
])
setgame("3. Harflarni", [
    {"word": "ILDIZ", "hint": "O'simlikning yer ostki organi"}, {"word": "POYA", "hint": "O'simlikning tayanch organi"},
    {"word": "BARG", "hint": "Fotosintez asosan boradigan organ"}, {"word": "GUL", "hint": "O'simlikning ko'payish organi"},
    {"word": "HUJAYRA", "hint": "Tirik organizmning tuzilish birligi"}, {"word": "YADRO", "hint": "Hujayrani boshqaradi, DNK saqlaydi"},
    {"word": "VAKUOLA", "hint": "Hujayra shirasi saqlanadigan bo'shliq"}, {"word": "XLOROPLAST", "hint": "Fotosintez boradigan yashil plastida"},
])
setgame("4. Harflarni", [
    {"word": "AMYOBA", "hint": "Soxta oyoqli bir hujayrali hayvon"}, {"word": "GIDRA", "hint": "Chuchuk suvda yashovchi ichakbo'shliqli"},
    {"word": "BURGUT", "hint": "Katta yirtqich qush"}, {"word": "XITIN", "hint": "Hasharotlar tashqi skeletining moddasi"},
    {"word": "BALIQ", "hint": "Jabralar bilan nafas oladi"}, {"word": "KAPALAK", "hint": "To'liq o'zgarish bilan rivojlanadigan hasharot"},
    {"word": "TUFELKA", "hint": "Kiprikli infuzoriya"}, {"word": "TIMSOH", "hint": "Katta sudralib yuruvchi"},
])
setgame("5. To'g'ri", [
    {"question": "Barcha o'simliklar zaharli hisoblanadi.", "answer": False},
    {"question": "Fotosintez jarayonida kislorod ajralib chiqadi.", "answer": True},
    {"question": "Ildiz orqali o'simlik suv va mineral moddalarni shimadi.", "answer": True},
    {"question": "Barcha gullar faqat kunduz kuni ochiladi.", "answer": False},
    {"question": "Urug'ning unib chiqishi uchun yorug'lik shart.", "answer": False},
    {"question": "Hayvon hujayrasida qalin hujayra devori bor.", "answer": False},
    {"question": "Xloroplastlar o'simlik hujayrasida bo'ladi.", "answer": True},
    {"question": "Zamburug'lar o'simliklar olamiga kiradi.", "answer": False},
    {"question": "Suv normal atmosfera bosimida 100 °C da qaynaydi.", "answer": True},
    {"question": "Mikroskop kichik obyektlarni kattalashtirib ko'rsatadi.", "answer": True},
])
setgame("6. To'g'ri", [
    {"question": "Ayiqlar qishda uzoq uyquga ketadi.", "answer": True},
    {"question": "Kitlar baliqlar sinfiga kiradi.", "answer": False},
    {"question": "Barcha hasharotlarning 6 ta oyog'i bor.", "answer": True},
    {"question": "Ilonlar ham sutemizuvchilar hisoblanadi.", "answer": False},
    {"question": "O'rgimchakning 8 ta oyog'i bor.", "answer": True},
    {"question": "Qushlar sutemizuvchilar sinfiga kiradi.", "answer": False},
    {"question": "Amyoba bir hujayrali hayvon.", "answer": True},
    {"question": "Baliqlar o'pka bilan nafas oladi.", "answer": False},
    {"question": "Qurbaqa sudralib yuruvchilar sinfiga kiradi.", "answer": False},
    {"question": "Ko'rshapalak ucha oladigan sutemizuvchi.", "answer": True},
])

# ───────── 5. Yangi mavzu va test banki ─────────
added_q = 0
for grade, title, md, qs in BANK:
    if sql("select 1 from Lesson where title=?", title).fetchone():
        continue
    lid, qid = str(uuid.uuid4()), str(uuid.uuid4())
    sql("insert into Lesson(id,courseId,title,contentMd,createdAt,updatedAt) values(?,?,?,?,?,?)", lid, COURSE[grade], title, md, now, now)
    sql("insert into Quiz(id,lessonId,title,createdAt,updatedAt) values(?,?,?,?,?)", qid, lid, f"{title}: test", now, now)
    for q, ok, wrong in qs:
        opts = [ok] + wrong
        sql("insert into Question(id,quizId,type,content,options,correctAnswer,createdAt,updatedAt) values(?,?,?,?,?,?,?,?)",
            str(uuid.uuid4()), qid, 'MULTIPLE_CHOICE', q, json.dumps(opts, ensure_ascii=False), ok, now, now)
        added_q += 1
print('new questions', added_q)

# ───────── 6. Imlo: oʻ, gʻ va tutuq belgisi ─────────
def conv(s):
    if not s or "'" not in s:
        return s
    s = re.sub(r"(?<=[oOgG])'(?=[A-Za-z])", "ʻ", s)       # o', g' + harf
    s = re.sub(r"(?<=[gG])'(?![A-Za-z])", "ʻ", s)         # soʻz oxiridagi g' (urugʻ, yorugʻ)
    s = re.sub(r"(?<=[A-Za-z])'(?=[A-Za-z])", "ʼ", s)      # ma'no, ta'sir, a'zo
    return s

total = 0
for t, cols in TEXT.items():
    pk = 'id'
    for col in cols:
        rows = sql(f'select {pk},"{col}" from "{t}" where "{col}" like "%\'%"').fetchall()
        for rid, v in rows:
            nv = conv(v)
            if nv != v:
                sql(f'update "{t}" set "{col}"=? where {pk}=?', nv, rid)
                total += 1
print('apostrophe rows converted', total)

# Test: javob variantlar ichida bormi
bad = 0
for qid, opts, ans in sql("select id,options,correctAnswer from Question").fetchall():
    if ans not in json.loads(opts):
        bad += 1
print('answers not in options:', bad)
c.commit()
print({t: sql(f'select count(*) from "{t}"').fetchone()[0] for t in ('Lesson', 'Quiz', 'Question', 'Glossary', 'Fact')})
