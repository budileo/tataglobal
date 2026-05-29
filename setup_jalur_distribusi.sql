-- ============================================================
-- SQL Script: Tambah Tabel Jalur Distribusi
-- AMAN: Tidak merusak data yang sudah ada
-- Jalankan script ini di menu SQL Editor pada Supabase Anda
-- ============================================================

-- 1. Buat tabel jalur_distribusi (IF NOT EXISTS = aman jika sudah ada)
CREATE TABLE IF NOT EXISTS public.jalur_distribusi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Disable RLS agar sesuai pola keamanan aplikasi saat ini
ALTER TABLE public.jalur_distribusi DISABLE ROW LEVEL SECURITY;

-- 3. Tambah kolom jalur di master_konsumen (IF NOT EXISTS = aman)
--    Data lama otomatis mendapat nilai kosong ('')
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'master_konsumen' 
          AND column_name = 'jalur'
    ) THEN
        ALTER TABLE public.master_konsumen ADD COLUMN jalur TEXT DEFAULT '';
    END IF;
END $$;
