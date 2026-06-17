# Rencana Pengembangan Modul Stok Ayam

Berdasarkan dokumen `perhitungan stok ayam.md`, modul ini bertujuan untuk melacak dan menghitung total stok ayam berdasarkan dua komponen utama: **Stok Ayam dengan DO Masuk** (dan pengurangannya) serta **Stok Ayam Kemarin**. 

Sesuai permintaan, kita akan merancang tabel **Master Kandang** dan tabel **Data Stok (dengan 2 jenis)** yang aman dan tidak merusak tabel existing di Supabase.

## User Review Required

> [!IMPORTANT]
> **Struktur Tabel Data Stok**
> Terdapat dua pendekatan untuk menyimpan 2 jenis data stok (DO Masuk & Stok Kemarin):
> 1. **Satu Tabel Gabungan (`stok_ayam`)**: Menggunakan kolom `jenis_stok` ('DO_MASUK', 'STOK_KEMARIN'). Kolom yang tidak relevan untuk salah satu jenis akan dibiarkan `NULL`. (Lebih mudah untuk query total stok).
> 2. **Dua Tabel Terpisah (`stok_do_masuk` dan `stok_kemarin`)**: Memisahkan secara fisik.
> 
> *Rekomendasi saya adalah pendekatan #1 (Satu Tabel Gabungan)* agar kalkulasi total stok jauh lebih mudah, cepat, dan scalable. Mohon persetujuan Anda mengenai pendekatan ini.

## Open Questions

> [!WARNING]
> 1. **Relasi Kandang**: Pada "Stok Ayam Kemarin", apakah perlu dicatat per Kandang juga, atau hanya total global di gudang/penampungan? Di dokumen, Kandang hanya disebutkan di DO Masuk.
> 2. **Master Ukuran & Rumus**: Rumus ukuran (KTN, K, B, dll) apakah akan di-hardcode di kode frontend/backend, atau Anda ingin tabel khusus Master Ukuran agar kedepannya range berat bisa diubah secara dinamis tanpa mengubah kode?
> 3. **Pengurang Stok**: Atribut susut dan mati dicatat di DO Masuk. Apakah ini artinya susut/mati terjadi *saat* bongkar muat DO, atau dihitung secara terpisah setiap hari? 

## Proposed Changes

Kita akan membuat tabel baru (add-on) di Supabase tanpa mengganggu tabel existing. Skema penamaan akan menggunakan prefix atau spesifik untuk modul ini agar terisolasi.

### Komponen 1: Database Schema (Supabase)

#### [NEW] Tabel `master_kandang`
Berfungsi untuk menyimpan daftar kandang agar penulisan nama dan alamat kandang lebih konsisten (tidak diketik manual).
- `id` (uuid, PK, default: uuid_generate_v4())
- `nama_kandang` (varchar, not null)
- `alamat_kandang` (text)
- `created_at` (timestamp, default: now())
- `updated_at` (timestamp, default: now())

#### [NEW] Tabel `data_stok_ayam`
Tabel ini akan menyimpan 2 jenis entri ('DO_MASUK' dan 'STOK_KEMARIN').
- `id` (uuid, PK)
- `jenis_stok` (varchar, not null) -> Nilainya: `DO_MASUK` atau `STOK_KEMARIN`
- `tanggal` (date, not null)
- `jumlah_ekor` (integer, not null)
- `jumlah_kg` (numeric, not null) -> Untuk DO Masuk ini adalah Netto, untuk Kemarin ini adalah Total Kg
- `rata_rata_ayam` (numeric) -> Di-kalkulasi (jumlah_kg / jumlah_ekor)
- `ukuran_ayam` (varchar) -> Berdasarkan rumus (KTN, K/PK, dll)
- `nama_staf` (varchar) -> Staf timbang atau staf pendata

*Kolom spesifik `DO_MASUK` (Nullable):*
- `id_kandang` (uuid, FK ke `master_kandang`)
- `jumlah_keranjang` (integer)
- `jam_bongkar` (time)
- `jumlah_susut_kg` (numeric) -> Pengurang
- `jumlah_mati_ekor` (integer) -> Pengurang
- `jumlah_mati_kg` (numeric) -> Pengurang

*Kolom spesifik `STOK_KEMARIN` (Nullable):*
- `masukan_range` (varchar) -> contoh: "1.2 sampai 1.4"

### Komponen 2: Logika Perhitungan (Frontend/Backend)

- **Netto (DO Masuk):** `Bruto - (Jumlah Keranjang * 6.2)` 
- **Rata Rata Ayam:** `Netto / Jumlah Ekor` (atau `Jumlah Kilo / Jumlah Ekor` untuk stok kemarin)
- **Otomasi Ukuran:**
  - 0.5 - 0.7 kg -> `KTN`
  - 0.8 - 1.2 kg -> `K` atau `K/PK`
  - 1.3 - 1.6 kg -> `TB` atau `B/PK`
  - 1.7 - 1.99 kg -> `B`
  - 2.0 - 2.29 kg -> `JK` atau `JB/PK`
- **Total Stok (Real-time):**
  Akan dikalkulasikan dengan query (atau view Supabase) yang menjumlahkan `Total DO Masuk (Netto Kg & Ekor) - Total Mati/Susut + Total Stok Kemarin`.

## Verification Plan

### Manual Verification
1. Review schema database bersama Anda.
2. Memastikan tidak ada tabel existing (seperti `users`, `permissions`, `transactions` lama) yang di-alter atau di-drop. Semua tabel baru.
3. Setelah disetujui, saya akan memberikan SQL script untuk Anda jalankan di Supabase SQL Editor atau saya jalankan menggunakan API jika diizinkan.
