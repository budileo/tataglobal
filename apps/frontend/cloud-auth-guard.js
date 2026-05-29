import { supabase } from './supabaseClient.js';

/**
 * TATA GLOBAL — Cloud Auth Guard
 * Script ini WAJIB dimuat di SEMUA halaman terproteksi.
 * Fungsi: Memverifikasi sesi Supabase. Jika tidak ada sesi cloud yang valid,
 * sesi lokal akan dihapus dan user dipaksa login ulang.
 */
(async function cloudAuthGuard() {
  const paths = window.location.pathname.split('/').filter(Boolean);
  const rawPage = paths[paths.length - 1] || '';
  const page = rawPage.replace(/-/g, '_').toLowerCase();
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
      
      // Fetch user role and status from Supabase to prevent hardcoded OWNER role
      let { data: appUser } = await supabase.from('app_users').select('*').eq('email', session.user.email).single();
      
      // Auto-migrate owner if missing
      if (!appUser && (session.user.email === 'budileo@gmail.com' || session.user.email === 'budi@tataglobal.com')) {
          await supabase.from('app_users').insert([{
             id: session.user.id,
             name: 'Budi Ariadi',
             email: session.user.email,
             username: 'budileo',
             role: 'OWNER',
             status: 'active',
             department_id: 'dept-global-unggas'
          }]);
          const res = await supabase.from('app_users').select('*').eq('email', session.user.email).single();
          appUser = res.data;
      }

      if (!appUser || appUser.status !== 'active') {
         await supabase.auth.signOut();
         localStorage.removeItem('tata_current_user');
         window.location.replace('index.html');
         return;
      }
      
      // Sinkronkan data user ke lokal (SELALU, bukan hanya saat role berubah)
      AuthGuard.setCurrentUser({
        id: appUser.id,
        name: appUser.name,
        email: appUser.email,
        role: appUser.role,
        status: appUser.status,
        departmentId: appUser.department_id
      });

      // Fetch user_permissions dari Supabase dan sinkronkan ke localStorage
      try {
        const { data: userPermRow } = await supabase
          .from('user_permissions')
          .select('permissions')
          .eq('user_id', appUser.id)
          .single();

        if (userPermRow && userPermRow.permissions) {
          // Sinkronkan override permission dari Supabase ke localStorage
          const localPerms = JSON.parse(localStorage.getItem('tata_user_permissions') || '[]');
          const idx = localPerms.findIndex(o => o.userId === appUser.id);
          if (idx >= 0) {
            localPerms[idx].permissions = userPermRow.permissions;
          } else {
            localPerms.push({ userId: appUser.id, permissions: userPermRow.permissions });
          }
          localStorage.setItem('tata_user_permissions', JSON.stringify(localPerms));
          console.log('[CloudAuthGuard] ✅ Permission di-sync dari Supabase:', userPermRow.permissions);
        } else {
          // Tidak ada override, hapus override lokal yang mungkin basi
          const localPerms = JSON.parse(localStorage.getItem('tata_user_permissions') || '[]');
          const filtered = localPerms.filter(o => o.userId !== appUser.id);
          localStorage.setItem('tata_user_permissions', JSON.stringify(filtered));
          console.log('[CloudAuthGuard] ✅ Tidak ada override, gunakan default role:', appUser.role);
        }
      } catch (permErr) {
        console.warn('[CloudAuthGuard] ⚠️ Gagal sync permission:', permErr.message);
      }

      // Selalu terapkan sidebar permission dari cloud setelah data di-sync
      if (typeof AuthGuard.applySidebarPermissionsFromCloud === 'function') {
        await AuthGuard.applySidebarPermissionsFromCloud();
      } else if (typeof AuthGuard.applySidebarPermissions === 'function') {
        AuthGuard.applySidebarPermissions();
      }
    }
  } catch (e) {
    console.error('Cloud Auth Guard Error:', e);
    // Jika ada error koneksi, tetap izinkan masuk (offline fallback)
  }
})();
