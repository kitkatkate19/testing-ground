/* =============================================================
   KBI Hong Kong — kbi-hk.js v5 · 2026
   Interactions · Animations · Reveals · Counters · Carousel
   ============================================================= */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITIES
  ---------------------------------------------------------- */
  function $(sel, ctx)  { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  var supportsIO = 'IntersectionObserver' in window;

  /* ----------------------------------------------------------
     ANNOUNCEMENT BAR
  ---------------------------------------------------------- */
  var annBar   = $('#announcementBar');
  var annClose = $('#announcementClose');
  if (annBar && annClose) {
    on(annClose, 'click', function () {
      annBar.style.maxHeight  = annBar.offsetHeight + 'px';
      requestAnimationFrame(function () {
        annBar.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease';
        annBar.style.maxHeight  = '0';
        annBar.style.opacity    = '0';
        annBar.style.padding    = '0';
        annBar.style.overflow   = 'hidden';
      });
      var nav = $('#siteNav');
      if (nav) { setTimeout(function () { nav.style.top = '0'; }, 420); }
    });
  }

  /* ----------------------------------------------------------
     HERO PARTICLES (lightweight CSS-driven)
  ---------------------------------------------------------- */
  var particleWrap = $('#heroParticles');
  if (particleWrap) {
    var count = window.innerWidth > 768 ? 18 : 9;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'hero-particle';
      var size = Math.random() * 3 + 1.5;
      p.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + Math.random() * 100 + '%',
        'top:'    + (Math.random() * 60 + 30) + '%',
        'animation-duration:' + (Math.random() * 8 + 6) + 's',
        'animation-delay:'    + (Math.random() * 6)     + 's'
      ].join(';');
      particleWrap.appendChild(p);
    }
  }

  /* ----------------------------------------------------------
     NAVIGATION — sticky / colour swap
  ---------------------------------------------------------- */
  var nav      = $('#siteNav');
  var ticking  = false;

  function handleNavScroll() {
    if (!nav) return;
    var scrollY = window.scrollY;
    nav.classList.toggle('nav-scrolled', scrollY > 60);
    if (nav.classList.contains('nav-dark')) {
      var threshold = window.innerHeight * 0.72;
      if (scrollY > threshold) {
        nav.style.background       = 'rgba(255,255,255,0.97)';
        nav.style.borderBottomColor = 'var(--stone)';
        $$('.nav-wordmark-name', nav).forEach(function (el) { el.style.color = 'var(--text-main)'; });
        $$('.nav-wordmark-sub',  nav).forEach(function (el) { el.style.color = 'var(--text-faint)'; });
        $$('.nav-links > li > a, .nav-links > li > button', nav).forEach(function (el) { el.style.color = ''; });
        $$('.nav-hamburger span', nav).forEach(function (el) { el.style.background = 'var(--text-main)'; });
      } else {
        nav.style.background        = '';
        nav.style.borderBottomColor = '';
        $$('.nav-wordmark-name', nav).forEach(function (el) { el.style.color = ''; });
        $$('.nav-wordmark-sub',  nav).forEach(function (el) { el.style.color = ''; });
        $$('.nav-hamburger span',nav).forEach(function (el) { el.style.background = ''; });
      }
    }
    ticking = false;
  }

  on(window, 'scroll', function () {
    if (!ticking) { requestAnimationFrame(handleNavScroll); ticking = true; }
  }, { passive: true });
  handleNavScroll();

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  (function setActive() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (!page) page = 'index.html';
    $$('.nav-links a, .nav-mobile-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === page || (page === 'index.html' && href === '')) {
        a.classList.add('active');
        var li = a.closest('.has-dropdown');
        if (li) {
          var trigger = li.querySelector('.nav-dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }
      }
    });
  }());

  /* ----------------------------------------------------------
     DROPDOWNS
  ---------------------------------------------------------- */
  $$('.has-dropdown').forEach(function (li) {
    var btn  = li.querySelector('.nav-dropdown-trigger');
    var menu = li.querySelector('.nav-dropdown');
    if (!btn || !menu) return;

    on(btn, 'click', function (e) {
      e.stopPropagation();
      var wasOpen = li.classList.contains('open');
      $$('.has-dropdown.open').forEach(function (other) {
        other.classList.remove('open');
        var t = other.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    on(btn, 'keydown', function (e) {
      if (e.key === 'Escape') {
        li.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  });

  on(document, 'click', function () {
    $$('.has-dropdown.open').forEach(function (li) {
      li.classList.remove('open');
      var t = li.querySelector('.nav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
  var hamburger = $('#navHamburger');
  var mobileNav = $('#navMobile');

  on(hamburger, 'click', function () {
    var isOpen = mobileNav && mobileNav.classList.toggle('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.classList.toggle('open', !!isOpen);
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('#navMobile a').forEach(function (a) {
    on(a, 'click', function () {
      if (mobileNav) mobileNav.classList.remove('open');
      if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
      document.body.style.overflow = '';
    });
  });

  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); hamburger.focus(); }
      document.body.style.overflow = '';
    }
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL
  ---------------------------------------------------------- */
  on(document, 'click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      var navH   = nav ? nav.offsetHeight : 68;
      var annH   = annBar && annBar.offsetHeight > 0 ? annBar.offsetHeight : 0;
      var top    = target.getBoundingClientRect().top + window.scrollY - navH - annH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });

  /* ----------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  if (supportsIO) {
    initReveal();
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ----------------------------------------------------------
     STAGGER CHILDREN REVEAL
  ---------------------------------------------------------- */
  $$('.stagger-children').forEach(function (parent) {
    Array.from(parent.children).forEach(function (child, i) {
      child.classList.add('reveal');
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  /* ----------------------------------------------------------
     ANIMATED COUNTERS
  ---------------------------------------------------------- */
  function animateCounter(el) {
    var suffix    = el.querySelector('span');
    var suffixTxt = suffix ? suffix.textContent : '';
    var raw       = el.textContent.replace(suffixTxt, '').trim();
    var num       = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;
    var hasComma = raw.includes(',');
    var duration = 1800;
    var start    = null;

    function step(ts) {
      if (!start) start = ts;
      var prog   = Math.min((ts - start) / duration, 1);
      var eased  = 1 - Math.pow(1 - prog, 3);
      var val    = Math.round(num * eased);
      var disp   = (num >= 1000 || hasComma) ? val.toLocaleString() : String(val);
      el.textContent = disp;
      if (suffix) el.appendChild(suffix);
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterEls = $$('.stats-bar-number, .impact-stat-n');
  if (counterEls.length && supportsIO) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { cio.observe(el); });
  }

  /* ----------------------------------------------------------
     PROGRAMME TABS
  ---------------------------------------------------------- */
  var progTabBtns   = $$('.prog-tab');
  var progTabPanels = $$('.prog-tab-panel');

  if (progTabBtns.length) {
    function showProgTab(target) {
      progTabBtns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.tab === target);
        b.setAttribute('aria-selected', b.dataset.tab === target ? 'true' : 'false');
      });
      progTabPanels.forEach(function (p) {
        p.classList.toggle('active', p.id === 'prog-' + target);
      });
    }
    progTabBtns.forEach(function (btn) {
      on(btn, 'click', function () { showProgTab(btn.dataset.tab); });
    });

    /* Deep-link: activate correct tab based on URL hash
       e.g. programmes.html#ibcol  → switch to "olympiads" tab
            programmes.html#idsol  → switch to "olympiads" tab
            programmes.html#iqcol  → switch to "olympiads" tab
            programmes.html#eto    → switch to "flagship" tab
            programmes.html#training → switch to "training" tab
            programmes.html#community → switch to "community" tab          */
    var hashTabMap = {
      'eto':       'flagship',
      'eto-tracks':'flagship',
      'eto-streams':'flagship',
      'ibcol':     'olympiads',
      'idsol':     'olympiads',
      'iqcol':     'olympiads',
      'training':  'training',
      'community': 'community',
      'groups':    'community'
    };
    function applyHashTab() {
      var hash = (window.location.hash || '').replace('#', '');
      if (hash && hashTabMap[hash]) {
        showProgTab(hashTabMap[hash]);
        var target = document.getElementById(hash);
        if (target) { setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); }
      }
    }
    applyHashTab();
    on(window, 'hashchange', applyHashTab);
  }

  /* ----------------------------------------------------------
     AUDIENCE / STAKEHOLDER TABS
  ---------------------------------------------------------- */
  var audTabs   = $$('.audience-tab');
  var audPanels = $$('.audience-panel');

  if (audTabs.length) {
    function showAudTab(target) {
      audTabs.forEach(function (b) {
        b.classList.toggle('active', b.dataset.audience === target);
      });
      audPanels.forEach(function (p) {
        p.classList.toggle('active', p.dataset.audience === target);
      });
    }
    audTabs.forEach(function (btn) {
      on(btn, 'click', function () { showAudTab(btn.dataset.audience); });
    });
  }

  /* ----------------------------------------------------------
     EVENTS TABS
  ---------------------------------------------------------- */
  var evtTabs   = $$('.events-tab');
  var evtPanels = $$('.events-tab-panel');

  if (evtTabs.length) {
    function showEvtTab(target) {
      evtTabs.forEach(function (b) {
        b.classList.toggle('active', b.dataset.tab === target);
      });
      evtPanels.forEach(function (p) {
        p.classList.toggle('active', p.id === 'evt-' + target);
      });
    }
    evtTabs.forEach(function (btn) {
      on(btn, 'click', function () { showEvtTab(btn.dataset.tab); });
    });
  }

  /* ----------------------------------------------------------
     EVENTS CAROUSEL
  ---------------------------------------------------------- */
  $$('.events-carousel').forEach(function (carousel) {
    var track  = carousel.querySelector('.events-carousel-track');
    var cards  = carousel.querySelectorAll('.event-card');
    var dotsEl = carousel.querySelector('.carousel-dots');
    var prevBtn= carousel.querySelector('.carousel-btn-prev');
    var nextBtn= carousel.querySelector('.carousel-btn-next');

    if (!track || cards.length < 2) return;

    var current    = 0;
    var perPage    = window.innerWidth > 1023 ? 3 : window.innerWidth > 700 ? 2 : 1;
    var total      = Math.ceil(cards.length / perPage);
    var autoTimer  = null;
    var touchStartX = 0;

    // Build dots
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (var d = 0; d < total; d++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (d + 1));
        (function(idx) { on(dot, 'click', function () { goTo(idx); }); }(d));
        dotsEl.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      $$('.carousel-dot', dotsEl).forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(idx) {
      current = (idx + total) % total;
      var cardW   = cards[0].offsetWidth + 20;
      var offset  = current * perPage * cardW;
      track.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
    }

    if (prevBtn) on(prevBtn, 'click', function () { goTo(current - 1); });
    if (nextBtn) on(nextBtn, 'click', function () { goTo(current + 1); });

    // Touch / swipe
    on(track, 'touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    on(track, 'touchend',   function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // Auto-rotate
    function startAuto() { autoTimer = setInterval(function () { goTo(current + 1); }, 5000); }
    function stopAuto()  { clearInterval(autoTimer); }
    startAuto();
    on(carousel, 'mouseenter', stopAuto);
    on(carousel, 'mouseleave', startAuto);

    on(window, 'resize', function () {
      perPage = window.innerWidth > 1023 ? 3 : window.innerWidth > 700 ? 2 : 1;
      total   = Math.ceil(cards.length / perPage);
      current = 0;
      track.style.transform = 'translateX(0)';
      if (dotsEl) {
        dotsEl.innerHTML = '';
        for (var d = 0; d < total; d++) {
          var dot2 = document.createElement('button');
          dot2.className = 'carousel-dot' + (d === 0 ? ' active' : '');
          (function(idx) { on(dot2, 'click', function () { goTo(idx); }); }(d));
          dotsEl.appendChild(dot2);
        }
      }
    });
  });

  /* ----------------------------------------------------------
     NEWS FILTERS
  ---------------------------------------------------------- */
  var newsFilterBtns = $$('.news-filter-btn');
  var newsCards      = $$('.news-all-card[data-category], .news-card[data-category]');

  if (newsFilterBtns.length) {
    newsFilterBtns.forEach(function (btn) {
      on(btn, 'click', function () {
        newsFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.filter;
        newsCards.forEach(function (card) {
          var show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.animation = 'fadeIn 0.3s ease both';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     TIMELINE REVEAL
  ---------------------------------------------------------- */
  var timelineItems = $$('.timeline-item');
  if (timelineItems.length && supportsIO) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          tio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
      tio.observe(el);
    });
  } else {
    timelineItems.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ----------------------------------------------------------
     FORM HANDLING (contact, sponsor enquiry, membership, newsletter)
  ---------------------------------------------------------- */
  function handleForm(formId, successId) {
    var form    = $('#' + formId);
    var success = $('#' + successId);
    if (!form) return;

    on(form, 'submit', function (e) {
      e.preventDefault();
      var inputs = $$('input[required], textarea[required], select[required]', form);
      var valid  = true;
      inputs.forEach(function (inp) {
        inp.style.borderColor = '';
        if (!inp.value.trim()) {
          inp.style.borderColor = '#ef4444';
          valid = false;
        }
        if (inp.type === 'email' && inp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
          inp.style.borderColor = '#ef4444';
          valid = false;
        }
      });
      if (!valid) return;

      var btn = form.querySelector('[type="submit"]');
      if (btn) {
        var orig = btn.textContent;
        btn.disabled    = true;
        btn.textContent = 'Sending…';
        setTimeout(function () {
          btn.disabled    = false;
          btn.textContent = orig;
          form.reset();
          if (success) { success.classList.add('visible'); setTimeout(function () { success.classList.remove('visible'); }, 5000); }
        }, 1200);
      }
    });
  }

  handleForm('contactForm',        'contactSuccess');
  handleForm('contactForm',        'contactFormSuccess');
  handleForm('enquiryForm',        'enquirySuccess');
  handleForm('sponsorEnquiryForm', 'sponsorEnquirySuccess');
  handleForm('membershipForm',     'membershipSuccess');

  /* Newsletter */
  var nlForm = $('#newsletterForm');
  if (nlForm) {
    on(nlForm, 'submit', function (e) {
      e.preventDefault();
      var inp = nlForm.querySelector('input[type="email"]');
      var btn = nlForm.querySelector('[type="submit"]');
      if (!inp || !inp.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
        if (inp) { inp.style.borderColor = '#ef4444'; setTimeout(function () { inp.style.borderColor = ''; }, 2000); }
        return;
      }
      if (btn) {
        var origText = btn.textContent.trim() || 'Subscribe';
        btn.disabled    = true;
        btn.textContent = '✓ Subscribed';
        btn.style.background = '#22c55e';
        btn.style.borderColor= '#22c55e';
        inp.value = '';
        setTimeout(function () {
          btn.disabled    = false;
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.borderColor= '';
        }, 3500);
      }
    });
  }

  /* ----------------------------------------------------------
     BACK TO TOP
  ---------------------------------------------------------- */
  var btt = $('#backToTop');
  if (btt) {
    on(window, 'scroll', function () {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    on(btt, 'click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     HERO VIDEO FALLBACK
  ---------------------------------------------------------- */
  var heroVideo = $('.hero-video');
  if (heroVideo) {
    on(heroVideo, 'error', function () {
      var wrap = heroVideo.closest('.hero-video-wrap');
      if (wrap) wrap.style.background = 'var(--night)';
      heroVideo.style.display = 'none';
    });
  }

  /* ----------------------------------------------------------
     HOVER TILT on cards (subtle 3D)
  ---------------------------------------------------------- */
  $$('.what-card, .prog-card, .event-card, .news-all-card').forEach(function (card) {
    on(card, 'mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x    = (e.clientX - rect.left) / rect.width  - 0.5;
      var y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = 'translateY(-4px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });
    on(card, 'mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });

  /* ----------------------------------------------------------
     SPONSOR LOGO MARQUEE (trust band)
  ---------------------------------------------------------- */
  var trustLogos = $('.trust-logos');
  if (trustLogos && trustLogos.children.length) {
    // No JS required — CSS animation via .trust-band handles display
  }

  /* ----------------------------------------------------------
     SECTION PROGRESS INDICATOR (thin line at top of viewport)
  ---------------------------------------------------------- */
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--prussian),var(--cyan));z-index:9999;transition:width 0.1s linear;width:0%;pointer-events:none;';
  document.body.appendChild(progressBar);

  on(window, 'scroll', function () {
    var doc  = document.documentElement;
    var winH = doc.scrollHeight - doc.clientHeight;
    var pct  = winH > 0 ? (window.scrollY / winH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ----------------------------------------------------------
     INIT — announce active page on load
  ---------------------------------------------------------- */
  document.documentElement.classList.add('js-loaded');

}());
