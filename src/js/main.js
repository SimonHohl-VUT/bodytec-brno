/* =============================================================================
   BodytecBrno — main.js
   Bez závislostí. Menu, scroll-spy, rok v patičce a okno s oznámením.

   Odkazy (Reservio, Facebook) se do HTML vypíšou při buildu z src/_data/
   site.json, ne tady — tlačítka tak fungují i bez JavaScriptu.

   Jediná věc, která JavaScript potřebuje, je vyskakovací okno s oznámením.
   Bez JS se nevykreslí vůbec (viz .oznameni-okno:not([open]) v CSS) a nic se
   tím neztratí: stejný text je i v proužku pod hlavičkou, který se skládá
   při buildu.
   ========================================================================== */

(function () {
  'use strict';

  /* --- sdílené: Escape zavírá vždy jen nejvrchnější otevřenou vrstvu -------
     Menu i okno na Escape reagují. Jeden posluchač a jedno pořadí priorit
     je míň chyb než dva posluchače, které o sobě nevědí.                   */
  var vrstvy = [];

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    for (var i = 0; i < vrstvy.length; i++) {
      if (vrstvy[i].otevrena()) { vrstvy[i].zavri(); return; }
    }
  });

  /* --- 1. header: stín po odscrollování ------------------------------------ */
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- 2. mobilní menu ----------------------------------------------------- */
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

  /* Menu se registruje první: kdo ho právě otevřel, čeká, že Escape zavře
     jeho, a ne okno pod ním. */
  vrstvy.push({
    otevrena: function () { return nav.classList.contains('is-open'); },
    zavri: function () { setNav(false); toggle.focus(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setNav(false);
  });

  /* --- 3. scroll-spy ------------------------------------------------------- */
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

  /* --- 4. rok v patičce ---------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* --- 5. okno s oznámením ------------------------------------------------- */
  var okno = document.getElementById('oznameni-okno');

  if (okno && typeof okno.showModal === 'function') {
    var KLIC = 'bt-oznameni';
    var podpis = okno.getAttribute('data-podpis');

    /* localStorage umí vyhodit výjimku (anonymní okno, zablokovaná data),
       takže každý přístup je obalený. Když nefunguje, okno se ukáže při
       každém načtení — to je správné selhání, oznámení se neztratí. */
    function pamet(hodnota) {
      try {
        if (hodnota === undefined) return window.localStorage.getItem(KLIC);
        window.localStorage.setItem(KLIC, hodnota);
      } catch (e) {}
      return null;
    }

    if (pamet() !== podpis) {
      /* Jedno místo pro všechny důsledky zavření, ať přišlo z tlačítka,
         z kliknutí mimo okno nebo z klávesy Esc (tu obsluhuje prohlížeč
         sám u modálního dialogu). Zavření se vždy počítá jako potvrzení:
         okno, ze kterého se nedá dostat klávesnicí, je past. */
      okno.addEventListener('close', function () {
        pamet(podpis);
        document.documentElement.classList.remove('is-locked');
        var logo = document.querySelector('.header .logo');
        if (logo) logo.focus();
      });

      okno.querySelector('[data-zavrit]').addEventListener('click', function () {
        okno.close();
      });

      /* Kliknutí mimo okno ho zavře. Modální <dialog> zabírá celou plochu
         obrazovky včetně tmavého pozadí, takže kliknutí „vedle“ dorazí na
         samotný dialog. Klik na cokoliv uvnitř bublá z potomka, proto se
         porovnává cíl. */
      okno.addEventListener('click', function (e) {
        if (e.target === okno) okno.close();
      });

      document.documentElement.classList.add('is-locked');
      okno.showModal();            /* fokus si vezme tlačítko s [autofocus] */
    }
  }
})();
