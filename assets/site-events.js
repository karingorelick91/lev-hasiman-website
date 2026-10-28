(function () {
  'use strict';
  // Only fixed, public page identifiers are sent. Never send message text,
  // names, email addresses, telephone numbers or query parameters.
  const page = document.body.dataset.page || 'home';
  function track(name, parameters) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, parameters);
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a');
    if (!link) return;
    // Conversion funnel tracking: navigation intent only, never a completed purchase.
    // Only fixed course identifiers are sent. Query strings and personal data are omitted.
    let target;
    try {
      target = new URL(link.href, window.location.origin);
    } catch (_error) {
      return;
    }
    if (target.origin === window.location.origin && target.pathname.replace(/\/+$/, '') === '/digital-course') {
      track('digital_course_offer_click', {service_page: page, course_id: 'level1_digital'});
    }
    if (target.hostname === 'my.schooler.biz' && target.pathname === '/s/122525/levhasiman-level1') {
      track('digital_course_registration_click', {service_page: page, course_id: 'level1_digital', destination: 'schooler'});
    }
  });
  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a');
    if (!link) return;
    const channel = link.dataset.contact;
    if (channel === 'whatsapp' || channel === 'email' || channel === 'leadform') {
      // A contact click is NOT a lead, registration or paid purchase.
      track('contact_click', {contact_method: channel, service_page: page});
    } else if (link.dataset.serviceLink) {
      const url = new URL(link.href, window.location.origin);
      track('service_view_click', {service_page: page, destination_path: url.pathname});
    }
  });
})();
