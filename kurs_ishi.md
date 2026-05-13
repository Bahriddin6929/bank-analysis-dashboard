# KURS ISHI

**Mavzu: Bank mijozlari tahlili: Pandas yordamida mijozlar tranzaksiyalarini tahlil qilish va natijalarni Azure SQL bazasiga saqlash**

---

## MUNDARIJA

**Kirish**
**I Bob. Bank mijozlari tranzaksiyalarini tahlil qilishning nazariy asoslari**
1.1. Ma'lumotlarni tahlil qilishda Python va Pandas kutubxonasining o'rni
1.2. Bulutli texnologiyalar va Azure SQL ma'lumotlar bazasi haqida tushuncha
**II Bob. Pandas yordamida tranzaksiyalarni amaliy tahlil qilish va Azure SQL bilan ishlash**
2.1. Ma'lumotlarni yig'ish, tozalash va dastlabki tahlil (Pandas yordamida)
2.2. Tahlil natijalarini Azure SQL ma'lumotlar bazasiga integratsiya qilish va saqlash
**Xulosa**
**Foydalanilgan adabiyotlar ro'yxati**

---

## KIRISH

**Mavzuning dolzarbligi:** Bugungi kunda bank va moliya sohasida kundan-kunga o'sib borayotgan ma'lumotlar oqimi (Big Data) ushbu ma'lumotlarni tahlil qilish orqali qimmatli xulosalar chiqarishni talab etadi. Mijozlarning tranzaksiyalarini tahlil qilish orqali banklar o'z xizmat sifatini oshirishi, shubhali tranzaksiyalarni (firibgarliklarni) aniqlashi va har bir mijoz uchun individual yondashuvni ishlab chiqishi mumkin. Zamonaviy tahliliy vositalar (masalan, Python Pandas) va ishonchli bulutli ma'lumotlar omborlari (Azure SQL) bu jarayonni avtomatlashtirish va xavfsizligini ta'minlashda muhim ahamiyat kasb etadi.

**Kurs ishining maqsadi va vazifalari:** Ushbu kurs ishining asosiy maqsadi — Python dasturlash tilining Pandas kutubxonasi yordamida bank mijozlarining tranzaksiya ma'lumotlarini tahlil qilish usullarini o'rganish va olingan yakuniy natijalarni Microsoft Azure SQL bulutli bazasiga muvaffaqiyatli saqlash jarayonini amaliy ko'rsatib berishdir. 

**Vazifalar:**
1. Tranzaksiya ma'lumotlarini tahlil qilishning nazariy asoslarini o'rganish.
2. Pandas yordamida noto'g'ri (anomal) yoki bo'sh ma'lumotlarni tozalash.
3. Mijozlarning xarajatlari va tranzaksiya odatlarini guruhlab tahlil qilish.
4. Python orqali Azure SQL ma'lumotlar bazasiga ulanish va ma'lumotlarni yuklash texnologiyalarini amalda qo'llash.

---

## I BOB. BANK MIJOZLARI TRANZAKSIYALARINI TAHLIL QILISHNING NAZARIY ASOSLARI

### 1.1. Ma'lumotlarni tahlil qilishda Python va Pandas kutubxonasining o'rni

Python so'nggi yillarda ma'lumotlar ilmi (Data Science) va tahlili sohasida eng mashhur tillardan biriga aylandi. Uning o'qish uchun qulay sintaksisi hamda boy kutubxonalar ekotizimi ma'lumotlar ustida amallar bajarishni ancha osonlashtiradi. Bank sohasida, xususan mijozlar bazasi va millionlab tranzaksiyalarni ishlashda Python yetakchi o'rinni egallaydi.

**Pandas** — bu Pythonning ochiq kodli, yuqori unumdorlikka ega ma'lumotlarni tahlil qilish vositasi bo'lib, relyatsion (jadvalli) ma'lumotlar bilan ishlash uchun juda mos keladi. 
Pandas bank tahlilida qanday muammolarni hal qiladi:
- **Data Cleaning (Ma'lumotlarni tozalash):** Mijozlarning tranzaksiyalari yozib boriladigan tizimlarda bazan xatolar yuzaga keladi. Pandas `dropna()`, `fillna()` kabi funksiyalar orqali bu bo'shliqlarni to'ldirish yoki o'chirish imkonini beradi.
- **Aggregation va Grouping (Guruhlash):** Mijozning oy davomidagi umumiy xarajatlari yoki filiallarning kunlik tushumlarini hisoblash uchun `groupby()` metodidan keng foydalaniladi.
- **Time-Series Analysis (Vaqt qatorlari tahlili):** Bank amaliyotlari aniq vaqtga bog'liq. Pandas kunlik, oylik va yillik tendensiyalarni kuzatish uchun maxsus tayyorlangan ajoyib funksiyalarga ega.

### 1.2. Bulutli texnologiyalar va Azure SQL ma'lumotlar bazasi haqida tushuncha

Mijozlar ma'lumotlarini faqat kompyuter xotirasida saqlab tahlil qilish bank xavfsizlik va kattalashish (scalability) talablariga javob bermaydi. Shuning uchun zamonaviy yechimlar bulutli arxitekturalarga asoslanadi. 

**Azure SQL Database** — Microsoft tomonidan taqdim etiladigan to'liq boshqariladigan bulutli ma'lumotlar bazasi xizmati bo'lib, an'anaviy SQL Server arxitekturasida ishlaydi. 
Nima uchun bank tahlilida Azure SQL tanlanadi:
1. **Xavfsizlik:** Bank ma'lumotlari eng yuqori darajadagi himoyaga muhtoj. Azure ma'lumotlarni shifrlash (encryption) va ko'p bosqichli autentifikatsiyani ta'minlaydi.
2. **Moslashuvchanlik:** Tranzaksiyalar hajmi bayram yoki oylik maoshlar tushadigan vaqtda keskin oshadi. Azure SQL resurslarni avtomatik tarzda kengaytira oladi (auto-scaling).
3. **Integratsiya:** Python va boshqa tahlil vositalari (masalan, Power BI) bilan to'g'ridan-to'g'ri integratsiya qilish imkoniyati yuqori.

---

## II BOB. PANDAS YORDAMIDA TRANZAKSIYALARNI AMALIY TAHLIL QILISH VA AZURE SQL BILAN ISHLASH

Ushbu bobda amaliy tarzda bank mijozlarining kunlik tranzaksiyalaridan iborat (CSV formatidagi) faylni Pandas orqali tahlil qilib, olingan agregat natijalarni Azure SQL'ga yuklashni ko'rib chiqamiz.

### 2.1. Ma'lumotlarni yig'ish, tozalash va dastlabki tahlil

Tasavvur qilaylik, bizda `transactions.csv` fayli mavjud va unda quyidagi ustunlar bor: `TransactionID`, `CustomerID`, `TransactionDate`, `Amount`, `TransactionType` (Kirim, Chiqim).

Dastlab, ma'lumotlarni o'qish va tahlilga tayyorlash kerak:
```python
import pandas as pd

# 1. Ma'lumotlarni yuklash
df = pd.read_csv('transactions.csv')

# 2. Ma'lumotlarni tozalash
# Bo'sh qiymatlarni o'chirish
df.dropna(inplace=True) 

# Tranzaksiya sanasini datetime formatiga o'tkazish
df['TransactionDate'] = pd.to_datetime(df['TransactionDate'])

# 3. Tahlil: Mijozlar kesimida umumiy xarajatlarni (Chiqim) hisoblash
chiqimlar = df[df['TransactionType'] == 'Chiqim']
mijoz_xarajatlari = chiqimlar.groupby('CustomerID')['Amount'].sum().reset_index()

# 4. Mijozlarni xarajatiga qarab tartiblash (Eng faol mijozlarni topish)
top_mijozlar = mijoz_xarajatlari.sort_values(by='Amount', ascending=False).head(10)
print(top_mijozlar)
```
Bu bosqichda biz millionlab qatorlardan iborat xom-ashyo ma'lumotidan bank uchun eng qadrli (yoki serxarajat) 10 ta mijozni ajratib oldik. 

### 2.2. Tahlil natijalarini Azure SQL ma'lumotlar bazasiga integratsiya qilish va saqlash

Tahlil natijalari doimiy saqlanishi va boshqa xodimlar (masalan, marketing bo'limi) bemalol ishlatishi uchun ularni Azure SQL bazasiga jo'natishimiz zarur. 
Buning uchun Pythonda `pyodbc` kutubxonasi va `SQLAlchemy` dvigatelidan foydalanamiz.

**Bog'lanish va saqlash jarayoni (Python kodi):**

```python
import urllib
from sqlalchemy import create_engine

# 1. Azure SQL uchun ulanish ma'lumotlari
server = 'SizningServeringiz.database.windows.net'
database = 'BankDataDB'
username = 'admin_user'
password = 'SizningParolingiz'
driver = '{ODBC Driver 17 for SQL Server}'

# 2. SQLAlchemy orqali ulanish ipi (connection string) shakllantirish
params = urllib.parse.quote_plus(
    f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

# 3. Pandas DataFrame'ni Azure SQL bazasiga saqlash
# 'TopCustomers' nomli yangi jadvalga tahlil qilingan natijalarni yozamiz
top_mijozlar.to_sql('TopCustomers', con=engine, if_exists='replace', index=False)

print("Tahlil natijalari muvaffaqiyatli ravishda Azure SQL bazasiga saqlandi!")
```
Yuqoridagi jarayonda `if_exists='replace'` parametri orqali har gal yangi tahlil qilinganda, jadval ma'lumotlari yangilanib borilishi ta'minlanadi.

---

## XULOSA

Xulosa o'rnida shuni aytish mumkinki, bank tizimidagi ma'lumotlar miqyosi oshib borishi bilan, ma'lumotlar ilmi usullaridan foydalanish hayotiy zaruratga aylanmoqda. Ushbu kurs ishi doirasida Pythonning Pandas kutubxonasi orqali dastlabki 'xom' ma'lumotlar tartibga solindi, guruhlandi va muhim biznes metrikalari (masalan, mijozlarning faollik reytingi) ishlab chiqildi. 

Bundan tashqari, yaratilgan tahliliy ma'lumotlarni jamoaviy foydalanish va yuqori xavfsizlikni ta'minlash maqsadida Microsoft Azure SQL bulutli bazasiga integratsiya qilish jarayoni muvaffaqiyatli ko'rsatib berildi. Kelajakda bu jarayonni avtomatlashtirish orqali bankning real vaqt (real-time) rejimida qaror qabul qilish tizimini yaratish mumkin.

---

## FOYDALANILGAN ADABIYOTLAR RO'YXATI

1. McKinney, W. (2017). *Python for Data Analysis: Data Wrangling with Pandas, NumPy, and IPython*. O'Reilly Media.
2. Microsoft Learn. "What is Azure SQL Database?" - Rasmiy hujjatlar (docs.microsoft.com).
3. VanderPlas, J. (2016). *Python Data Science Handbook*. O'Reilly Media.
4. Internet manbalari: https://pandas.pydata.org/docs/
5. Internet manbalari: https://learn.microsoft.com/en-us/azure/azure-sql/
