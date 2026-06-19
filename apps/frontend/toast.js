// toast.js - Premium Toast Notification System
// Slides in from the top-right corner and vanishes after 3 seconds automatically.

(function() {
  // Inject Toast CSS styles if they don't exist
  if (!document.getElementById('toast-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-notification-styles';
    style.innerHTML = `
      #toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .toast-card {
        pointer-events: auto;
        min-width: 320px;
        max-width: 450px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
        border: 1px solid rgba(226, 232, 240, 0.8);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
      }
      .toast-card.show {
        transform: translateX(0);
        opacity: 1;
      }
      .toast-card.hide {
        transform: translateX(120%);
        opacity: 0;
      }
      .toast-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .toast-success {
        border-left: 4px solid #10b981;
      }
      .toast-success .toast-icon {
        background: #ecfdf5;
        color: #10b981;
      }
      .toast-error {
        border-left: 4px solid #ef4444;
      }
      .toast-error .toast-icon {
        background: #fef2f2;
        color: #ef4444;
      }
      .toast-info {
        border-left: 4px solid #3b82f6;
      }
      .toast-info .toast-icon {
        background: #eff6ff;
        color: #3b82f6;
      }
      .toast-warning {
        border-left: 4px solid #f59e0b;
      }
      .toast-warning .toast-icon {
        background: #fffbeb;
        color: #f59e0b;
      }
      .toast-content {
        flex-grow: 1;
      }
      .toast-title {
        font-size: 0.875rem;
        font-weight: 700;
        color: #0f172a;
      }
      .toast-message {
        font-size: 0.75rem;
        font-weight: 500;
        color: #64748b;
        margin-top: 2px;
        line-height: 1.4;
      }
      .toast-close {
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
        border-radius: 8px;
        transition: background 0.2s, color 0.2s;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .toast-close:hover {
        background: #f1f5f9;
        color: #475569;
      }
    `;
    document.head.appendChild(style);
  }

  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
  };

  const titles = {
    success: 'Berhasil',
    error: 'Gagal',
    info: 'Informasi',
    warning: 'Peringatan'
  };

  window.showToast = function(message, type = 'success', customTitle = null) {
    const card = document.createElement('div');
    card.className = `toast-card toast-${type}`;

    const iconHtml = icons[type] || icons.info;
    const titleText = customTitle || titles[type] || 'Informasi';

    card.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-content">
        <div class="toast-title">${titleText}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" title="Tutup">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    container.appendChild(card);

    // Trigger show animation
    setTimeout(() => {
      card.classList.add('show');
    }, 10);

    // Setup close button
    const closeBtn = card.querySelector('.toast-close');
    const dismiss = () => {
      card.classList.remove('show');
      card.classList.add('hide');
      setTimeout(() => {
        card.remove();
      }, 400);
    };

    closeBtn.addEventListener('click', dismiss);

    // Auto dismiss after 3 seconds
    setTimeout(dismiss, 3000);
  };
})();
