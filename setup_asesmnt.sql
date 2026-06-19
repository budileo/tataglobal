-- SQL Script for Setting Up TATA GLOBAL Assessment Database Schema
-- Please run this script in your Supabase SQL Editor

-- 1. Create hrd_asesmnt Table
CREATE TABLE IF NOT EXISTS public.hrd_asesmnt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pelamar_id UUID REFERENCES public.hrd_pelamar(id) ON DELETE SET NULL,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    kandidat TEXT NOT NULL,
    posisi TEXT NOT NULL,
    asesor TEXT NOT NULL,
    scores JSONB NOT NULL,
    texts JSONB NOT NULL,
    avg_mindset NUMERIC(3,2) NOT NULL,
    avg_attitude NUMERIC(3,2) NOT NULL,
    avg_fit NUMERIC(3,2) NOT NULL,
    cluster TEXT NOT NULL,
    status TEXT NOT NULL,
    rekomendasi TEXT,
    peringatan JSONB,
    kesimpulan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for seamless client-side UI integration
ALTER TABLE public.hrd_asesmnt DISABLE ROW LEVEL SECURITY;
