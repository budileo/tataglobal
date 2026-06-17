-- SQL Script for Setting Up TATA GLOBAL HRD Database Schema
-- Please run this script in your Supabase SQL Editor

-- 1. HRD Kehadiran Table
CREATE TABLE IF NOT EXISTS public.hrd_kehadiran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    karyawan_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    asal_tabel TEXT NOT NULL, -- 'operasional' atau 'user'
    tanggal DATE NOT NULL,
    status TEXT NOT NULL, -- 'Hadir', 'Sakit', 'Alfa', 'Cuti', 'Izin'
    jam_datang TIME,
    jam_pulang TIME,
    keterangan_tambahan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT -- ID pengguna sistem yang menginput
);

-- 2. HRD Produktivitas Table
CREATE TABLE IF NOT EXISTS public.hrd_produktivitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    karyawan_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    asal_tabel TEXT NOT NULL,
    tanggal DATE NOT NULL,
    tangkap_ayam_kotak INTEGER DEFAULT 0,
    prestasi_lain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- 3. HRD Pelanggaran Table
CREATE TABLE IF NOT EXISTS public.hrd_pelanggaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    karyawan_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    asal_tabel TEXT NOT NULL,
    tanggal DATE NOT NULL,
    kategori TEXT NOT NULL, -- 'Ringan', 'Berat', 'Sangat Berat'
    detail_pelanggaran TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- 4. HRD Pengembangan Table
CREATE TABLE IF NOT EXISTS public.hrd_pengembangan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    karyawan_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    asal_tabel TEXT NOT NULL,
    tanggal DATE NOT NULL,
    jenis_kegiatan TEXT NOT NULL, -- 'Briefing', 'Meeting', 'Training', 'Coaching'
    kehadiran TEXT NOT NULL, -- 'Hadir', 'Tidak Hadir'
    keterangan TEXT,
    pemateri TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- Disable Row Level Security (RLS) for seamless UI integration
ALTER TABLE public.hrd_kehadiran DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hrd_produktivitas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hrd_pelanggaran DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hrd_pengembangan DISABLE ROW LEVEL SECURITY;

-- Migration script if table already exists (safe for existing data):
ALTER TABLE public.hrd_pengembangan ADD COLUMN IF NOT EXISTS pemateri TEXT;
