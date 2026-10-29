/**
 * Forest Dew Udawalawa — Reservation & Stay Planner Logic
 * Pure client-side arithmetic.
 * NEVER adds or converts LKR and USD together.
 * No fake live booking or simulated database transactions.
 */

(() => {
  'use strict';

  const CONFIG = window.FOREST_DEW_CONFIG || {};
  const ROOM_RATES = CONFIG.roomRates || {};
  const MEAL_PLANS = CONFIG.mealPlans || {};
  const SAFARI_PACKAGES = CONFIG.safariPackages || {};

  // Nights calculation helper
  function calculateNights(checkinStr, checkoutStr) {
    if (!checkinStr || !checkoutStr) return null;
    const d1 = Date.parse(`${checkinStr}T12:00:00Z`);
    const d2 = Date.parse(`${checkoutStr}T12:00:00Z`);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return Number.isFinite(diff) && diff > 0 ? diff : null;
  }

  // 1. Quick Booking Bar (Homepage)
  const quickBookingForm = document.querySelector('#quick-booking-form');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!quickBookingForm.reportValidity()) return;
      const fd = new FormData(quickBookingForm);
      const checkin = String(fd.get('checkin') || '');
      const checkout = String(fd.get('checkout') || '');
      const room = String(fd.get('room') || 'double');
      const guests = String(fd.get('guests') || '2');

      if (checkin && checkout && !calculateNights(checkin, checkout)) {
        alert('Check-out date must be later than check-in date.');
        return;
      }

      const params = new URLSearchParams({
        room,
        guests,
        ...(checkin ? { checkin } : {}),
        ...(checkout ? { checkout } : {})
      });

      window.location.href = `plan-stay.html?${params.toString()}#builder`;
    });
  }

  // 2. Interactive Room Rate Estimator (Rooms Page)
  const roomCalcForm = document.querySelector('#room-rate-calculator');
  if (roomCalcForm) {
    const totalOut = document.querySelector('#room-calc-total');
    const breakdownOut = document.querySelector('#room-calc-breakdown');

    function updateRoomCalculation() {
      const fd = new FormData(roomCalcForm);
      const roomKey = String(fd.get('room') || 'double');
      const planKey = String(fd.get('plan') || 'bb');
      const checkin = String(fd.get('checkin') || '');
      const checkout = String(fd.get('checkout') || '');

      const roomData = ROOM_RATES[roomKey];
      const nightlyRate = roomData?.rates?.[planKey] || 0;
      const nights = calculateNights(checkin, checkout);

      if (!nights) {
        if (totalOut) totalOut.textContent = `${window.formatLKR(nightlyRate)} / night`;
        if (breakdownOut) breakdownOut.textContent = 'Select arrival and departure dates to calculate indicative total.';
        return { roomKey, planKey, nightlyRate, nights: null, total: null };
      }

      const total = nightlyRate * nights;
      if (totalOut) totalOut.textContent = window.formatLKR(total);
      if (breakdownOut) breakdownOut.textContent = `${nights} night${nights === 1 ? '' : 's'} × ${window.formatLKR(nightlyRate)} / night (Indicative)`;

      return { roomKey, planKey, checkin, checkout, nightlyRate, nights, total };
    }

    // Set initial values from URL if present
    const params = new URLSearchParams(window.location.search);
    if (params.get('room') && ROOM_RATES[params.get('room')]) {
      roomCalcForm.elements.room.value = params.get('room');
    }
    if (params.get('checkin')) roomCalcForm.elements.checkin.value = params.get('checkin');
    if (params.get('checkout')) roomCalcForm.elements.checkout.value = params.get('checkout');

    roomCalcForm.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', updateRoomCalculation);
      el.addEventListener('input', updateRoomCalculation);
    });

    updateRoomCalculation();

    // Enquire via WhatsApp from room estimator
    roomCalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!roomCalcForm.reportValidity()) return;
      const res = updateRoomCalculation();
      if (!res.nights) {
        alert('Please choose valid check-in and check-out dates.');
        return;
      }
      const roomName = ROOM_RATES[res.roomKey]?.name || res.roomKey;
      const planName = MEAL_PLANS[res.planKey]?.name || res.planKey;

      const lines = [
        `Hello Forest Dew Udawalawa, I would like to enquire about room availability.`,
        ``,
        `Room category: ${roomName}`,
        `Meal plan: ${planName} (${MEAL_PLANS[res.planKey]?.code})`,
        `Check-in: ${window.formatDisplayDate(res.checkin)}`,
        `Check-out: ${window.formatDisplayDate(res.checkout)}`,
        `Duration: ${res.nights} night${res.nights === 1 ? '' : 's'}`,
        `Indicative nightly rate: ${window.formatLKR(res.nightlyRate)}`,
        `Indicative stay total: ${window.formatLKR(res.total)}`,
        ``,
        `Please confirm availability, taxes and payment arrangements. Thank you!`
      ];

      window.sendToWhatsApp(lines.join('\n'));
    });

    // Room quick enquiry buttons on room cards
    document.querySelectorAll('[data-select-room]').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomKey = btn.dataset.selectRoom;
        if (roomCalcForm.elements.room) {
          roomCalcForm.elements.room.value = roomKey;
          updateRoomCalculation();
          const target = document.querySelector('#room-estimator-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // 3. Comprehensive Trip Planner (Plan Your Stay Page)
  const tripPlannerForm = document.querySelector('#comprehensive-trip-planner');
  if (tripPlannerForm) {
    // Output nodes in summary card
    const sumRoom = document.getElementById('sum-room-name');
    const sumPlan = document.getElementById('sum-plan-name');
    const sumNights = document.getElementById('sum-nights-count');
    const sumDates = document.getElementById('sum-dates-display');
    const sumStayCost = document.getElementById('sum-stay-cost');
    const sumSafariName = document.getElementById('sum-safari-name');
    const sumSafariParty = document.getElementById('sum-safari-party');
    const sumSafariCost = document.getElementById('sum-safari-cost');
    const safariDateWrap = document.getElementById('safari-custom-fields');
    const feedbackMsg = document.getElementById('planner-feedback-msg');

    function calculateTrip() {
      const fd = new FormData(tripPlannerForm);
      const roomKey = String(fd.get('room') || 'double');
      const planKey = String(fd.get('plan') || 'bb');
      const checkin = String(fd.get('checkin') || '');
      const checkout = String(fd.get('checkout') || '');
      const safariKey = String(fd.get('safari') || 'none');
      const party = String(fd.get('party') || '2');
      const safariDate = String(fd.get('safaridate') || '');

      const roomData = ROOM_RATES[roomKey];
      const nightly = roomData?.rates?.[planKey] || 0;
      const nights = calculateNights(checkin, checkout);
      const stayTotal = nights ? nights * nightly : null;

      const hasSafari = safariKey !== 'none' && SAFARI_PACKAGES[safariKey];
      const safariPkg = hasSafari ? SAFARI_PACKAGES[safariKey] : null;
      const safariCost = safariPkg ? safariPkg.prices[party] : null;

      // Update UI outputs
      if (sumRoom) sumRoom.textContent = roomData?.name || 'Double Room';
      if (sumPlan) sumPlan.textContent = MEAL_PLANS[planKey]?.name || 'Bed & Breakfast';
      if (sumNights) sumNights.textContent = nights ? `${nights} night${nights === 1 ? '' : 's'}` : 'Dates required';
      if (sumDates) sumDates.textContent = nights ? `${window.formatDisplayDate(checkin)} — ${window.formatDisplayDate(checkout)}` : 'Select check-in & check-out';
      if (sumStayCost) sumStayCost.textContent = stayTotal ? window.formatLKR(stayTotal) : '—';

      if (safariDateWrap) {
        safariDateWrap.style.display = hasSafari ? 'block' : 'none';
      }

      if (sumSafariName) sumSafariName.textContent = hasSafari ? safariPkg.name : 'None selected';
      if (sumSafariParty) sumSafariParty.textContent = hasSafari ? `${party} persons · ${safariDate ? window.formatDisplayDate(safariDate) : 'Flexible date'}` : 'Optional addition';
      if (sumSafariCost) sumSafariCost.textContent = safariCost ? `USD ${safariCost}` : '—';

      return {
        roomKey, roomName: roomData?.name,
        planKey, planName: MEAL_PLANS[planKey]?.name, planCode: MEAL_PLANS[planKey]?.code,
        checkin, checkout, nights, nightly, stayTotal,
        safariKey, hasSafari, safariName: safariPkg?.name, party, safariCost, safariDate
      };
    }

    // Populate from query params
    const qParams = new URLSearchParams(window.location.search);
    if (qParams.get('room') && ROOM_RATES[qParams.get('room')]) {
      tripPlannerForm.elements.room.value = qParams.get('room');
    }
    if (qParams.get('plan') && MEAL_PLANS[qParams.get('plan')]) {
      tripPlannerForm.elements.plan.value = qParams.get('plan');
    }
    if (qParams.get('checkin')) tripPlannerForm.elements.checkin.value = qParams.get('checkin');
    if (qParams.get('checkout')) tripPlannerForm.elements.checkout.value = qParams.get('checkout');
    if (qParams.get('safari')) {
      const radio = tripPlannerForm.querySelector(`input[name="safari"][value="${qParams.get('safari')}"]`);
      if (radio) radio.checked = true;
    }
    if (qParams.get('party')) tripPlannerForm.elements.party.value = qParams.get('party');
    if (qParams.get('safaridate')) tripPlannerForm.elements.safaridate.value = qParams.get('safaridate');

    tripPlannerForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('change', calculateTrip);
      el.addEventListener('input', calculateTrip);
    });

    calculateTrip();

    // Submit via WhatsApp
    tripPlannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!tripPlannerForm.reportValidity()) return;
      const trip = calculateTrip();

      if (!trip.nights || !trip.stayTotal) {
        if (feedbackMsg) feedbackMsg.textContent = 'Please choose valid arrival and departure dates.';
        tripPlannerForm.elements.checkout.focus();
        return;
      }

      const fd = new FormData(tripPlannerForm);
      const guestName = String(fd.get('guestname') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const notes = String(fd.get('notes') || '').trim();

      const lines = [
        `Hello Forest Dew Udawalawa, I would like to enquire about a custom stay & safari package.`,
        ``,
        `Guest name: ${guestName}`,
        ...(email ? [`Email: ${email}`] : []),
        `Check-in: ${window.formatDisplayDate(trip.checkin)}`,
        `Check-out: ${window.formatDisplayDate(trip.checkout)}`,
        `Duration: ${trip.nights} night${trip.nights === 1 ? '' : 's'}`,
        `Room category: ${trip.roomName}`,
        `Meal plan: ${trip.planName} (${trip.planCode})`,
        `Indicative room total: ${window.formatLKR(trip.stayTotal)} (at ${window.formatLKR(trip.nightly)} / night)`,
        ``,
        ...(trip.hasSafari ? [
          `Safari package: ${trip.safariName}`,
          `Safari group size: ${trip.party} persons`,
          `Preferred safari date: ${trip.safariDate ? window.formatDisplayDate(trip.safariDate) : 'Flexible / to be arranged'}`,
          `Indicative safari total: USD ${trip.safariCost}`
        ] : [
          `Safari: Not requested at this time`
        ]),
        ...(notes ? [``, `Special requests & notes:`, notes] : []),
        ``,
        `Note: This is an enquiry to confirm actual dates, availability and final charges. Thank you!`
      ];

      if (feedbackMsg) feedbackMsg.textContent = 'Enquiry prepared. Opening WhatsApp to submit directly to the hotel...';
      window.sendToWhatsApp(lines.join('\n'));
    });

    // Share link feature
    const shareBtn = document.getElementById('share-plan-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const trip = calculateTrip();
        const p = new URLSearchParams();
        p.set('room', trip.roomKey);
        p.set('plan', trip.planKey);
        if (trip.checkin) p.set('checkin', trip.checkin);
        if (trip.checkout) p.set('checkout', trip.checkout);
        if (trip.safariKey) p.set('safari', trip.safariKey);
        if (trip.party) p.set('party', trip.party);
        if (trip.safariDate) p.set('safaridate', trip.safariDate);

        const shareUrl = `${window.location.origin}${window.location.pathname}?${p.toString()}#builder`;
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
            if (feedbackMsg) feedbackMsg.textContent = 'Plan link copied to clipboard! (Selections only, no personal data)';
          } else {
            prompt('Copy this link to share your stay plan:', shareUrl);
          }
        } catch (err) {
          prompt('Copy this link to share your stay plan:', shareUrl);
        }
      });
    }
  }

  // 4. Interactive Meal Plan Pills directly on Room Cards
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-room-plan-pill]');
    if (!pill) return;
    e.preventDefault();
    const card = pill.closest('.room-card');
    if (!card) return;
    const roomKey = card.dataset.roomKey;
    const planKey = pill.dataset.roomPlanPill;

    // Toggle active pill in this card
    card.querySelectorAll('[data-room-plan-pill]').forEach(p => {
      const match = p === pill;
      p.classList.toggle('is-active', match);
      p.setAttribute('aria-pressed', String(match));
    });

    // Update price display with soft animation
    const rate = ROOM_RATES[roomKey]?.rates?.[planKey];
    const priceDisplay = card.querySelector('.room-card-price');
    const intlBadge = card.querySelector('.room-card-price-intl');
    if (priceDisplay && rate) {
      priceDisplay.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      priceDisplay.style.opacity = '0.3';
      priceDisplay.style.transform = 'translateY(-3px)';
      if (intlBadge) {
        intlBadge.dataset.intlLkr = rate;
      }
      setTimeout(() => {
        priceDisplay.innerHTML = `${window.formatLKR(rate)} <span>/ night</span>`;
        if (intlBadge && window.convertLKR) {
          const curr = window.getActiveCurrency ? window.getActiveCurrency() : 'USD';
          if (curr === 'LKR') {
            intlBadge.textContent = '';
            intlBadge.style.display = 'none';
          } else {
            intlBadge.textContent = `(${window.convertLKR(rate, curr)})`;
            intlBadge.style.display = 'inline';
          }
        }
        priceDisplay.style.opacity = '1';
        priceDisplay.style.transform = 'translateY(0)';
      }, 120);
    }

    // Update link to plan-stay
    const bookLink = card.querySelector('.btn-room-book');
    if (bookLink) {
      bookLink.href = `plan-stay.html?room=${roomKey}&plan=${planKey}#builder`;
    }
  });

})();

