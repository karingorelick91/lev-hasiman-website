(function () {
  'use strict';
  // Only allowlisted course identifiers; no form contents or personal data in GA.
  const key = 'lev-lead-attempt';
  const page = document.body.dataset.page || 'home';
  const emit = (name, course, extra) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({service_page: page, course_id: course}, extra || {}));
  };
  const allowed = ['winter_2026','group_zoom','level1_digital','private_10','private_16','private_24','private_other','organization','other'];
  const form = document.querySelector('form[action="https://formsubmit.co/levhasiman@gmail.com"]');
  if (form) {
    const choice = form.querySelector('#interest') || form.querySelector('[name="תחום עניין"]');
    const packages = {'private_10':'שיעורים פרטיים — 10 שיעורים','private_16':'שיעורים פרטיים — 16 שיעורים','private_24':'שיעורים פרטיים — 24 שיעורים'};
    const lang = document.documentElement.lang;
    if (choice && choice.tagName === 'SELECT' && lang === 'he') {
      Object.values(packages).forEach(function(label) {
        if (!Array.from(choice.options).some(o => o.value === label)) choice.add(new Option(label, label));
      });
      const requested = new URLSearchParams(location.search).get('plan');
      if (Object.prototype.hasOwnProperty.call(packages, requested)) choice.value = packages[requested];
    }
    const course = function () {
      const value = choice ? choice.value : '';
      for (const id of Object.keys(packages)) if (value === packages[id]) return id;
      if (page === 'winter-contact' || value === 'קורס החורף בזום — 7.12.2026') return 'winter_2026';
      if (['קורס קבוצתי בזום','Live beginner Zoom course','Групповой курс в Zoom'].includes(value)) return 'group_zoom';
      if (['שאלה על הקורס הדיגיטלי','Digital Level 1','Видеокурс, уровень 1'].includes(value)) return 'level1_digital';
      if (['שיעורים פרטיים','Private lessons','Индивидуальные занятия'].includes(value)) return 'private_other';
      if (['הרצאה או סדנה לארגון','Organizational talk or workshop','Лекция или мастер-класс'].includes(value)) return 'organization';
      return 'other';
    };
    form.addEventListener('focusin', function () { emit('lead_form_start', course()); }, {once: true});
    form.addEventListener('submit', function () {
      if (!form.checkValidity()) return;
      const selected = course();
      emit('lead_submit_attempt', selected);
      try { sessionStorage.setItem(key, JSON.stringify({course:selected,time:Date.now()})); } catch (_) {}
    });
  }
  if (page === 'thanks') {
    // A return from the external form is a lead completion proxy, not proof of email delivery or payment.
    try {
      const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      if (pending && allowed.includes(pending.course) && Number.isFinite(pending.time) &&
          Date.now() >= pending.time && Date.now() - pending.time < 30 * 60 * 1000) {
        emit('lead_thank_you_return', pending.course);
      }
    } catch (_) {}
  }
})();
