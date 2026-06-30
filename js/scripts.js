/* ============================================================
   Code Studio — shared interactions
   scroll-progress, navbar blur, mobile nav, scroll-reveal,
   skill bars, smooth anchor scroll, and book-TOC scrollspy.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- scroll progress bar ---------- */
    const progress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    function onScroll() {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        if (progress) progress.style.width = pct + '%';
        if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- mobile nav ---------- */
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');

    function closeNav() {
        if (toggle) toggle.classList.remove('open');
        if (links) links.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
    function toggleNav() {
        const open = toggle && toggle.classList.toggle('open');
        if (links) links.classList.toggle('open', open);
        if (overlay) overlay.classList.toggle('show', open);
    }
    if (toggle) toggle.addEventListener('click', toggleNav);
    if (overlay) overlay.addEventListener('click', closeNav);
    if (links) {
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeNav);
        });
    }

    /* ---------- scroll-reveal (with sibling stagger) ---------- */
    const reveals = Array.prototype.slice.call(document.querySelectorAll('.scroll-reveal'));
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const parent = el.parentElement;
                const siblings = parent ? Array.prototype.slice.call(parent.children).filter(function (c) {
                    return c.classList.contains('scroll-reveal');
                }) : [el];
                const idx = siblings.indexOf(el);
                el.style.transitionDelay = Math.min(idx, 6) * 80 + 'ms';
                el.classList.add('revealed');
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ---------- animated skill bars ---------- */
    const bars = Array.prototype.slice.call(document.querySelectorAll('.skill-fill'));
    if ('IntersectionObserver' in window && bars.length) {
        const bo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.width = (el.getAttribute('data-width') || 0) + '%';
                bo.unobserve(el);
            });
        }, { threshold: 0.4 });
        bars.forEach(function (el) { bo.observe(el); });
    }

    /* ---------- smooth anchor scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', id);
        });
    });

    /* ---------- book TOC scrollspy ---------- */
    const tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc-list a'));
    if (tocLinks.length) {
        const map = {};
        const sections = [];
        tocLinks.forEach(function (link) {
            const id = link.getAttribute('href');
            if (!id || id.charAt(0) !== '#') return;
            const sec = document.querySelector(id);
            if (sec) { map[id] = link; sections.push(sec); }
        });
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const link = map['#' + entry.target.id];
                if (!link) return;
                tocLinks.forEach(function (l) { l.classList.remove('active'); });
                link.classList.add('active');
            });
        }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
