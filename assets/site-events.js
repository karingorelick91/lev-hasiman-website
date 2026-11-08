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

  // Keep desktop language switching available and place a dedicated language section
  // inside the existing Hebrew hamburger menu on small screens.
  const localizedPages = new Set(['', 'about', 'digital-course', 'private-lessons', 'sign-language-course', 'organizations', 'deaf-culture-lecture', 'usher-lecture', 'contact', 'thanks']);
  if (document.documentElement.lang === 'he') {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const translatedPath = localizedPages.has(currentPath) ? currentPath : '';
    const links = [
      ['עברית', '/' + (currentPath ? currentPath + '/' : ''), 'he'],
      ['English', '/en/' + (translatedPath ? translatedPath + '/' : ''), 'en'],
      ['Русский', '/ru/' + (translatedPath ? translatedPath + '/' : ''), 'ru']
    ];
    const actions = document.querySelector('header .header-actions');
    const siteNav = document.querySelector('header #site-nav');

    function addLinks(target) {
      const options = document.createElement('div');
      options.className = 'he-language-options';
      links.forEach(function (item) {
        const a = document.createElement('a');
        a.href = item[1];
        a.lang = item[2];
        a.hreflang = item[2];
        a.textContent = item[0];
        if (item[2] === 'he') a.setAttribute('aria-current', 'page');
        if (item[2] !== 'he' && !localizedPages.has(currentPath)) {
          a.title = 'העמוד טרם תורגם. מעבר לדף הבית בשפה זו.';
        }
        options.appendChild(a);
      });
      target.appendChild(options);
    }

    if (actions && siteNav) {
      const desktopLanguages = document.createElement('div');
      desktopLanguages.className = 'he-language-desktop';
      desktopLanguages.setAttribute('role', 'group');
      desktopLanguages.setAttribute('aria-label', 'בחירת שפה');
      addLinks(desktopLanguages);
      actions.appendChild(desktopLanguages);

      const mobileLanguages = document.createElement('section');
      mobileLanguages.className = 'he-language-mobile';
      mobileLanguages.setAttribute('role', 'group');
      mobileLanguages.setAttribute('aria-label', 'בחירת שפה');
      const heading = document.createElement('span');
      heading.className = 'he-language-heading';
      heading.textContent = 'שפות';
      heading.setAttribute('role', 'heading');
      heading.setAttribute('aria-level', '2');
      mobileLanguages.appendChild(heading);
      addLinks(mobileLanguages);
      siteNav.appendChild(mobileLanguages);

      const style = document.createElement('style');
      style.textContent = [
        '.he-language-desktop{display:flex;flex-wrap:wrap;align-items:center;direction:ltr;gap:5px}',
        '.he-language-desktop .he-language-options{display:flex;flex-wrap:wrap;gap:5px}',
        '.he-language-desktop a{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:3px 8px;border:1px solid var(--line);border-radius:7px;background:var(--white);color:var(--wine);font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap}',
        '.he-language-desktop a[aria-current="page"]{background:var(--wine);color:var(--white)}',
        '.he-language-mobile{display:none}',
        '@media(max-width:920px){',
        '.header .header-actions .he-language-desktop{display:none!important}',
        '.header .nav .he-language-mobile{display:flex;flex-direction:column;gap:10px;padding:16px 10px 12px;margin-top:12px;border-top:1px solid var(--line);direction:rtl}',
        '.header .nav .he-language-heading{display:block;color:var(--dark);font-size:1.0625rem;font-weight:800;line-height:1.5}',
        '.header .nav .he-language-options{display:flex;flex-wrap:wrap;gap:10px;direction:ltr}',
        '.header .nav .he-language-options a{display:inline-flex;align-items:center;justify-content:center;flex:1 1 84px;min-height:46px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:var(--white);color:var(--wine);text-align:center;text-decoration:none;font-size:1rem;font-weight:700;line-height:1.3;white-space:nowrap}',
        '.header .nav .he-language-options a[aria-current="page"]{background:var(--wine);color:var(--white);border-color:var(--wine)}',
        '.header .nav .he-language-options a:hover,.header .nav .he-language-options a:focus-visible{outline-offset:2px;border-color:var(--wine)}',
        '}'
      ].join('');
      document.head.appendChild(style);
    } else {
      // Small standalone Hebrew pages have no hamburger menu.
      const target = document.querySelector('header nav') || document.querySelector('header');
      if (target) {
        const fallback = document.createElement('div');
        fallback.setAttribute('role', 'group');
        fallback.setAttribute('aria-label', 'בחירת שפה');
        fallback.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:7px;direction:ltr';
        addLinks(fallback);
        fallback.querySelectorAll('a').forEach(function (a) {
          a.style.cssText = 'display:inline-block;padding:5px 8px;border:1px solid #a6808c;border-radius:7px;background:#fff;color:#6b1330;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap';
        });
        target.appendChild(fallback);
      }
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
