-- SQL Script untuk memperbaiki akses data antar User (Menghapus blokade RLS)
-- Jalankan script ini di menu SQL Editor pada Supabase Anda

ALTER TABLE public.bons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pembayaran DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_konsumen DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_marketing DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_operasional DISABLE ROW LEVEL SECURITY;
