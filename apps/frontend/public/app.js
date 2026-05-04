// app.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Auth Guard Check
  if (typeof AuthGuard !== 'undefined') {
    if (!AuthGuard.requireAuth()) return;
    AuthGuard.applySidebarPermissions();
  }

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleMenuBtn');
  const mainWrapper = document.getElementById('main-wrapper');
  
  if (sidebar && toggleBtn && mainWrapper) {
    // Inject Token Badge if not present
    if (typeof AuthGuard !== 'undefined' && !document.getElementById('sidebar-token-info')) {
      const dept = AuthGuard.getUserDepartment();
      const tokenDiv = document.createElement('div');
      tokenDiv.id = 'sidebar-token-info';
      tokenDiv.className = 'px-6 py-2 border-t border-slate-800 sidebar-text';
      tokenDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-amber-500 font-black text-xs">🪙</span>
          <span class="text-[10px] font-bold text-slate-400">SALDO TOKEN:</span>
        </div>
        <div class="text-xs font-black text-amber-500 mt-0.5">${dept ? dept.tokenBalance.toLocaleString('id-ID') : 0} Token</div>
      `;
      // Insert before logout
      const logoutLink = sidebar.querySelector('a[href="index.html"]');
      if (logoutLink) sidebar.insertBefore(tokenDiv, logoutLink.parentElement);
      else sidebar.appendChild(tokenDiv);
    }

    toggleBtn.addEventListener('click', () => {
      // Logic for Desktop (Width Toggle)
      const isDesktop = window.innerWidth >= 768;
      
      if (isDesktop) {
        // Toggle desktop width classes
        const isCollapsed = sidebar.classList.contains('md:w-20');
        
        if (isCollapsed) {
          sidebar.classList.remove('md:w-20');
          sidebar.classList.add('md:w-64');
          mainWrapper.classList.remove('md:pl-20');
          mainWrapper.classList.add('md:pl-64');
          document.querySelectorAll('.sidebar-text').forEach(el => el.classList.remove('md:hidden'));
        } else {
          sidebar.classList.remove('md:w-64');
          sidebar.classList.add('md:w-20');
          mainWrapper.classList.remove('md:pl-64');
          mainWrapper.classList.add('md:pl-20');
          document.querySelectorAll('.sidebar-text').forEach(el => el.classList.add('md:hidden'));
        }
      } else {
        // Logic for Mobile (Translate Toggle)
        if (sidebar.style.transform === 'translateY(100%)') {
          sidebar.style.transform = 'translateY(0)';
        } else {
          sidebar.style.transform = 'translateY(100%)';
        }
      }

      // Dispatch event for components that need to resize (e.g. Charts)
      window.dispatchEvent(new CustomEvent('sidebarToggle'));
    });
  }

  // Update sidebar and header user info
  if (typeof AuthGuard !== 'undefined') {
    const user = AuthGuard.getCurrentUser();
    if (user) {
      // Sidebar
      const nameEl = document.getElementById('sidebar-user-name');
      const emailEl = document.getElementById('sidebar-user-email');
      if (nameEl) nameEl.textContent = user.name || '-';
      if (emailEl) emailEl.textContent = user.email || user.role || '-';

      // Header role badge
      const roleBadge = document.getElementById('header-role-badge');
      if (roleBadge) roleBadge.textContent = 'Role: ' + (user.role || '-');

      // Header avatar initial
      const avatar = document.getElementById('header-user-avatar');
      if (avatar) avatar.textContent = (user.name || '-').charAt(0).toUpperCase();
    }
  }
});
