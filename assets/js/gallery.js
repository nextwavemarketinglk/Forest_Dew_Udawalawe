/**
 * Forest Dew Udawalawa — Visual Journal & Lightbox
 * Full category filtering, keyboard navigation, and accessible modal.
 */

(() => {
  'use strict';

  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');
  const lightboxModal = document.getElementById('gallery-lightbox');
  const lightboxImg = lightboxModal?.querySelector('.lightbox-img');
  const lightboxCaption = lightboxModal?.querySelector('.lightbox-caption-text');
  const lightboxClose = lightboxModal?.querySelector('.lightbox-close-btn');

  let activeIndex = -1;
  let activeVisibleItems = [];
  let previousFocusedElement = null;

  // 1. Filtering Logic
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.galleryFilter;

        // Toggle active button
        filterButtons.forEach(b => {
          const match = b === btn;
          b.classList.toggle('is-active', match);
          b.setAttribute('aria-pressed', String(match));
        });

        // Filter items with multi-category support
        galleryItems.forEach(item => {
          const cat = item.dataset.galleryCategory || '';
          const categories = cat.split(/\s+/);
          const show = filter === 'all' || categories.includes(filter);
          item.style.display = show ? 'block' : 'none';
        });

        updateVisibleList();
      });
    });
  }

  function updateVisibleList() {
    activeVisibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }
  updateVisibleList();

  // 2. Lightbox Open / Close / Navigate
  function openLightbox(item) {
    if (!lightboxModal || !lightboxImg) return;
    previousFocusedElement = document.activeElement;

    updateVisibleList();
    activeIndex = activeVisibleItems.indexOf(item);

    const imgSrc = item.dataset.lightboxSrc || item.querySelector('img')?.src;
    const caption = item.dataset.lightboxCaption || item.querySelector('img')?.alt || '';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightboxModal.classList.add('is-active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (previousFocusedElement) {
      previousFocusedElement.focus();
    }
  }

  function showNextImage() {
    if (!activeVisibleItems.length) return;
    activeIndex = (activeIndex + 1) % activeVisibleItems.length;
    const nextItem = activeVisibleItems[activeIndex];
    const imgSrc = nextItem.dataset.lightboxSrc || nextItem.querySelector('img')?.src;
    const caption = nextItem.dataset.lightboxCaption || nextItem.querySelector('img')?.alt || '';
    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
    }
    if (lightboxCaption) lightboxCaption.textContent = caption;
  }

  function showPrevImage() {
    if (!activeVisibleItems.length) return;
    activeIndex = (activeIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
    const prevItem = activeVisibleItems[activeIndex];
    const imgSrc = prevItem.dataset.lightboxSrc || prevItem.querySelector('img')?.src;
    const caption = prevItem.dataset.lightboxCaption || prevItem.querySelector('img')?.alt || '';
    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
    }
    if (lightboxCaption) lightboxCaption.textContent = caption;
  }

  // Attach click & enter key to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  // Lightbox click outside & close button
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        showNextImage();
      } else {
        showPrevImage();
      }
    }
  }, { passive: true });

})();
