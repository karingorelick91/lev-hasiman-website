(function () {
  'use strict';
  // Fixed identifiers only: never read names, emails, messages or telephone fields.
  const key = 'lev-lead-attempt';
  const page = document.body.dataset.page || 'home';
  const emit = function (name, course) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, {service_page: page, course_id: course});
    }
  };
  const form = document.querySelector('form[action="https://formsubmit.co/levhasiman@gmail.com"]');
  if (form) {
    const course = function () {
      const choice = form.querySelector('#interest');
      if (choice && choice.value === 'קורס החורף בזום — 7.12.2026') return 'winter_2026';
      if (choice && choice.value === 'קורס קבוצתי בזום') return 'group_zoom';
      return 'other';
    };
    form.addEventListener('focusin', function () { emit('lead_form_start', course()); }, {once: true});
    form.addEventListener('submit', function () {
      if (!form.checkValidity()) return;
      const selected = course();
      emit('lead_submit_attempt', selected);
      try { sessionStorage.setItem(key, JSON.stringify({course: selected, time: Date.now()})); } catch (_) {}
    });
  }
  if (page === 'thanks') {
    // A return from the form is a completion signal, not proof of email delivery/payment.
    try {
      const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      if (pending && ['winter_2026', 'group_zoom', 'other'].includes(pending.course) &&
          Date.now() >= pending.time && Date.now() - pending.time < 30 * 60 * 1000) {
        emit('lead_thank_you_return', pending.course);
      }
    } catch (_) {}
  }
})();
