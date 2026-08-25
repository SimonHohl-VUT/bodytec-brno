/* =============================================================================
   BodytecBrno — main.js
   No dependencies. Everything the site needs lives here.

   >>> NASTAV TOHLE <<<
   BOOKING_URL  — odkaz na rezervační stránku Reservio
   FACEBOOK_URL — odkaz na facebookovou stránku
   Dokud jsou prázdné, tlačítka jen sjedou na sekci Kontakt.
   ========================================================================== */

var CONFIG = {
  BOOKING_URL: 'https://bookings.reservio.com/modal/LACbqYPJJw/?backlink=https%3A%2F%2Fwww.bodytecbrno.cz%2Fkontakt%2F',
  FACEBOOK_URL: 'https://www.facebook.com/bodytecbrno'
};

(function () {
  'use strict';

  /* --- externí odkazy ----------------------------------------------------- */
  function wireLinks(selector, url, whenMissing) {
    var links = document.querySelectorAll(selector);
    for (var i = 0; i < links.length; i++) {
      if (url) {
        links[i].href = url;
        links[i].target = '_blank';
        links[i].rel = 'noopener noreferrer';
      } else if (whenMissing === 'hide') {
        var row = links[i].closest('li') || links[i];
        row.hidden = true;
      } else if (links[i].getAttribute('href') === '#') {
        links[i].href = whenMissing;
      }
    }
    if (!url) {
      console.info('[BodytecBrno] Chybí odkaz pro ' + selector + ' — doplň ho v js/main.js.');
    }
  }

  // bez odkazu: rezervační tlačítka sjedou na Kontakt, odkaz na FB se skryje
  wireLinks('[data-booking]', CONFIG.BOOKING_URL, '#kontakt');
  wireLinks('[data-facebook]', CONFIG.FACEBOOK_URL, 'hide');

  /* --- header: stín po odscrollování -------------------------------------- */
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- mobilní menu -------------------------------------------------------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
  }

  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setNav(false);
  });

  /* --- scroll-spy ---------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* --- rok v patičce ------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
