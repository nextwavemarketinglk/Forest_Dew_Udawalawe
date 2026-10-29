/**
 * Forest Dew Udawalawa — Main UI, Navigation & Theme Management
 * Pure Vanilla JavaScript ES6+
 */

(() => {
  'use strict';

  // Config reference
  const CONFIG = window.FOREST_DEW_CONFIG || {};
  const WA_NUMBER = CONFIG.hotel?.whatsappNumber || '94766386132';

  // Storage may be unavailable in restricted previews/private browsing.  Keep
  // navigation and the mobile drawer working even when that happens.
  const safeStorage = {
    getItem(key) {
      try { return window.localStorage.getItem(key); }
      catch (err) { return null; }
    },
    setItem(key, value) {
      try { window.localStorage.setItem(key, value); }
      catch (err) { /* Keep using the current page's setting. */ }
    }
  };

  // 1. Theme (Dark / Light Mode) Controller
  const THEME_KEY = 'fd_theme';
  
  function getPreferredTheme() {
    const saved = safeStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.setItem(THEME_KEY, theme);

    // Update all toggle buttons state
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    });

    window.dispatchEvent(new CustomEvent('fd-theme-change', { detail: { theme } }));
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind toggle click handlers with event delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    e.preventDefault();
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  // Listen for OS theme changes if user hasn't manually chosen
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!safeStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 2. Global Currency & Date Format Helpers
  const CURRENCY_KEY = 'fd_currency';
  const currencies = window.FOREST_DEW_CONFIG?.currencies || {
    USD: { code: "USD", symbol: "$", rateToLKR: 300, prefix: "$" },
    EUR: { code: "EUR", symbol: "€", rateToLKR: 328, prefix: "€" },
    GBP: { code: "GBP", symbol: "£", rateToLKR: 388, prefix: "£" },
    AUD: { code: "AUD", symbol: "A$", rateToLKR: 198, prefix: "A$" },
    LKR: { code: "LKR", symbol: "Rs", rateToLKR: 1, prefix: "LKR " }
  };

  let activeCurrency = safeStorage.getItem(CURRENCY_KEY) || 'USD';
  window.getActiveCurrency = () => activeCurrency;

  window.formatLKR = (num) => `LKR ${Number(num).toLocaleString('en-LK')}`;
  window.formatUSD = (num) => `USD ${Number(num)}`;

  window.convertLKR = (lkrAmount, targetCurrency = activeCurrency) => {
    const curr = currencies[targetCurrency] || currencies.USD;
    if (curr.code === 'LKR') {
      return `LKR ${Number(lkrAmount).toLocaleString('en-LK')}`;
    }
    const converted = Math.round(Number(lkrAmount) / curr.rateToLKR);
    return `~${curr.prefix}${converted.toLocaleString()} ${curr.code}`;
  };

  window.convertUSD = (usdAmount, targetCurrency = activeCurrency) => {
    const lkrEquiv = Number(usdAmount) * 300;
    const curr = currencies[targetCurrency] || currencies.USD;
    if (curr.code === 'USD') {
      return `USD ${usdAmount}`;
    }
    if (curr.code === 'LKR') {
      return `LKR ${Math.round(lkrEquiv).toLocaleString('en-LK')}`;
    }
    const converted = Math.round(lkrEquiv / curr.rateToLKR);
    return `~${curr.prefix}${converted.toLocaleString()} ${curr.code}`;
  };

  window.setCurrency = (currCode) => {
    if (!currencies[currCode]) return;
    activeCurrency = currCode;
    safeStorage.setItem(CURRENCY_KEY, currCode);
    document.documentElement.setAttribute('data-currency', currCode);

    // Update active state on all currency buttons (desktop and mobile)
    document.querySelectorAll('button[data-currency], a[data-currency], [role="button"][data-currency]').forEach(btn => {
      const match = btn.dataset.currency === currCode;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-pressed', String(match));
    });

    // Update all international conversion tags across the page
    document.querySelectorAll('[data-intl-lkr]').forEach(el => {
      const lkr = el.dataset.intlLkr;
      if (activeCurrency === 'LKR') {
        el.textContent = '';
        el.style.display = 'none';
      } else {
        el.textContent = `(${window.convertLKR(lkr, activeCurrency)})`;
        el.style.display = 'inline';
      }
    });

    // Update all safari USD international conversion tags
    document.querySelectorAll('[data-intl-usd]').forEach(el => {
      const usd = el.dataset.intlUsd;
      if (activeCurrency === 'USD') {
        el.textContent = '';
        el.style.display = 'none';
      } else {
        el.textContent = `(${window.convertUSD(usd, activeCurrency)})`;
        el.style.display = 'inline';
      }
    });
  };

  // Listen for currency button clicks
  document.addEventListener('click', (e) => {
    const currBtn = e.target.closest('button[data-currency], a[data-currency], [role="button"][data-currency]');
    if (currBtn) {
      e.preventDefault();
      window.setCurrency(currBtn.dataset.currency);
    }
  });

  // Live Udawalawe Local Time in GMT+5:30
  function updateUdawalaweTime() {
    const timeEls = document.querySelectorAll('#intl-local-time, .intl-live-clock');
    if (!timeEls.length) return;
    try {
      const options = {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const timeStr = formatter.format(new Date());
      timeEls.forEach(el => { el.textContent = timeStr; });
    } catch(e) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const colombo = new Date(utc + (3600000 * 5.5));
      const hh = String(colombo.getHours()).padStart(2, '0');
      const mm = String(colombo.getMinutes()).padStart(2, '0');
      timeEls.forEach(el => { el.textContent = `${hh}:${mm}`; });
    }
  }

  // Initialize currency and live clock on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.setCurrency(activeCurrency);
    updateUdawalaweTime();
    setInterval(updateUdawalaweTime, 10000);
  });
  // Also run immediately in case DOM is already parsed
  setTimeout(() => {
    window.setCurrency(activeCurrency);
    updateUdawalaweTime();
  }, 50);

  window.formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Not selected';
    const d = new Date(`${dateStr}T12:00:00`);
    return isNaN(d) ? dateStr : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Safe WhatsApp sender
  window.sendToWhatsApp = (message) => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = url;
    }
  };

  // 3. Header Scroll & Reading Progress
  const siteHeader = document.querySelector('.site-header');
  const scrollProgress = document.querySelector('.scroll-progress-bar');
  let isTicking = false;

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (scrollProgress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(handleScroll);
      isTicking = true;
    }
  }, { passive: true });
  handleScroll();

  // 4. Mobile Drawer Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  function openMobileMenu() {
    if (!mobileDrawer || !menuToggle) return;
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !menuToggle) return;
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Handle mobile navigation links without aborting document navigation
    mobileDrawer.querySelectorAll('.mobile-drawer-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        const isCurrentPage = link.dataset.link === currentPage ||
                              (currentPage === 'home' && (href === 'index.html' || href === './' || href === ''));
        if (href.startsWith('#') || isCurrentPage) {
          closeMobileMenu();
        } else {
          // Delay menu close slightly so browser can register and initiate page transition
          setTimeout(closeMobileMenu, 200);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  // 5. Active Link Indication
  const currentPage = document.body.dataset.page || '';
  document.querySelectorAll('.desktop-nav .nav-link, .mobile-drawer-link').forEach(link => {
    if (link.dataset.link === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Current Year in Footer
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  // 6. Dynamic Date Input Min Attributes
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if (!input.min) {
      input.min = todayStr;
    }
  });

  // Checkin / Checkout Coupling
  document.querySelectorAll('form').forEach(form => {
    const checkin = form.querySelector('input[name="checkin"]');
    const checkout = form.querySelector('input[name="checkout"]');
    if (checkin && checkout) {
      checkin.addEventListener('change', () => {
        if (!checkin.value) return;
        const d = new Date(`${checkin.value}T12:00:00`);
        d.setDate(d.getDate() + 1);
        const nextDayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        checkout.min = nextDayStr;
        if (checkout.value && checkout.value < nextDayStr) {
          checkout.value = '';
        }
      });
    }
  });

  // 7. Safari Group Size Switcher
  let currentGroupSize = '2';
  window.updateSafariGroupSize = (size) => {
    currentGroupSize = size;
    document.querySelectorAll('[data-party-btn]').forEach(btn => {
      const match = btn.dataset.partyBtn === size;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-pressed', String(match));
    });

    document.querySelectorAll('[data-safari-val]').forEach(valEl => {
      const pkgId = valEl.dataset.safariVal;
      const pkg = CONFIG.safariPackages?.[pkgId];
      if (pkg && pkg.prices[size]) {
        valEl.textContent = `USD ${pkg.prices[size]}`;
      }
    });

    document.querySelectorAll('[data-group-label]').forEach(label => {
      label.textContent = `${size} guests`;
    });
  };

  document.querySelectorAll('[data-party-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.updateSafariGroupSize(btn.dataset.partyBtn);
    });
  });

  // Safari Individual Enquire Buttons
  document.querySelectorAll('[data-safari-enquire]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.dataset.safariEnquire;
      const pkg = CONFIG.safariPackages?.[pkgId];
      if (!pkg) return;
      const price = pkg.prices[currentGroupSize];
      const msg = [
        `Hello Forest Dew Udawalawa, I would like to enquire about your safari experience.`,
        ``,
        `Package: ${pkg.name} (${pkg.duration})`,
        `Group size: ${currentGroupSize} persons`,
        `Package price: USD ${price} (total for group)`,
        `Inclusions: ${pkg.inclusions.join(', ')}`,
        ``,
        `Please confirm available dates, pickup schedule and all safari arrangements. Thank you!`
      ].join('\n');
      window.sendToWhatsApp(msg);
    });
  });

  // 8. Contact Form Direct WhatsApp
  const contactForm = document.querySelector('#contact-enquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.reportValidity()) return;
      const fd = new FormData(contactForm);
      const name = String(fd.get('name') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const subject = String(fd.get('subject') || 'General Enquiry');
      const checkin = String(fd.get('checkin') || '');
      const checkout = String(fd.get('checkout') || '');
      const guests = String(fd.get('guests') || '2');
      const message = String(fd.get('message') || '').trim();

      const lines = [
        `Hello Forest Dew Udawalawa, I have an enquiry regarding my stay.`,
        ``,
        `Name: ${name}`,
        ...(email ? [`Email: ${email}`] : []),
        `Subject: ${subject}`,
        `Guests: ${guests}`,
        ...(checkin ? [`Check-in: ${window.formatDisplayDate(checkin)}`] : []),
        ...(checkout ? [`Check-out: ${window.formatDisplayDate(checkout)}`] : []),
        ``,
        `Message:`,
        message,
        ``,
        `Please let me know availability and pricing. Thank you!`
      ];

      window.sendToWhatsApp(lines.join('\n'));
    });
  }

  // 9. Hero 3-Scene Cinematic Slideshow (Homepage - 4s Interval with Ken Burns Zoom)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroImg = document.querySelector('#hero-dynamic-image');
  const heroSceneButtons = document.querySelectorAll('[data-hero-scene-idx]');
  const SCENE_DURATION = 4000; // 4 seconds interval as requested

  const scenes = [
    { src: 'assets/images/hotel-aerial-canopy.jpg', alt: 'Breathtaking aerial panorama of Forest Dew nestled within Udawalawe forest canopy and lake' },
    { src: 'assets/images/hotel-exterior-facade.jpg', alt: 'Two-storey white boutique guest wing with private balconies, garden terrace, and elephant ear foliage' },
    { src: 'assets/images/swimming-pool.webp', alt: 'Outdoor freshwater swimming pool framed by coconut trees and forest' }
  ];

  if ((heroSlides.length || heroImg) && heroSceneButtons.length) {
    let currentScene = 0;
    let sceneTimer = null;
    const totalScenes = heroSlides.length || scenes.length;

    const heroSceneCaption = document.getElementById('hero-scene-caption');
    const clearViewBtn = document.getElementById('hero-clear-view-toggle');
    const clearViewToast = document.getElementById('hero-clear-view-toast');
    const toastCloseBtn = document.getElementById('hero-toast-close');
    const heroCinematic = document.querySelector('.hero-cinematic');

    const sceneCaptions = [
      '01 · Canopy Panorama',
      '02 · Boutique Architecture',
      '03 · Freshwater Pool'
    ];

    function switchHeroScene(idx) {
      currentScene = idx % totalScenes;

      // Update button indicators & restart 4s progress line
      heroSceneButtons.forEach((btn, i) => {
        const match = i === currentScene;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-pressed', String(match));

        // Reset progress bar animation
        if (match) {
          btn.style.animation = 'none';
          void btn.offsetWidth;
          btn.style.animation = '';
        }
      });

      // Update live atmosphere title caption
      if (heroSceneCaption && sceneCaptions[currentScene]) {
        heroSceneCaption.textContent = sceneCaptions[currentScene];
      }

      // Multi-slide Ken Burns Zoom Transition
      if (heroSlides.length) {
        heroSlides.forEach((slide, i) => {
          const match = i === currentScene;
          slide.classList.toggle('is-active', match);
          if (match) {
            const img = slide.querySelector('img');
            if (img) {
              img.style.animation = 'none';
              void img.offsetWidth; // Force reflow to restart zoom smoothly
              img.style.animation = '';
            }
          }
        });
      } else if (heroImg) {
        // Fallback smooth dissolve if single img
        heroImg.style.transition = 'opacity 0.4s ease, transform 0.6s ease';
        heroImg.style.opacity = '0.3';
        heroImg.style.transform = 'scale(1.04)';
        setTimeout(() => {
          heroImg.src = scenes[currentScene].src;
          heroImg.alt = scenes[currentScene].alt;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 200);
      }
    }

    heroSceneButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.heroSceneIdx, 10);
        switchHeroScene(idx);
        resetTimer();
      });
    });

    // Mobile / Interactive Clear View Mode (Gives visitors an unobstructed, crystal-clear view of the scenes)
    function setClearView(active) {
      if (!heroCinematic) return;
      heroCinematic.classList.toggle('is-clear-view', active);
      if (clearViewBtn) {
        const label = clearViewBtn.querySelector('.view-label');
        if (label) label.textContent = active ? 'Exit View ✕' : 'Clear View';
        clearViewBtn.setAttribute('aria-pressed', String(active));
      }
    }

    if (clearViewBtn && heroCinematic) {
      clearViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = heroCinematic.classList.contains('is-clear-view');
        setClearView(!isActive);
      });
    }

    if (toastCloseBtn) {
      toastCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setClearView(false);
      });
    }

    // Tapping on the hero background while in Clear View restores full booking interface
    if (heroCinematic) {
      heroCinematic.addEventListener('click', (e) => {
        if (heroCinematic.classList.contains('is-clear-view')) {
          if (!e.target.closest('.hero-scene-btns') && !e.target.closest('.hero-clear-view-btn') && !e.target.closest('.header-cta') && !e.target.closest('.brand')) {
            setClearView(false);
          }
        }
      });

      // Mobile Touch Swipe Gesture for Hero Scene Exploration
      let touchStartX = 0;
      let touchStartY = 0;
      heroCinematic.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      heroCinematic.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          // Only trigger if horizontal swipe is dominant and significant
          if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < 0) {
              // Swipe Left: Next Scene
              switchHeroScene((currentScene + 1) % totalScenes);
            } else {
              // Swipe Right: Previous Scene
              switchHeroScene((currentScene - 1 + totalScenes) % totalScenes);
            }
            resetTimer();
          }
        }
      }, { passive: true });
    }

    function resetTimer() {
      if (sceneTimer) clearInterval(sceneTimer);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        sceneTimer = setInterval(() => {
          switchHeroScene((currentScene + 1) % totalScenes);
        }, SCENE_DURATION);
      }
    }

    resetTimer();
  }

})();

