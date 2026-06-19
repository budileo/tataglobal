document.addEventListener('DOMContentLoaded', () => {
  // Try to load sidebar using fetch (works on HTTP/Live Server)
  fetch('sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(html => injectSidebar(html))
    .catch(err => {
      console.warn("Fetch gagal (kemungkinan karena dibuka via file:///), menggunakan fallback HTML internal:", err);
      injectSidebar(getSidebarFallbackHTML());
    });
});

function injectSidebar(html) {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = html;
    initSidebar();
    if (window.feather) window.feather.replace();
    // Important to re-apply active state to newly loaded nav links
    if (window.applyNavActiveState) {
      window.applyNavActiveState();
    }
  }
}

function getSidebarFallbackHTML() {
  return `
<!-- Mobile Overlay -->
<div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-20 hidden lg:hidden transition-opacity duration-300 opacity-0 cursor-pointer"></div>

<!-- Sidebar -->
<aside id="main-sidebar" class="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 transform -translate-x-full lg:translate-x-0 print:hidden overflow-hidden">
  <div class="py-4 flex items-center justify-center border-b border-slate-700 h-16 min-h-[4rem] transition-all duration-300 flex-shrink-0">
    <h1 id="sidebar-title" class="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight text-center whitespace-nowrap transition-opacity duration-300">
      <span class="block lg:hidden sm:text-lg">TATA KELOLA<br>9-Box</span>
      <span class="hidden lg:block text-lg">TATA KELOLA<br>9-Box</span>
    </h1>
    <i data-feather="box" id="sidebar-icon-logo" class="hidden text-blue-400 w-8 h-8 flex-shrink-0"></i>
  </div>
  <nav class="flex-1 p-4 space-y-2 mt-2 overflow-y-auto overflow-x-hidden no-scrollbar" id="main-nav">
    <a href="#/" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="dashboard">
      <i data-feather="grid" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Dashboard</span>
    </a>
    <a href="#/employees" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="employees">
      <i data-feather="users" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Karyawan</span>
    </a>
    <a href="#/posmatch" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="posmatch">
      <i data-feather="user-check" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Pra Asesmen</span>
    </a>
    <a href="#/assessment" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="assessment">
      <i data-feather="clipboard" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Asesmen Baru</span>
    </a>
    <a href="#/history" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="history">
      <i data-feather="clock" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Riwayat Asesmen</span>
    </a>
    <a href="#/reference" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors nav-link whitespace-nowrap overflow-hidden group" data-view="reference">
      <i data-feather="book-open" class="flex-shrink-0 group-hover:text-blue-400 transition-colors"></i>
      <span class="sidebar-text transition-opacity duration-300">Referensi HRD</span>
    </a>
  </nav>
  <div class="p-4 border-t border-slate-700 transition-all duration-300 flex-shrink-0 h-16 min-h-[4rem] flex items-center justify-center">
    <div id="sidebar-footer-text" class="text-sm text-slate-400 text-center whitespace-nowrap transition-opacity duration-300">
      Budi Ariadi<br>2026
    </div>
    <div id="sidebar-footer-icon" class="hidden text-slate-400 flex items-center justify-center">
      <i data-feather="user"></i>
    </div>
  </div>
</aside>
  `;
}

function initSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const mainWrapper = document.getElementById('main-content-wrapper');
  
  const sidebarTexts = document.querySelectorAll('.sidebar-text');
  const sidebarTitle = document.getElementById('sidebar-title');
  const sidebarIconLogo = document.getElementById('sidebar-icon-logo');
  const sidebarFooterText = document.getElementById('sidebar-footer-text');
  const sidebarFooterIcon = document.getElementById('sidebar-footer-icon');

  let isCollapsed = false; // Desktop: collapsed or expanded
  let isMobileOpen = false; // Mobile: open or closed

  function updateSidebarState() {
    if (window.innerWidth >= 1024) { // Desktop (lg)
      // Reset mobile states
      isMobileOpen = false;
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.add('hidden');
      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');

      if (isCollapsed) {
        // Mini sidebar
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');
        mainWrapper.classList.remove('lg:ml-64');
        mainWrapper.classList.add('lg:ml-20');
        
        sidebarTitle.classList.add('hidden');
        sidebarIconLogo.classList.remove('hidden');
        
        sidebarTexts.forEach(el => el.classList.add('hidden'));
        
        sidebarFooterText.classList.add('hidden');
        sidebarFooterIcon.classList.remove('hidden');
      } else {
        // Expanded sidebar
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');
        mainWrapper.classList.remove('lg:ml-20');
        mainWrapper.classList.add('lg:ml-64');
        
        sidebarIconLogo.classList.add('hidden');
        sidebarTitle.classList.remove('hidden');
        
        sidebarTexts.forEach(el => el.classList.remove('hidden'));
        
        sidebarFooterIcon.classList.add('hidden');
        sidebarFooterText.classList.remove('hidden');
      }
    } else { // Mobile (< lg)
      // Desktop state reset
      mainWrapper.classList.remove('lg:ml-64', 'lg:ml-20'); // handled by lg: prefix but just to be sure
      // Always w-64 for mobile
      sidebar.classList.remove('w-20');
      sidebar.classList.add('w-64');
      
      sidebarIconLogo.classList.add('hidden');
      sidebarTitle.classList.remove('hidden');
      sidebarTexts.forEach(el => el.classList.remove('hidden'));
      sidebarFooterIcon.classList.add('hidden');
      sidebarFooterText.classList.remove('hidden');

      if (isMobileOpen) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        // Small delay to allow display block to apply before opacity transition
        setTimeout(() => {
          overlay.classList.remove('opacity-0');
          overlay.classList.add('opacity-100');
        }, 10);
      } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300); // Wait for transition
      }
    }
  }

  // Toggle button handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth >= 1024) {
        isCollapsed = !isCollapsed;
      } else {
        isMobileOpen = !isMobileOpen;
      }
      updateSidebarState();
    });
  }

  // Overlay click handler
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        isMobileOpen = false;
        updateSidebarState();
      }
    });
  }

  // Close sidebar on mobile when a nav link is clicked
  const navLinks = sidebar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        isMobileOpen = false;
        updateSidebarState();
      }
    });
  });

  window.addEventListener('resize', () => {
    // Prevent state jumping horizontally during resizing if possible
    updateSidebarState();
  });
  
  // Init state
  updateSidebarState();
}
