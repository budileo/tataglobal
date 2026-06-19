-- SQL Script for Setting Up TATA GLOBAL Recruitment Database Schema
-- Please run this script in your Supabase SQL Editor

-- 1. HRD Lowongan Table
CREATE TABLE IF NOT EXISTS public.hrd_lowongan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lowongan TEXT NOT NULL,
    posisi_lowongan TEXT NOT NULL,
    deskripsi TEXT,
    tanggal_buka DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT -- ID pengguna sistem (HRD) yang menginput
);

-- 2. HRD Pelamar Table
CREATE TABLE IF NOT EXISTS public.hrd_pelamar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lowongan_id UUID REFERENCES public.hrd_lowongan(id) ON DELETE CASCADE,
    tanggal_daftar DATE NOT NULL DEFAULT CURRENT_DATE,
    nama_pelamar TEXT NOT NULL,
    no_ktp TEXT NOT NULL,
    no_sim TEXT,
    nomor_telp TEXT NOT NULL,
    nomor_kontak_keluarga TEXT,
    umur INTEGER,
    status_nikah TEXT, -- 'Belum Menikah', 'Menikah', 'Duda/Janda'
    pendidikan TEXT, -- 'SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'
    gaji_diminta NUMERIC,
    catatan_lain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for seamless client-side UI integration
ALTER TABLE public.hrd_lowongan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hrd_pelamar DISABLE ROW LEVEL SECURITY;
