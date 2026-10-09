/* ==========================================================================
   Mabevic — Shared Interactions
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  var preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () { preloader.classList.add('hide'); }, 350);
    });
    // Fallback in case load already fired
    setTimeout(function () { preloader.classList.add('hide'); }, 1800);
  }

  /* ---------- Header: solid on scroll ---------- */
  var header = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('solid');
      header.classList.remove('transparent');
    } else if (header.dataset.transparentHome === 'true') {
      header.classList.remove('solid');
      header.classList.add('transparent');
    } else {
      header.classList.add('solid');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var scrim = document.querySelector('.nav-scrim');
  function closeMobileNav() {
    toggle && toggle.classList.remove('open');
    mobileNav && mobileNav.classList.remove('open');
    scrim && scrim.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      scrim && scrim.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    scrim && scrim.addEventListener('click', closeMobileNav);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = (scrolled || 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  function handleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', handleBackToTop, { passive: true });
  backToTop && backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  handleBackToTop();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('.counter-num[data-count]');
  if (counters.length) {
    var counted = new WeakSet();
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progressRatio = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progressRatio, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progressRatio < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Testimonial carousel ---------- */
  var slidesWrap = document.querySelector('.testimonial-slides');
  if (slidesWrap) {
    var slides = slidesWrap.querySelectorAll('.t-slide');
    var dots = document.querySelectorAll('.t-dot');
    var prevBtn = document.querySelector('.t-arrow.prev');
    var nextBtn = document.querySelector('.t-arrow.next');
    var current = 0;
    var total = slides.length;
    function goTo(idx) {
      current = (idx + total) % total;
      slidesWrap.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }
    prevBtn && prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn && nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
    var autoplay = setInterval(function () { goTo(current + 1); }, 6000);
    slidesWrap.closest('.testimonial-wrap').addEventListener('mouseenter', function () { clearInterval(autoplay); });
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var idx = 0;
    var items = Array.prototype.slice.call(galleryItems);

    function openLightbox(i) {
      idx = i;
      var img = items[idx].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    items.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });
    lbClose && lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    lbPrev && lbPrev.addEventListener('click', function () { openLightbox((idx - 1 + items.length) % items.length); });
    lbNext && lbNext.addEventListener('click', function () { openLightbox((idx + 1) % items.length); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox((idx - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') openLightbox((idx + 1) % items.length);
    });
  }

  /* ---------- Product filter + search (products page) ---------- */
  var filterTabs = document.querySelectorAll('.filter-tab');
  var categoryBlocks = document.querySelectorAll('.category-block');
  var searchInput = document.querySelector('.search-box input');
  var noResults = document.querySelector('.no-results');

  function applyFilters() {
    var activeTab = document.querySelector('.filter-tab.active');
    var activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var anyVisible = false;

    categoryBlocks.forEach(function (block) {
      var blockCategory = block.getAttribute('data-category');
      var categoryMatches = activeCategory === 'all' || activeCategory === blockCategory;
      var cards = block.querySelectorAll('.product-card, .ebook-card');
      var visibleInBlock = 0;

      cards.forEach(function (card) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var searchMatches = query === '' || name.indexOf(query) !== -1;
        var show = categoryMatches && searchMatches;
        card.style.display = show ? '' : 'none';
        if (show) visibleInBlock++;
      });

      block.style.display = (categoryMatches && visibleInBlock > 0) ? '' : 'none';
      if (visibleInBlock > 0) anyVisible = true;
    });

    if (noResults) noResults.classList.toggle('show', !anyVisible);
  }

  if (filterTabs.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        applyFilters();
      });
    });
  }
  searchInput && searchInput.addEventListener('input', applyFilters);
  if (filterTabs.length || searchInput) applyFilters();

  /* ---------- Lead capture forms (Web3Forms) ---------- */
  var W3F_ENDPOINT = 'https://api.web3forms.com/submit';

  // Posts a form's fields to Web3Forms and resolves to true only on a confirmed success.
  function sendToWeb3Forms(form) {
    return fetch(W3F_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (res) {
      return res.json().then(function (data) {
        return !!(res.ok && data && data.success);
      });
    });
  }

  // Inquiry form (contact page)
  var contactForm = document.querySelector('.inquiry-form');
  if (contactForm) {
    var cBtn = contactForm.querySelector('button[type="submit"]');
    var cOk = contactForm.querySelector('.form-success');
    var cErr = contactForm.querySelector('.form-error');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (cBtn.disabled) return;
      var label = cBtn.textContent;
      cBtn.disabled = true;
      cBtn.textContent = 'Sending…';
      cOk && cOk.classList.remove('show');
      cErr && cErr.classList.remove('show');
      sendToWeb3Forms(contactForm).then(function (ok) {
        return ok;
      }, function () {
        return false;
      }).then(function (ok) {
        var box = ok ? cOk : cErr;
        if (ok) contactForm.reset();
        if (box) {
          box.classList.add('show');
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        cBtn.disabled = false;
        cBtn.textContent = label;
      });
    });
  }

  // Newsletter sign-up forms
  document.querySelectorAll('.newsletter-form-wide').forEach(function (form) {
    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      if (status) { status.textContent = ''; status.className = 'form-status'; }
      sendToWeb3Forms(form).then(function (ok) {
        return ok;
      }, function () {
        return false;
      }).then(function (ok) {
        if (ok) form.reset();
        if (status) {
          status.textContent = ok
            ? 'Thank you, you are subscribed.'
            : 'Sorry, we could not sign you up just now. Please try again in a moment.';
          status.className = 'form-status ' + (ok ? 'ok' : 'err');
        }
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  });

  /* ---------- Blog category filter ---------- */
  var blogTabs = document.querySelectorAll('.blog-tab');
  var blogCards = document.querySelectorAll('.blog-card[data-categories]');
  if (blogTabs.length && blogCards.length) {
    var showCategory = function (cat) {
      blogTabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-cat') === cat);
      });
      blogCards.forEach(function (card) {
        var cats = (card.getAttribute('data-categories') || '').split(' ');
        card.style.display = (cat === 'all' || cats.indexOf(cat) !== -1) ? '' : 'none';
      });
    };
    var wanted = (new URLSearchParams(window.location.search).get('category') || 'all').toLowerCase();
    if (!document.querySelector('.blog-tab[data-cat="' + wanted + '"]')) wanted = 'all';
    showCategory(wanted);
    blogTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var cat = tab.getAttribute('data-cat');
        showCategory(cat);
        try {
          history.replaceState(null, '', window.location.pathname + (cat === 'all' ? '' : '?category=' + cat));
        } catch (err) { /* ignore (e.g. opened from a file) */ }
      });
    });
  }

});
