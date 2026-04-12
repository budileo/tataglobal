Nama proyek GITHUB
------------------------------------
tataglobal
link reposrorinya
https://github.com/budileo/tataglobal.git


nama repositorinya = tataglobal
git config --global user.name "Budi Ariadi"
git config --global user.email "budileo@gmail.com"
git remote add origin https://github.com/budileo/tataglobal.git
token nya : 

link public nya :
------------------------------------
https://github.com/budileo/tataglobal

Token GITHUB
------------------------------------



DETAIL APLIKASI
------------------------------------
aplikasi Operasional Keuangan untuk menghasilkan laporan operasional penjualan dan keuangan
- Frontend: HTML + Tailwind (boleh tetap sederhana)
- tampilan optimal di gunakan di mobile phone
- Memiliki akses yang cepat
- Menu bar nya bisa di on off kan
🔐 1. LOGIN SYSTEM
User login
Sistem cek role:
Owner → full akses
Operasional → Bon + Master + Laporan
Keuangan → Pembayaran + Laporan
Marketing → Laporan saja
Manager  →  Input Data Master + Laporan

🧾 2. PROSES OPERASIONAL (INPUT BON)
Flow:
Operasional buka menu Bon Penjualan
Klik Tambah Bon
Isi HEADER:
Tanggal
No Bon (Input Manual)
Nama Konsumen (dropdown / tambah baru)
Staf Operasional (dropdown) 
PIC Marketing (dropdown)
Input DETAIL ITEM (multi row):
Jumlah Ayam
Berat Bruto
Berat Kotak (dropdown: 6.2 / 12.4 / custom kelipatan)
👉 Sistem hitung:
Netto = Bruto - Kotak
Ukuran (dropdown)
Harga Satuan
👉 Sistem hitung:
Jumlah = Netto x Harga
Tambahan:
Keterangan
Klik Simpan
 👉 Status Bon = BELUM LUNAS (PIUTANG)

💰 3. PROSES KEUANGAN (PEMBAYARAN)
Flow:
Keuangan buka menu Pembayaran
Pilih No Bon
Sistem auto isi:
Nama Konsumen
Jumlah Tagihan
Input:
Tanggal Pembayaran
Kolektor Marketing (dropdown)
Kasir Finance (Otomatis Saat User Login)
Cara Bayar (Pilihan : Kasir / Marketing / Transfer)
Waktu Bayar (Pilihan : (Pagi / Siang / Sore / Malam)

⚖️ POTONGAN (KRITIKAL AREA)
Input:
Potongan Harga
Ayam Mati (Kg & Rp)
Ayam Susut (Kg & Rp)
Ayam Pulang (Kg & Rp)
👉 Sistem hitung:
Total Potongan = semua Rp
⚠️ Catatan penting:
 Secara logika bisnis:

 Tagihan Akhir = Jumlah Tagihan - Total Potongan


💵 PEMBAYARAN:
Input: Jumlah Bayar
👉 Sistem:
Jika bayar < tagihan → masih PIUTANG
Jika bayar ≥ tagihan → LUNAS

📊 4. OUTPUT LAPORAN

🅰️ Laporan Penerimaan Detail
Isi:
No
Tgl Bayar
Konsumen
No Bon
Kolektor
Potongan Harga
Ayam Mati (Kg & Rp)
Ayam Susut (Kg & Rp)
Ayam Pulang (Kg & Rp)

🅱️ Laporan Summary Harian
PENERIMAAN KAS:
Per Kasir
Per Kolektor
Per Cara Bayar
Total Kas
PENJUALAN:
Total Rp
Total Kg
Total Potongan (detail breakdown)
Total Penjualan Akhir
PIUTANG:
Total Piutang (belum lunas)

🅲 Laporan Piutang Konsumen
Isi:
Nama Konsumen
Total Bon
Total Bayar
Sisa Piutang
Aging (opsional: 0–7 hari, 8–30 hari, dst)

📈 5. DASHBOARD
Tampilan cepat (mobile friendly):
Grafik Penjualan Harian
Grafik Penerimaan Kas
Grafik Piutang
KPI:
Total Penjualan Bulan Ini
Total Konsumen
Total Piutang

📜 6. HISTORI (AUDIT SYSTEM)
Ini penting banget buat kontrol:
Nama User
Aktivitas:
Buat Bon
Edit
Hapus
Pembayaran
Login
Cetak Laporan
Tambah Data Master
Tanggal & Jam
👉 Ini bikin sistem anti manipulasi

🔷 2. CORE FEATURE (FITUR UTAMA)
Ini inti kekuatan aplikasi :

🧠 1. AUTO CALCULATION ENGINE
Semua hitungan otomatis:
Netto
Jumlah per item
Total Bon
Potongan
Tagihan akhir
👉 Minim human error

🔗 2. RELASI DATA (TERINTEGRASI)
Bon → Pembayaran → Laporan
Konsumen → Piutang
Marketing → Kolektor tracking
👉 Ini yang bikin laporan jadi hidup

📉 3. PIUTANG CONTROL SYSTEM
Tracking Bon belum lunas
Status:
Belum bayar
Sebagian
Lunas
Aging Piutang
👉 Ini critical buat cash flow

🧾 4. MULTI ITEM DALAM 1 BON
Real sesuai bisnis ayam
Flexible
Bisa campur ukuran & harga

👥 5. ROLE MANAGEMENT (4 LEVEL)
Sudah tepat:
Owner (full control)
Operasional (input)
Keuangan (uang masuk)
Marketing (monitor)
Manager (Master Data + monitor)
👉 Pisah tugas = aman

📊 6. REALTIME DASHBOARD
Owner bisa lihat:
Hari ini dapat berapa
Siapa belum bayar
Siapa paling besar jualan

📱 7. MOBILE FIRST UI
Karena:
Operasional di lapangan
Marketing mobile
Kasir cepat input

⚡ 8. FAST INPUT DESIGN
Tips penting:
Dropdown (hindari ketik ulang)
Auto fill
Default value
Copy bon sebelumnya 



🔐 9. DATA SECURITY BASIC
Minimal:
Login session
Role validation
Log aktivitas

🔷 3. STRUKTUR MENU FINAL
Ini sudah ideal, aku rapikan:
MENU:
Dashboard
Bon Penjualan
Pembayaran & Potongan
Laporan
Penerimaan Detail
Summary Harian
Piutang Konsumen
Master Data
Konsumen (nama Konsumen, No telpon, Alamat)
Marketing (Nama, No HP)
User
Ukuran Ayam (contoh, K, B, J)
Berat Kotak (6,2 Kg, 12,4 Kg, dst)
Histori Aktivitas
Logout

🔷 4. MASUKAN STRATEGIS (LEVEL BISNIS)
Ini bukan teknis, tapi bikin sistem lu naik kelas:
🔥 1. Tambahkan STATUS BON
Draft
Final
Lunas

🔥 2. Tambahkan LIMIT PIUTANG
Per konsumen:
Misal max 5  juta
 👉 Kalau lewat → warning

🔥 3. Tambahkan VALIDASI
Tidak boleh bayar tanpa bon
Tidak boleh edit bon setelah bayar

🔥 4. FUTURE UPGRADE (WAJIB NANTI)
Export PDF Bon
Export Excel Laporan
Notifikasi Piutang jatuh tempo
Integrasi WhatsApp reminder


Berat Kotak: 1-20 Kotak dalam KG
------------------------------------
0,64 kg
1,28 kg
1,92 kg
2,56 kg
3,2 kg
3,84 kg
4,48 kg
5,12 kg
5,76 kg
6,4 kg
7,04 kg
7,68 kg
8,32 kg
8,96 kg
9,6 kg
10,24 kg
10,88 kg
11,52 kg
12,16 kg
12,8 kg


Ukuran Ayam
------------------------------------
B
K
K/PK
PK
JK
JK/PK
JB
JB/PK
KTB
KTN
TB
TK


Nama Usaha :
CV Global Putra Swasembada
Distributor Ayam Potong Pekanbaru
