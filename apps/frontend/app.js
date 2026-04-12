// app.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleMenuBtn');
  const mainWrapper = document.getElementById('main-wrapper');
  
  if (sidebar && toggleBtn && mainWrapper) {
    toggleBtn.addEventListener('click', () => {
      // Toggle sidebar width classes
      sidebar.classList.toggle('md:w-64');
      sidebar.classList.toggle('md:w-20');
      
      // Toggle main wrapper padding to match sidebar
      mainWrapper.classList.toggle('md:pl-64');
      mainWrapper.classList.toggle('md:pl-20');
      
      // Hide/Show text in sidebar based on state
      document.querySelectorAll('.sidebar-text').forEach(el => {
        el.classList.toggle('md:hidden');
      });
    });
  }
});
