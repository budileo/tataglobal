/**
 * TATA GLOBAL — Auth Guard + Token Engine
 * Handles: Authentication, RBAC permissions, Token SaaS credits (department-level)
 */
const AuthGuard = (function() {
  const KEYS = {
    departments: 'tata_departments',
    users: 'tata_users',
    rolePerms: 'tata_role_permissions',
    userPerms: 'tata_user_permissions',
    tokenTarif: 'tata_token_tarif',
    tokenHistory: 'tata_token_history',
    currentUser: 'tata_current_user'
  };

  // ==================== HELPERS ====================
  function _get(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } }
  function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function _getObj(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e) { return null; } }
  function _id() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 6); }

  async function _hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ==================== SEED DEFAULTS ====================
  function seedDefaults() {
    // 1. Default Departments
    if (_get(KEYS.departments).length === 0) {
      _set(KEYS.departments, [{
        id: 'dept-global-unggas',
        name: 'Global Unggas',
        tokenBalance: 100,
        inviteCode: 'GU-GLOBALUNGGAS',
        createdAt: new Date().toISOString()
      }]);
    }

    // 2. Default Users (Owner)
    if (_get(KEYS.users).length === 0) {
      // SHA-256 of "12345" = 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
      _set(KEYS.users, [{
        id: 'usr-owner-001',
        name: 'Budi Ariadi',
        email: 'budi@tataglobal.com',
        username: 'budileo',
        passwordHash: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
        role: 'OWNER',
        status: 'active',
        departmentId: 'dept-global-unggas',
        createdAt: '2026-01-01T00:00:00Z'
      }]);
    }

    // 3. Default Role Permissions (Force Update to latest)
    _set(KEYS.rolePerms, [
      { role: 'OWNER', permissions: ['dashboard.view','bon.create','bon.update','bon.delete','pembayaran.create','laporan.view','marketing.view','pelanggan.view','void.approve','search.view','master_data.manage','history.view','setting.manage','audit_kpi.view'] },
      { role: 'MANAGER', permissions: ['dashboard.view','bon.create','bon.update','pembayaran.create','laporan.view','marketing.view','pelanggan.view','void.approve','search.view','master_data.manage','history.view','audit_kpi.view'] },
      { role: 'STAFF', permissions: ['dashboard.view','bon.create','pembayaran.create','pelanggan.view','search.view'] }
    ]);

    // 4. Default Token Tarif
    if (_get(KEYS.tokenTarif).length === 0) {
      _set(KEYS.tokenTarif, [
        { code: 'create',   label: 'Tambah data baru', cost: 1 },
        { code: 'update',   label: 'Edit data',        cost: 1 },
        { code: 'button',   label: 'Aksi tombol',      cost: 1 },
        { code: 'download', label: 'Download / Print PDF', cost: 2 },
        { code: 'search',   label: 'Pencarian data',   cost: 2 },
        { code: 'void',     label: 'Void BON / Pembayaran', cost: 1 }
      ]);
    }
  }

  // ==================== CLOUD SYNC ====================
  async function initCloudSync() {
    if (!window.supabaseClient) return;
    try {
      // Fetch all core data from Supabase
      const [
        { data: depts },
        { data: appUsers },
        { data: userPerms },
        { data: tokenTarif },
        { data: tokenHistory }
      ] = await Promise.all([
        window.supabaseClient.from('departments').select('*'),
        window.supabaseClient.from('app_users').select('*'),
        window.supabaseClient.from('user_permissions').select('*'),
        window.supabaseClient.from('token_tarif').select('*'),
        window.supabaseClient.from('token_history').select('*').order('created_at', { ascending: false }).limit(100)
      ]);

      // Update local storage silently if data exists
      if (depts && depts.length > 0) {
        _set(KEYS.departments, depts.map(d => ({
          id: d.id, name: d.name, tokenBalance: Number(d.token_balance), inviteCode: d.invite_code, createdAt: d.created_at
        })));
      }
      
      if (appUsers && appUsers.length > 0) {
        _set(KEYS.users, appUsers.map(u => ({
          id: u.id, name: u.name, email: u.email, username: u.username, passwordHash: u.password_hash,
          role: u.role, status: u.status, departmentId: u.department_id, createdAt: u.created_at
        })));
      }

      if (userPerms && userPerms.length > 0) {
        _set(KEYS.userPerms, userPerms.map(p => ({
          userId: p.user_id, permissions: p.permissions || []
        })));
      }

      if (tokenTarif && tokenTarif.length > 0) {
        _set(KEYS.tokenTarif, tokenTarif.map(t => ({
          code: t.code, label: t.label, cost: Number(t.cost)
        })));
      }

      if (tokenHistory && tokenHistory.length > 0) {
        _set(KEYS.tokenHistory, tokenHistory.map(h => ({
          id: h.id, departmentId: h.department_id, userId: h.user_id, userName: h.user_name,
          type: h.type, amount: Number(h.amount), actionCode: h.action_code, description: h.description,
          balanceAfter: Number(h.balance_after), createdAt: h.created_at
        })));
      }
    } catch (e) {
      console.error("AuthGuard Cloud Sync Error:", e);
    }
  }

  // ==================== AUTH ====================
  function getCurrentUser() {
    return _getObj(KEYS.currentUser);
  }

  function setCurrentUser(user) {
    _set(KEYS.currentUser, user);
  }

  async function logout() {
    // 1. Sign out dari Supabase Cloud (penting agar session cloud terhapus)
    try {
      if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
      }
    } catch(e) { console.error('Supabase signOut error:', e); }
    
    // 2. Hapus session lokal
    localStorage.removeItem(KEYS.currentUser);
    
    // 3. Hapus juga session token Supabase dari localStorage
    const keysToRemove = [];
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if(key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    // 4. Redirect ke login page
    window.location.href = 'index.html';
  }

  function requireAuth() {
    const user = getCurrentUser();
    const paths = window.location.pathname.split('/').filter(Boolean);
    const rawPage = paths[paths.length - 1] || '';
    const page = rawPage.replace(/-/g, '_').toLowerCase();
    const publicPages = ['index.html', 'index', 'join.html', 'join', 'dasbort_menu.html', 'dasbort_menu', ''];
    if (publicPages.includes(page)) return true;
    if (!user) { window.location.href = 'index.html'; return false; }
    if (user.status !== 'active') { window.location.href = 'index.html'; return false; }
    return true;
  }

  async function authenticate(username, password) {
    const users = _get(KEYS.users);
    const hash = await _hash(password);
    const user = users.find(u => u.username === username && u.passwordHash === hash);
    if (!user) return { success: false, message: 'Username atau password salah!' };
    if (user.status === 'pending') return { success: false, message: 'Akun belum diaktivasi oleh Owner.' };
    if (user.status === 'suspended') return { success: false, message: 'Akun Anda dinonaktifkan. Hubungi Owner.' };
    setCurrentUser(user);
    return { success: true, user };
  }

  // ==================== PERMISSIONS ====================
  function getUserPermissions(userId) {
    const users = _get(KEYS.users);
    let user = userId ? users.find(u => u.id === userId) : null;
    
    // Fallback untuk user baru dari Supabase Auth yang belum ada di local 'users'
    if (!user) {
       const curr = getCurrentUser();
       if (curr && (!userId || curr.id === userId)) {
          user = curr;
       }
    }

    if (!user) {
       return [];
    }

    // Get role defaults
    const rolePerms = _get(KEYS.rolePerms);
    const roleEntry = rolePerms.find(r => r.role.toUpperCase() === (user.role || '').toUpperCase());
    const defaults = roleEntry ? [...roleEntry.permissions] : [];

    // Get overrides
    const overrides = _get(KEYS.userPerms);
    const userOverride = overrides.find(o => o.userId === user.id);
    if (userOverride) return userOverride.permissions;

    return defaults;
  }

  function hasPermission(permKey) {
    const user = getCurrentUser();
    if (!user) return false;
    const perms = getUserPermissions(user.id);
    return perms.includes(permKey);
  }

  function requirePermission(permKey) {
    if (!hasPermission(permKey)) {
      alert('⛔ Anda tidak memiliki akses ke fitur ini.');
      window.location.href = 'dasbort_menu.html';
      return false;
    }
    return true;
  }

  // ==================== DEPARTMENTS ====================
  function getDepartments() { return _get(KEYS.departments); }
  function saveDepartments(depts) { 
     _set(KEYS.departments, depts); 
     // Cloud sync
     if (window.supabaseClient) {
        depts.forEach(d => {
           window.supabaseClient.from('departments').upsert({
              id: d.id, name: d.name, token_balance: d.tokenBalance, invite_code: d.inviteCode, created_at: d.createdAt
           }).then();
        });
     }
  }

  function getDepartmentById(id) {
    return _get(KEYS.departments).find(d => d.id === id) || null;
  }

  function getUserDepartment() {
    const user = getCurrentUser();
    if (!user) return null;
    return getDepartmentById(user.departmentId);
  }

  // ==================== TOKEN ENGINE (CLOUD-FIRST) ====================

  // --- Token Tarif: Cloud-First ---
  async function getTokenTarif() {
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('token_tarif').select('*');
        if (!error && data && data.length > 0) {
          const mapped = data.map(t => ({ code: t.code, label: t.label, cost: Number(t.cost) }));
          _set(KEYS.tokenTarif, mapped);
          return mapped;
        }
      } catch(e) { console.warn('getTokenTarif cloud error, fallback lokal:', e.message); }
    }
    return _get(KEYS.tokenTarif);
  }

  async function saveTokenTarif(t) {
    _set(KEYS.tokenTarif, t);
    if (window.supabaseClient) {
      for (const tarif of t) {
        await window.supabaseClient.from('token_tarif').upsert({
          code: tarif.code, label: tarif.label, cost: tarif.cost
        });
      }
    }
  }

  async function getTarifCost(actionCode) {
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('token_tarif').select('cost').eq('code', actionCode).single();
        if (!error && data) return Number(data.cost);
      } catch(e) { /* fallback */ }
    }
    const tarif = _get(KEYS.tokenTarif);
    const entry = tarif.find(t => t.code === actionCode);
    return entry ? entry.cost : 1;
  }

  // --- Saldo Token: Cloud-First ---
  async function getDeptTokenBalance() {
    const user = getCurrentUser();
    if (!user) return 0;
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('departments').select('token_balance').eq('id', user.departmentId).single();
        if (!error && data) {
          // Update local cache
          const depts = _get(KEYS.departments);
          const d = depts.find(x => x.id === user.departmentId);
          if (d) { d.tokenBalance = Number(data.token_balance); _set(KEYS.departments, depts); }
          return Number(data.token_balance);
        }
      } catch(e) { /* fallback */ }
    }
    const dept = getUserDepartment();
    return dept ? dept.tokenBalance : 0;
  }

  async function canAfford(actionCode) {
    const cost = await getTarifCost(actionCode);
    const balance = await getDeptTokenBalance();
    return balance >= cost;
  }

  // --- Consume Token: Cloud-First (async) ---
  async function consumeToken(actionCode, description) {
    const user = getCurrentUser();
    if (!user) return false;

    // Owner tidak perlu potong token
    if (user.role === 'OWNER') return true;

    const cost = await getTarifCost(actionCode);

    // Baca saldo terbaru dari Supabase
    let currentBalance = 0;
    let deptId = user.departmentId;
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('departments').select('token_balance').eq('id', deptId).single();
        if (!error && data) currentBalance = Number(data.token_balance);
        else { const dept = getUserDepartment(); currentBalance = dept ? dept.tokenBalance : 0; }
      } catch(e) { const dept = getUserDepartment(); currentBalance = dept ? dept.tokenBalance : 0; }
    } else {
      const dept = getUserDepartment();
      currentBalance = dept ? dept.tokenBalance : 0;
    }

    if (currentBalance < cost) {
      alert('⚠️ Token tidak cukup!\n\nSaldo departemen: ' + currentBalance + ' token\nBiaya aksi: ' + cost + ' token\n\nHubungi Owner untuk mengisi token.');
      return false;
    }

    const newBalance = currentBalance - cost;

    // Tulis ke Supabase DULU
    const historyEntry = {
      id: 'tkn-' + _id(),
      departmentId: deptId,
      userId: user.id,
      userName: user.name,
      type: 'consume',
      amount: -cost,
      actionCode: actionCode,
      description: description || actionCode,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString()
    };

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('departments').update({ token_balance: newBalance }).eq('id', deptId);
        await window.supabaseClient.from('token_history').insert([{
          id: historyEntry.id, department_id: historyEntry.departmentId, user_id: historyEntry.userId,
          user_name: historyEntry.userName, type: historyEntry.type, amount: historyEntry.amount,
          action_code: historyEntry.actionCode, description: historyEntry.description,
          balance_after: historyEntry.balanceAfter, created_at: historyEntry.createdAt
        }]);
      } catch(e) { console.error('consumeToken cloud write error:', e); }
    }

    // Update local cache
    const depts = _get(KEYS.departments);
    const dept = depts.find(d => d.id === deptId);
    if (dept) { dept.tokenBalance = newBalance; _set(KEYS.departments, depts); }
    const history = _get(KEYS.tokenHistory);
    history.unshift(historyEntry);
    if (history.length > 5000) history.length = 5000;
    _set(KEYS.tokenHistory, history);

    setCurrentUser({ ...user });

    // Refresh sidebar token badge
    refreshSidebarToken();

    return true;
  }

  // --- Top-Up Token: Cloud-First (async) ---
  async function topUpToken(departmentId, amount, note, byUserId) {
    // Baca saldo terbaru dari Supabase
    let currentBalance = 0;
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('departments').select('token_balance').eq('id', departmentId).single();
        if (!error && data) currentBalance = Number(data.token_balance);
        else { const dept = getDepartmentById(departmentId); currentBalance = dept ? dept.tokenBalance : 0; }
      } catch(e) { const dept = getDepartmentById(departmentId); currentBalance = dept ? dept.tokenBalance : 0; }
    } else {
      const dept = getDepartmentById(departmentId);
      currentBalance = dept ? dept.tokenBalance : 0;
    }

    const newBalance = currentBalance + amount;
    const user = getCurrentUser();

    const historyEntry = {
      id: 'tkn-' + _id(),
      departmentId: departmentId,
      userId: byUserId,
      userName: user ? user.name : 'Owner',
      type: 'topup',
      amount: amount,
      actionCode: 'topup',
      description: note || 'Top-up token oleh Owner',
      balanceAfter: newBalance,
      createdAt: new Date().toISOString()
    };

    // Tulis ke Supabase DULU
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('departments').update({ token_balance: newBalance }).eq('id', departmentId);
        await window.supabaseClient.from('token_history').insert([{
          id: historyEntry.id, department_id: historyEntry.departmentId, user_id: historyEntry.userId,
          user_name: historyEntry.userName, type: historyEntry.type, amount: historyEntry.amount,
          action_code: historyEntry.actionCode, description: historyEntry.description,
          balance_after: historyEntry.balanceAfter, created_at: historyEntry.createdAt
        }]);
      } catch(e) { console.error('topUpToken cloud write error:', e); }
    }

    // Update local cache
    const depts = _get(KEYS.departments);
    const dept = depts.find(d => d.id === departmentId);
    if (dept) { dept.tokenBalance = newBalance; _set(KEYS.departments, depts); }
    const history = _get(KEYS.tokenHistory);
    history.unshift(historyEntry);
    _set(KEYS.tokenHistory, history);

    // Refresh sidebar token badge
    refreshSidebarToken();

    return newBalance;
  }

  // --- Token History: Cloud-First (async) ---
  async function getTokenHistory(departmentId) {
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('token_history').select('*')
          .eq('department_id', departmentId)
          .order('created_at', { ascending: false })
          .limit(500);
        if (!error && data) {
          return data.map(h => ({
            id: h.id, departmentId: h.department_id, userId: h.user_id, userName: h.user_name,
            type: h.type, amount: Number(h.amount), actionCode: h.action_code, description: h.description,
            balanceAfter: Number(h.balance_after), createdAt: h.created_at
          }));
        }
      } catch(e) { console.warn('getTokenHistory cloud error, fallback lokal:', e.message); }
    }
    return _get(KEYS.tokenHistory).filter(h => h.departmentId === departmentId);
  }

  // --- Refresh Sidebar Token Badge ---
  async function refreshSidebarToken() {
    const balance = await getDeptTokenBalance();
    const el = document.getElementById('sidebar-token-info');
    if (el) {
      const valEl = el.querySelector('.token-balance-value');
      if (valEl) valEl.textContent = balance.toLocaleString('id-ID') + ' Token';
    }
    // Also update header badge if present
    const headerBadge = document.getElementById('dept-token-badge');
    if (headerBadge) headerBadge.textContent = '🪙 ' + balance.toLocaleString('id-ID') + ' Token';
  }

  // ==================== USERS CRUD ====================
  function getUsers() { return _get(KEYS.users); }
  function saveUsers(users) { 
     _set(KEYS.users, users); 
     if (window.supabaseClient) {
        users.forEach(u => {
           window.supabaseClient.from('app_users').upsert({
              id: u.id, name: u.name, email: u.email, username: u.username, password_hash: u.passwordHash,
              role: u.role, status: u.status, department_id: u.departmentId, created_at: u.createdAt
           }).then();
        });
     }
  }

  function getUsersByDepartment(deptId) {
    return _get(KEYS.users).filter(u => u.departmentId === deptId);
  }

  function setUserPermissions(userId, permissions) {
    const overrides = _get(KEYS.userPerms);
    const idx = overrides.findIndex(o => o.userId === userId);
    if (idx >= 0) overrides[idx].permissions = permissions;
    else overrides.push({ userId, permissions });
    _set(KEYS.userPerms, overrides);
    
    if (window.supabaseClient) {
       window.supabaseClient.from('user_permissions').upsert({
          user_id: userId, permissions: permissions
       }).then();
    }
  }

  function resetUserPermissions(userId) {
    const overrides = _get(KEYS.userPerms);
    _set(KEYS.userPerms, overrides.filter(o => o.userId !== userId));
    
    if (window.supabaseClient) {
       window.supabaseClient.from('user_permissions').delete().eq('user_id', userId).then();
    }
  }

  function hasOverride(userId) {
    return _get(KEYS.userPerms).some(o => o.userId === userId);
  }

  // ==================== INVITE / REGISTRATION ====================
  function getDeptByInviteCode(code) {
    return _get(KEYS.departments).find(d => d.inviteCode === code) || null;
  }

  async function registerUser(inviteCode, name, email, username, password) {
    const dept = getDeptByInviteCode(inviteCode);
    if (!dept) return { success: false, message: 'Kode invite tidak valid.' };

    const users = _get(KEYS.users);
    if (users.some(u => u.username === username)) return { success: false, message: 'Username sudah digunakan.' };

    const hash = await _hash(password);
    const newUser = {
      id: 'usr-' + _id(),
      name, email, username,
      passwordHash: hash,
      role: 'STAFF',
      status: 'pending',
      departmentId: dept.id,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    _set(KEYS.users, users);

    if (window.supabaseClient) {
       window.supabaseClient.from('app_users').insert([{
          id: newUser.id, name: newUser.name, email: newUser.email, username: newUser.username,
          password_hash: newUser.passwordHash, role: newUser.role, status: newUser.status,
          department_id: newUser.departmentId, created_at: newUser.createdAt
       }]).then();
    }

    if (typeof ActivityLogger !== 'undefined') {
      ActivityLogger.log({ action: 'CREATE', entityType: 'USER', entityId: newUser.id, newData: { name, email, username, role: 'STAFF', department: dept.name }, message: 'User baru mendaftar via invite: ' + name });
    }

    return { success: true, user: newUser };
  }

  // ==================== SIDEBAR VISIBILITY ====================
  const menuPermissionMap = {
    'dashboard.html': 'dashboard.view',
    'bon.html': 'bon.create',
    'pembayaran.html': 'pembayaran.create',
    'pelanggan.html': 'pelanggan.view',
    'marketing.html': 'marketing.view',
    'laporan.html': 'laporan.view',
    'master.html': 'master_data.manage',
    'histori.html': 'history.view',
    'void.html': 'void.approve',
    'pencarian.html': 'search.view',
    'setting.html': 'setting.manage',
    'audit-kpi.html': 'audit_kpi.view',
    'stok_ayam.html': 'dashboard.view',
    'dasbort_menu.html': 'dashboard.view',
    'dasbort_finance.html': 'dashboard.view',
    'dasbort_marketing.html': 'dashboard.view',
    'dasbort_hrd.html': 'dashboard.view'
  };

  /**
   * Menampilkan/menyembunyikan menu sidebar berdasarkan daftar permission.
   * @param {string[]} [permList] - Jika diberikan, gunakan daftar ini. Jika tidak, ambil dari lokal.
   */
  function applySidebarPermissions(permList) {
    const user = getCurrentUser();
    if (!user) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Gunakan permList jika diberikan, atau fallback ke lokal
    const perms = permList || getUserPermissions(user.id);

    const links = sidebar.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'index.html') return;

      // Ekstraksi nama file / rute secara aman (strip slashes, hashes, dan query params)
      let filename = href.split('/').pop().split('#')[0].split('?')[0];

      // Cari permission yang cocok (baik dengan atau tanpa ekstensi .html)
      let requiredPerm = menuPermissionMap[filename];
      if (!requiredPerm && !filename.endsWith('.html')) {
        requiredPerm = menuPermissionMap[filename + '.html'];
      }
      if (!requiredPerm && filename.endsWith('.html')) {
        requiredPerm = menuPermissionMap[filename.slice(0, -5)];
      }

      if (requiredPerm) {
        // Tampilkan jika punya permission, sembunyikan jika tidak
        link.style.display = perms.includes(requiredPerm) ? '' : 'none';
      }
    });
  }

  /**
   * Fetch permission dari Supabase lalu terapkan ke sidebar.
   * Ini memastikan menu selalu konsisten dengan database, bukan data lokal browser.
   * Fallback ke data lokal jika Supabase tidak tersedia (offline).
   */
  async function applySidebarPermissionsFromCloud() {
    const user = getCurrentUser();
    if (!user) return;

    // Default: ambil dari lokal dulu sebagai fallback awal
    let perms = getUserPermissions(user.id);

    if (window.supabaseClient) {
      try {
        // 1. Coba ambil override permission untuk user ini dari Supabase
        const { data: userPermRow, error: permErr } = await window.supabaseClient
          .from('user_permissions')
          .select('permissions')
          .eq('user_id', user.id)
          .single();

        if (!permErr && userPermRow && userPermRow.permissions && userPermRow.permissions.length > 0) {
          // User punya override permission di database
          perms = userPermRow.permissions;
          // Sinkronkan ke lokal agar konsisten
          _set(KEYS.userPerms, [{ userId: user.id, permissions: perms }]);
          console.log('[AuthGuard] ✅ Permission diambil dari Supabase (override):', perms);
        } else {
          // Tidak ada override, gunakan default role
          // Ambil role terbaru dari app_users untuk memastikan role konsisten
          const { data: appUser, error: userErr } = await window.supabaseClient
            .from('app_users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!userErr && appUser) {
            // Update role di currentUser jika berbeda
            if (appUser.role !== user.role) {
              user.role = appUser.role;
              setCurrentUser(user);
            }
          }

          // Gunakan default permission berdasarkan role
          const rolePerms = _get(KEYS.rolePerms);
          const roleEntry = rolePerms.find(r => r.role.toUpperCase() === (user.role || '').toUpperCase());
          perms = roleEntry ? [...roleEntry.permissions] : [];
          
          // Hapus override lokal yang mungkin basi
          _set(KEYS.userPerms, _get(KEYS.userPerms).filter(o => o.userId !== user.id));
          console.log('[AuthGuard] ✅ Permission default role "' + user.role + '" dari database:', perms);
        }
      } catch (e) {
        console.warn('[AuthGuard] ⚠️ Gagal fetch permission dari Supabase, gunakan data lokal:', e.message);
        // Tetap gunakan perms dari lokal (sudah di-set di atas)
      }
    }

    // Terapkan ke sidebar
    applySidebarPermissions(perms);
  }

  // ==================== INIT ====================
  seedDefaults();

  return {
    initCloudSync,
    // Auth
    getCurrentUser, setCurrentUser, logout, requireAuth, authenticate,
    // Permissions
    getUserPermissions, hasPermission, requirePermission,
    setUserPermissions, resetUserPermissions, hasOverride,
    // Departments
    getDepartments, saveDepartments, getDepartmentById, getUserDepartment,
    // Token
    getTokenTarif, saveTokenTarif, getTarifCost,
    getDeptTokenBalance, canAfford, consumeToken, topUpToken, getTokenHistory, refreshSidebarToken,
    // Users
    getUsers, saveUsers, getUsersByDepartment,
    // Invite
    getDeptByInviteCode, registerUser,
    // UI
    applySidebarPermissions, applySidebarPermissionsFromCloud, menuPermissionMap,
    // Util
    _hash: _hash, KEYS: KEYS
  };
})();
