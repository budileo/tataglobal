Fungsinya untuk menyimpan Vendor dari Pembelian Ayam
diletakan di Master Data
data ini di panggil saat mengisi Data Stok DO

Tabel Master Kandang
-----------
Kode Kandang
Nama Kandang
Alamat
Kontak Person


Data Stok DO Ayam (ayam Masuk Via DO)
fungsi sebagai merekam data stok ayam

1. Tanggal 
2. (pilih Nama Kandang) ambil dari Master kandang 
3. Nama supir (ambil dari data karyawan)
4. Lokasi kandang (otomatis)
5. Nama Kernet
6. Jam berangkat 
7. Jam sampai kandang
8. Nomor antrian
9. Jam sampai gudang
10. Staf Timbang
11. Keterangan ayam (sakit,lemah dls)


12. Jumlah Ekor :  (sebagai perhitungan stok)
13. Jumlah Kg : (sebagai perhitungan stok)
14. Rata Rata Ayam : 
Rata Rata Ayam (kg) =rumus (Berat Netto/Jumlah Ayam)

15. Ukuran Ayam Rekomndasi (Otomatis : ) 

Rumus Ukuran :
Jika Rata Rata Ayam 0,5 - 0,7 kg   = maka Rekomendasi Ukuran KTN
Jika Rata Rata Ayam 0,8 - 1,2 kg   = maka Rekomendasi Ukuran K atau K/PK
Jika Rata Rata Ayam 1.3 - 1,6 kg   = maka Rekomendasi Ukuran TB atau B/PK
Jika Rata Rata Ayam 1.7 - 1.99 kg  = maka Rekomendasi Ukuran B
Jika Rata Rata Ayam 2.0 - 2,29 kg  = maka Rekomendasi Ukuran JK atau JB/PK

Ukuran DO
16. Ukuran realisasi DO Ayam
17. Jumlah Susut (kg) : (sebagai perhitungan stok)
18. Jumlah Ayam Mati (ekor) : (sebagai perhitungan stok)
19. Jumlah Ayam Mati (kg) :  (sebagai perhitungan stok)


Stok Ayam Kemarin
------------------
A. Tgl
B. Jumlah Ekor : 
C. Masukan Range : 1,2 samapi 1-4 = 3 range
D. Rata Rata Ayam : sigma range 
   Rumus Rata rata AYam = (Jumlah data)/ Jumlah seluruh data

E. Rekomenadi Ukuran = 
Jika Rata Rata Ayam 0,5 - 0,7 kg   = maka Rekomendasi Ukuran KTN
Jika Rata Rata Ayam 0,8 - 1,2 kg   = maka Rekomendasi Ukuran K atau K/PK
Jika Rata Rata Ayam 1.3 - 1,6 kg   = maka Rekomendasi Ukuran TB atau B/PK
Jika Rata Rata Ayam 1.7 - 1.99 kg  = maka Rekomendasi Ukuran B
Jika Rata Rata Ayam 2.0 - 2,29 kg  = maka Rekomendasi Ukuran JK atau JB/PK

F. Jumlah Kilo = Rumus (jumlah Ekor x Rata rata AYam)
G. Nama Staf : 

Maka Total Stok Ayam
1. Stok Ayam dengan DO Masuk
   - Ukuran 
   - Total Kg
   - Total Ekor
   - rata Rata
2. Stok Ayam Kemarin
   - Ukuran 
   - Total Kg
   - Total Ekor
   - rata rata
3. Stok Ayam = Stok Ayam dengan DO Masuk + Stok Ayam Kemarin

