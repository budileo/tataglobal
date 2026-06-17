-- SQL Script for Setting Up CRM Data Komplain Pelanggan
-- Please run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.crm_komplain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tgl_komplain DATE NOT NULL,
    nama_customer TEXT NOT NULL,
    no_bon TEXT,
    jenis_komplain TEXT NOT NULL,
    detail_komplain TEXT,
    petugas_operasional JSONB DEFAULT '[]'::jsonb,
    petugas_recovery JSONB DEFAULT '[]'::jsonb,
    hasil_recovery TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for seamless UI migration (since data logic relies on frontend AuthGuard)
ALTER TABLE public.crm_komplain DISABLE ROW LEVEL SECURITY;
