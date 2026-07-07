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
            /* chapter slides are handled by the reader carousel below */
            if (target.classList && target.classList.contains('chapter-slide')) return;
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

    /* ---------- reader carousel (book chapters) ---------- */
    const reader = document.getElementById('reader');
    if (reader) {
        const slides = Array.prototype.slice.call(reader.querySelectorAll('.chapter-slide'));
        if (slides.length) {
            const dotsWrap = document.getElementById('readerDots');
            const numEl = document.getElementById('readerNum');
            const nowEl = document.getElementById('readerNow');
            const navBtns = Array.prototype.slice.call(reader.querySelectorAll('[data-dir]'));
            const tocA = Array.prototype.slice.call(document.querySelectorAll('.toc-list a'));
            const total = slides.length;
            let index = 0;

            const titles = slides.map(function (s, i) {
                const h = s.querySelector('h2');
                return h ? h.textContent.trim() : ('Chapter ' + (i + 1));
            });
            const pad = function (n) { return (n < 10 ? '0' : '') + n; };
            const navHeight = function () {
                const n = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10);
                return isNaN(n) ? 70 : n;
            };

            const dots = [];
            if (dotsWrap) {
                titles.forEach(function (t, i) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.setAttribute('aria-label', 'Go to chapter: ' + t);
                    b.addEventListener('click', function () { go(i); });
                    dotsWrap.appendChild(b);
                    dots.push(b);
                });
            }

            function render(dir) {
                slides.forEach(function (s, i) {
                    s.classList.remove('is-active', 'dir-next', 'dir-prev');
                    if (i === index) {
                        s.classList.add('is-active');
                        if (dir === 1) s.classList.add('dir-next');
                        else if (dir === -1) s.classList.add('dir-prev');
                    }
                });
                dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
                if (numEl) numEl.textContent = pad(index + 1);
                if (nowEl) nowEl.textContent = titles[index];
                const activeId = '#' + slides[index].id;
                tocA.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === activeId); });
                navBtns.forEach(function (btn) {
                    const d = parseInt(btn.getAttribute('data-dir'), 10);
                    btn.disabled = (d < 0 && index === 0) || (d > 0 && index === total - 1);
                });
            }

            function go(i, noScroll) {
                i = Math.max(0, Math.min(total - 1, i));
                const dir = i > index ? 1 : (i < index ? -1 : 0);
                index = i;
                render(dir);
                history.replaceState(null, '', '#' + slides[index].id);
                if (!noScroll) {
                    const top = reader.getBoundingClientRect().top + window.scrollY - navHeight() - 8;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }

            navBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    go(index + (parseInt(btn.getAttribute('data-dir'), 10) || 0));
                });
            });

            Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
                const href = a.getAttribute('href');
                const t = href && href.length > 1 ? document.getElementById(href.slice(1)) : null;
                if (!t || !t.classList.contains('chapter-slide')) return;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    const i = slides.indexOf(t);
                    if (i >= 0) go(i);
                });
            });

            document.addEventListener('keydown', function (e) {
                if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
                if (e.key === 'ArrowRight') go(index + 1);
                else if (e.key === 'ArrowLeft') go(index - 1);
            });

            const vp = reader.querySelector('.reader-viewport');
            if (vp) {
                let sx = 0, sy = 0, swiping = false;
                vp.addEventListener('touchstart', function (e) {
                    const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; swiping = true;
                }, { passive: true });
                vp.addEventListener('touchend', function (e) {
                    if (!swiping) return; swiping = false;
                    const t = e.changedTouches[0];
                    const dx = t.clientX - sx, dy = t.clientY - sy;
                    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                        go(index + (dx < 0 ? 1 : -1));
                    }
                }, { passive: true });
            }

            let start = 0;
            if (location.hash && location.hash.length > 1) {
                const el = document.getElementById(location.hash.slice(1));
                const i = el ? slides.indexOf(el) : -1;
                if (i >= 0) start = i;
            }
            index = start;
            render(0);
        }
    }

    /* ---------- hero typing effect ---------- */
    const reduceMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const typingEl = document.getElementById('typingText');
    if (typingEl && !reduceMotion) {
        const raw = typingEl.getAttribute('data-typing') || typingEl.textContent || '';
        const phrases = raw.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        if (phrases.length > 1) {
            let pi = 0, ci = 0, deleting = false;
            typingEl.textContent = '';
            const tick = function () {
                const word = phrases[pi];
                if (!deleting) {
                    ci++;
                    typingEl.textContent = word.slice(0, ci);
                    if (ci >= word.length) { deleting = true; return setTimeout(tick, 1800); }
                    return setTimeout(tick, 70);
                }
                ci--;
                typingEl.textContent = word.slice(0, ci);
                if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 420); }
                return setTimeout(tick, 35);
            };
            setTimeout(tick, 900);
        }
    }

    /* ---------- active-nav scrollspy (same-page anchors) ---------- */
    const spyItems = [];
    Array.prototype.slice.call(document.querySelectorAll('.nav-links a.nav-link[href*="#"]'))
        .forEach(function (a) {
            const href = a.getAttribute('href') || '';
            const hashAt = href.indexOf('#');
            if (hashAt < 0) return;
            const id = href.slice(hashAt);
            if (id.length < 2) return;
            const path = href.slice(0, hashAt);
            if (path && path.indexOf('index.html') < 0 && path !== './') return;
            const sec = document.querySelector(id);
            if (sec) spyItems.push({ link: a, sec: sec });
        });
    if (spyItems.length) {
        const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a.nav-link'));
        const homeLink = document.querySelector(
            '.nav-links a.nav-link[href="./index.html"], .nav-links a.nav-link[href="../index.html"], .nav-links a.nav-link[href="../../index.html"]'
        );
        const updateSpy = function () {
            let current = null;
            spyItems.forEach(function (item) {
                if (item.sec.getBoundingClientRect().top <= 140) current = item;
            });
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            if (current) current.link.classList.add('active');
            else if (homeLink) homeLink.classList.add('active');
        };
        window.addEventListener('scroll', updateSpy, { passive: true });
        updateSpy();
    }

    /* ---------- footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
