(function () {
  'use strict';
  // Only fixed, public page identifiers are sent. Never send message text,
  // names, email addresses, telephone numbers or query parameters.
  const page = document.body.dataset.page || 'home';
  // Keep copyright dates current each January without changing event dates.
  const currentYear = String(new Date().getFullYear());
  document.querySelectorAll('footer').forEach(function (footer) {
    const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      node.nodeValue = node.nodeValue.replace(/(©\s*)20\d{2}/g, '$1' + currentYear);
    }
  });

  // Language selector on existing Hebrew pages; unsupported translations open the locale homepage.
  const localizedPages = new Set(['', 'about', 'digital-course', 'private-lessons', 'sign-language-course', 'organizations', 'deaf-culture-lecture', 'usher-lecture', 'contact']);
  if (document.documentElement.lang === 'he') {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const translatedPath = localizedPages.has(currentPath) ? currentPath : '';
    const target = document.querySelector('header .header-actions') || document.querySelector('header nav') || document.querySelector('header');
    if (target) {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'בחירת שפה');
      nav.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:5px;direction:ltr;';
      [['עברית', '/'], ['EN', '/en/' + (translatedPath ? translatedPath + '/' : '')], ['RU', '/ru/' + (translatedPath ? translatedPath + '/' : '')]].forEach(function (item, i) {
        const a = document.createElement('a');
        a.href = item[1]; a.textContent = item[0];
        a.style.cssText = 'display:inline-block;padding:3px 7px;border:1px solid #a6808c;border-radius:7px;background:#fff;color:#6b1330;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;';
        if (i === 0) { a.setAttribute('aria-current', 'page'); }
        nav.appendChild(a);
      });
      target.appendChild(nav);
    }
  }


  // Reuse the Hebrew site's theme preference and add responsive navigation to all localized pages.
  (function setupLocalizedHeader() {
    const locale = document.documentElement.lang;
    if (locale !== 'en' && locale !== 'ru') return;
    const topbar = document.querySelector('.site-header .topbar');
    if (!topbar) return;
    const siteNav = topbar.querySelector('.main-nav');
    const languageNav = topbar.querySelector('.languages');
    if (!siteNav || !languageNav) return;

    const labels = locale === 'ru'
      ? { dark: 'Тёмная тема', light: 'Светлая тема', menu: 'Меню', close: 'Закрыть меню', languages: 'Языки' }
      : { dark: 'Dark mode', light: 'Light mode', menu: 'Menu', close: 'Close menu', languages: 'Languages' };

    siteNav.id = 'localized-site-nav';
    languageNav.id = 'localized-language-nav';
    const languageHeading = document.createElement('span');
    languageHeading.className = 'language-menu-heading';
    languageHeading.textContent = labels.languages;
    languageHeading.setAttribute('role', 'heading');
    languageHeading.setAttribute('aria-level', '2');
    languageNav.insertBefore(languageHeading, languageNav.firstChild);

    const controls = document.createElement('div');
    controls.className = 'header-controls';

    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'theme-toggle';
    const themeIcon = document.createElement('span');
    themeIcon.className = 'theme-icon';
    themeIcon.setAttribute('aria-hidden', 'true');
    const themeLabel = document.createElement('span');
    themeLabel.className = 'theme-label';
    themeButton.appendChild(themeIcon);
    themeButton.appendChild(themeLabel);

    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'menu-toggle';
    menuButton.setAttribute('aria-controls', 'localized-site-nav localized-language-nav');
    menuButton.setAttribute('aria-expanded', 'false');
    const bars = document.createElement('span');
    bars.className = 'hamburger';
    bars.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i += 1) {
      bars.appendChild(document.createElement('span'));
    }
    const menuLabel = document.createElement('span');
    menuLabel.className = 'menu-label';
    menuLabel.textContent = labels.menu;
    menuButton.setAttribute('aria-label', labels.menu);
    menuButton.appendChild(bars);
    menuButton.appendChild(menuLabel);
    controls.appendChild(themeButton);
    controls.appendChild(menuButton);
    topbar.appendChild(controls);

    const logo = topbar.querySelector('.brand img');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const root = document.documentElement;
    function applyTheme(theme) {
      const dark = theme === 'dark';
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', dark ? labels.light : labels.dark);
      themeLabel.textContent = dark ? labels.light : labels.dark;
      themeIcon.textContent = dark ? '☀' : '☾';
      if (logo) logo.src = dark ? '/assets/logo-dark.png' : '/assets/logo.png';
      if (themeColor) themeColor.setAttribute('content', dark ? '#20191e' : '#faf7f2');
    }

    let savedTheme;
    try { savedTheme = window.localStorage.getItem('lev-hasiman-theme'); } catch (_error) {}
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme : (systemDark ? 'dark' : 'light'));

    themeButton.addEventListener('click', function () {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try { window.localStorage.setItem('lev-hasiman-theme', nextTheme); } catch (_error) {}
    });

    function setMenu(open) {
      topbar.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? labels.close : labels.menu);
      menuLabel.textContent = open ? labels.close : labels.menu;
    }
    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !topbar.contains(event.target)) {
        setMenu(false);
      }
    });
    if (window.matchMedia) {
      const wideView = window.matchMedia('(min-width: 1001px)');
      if (wideView.addEventListener) {
        wideView.addEventListener('change', function (event) {
          if (event.matches) setMenu(false);
        });
      }
    }
    topbar.classList.add('i18n-enhanced');
  })();

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
