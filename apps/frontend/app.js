// app.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleMenuBtn');
  const mainWrapper = document.getElementById('main-wrapper');
  
  if (sidebar && toggleBtn && mainWrapper) {
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
        // Logic for Mobile (Translate Toggle - if sidebar is used as a drawer)
        // Note: Currently sidebar is bottom navigation on mobile. 
        // If users want to hide it, we could toggle translateY.
        // But based on user feedback, "on off" usually refers to the desktop sidebar state.
        // We will implement a simple transform toggle for mobile just in case.
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

  // Update sidebar user info
  if (typeof AuthGuard !== 'undefined') {
    const user = AuthGuard.getCurrentUser();
    if (user) {
      const nameEl = document.getElementById('sidebar-user-name');
      const emailEl = document.getElementById('sidebar-user-email');
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email || user.role;
    }
  }
});
