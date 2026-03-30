/* ============================================================
   VuaHoanTien — Shared App JavaScript
   Handles: navigation, toasts, modals, copy, filters, tabs,
   form validation, and interactive behaviors
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation ── */
  const nav = document.querySelector('.top-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) navLinks.classList.remove('open');
    });
  }

  /* ── Toast System ── */
  window.VHT = window.VHT || {};

  VHT.toast = function (message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '&#10003;',
      error: '&#10007;',
      warning: '&#9888;',
      info: '&#8505;'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ── Modal System ── */
  VHT.openModal = function (modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  VHT.closeModal = function (modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close modal on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });

  /* ── Copy to Clipboard ── */
  VHT.copyCode = function (code, btn) {
    navigator.clipboard.writeText(code).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '&#10003; Da copy!';
      btn.classList.add('btn-primary');
      VHT.toast('Ma da duoc copy vao clipboard!', 'success');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('btn-primary');
      }, 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      VHT.toast('Ma da duoc copy!', 'success');
    });
  };

  /* ── Tab System ── */
  VHT.initTabs = function (containerSelector) {
    const containers = document.querySelectorAll(containerSelector || '.tabs-container');
    containers.forEach(container => {
      const btns = container.querySelectorAll('.tab-btn');
      const contents = container.querySelectorAll('.tab-content');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;

          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          contents.forEach(c => {
            c.classList.remove('active');
            if (c.dataset.tab === target) c.classList.add('active');
          });
        });
      });
    });
  };

  /* ── Filter Chips ── */
  VHT.initChips = function (containerSelector) {
    const containers = document.querySelectorAll(containerSelector || '.chip-group');
    containers.forEach(container => {
      const chips = container.querySelectorAll('.chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          // Toggle or single select based on data-mode
          if (container.dataset.mode === 'multi') {
            chip.classList.toggle('active');
          } else {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          }
          // Fire custom event
          container.dispatchEvent(new CustomEvent('filter-change', {
            detail: {
              active: Array.from(container.querySelectorAll('.chip.active'))
                .map(c => c.dataset.value)
            }
          }));
        });
      });
    });
  };

  /* ── Form Validation ── */
  VHT.validateForm = function (formEl) {
    let valid = true;
    const inputs = formEl.querySelectorAll('[data-required]');

    inputs.forEach(input => {
      const errorEl = input.parentElement.querySelector('.form-error');

      // Reset
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';

      // Check empty
      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = 'Truong nay khong duoc de trong';
        valid = false;
        return;
      }

      // Check email
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = 'Email khong hop le';
        valid = false;
        return;
      }

      // Check min length
      if (input.dataset.minlength && input.value.length < parseInt(input.dataset.minlength)) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = `Toi thieu ${input.dataset.minlength} ky tu`;
        valid = false;
        return;
      }

      // Check password match
      if (input.dataset.match) {
        const matchEl = formEl.querySelector(input.dataset.match);
        if (matchEl && input.value !== matchEl.value) {
          input.classList.add('error');
          if (errorEl) errorEl.textContent = 'Mat khau khong khop';
          valid = false;
        }
      }
    });

    return valid;
  };

  /* ── Format Currency ── */
  VHT.formatVND = function (amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  VHT.formatNumber = function (num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  /* ── Sidebar Filter Toggle (mobile) ── */
  VHT.toggleSidebar = function () {
    const sidebar = document.querySelector('.sidebar-filter');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
    }
  };

  /* ── Notification Bell ── */
  VHT.markAsRead = function (itemEl) {
    itemEl.classList.remove('unread');
    // Update count badge
    const badge = document.querySelector('.notif-count');
    if (badge) {
      const current = parseInt(badge.textContent) || 0;
      if (current > 1) {
        badge.textContent = current - 1;
      } else {
        badge.style.display = 'none';
      }
    }
  };

  /* ── Withdrawal Form Logic ── */
  VHT.initWithdrawalForm = function () {
    const amountInput = document.getElementById('withdrawal-amount');
    const availableEl = document.getElementById('available-balance');
    if (!amountInput || !availableEl) return;

    amountInput.addEventListener('input', () => {
      const val = parseInt(amountInput.value.replace(/\D/g, '')) || 0;
      const available = parseInt(availableEl.dataset.amount) || 0;
      const errorEl = amountInput.parentElement.querySelector('.form-error');

      if (val > available) {
        amountInput.classList.add('error');
        if (errorEl) errorEl.textContent = 'Vuot qua so du kha dung';
      } else if (val < 50000 && val > 0) {
        amountInput.classList.add('error');
        if (errorEl) errorEl.textContent = 'So tien toi thieu la 50,000 VND';
      } else {
        amountInput.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  };

  /* ── URL Input Validation ── */
  VHT.initURLInput = function () {
    const urlInputs = document.querySelectorAll('.url-input-wrap input');
    urlInputs.forEach(input => {
      const wrap = input.closest('.url-input-wrap');
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val && !val.match(/^https?:\/\/(.*\.)?(shopee|lazada)\./i)) {
          wrap.style.borderColor = 'var(--state-danger)';
        } else if (val) {
          wrap.style.borderColor = 'var(--state-success)';
        } else {
          wrap.style.borderColor = '';
        }
      });
    });
  };

  /* ── Simulate Deep Link Creation ── */
  VHT.createDeepLink = function (url) {
    if (!url.trim()) {
      VHT.toast('Vui long dan link san pham', 'warning');
      return;
    }
    if (!url.match(/^https?:\/\/(.*\.)?(shopee|lazada)\./i)) {
      VHT.toast('Chi ho tro link tu Shopee hoac Lazada', 'error');
      return;
    }
    // Simulate - redirect to cashback result page
    VHT.toast('Dang tao link...', 'info');
    setTimeout(() => {
      window.location.href = 'cashback-result.html?url=' + encodeURIComponent(url);
    }, 800);
  };

  /* ── Scroll Reveal Animation ── */
  VHT.initScrollReveal = function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };

  /* ── Number Counter Animation ── */
  VHT.animateCounter = function (el, target, duration = 1200) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = VHT.formatNumber(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── Initialize on DOM Ready ── */
  document.addEventListener('DOMContentLoaded', () => {
    VHT.initTabs();
    VHT.initChips();
    VHT.initURLInput();
    VHT.initWithdrawalForm();
    VHT.initScrollReveal();

    // Animate counters
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter);
      if (target) VHT.animateCounter(el, target);
    });

    // Simulate logged-in state
    const authLinks = document.querySelectorAll('[data-auth-required]');
    const isLoggedIn = localStorage.getItem('vht_logged_in') === 'true';
    authLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          VHT.toast('Vui long dang nhap de tiep tuc', 'warning');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        }
      });
    });
  });

})();
