import { supabase } from './supabaseClient.js';

/**
 * TATA GLOBAL — Cloud Auth Guard
 * Script ini WAJIB dimuat di SEMUA halaman terproteksi.
 * Fungsi: Memverifikasi sesi Supabase. Jika tidak ada sesi cloud yang valid,
 * sesi lokal akan dihapus dan user dipaksa login ulang.
 */
(async function cloudAuthGuard() {
  // Jangan jalankan di halaman login/join
  const page = window.location.pathname.split('/').pop() || '';
  if (['index.html', 'index', 'join.html', 'join', ''].includes(page)) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Tidak ada sesi cloud → hapus semua sesi lokal → paksa login
      localStorage.removeItem('tata_current_user');
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
        }
      }
      window.location.replace('index.html');
      return;
    }

    // Sesi cloud valid → pastikan AuthGuard lokal juga ter-sinkronisasi
    if (typeof AuthGuard !== 'undefined') {
      const currentLocal = AuthGuard.getCurrentUser();
      // Force OWNER for budileo even if session says otherwise
      let role = 'OWNER';
      
      // Jika belum ada lokal, atau ID-nya beda dengan session cloud, atau jika budileo dipaksa OWNER
      if (!currentLocal || currentLocal.id !== session.user.id || (session.user.email === 'budileo@gmail.com' && currentLocal.role !== 'OWNER')) {
        AuthGuard.setCurrentUser({
          id: session.user.id,
          name: session.user.email.split('@')[0],
          email: session.user.email,
          role: role,
          status: 'active',
          departmentId: 'dept-global-unggas'
        });
      }
    }
  } catch (e) {
    console.error('Cloud Auth Guard Error:', e);
    // Jika ada error koneksi, tetap izinkan masuk (offline fallback)
  }
})();
