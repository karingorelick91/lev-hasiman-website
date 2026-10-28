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
