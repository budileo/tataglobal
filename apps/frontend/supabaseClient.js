import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Konfigurasi Supabase Project Anda
const SUPABASE_URL = 'https://mbzrtavjswxewzneuzut.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ahy6SBHAsL9yTkLfiRf3Ug_zhzrxEFv';

// Inisialisasi client dengan setting auth standar SaaS
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

window.supabaseClient = supabase;
