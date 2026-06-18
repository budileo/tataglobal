(function() {
  const paths = window.location.pathname.split('/').filter(Boolean);
  const currentPath = paths[paths.length - 1] || 'index.html';
  const cleanPath = currentPath.split('#')[0].split('?')[0];

  // Normalisasi semua tanda hubung (-) menjadi garis bawah (_) untuk kompatibilitas penuh dengan build Vercel / Vite
  const normalizedPath = cleanPath.replace(/-/g, '_').toLowerCase();

  let activeModule = localStorage.getItem('active_module') || 'marketing';

  if (normalizedPath === 'dasbort_finance.html' || normalizedPath === 'dasbort_finance') {
    activeModule = 'finance';
    localStorage.setItem('active_module', 'finance');
  } else if (normalizedPath === 'dasbort_marketing.html' || normalizedPath === 'dasbort_marketing') {
    activeModule = 'marketing';
    localStorage.setItem('active_module', 'marketing');
  } else if (normalizedPath === 'dashboard.html' || normalizedPath === 'dashboard') {
    activeModule = 'operasional';
    localStorage.setItem('active_module', 'operasional');
  } else if (normalizedPath === 'dasbort_hrd.html' || normalizedPath === 'dasbort_hrd') {
    activeModule = 'hrd';
    localStorage.setItem('active_module', 'hrd');
  } else if (normalizedPath === 'setting.html' || normalizedPath === 'setting') {
    activeModule = 'setting';
    localStorage.setItem('active_module', 'setting');
  } else if (normalizedPath === 'dasbort_crm.html' || normalizedPath === 'dasbort_crm' || normalizedPath === 'komplain_pelanggan.html' || normalizedPath === 'komplain_pelanggan' || normalizedPath === 'laporan_komplain.html' || normalizedPath === 'laporan_komplain') {
    activeModule = 'crm';
    localStorage.setItem('active_module', 'crm');
  }

  const icons = {
    'Menu Utama': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>',
    'Dashboard': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
    'Marketing': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>',
    'Pelanggan': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
    'Laporan': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
    'Pencarian': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
    'Pembayaran': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
    'Void': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
    'Master Data': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>',
    'Bon Penjualan': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
    'Audit & KPI': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    'Pengaturan': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
    'Histori Aktivitas': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    'Stok Ayam': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>',
    'Komplain': '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>'
  };

  const operasionalMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'dashboard.html', icon: 'Dashboard' },
    { title: 'Stok Ayam', href: 'stok_ayam.html', icon: 'Stok Ayam' },
    { title: 'Bon Penjualan', href: 'bon.html', icon: 'Bon Penjualan' },
    { title: 'Pelanggan', href: 'pelanggan.html', icon: 'Pelanggan' },
    { title: 'Void', href: 'void.html', icon: 'Void' },
    { title: 'Master Data', href: 'master.html', icon: 'Master Data' },
    { title: 'Pencarian', href: 'pencarian.html', icon: 'Pencarian' },
    { title: 'Laporan', href: 'laporan.html', icon: 'Laporan' }
  ];

  const financeMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'dasbort_finance.html', icon: 'Dashboard' },
    { title: 'Pembayaran', href: 'pembayaran.html', icon: 'Pembayaran' },
    { title: 'Pelanggan', href: 'pelanggan.html', icon: 'Pelanggan' },
    { title: 'Void', href: 'void.html', icon: 'Void' },
    { title: 'Master Data', href: 'master.html', icon: 'Master Data' },
    { title: 'Pencarian', href: 'pencarian.html', icon: 'Pencarian' },
    { title: 'Laporan', href: 'laporan.html', icon: 'Laporan' }
  ];

  const marketingMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'dasbort_marketing.html', icon: 'Dashboard' },
    { title: 'Marketing', href: 'marketing.html', icon: 'Marketing' },
    { title: 'Pelanggan', href: 'pelanggan.html', icon: 'Pelanggan' },
    { title: 'Laporan', href: 'laporan.html', icon: 'Laporan' },
    { title: 'Pencarian', href: 'pencarian.html', icon: 'Pencarian' }
  ];

  const hrdMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'dasbort_hrd.html', icon: 'Dashboard' },
    { title: 'Audit & KPI', href: 'audit-kpi.html', icon: 'Audit & KPI' }
  ];

  const settingMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'setting.html', icon: 'Dashboard' },
    { title: 'Pengaturan', href: 'setting.html', icon: 'Pengaturan' },
    { title: 'Audit & KPI', href: 'audit-kpi.html', icon: 'Audit & KPI' },
    { title: 'Histori Aktivitas', href: 'histori.html', icon: 'Histori Aktivitas' }
  ];

  const crmMenu = [
    { title: 'Menu Utama', href: 'dasbort_menu.html', icon: 'Menu Utama' },
    { title: 'Dashboard', href: 'laporan_komplain.html', icon: 'Laporan' },
    { title: 'Komplain', href: 'komplain_pelanggan.html', icon: 'Komplain' }
  ];

  // Tentukan menu aktif berdasarkan modul yang terdeteksi secara case-insensitive & dash-tolerant
  let activeMenus = marketingMenu;
  if (activeModule === 'finance') {
    activeMenus = financeMenu;
  } else if (activeModule === 'operasional') {
    activeMenus = operasionalMenu;
  } else if (activeModule === 'hrd') {
    activeMenus = hrdMenu;
  } else if (activeModule === 'setting') {
    activeMenus = settingMenu;
  } else if (activeModule === 'crm') {
    activeMenus = crmMenu;
  }

  const renderSidebar = () => {
    const container = document.getElementById('sidebar-menu-container');
    if (!container) return;

    let html = '';
    activeMenus.forEach(item => {
      // Pengecekan status aktif secara fleksibel (keduanya dinormalisasi tanda hubungnya)
      const pathPart = normalizedPath;
      const hrefPart = item.href.replace(/-/g, '_').toLowerCase();
      const isActive = pathPart === hrefPart || pathPart + '.html' === hrefPart || hrefPart + '.html' === pathPart;
      
      let cssClass = '';
      if (item.title === 'Menu Utama') {
        cssClass = 'text-amber-400 hover:text-amber-300 hover:bg-slate-800';
      } else if (isActive) {
        cssClass = 'bg-emerald-600 text-white rounded-lg md:rounded-none mx-1 md:mx-0';
      } else {
        cssClass = 'text-slate-400 hover:text-white hover:bg-slate-800';
      }

      html += `
        <a href="${item.href}" title="${item.title}" class="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 p-2 md:px-6 md:py-3 transition-colors ${cssClass}">
          ${icons[item.icon] || ''}
          <span class="text-[10px] md:text-sm font-medium sidebar-text whitespace-nowrap">${item.title}</span>
        </a>
      `;
    });

    container.innerHTML = html;

    // Segera panggil AuthGuard untuk menerapkan izin pada link yang baru dirender
    if (typeof AuthGuard !== 'undefined' && typeof AuthGuard.applySidebarPermissions === 'function') {
      AuthGuard.applySidebarPermissions();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }
})();
