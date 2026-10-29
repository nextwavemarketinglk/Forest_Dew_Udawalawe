/**
 * Forest Dew Udawalawa — Creative Motion & Animation System
 * International Boutique Hospitality Standards (Aman, One&Only, Rosewood)
 * GSAP 3.12+ and ScrollTrigger with native IntersectionObserver & CSS fallbacks.
 */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-clip-right, .reveal-clip-up').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    if (hasGSAP) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // 1. Hero Staggered Cinematic Intro
      const heroTimeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      if (document.querySelector('.hero-cinematic')) {
        heroTimeline
          .from('.hero-text-aura', { opacity: 0, scale: 0.85, duration: 1.5, ease: 'power2.out' }, 0.05)
          .from('.hero-kicker', { y: 24, opacity: 0, duration: 0.8, delay: 0.15 })
          .from('.hero-actions', { y: 24, opacity: 0, duration: 0.8 }, '-=0.5')
          .from('.hero-meta-panel', { y: 36, opacity: 0, duration: 0.95 }, '-=0.6')
          .from('.hero-scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.3');

        // Subtle Mousemove Parallax for Hero Aura on Desktop Fine Pointers
        if (window.matchMedia('(pointer: fine)').matches) {
          const heroSection = document.querySelector('.hero-cinematic');
          const heroAura = document.querySelector('.hero-text-aura');
          if (heroSection && heroAura) {
            heroSection.addEventListener('mousemove', (e) => {
              const rect = heroSection.getBoundingClientRect();
              const relX = (e.clientX - rect.left) / rect.width - 0.5;
              const relY = (e.clientY - rect.top) / rect.height - 0.5;
              window.gsap.to(heroAura, {
                x: relX * 35,
                y: relY * 25,
                duration: 1.2,
                ease: 'power2.out'
              });
            });
          }
        }
      }

      // 2. Scroll-Triggered Headings & Cards
      window.gsap.utils.toArray('.reveal-fade-up').forEach(item => {
        window.gsap.fromTo(item, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // 3. Cinematic Clip-Path Image Reveals
      window.gsap.utils.toArray('.reveal-clip-right').forEach(item => {
        window.gsap.fromTo(item,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.25,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // 4. Subtle Parallax for Full Bleed & Sanctuary Sections (Desktop only for hero background to protect mobile focal framing)
      const parallaxSelector = window.innerWidth > 768 
        ? '.hero-bg-media img, .page-hero-bg img, .sanctuary-aerial-card img'
        : '.page-hero-bg img, .sanctuary-aerial-card img';
      
      window.gsap.utils.toArray(parallaxSelector).forEach(img => {
        window.gsap.to(img, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement || img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      });

      // 5. Clean, reliable button hover interactions (no position shifts to guarantee 100% click reliability)
      // Removed magnetic translate jitter that interfered with browser click & tap events

      // 6. Scale In Reveals
      window.gsap.utils.toArray('.reveal-scale-in').forEach(item => {
        window.gsap.fromTo(item,
          { scale: 0.94, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

    } else {
      // Robust IntersectionObserver Fallback
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

        document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-clip-right, .reveal-clip-up, .reveal-scale-in').forEach(el => {
          observer.observe(el);
        });
      } else {
        document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-clip-right, .reveal-clip-up, .reveal-scale-in').forEach(el => {
          el.classList.add('is-revealed');
        });
      }
    }

    // 7. Interactive Multi-Angle Room Gallery Sliders & Showcase Controls
    initRoomInteractions();
  }

  function initRoomInteractions() {
    // A. Multi-Angle Sliders
    document.querySelectorAll('[data-room-slider]').forEach(slider => {
      const slides = slider.querySelectorAll('.room-gallery-slide');
      const tabs = slider.querySelectorAll('.room-view-tab');
      const prevBtn = slider.querySelector('.room-arrow-prev');
      const nextBtn = slider.querySelector('.room-arrow-next');
      let currentIndex = 0;

      if (!slides.length) return;

      function switchSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((slide, i) => {
          slide.classList.toggle('is-active', i === currentIndex);
        });

        tabs.forEach((tab, i) => {
          tab.classList.toggle('is-active', i === currentIndex);
          tab.setAttribute('aria-pressed', String(i === currentIndex));
        });

        // Update zoom button data if present
        const zoomBtn = slider.querySelector('.room-zoom-btn');
        if (zoomBtn && slides[currentIndex]) {
          zoomBtn.dataset.zoomImg = slides[currentIndex].src;
          zoomBtn.dataset.zoomCaption = slides[currentIndex].alt || '';
        }
      }

      tabs.forEach((tab, i) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          switchSlide(i);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          switchSlide(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          switchSlide(currentIndex + 1);
        });
      }

      // Touch swipe support
      let touchStartX = 0;
      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) switchSlide(currentIndex + 1);
          else switchSlide(currentIndex - 1);
        }
      }, { passive: true });
    });

    // B. Lightbox zoom trigger binding (delegated)
    document.addEventListener('click', (e) => {
      const zoomBtn = e.target.closest('.room-zoom-btn');
      if (zoomBtn) {
        e.preventDefault();
        e.stopPropagation();
        const imgSrc = zoomBtn.dataset.zoomImg;
        const caption = zoomBtn.dataset.zoomCaption || '';
        
        const lightboxModal = document.getElementById('gallery-lightbox');
        if (lightboxModal && imgSrc) {
          const lightboxImg = lightboxModal.querySelector('.lightbox-img');
          const lightboxCaption = lightboxModal.querySelector('.lightbox-caption-text');
          if (lightboxImg) {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = caption;
          }
          if (lightboxCaption) {
            lightboxCaption.textContent = caption;
          }
          lightboxModal.classList.add('is-active');
          lightboxModal.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
        }
        return;
      }

      // Universal lightbox close handler
      const closeBtn = e.target.closest('.lightbox-close-btn');
      const modal = e.target.closest('.lightbox-modal');
      if (closeBtn || (modal && e.target === modal)) {
        const lb = document.getElementById('gallery-lightbox');
        if (lb) {
          lb.classList.remove('is-active');
          lb.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const lb = document.getElementById('gallery-lightbox');
        if (lb && lb.classList.contains('is-active')) {
          lb.classList.remove('is-active');
          lb.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
        }
      }
    });

    // C. Creative Room Experience Showcase Tabs
    const showcaseContainer = document.querySelector('.room-experience-showcase');
    if (showcaseContainer) {
      const triggers = showcaseContainer.querySelectorAll('.showcase-tab-trigger');
      const panes = showcaseContainer.querySelectorAll('.showcase-pane');

      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const targetId = trigger.dataset.showcaseTarget;
          triggers.forEach(t => {
            const match = t === trigger;
            t.classList.toggle('is-active', match);
            t.setAttribute('aria-pressed', String(match));
          });

          panes.forEach(pane => {
            const match = pane.id === targetId;
            pane.classList.toggle('is-active', match);
          });
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();
