-- SQL Script for Setting Up TATA GLOBAL Database Schema
-- Please run this script in your Supabase SQL Editor

-- 1. Departments Table (Token Balances)
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    token_balance NUMERIC DEFAULT 0,
    invite_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. App Users Table
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    username TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'STAFF',
    status TEXT DEFAULT 'pending',
    department_id TEXT REFERENCES public.departments(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Permissions Table (Overrides)
CREATE TABLE IF NOT EXISTS public.user_permissions (
    user_id TEXT PRIMARY KEY REFERENCES public.app_users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]'::jsonb
);

-- 4. Token Tarif Table
CREATE TABLE IF NOT EXISTS public.token_tarif (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    cost NUMERIC DEFAULT 1
);

-- Insert Default Token Tarifs if empty
INSERT INTO public.token_tarif (code, label, cost)
VALUES 
    ('create', 'Tambah data baru', 1),
    ('update', 'Edit data', 1),
    ('button', 'Aksi tombol', 1),
    ('download', 'Download / Print PDF', 2),
    ('search', 'Pencarian data', 2),
    ('void', 'Void BON / Pembayaran', 1)
ON CONFLICT (code) DO NOTHING;

-- 5. Token History Table
CREATE TABLE IF NOT EXISTS public.token_history (
    id TEXT PRIMARY KEY,
    department_id TEXT REFERENCES public.departments(id),
    user_id TEXT,
    user_name TEXT,
    type TEXT, -- 'consume' or 'topup'
    amount NUMERIC,
    action_code TEXT,
    description TEXT,
    balance_after NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop existing log tables to fix structure as requested
DROP TABLE IF EXISTS public.activity_logs;
DROP TABLE IF EXISTS public.audit_logs;

-- 6. Activity Logs Table (For normal history)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT,
    action TEXT,
    entity_type TEXT,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    status TEXT DEFAULT 'success',
    message TEXT,
    session_id TEXT,
    is_critical BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs Table (For financial/critical history)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT,
    action TEXT,
    entity_type TEXT,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    status TEXT DEFAULT 'success',
    message TEXT,
    session_id TEXT,
    is_critical BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for seamless UI migration (since data logic relies on frontend AuthGuard)
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_tarif DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Insert default department and owner user if table is empty
INSERT INTO public.departments (id, name, token_balance, invite_code)
VALUES ('dept-global-unggas', 'Global Unggas', 100, 'GU-GLOBALUNGGAS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.app_users (id, name, email, username, password_hash, role, status, department_id, created_at)
VALUES (
    'usr-owner-001', 
    'Budi Ariadi', 
    'budi@tataglobal.com', 
    'budileo', 
    '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 
    'OWNER', 
    'active', 
    'dept-global-unggas', 
    '2026-01-01T00:00:00Z'
)
ON CONFLICT (id) DO NOTHING;
