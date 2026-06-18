/* =============================================================
   Sarvo Prayas Sansthan — Theme JavaScript
   Features:
   - Mobile navigation toggle
   - Sticky header scroll class
   - Language toggle (EN default; Hindi hook)
   - Stat counter animation (Intersection Observer)
   ============================================================= */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Utility
    ------------------------------------------------------------------ */
    function $(selector, scope) {
        return (scope || document).querySelector(selector);
    }
    function $$(selector, scope) {
        return Array.from((scope || document).querySelectorAll(selector));
    }

    /* ------------------------------------------------------------------
       Sticky header — add scroll class
    ------------------------------------------------------------------ */
    var siteHeader = $('#site-header');
    if (siteHeader) {
        var onScroll = function () {
            siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }

    /* ------------------------------------------------------------------
       Mobile navigation toggle
    ------------------------------------------------------------------ */
    var navToggle = $('#nav-toggle');
    var siteNav   = $('#site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = siteNav.classList.toggle('is-open');
            navToggle.classList.toggle('is-open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close nav when a link inside it is clicked (mobile)
        $$('a', siteNav).forEach(function (link) {
            link.addEventListener('click', function () {
                siteNav.classList.remove('is-open');
                navToggle.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close nav on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
                siteNav.classList.remove('is-open');
                navToggle.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    /* ------------------------------------------------------------------
       Dynamic Navigation Builder
       Reads Ghost's primary nav (rendered in #nav-menu) + secondary nav
       (rendered hidden in #nav-secondary-src).
       Primary items with href containing "#" become dropdown parents.
       Secondary items use "Parent: Child" label format to group under parents.
    ------------------------------------------------------------------ */
    (function buildDynamicNav() {
        var navMenu = $('#nav-menu');
        var secSrc = $('#nav-secondary-src');
        if (!navMenu) return;

        // Collect secondary items: { parentLabel: [{label, url}, ...] }
        var subs = {};
        if (secSrc) {
            $$('li', secSrc).forEach(function (li) {
                var rawLabel = li.getAttribute('data-nav-label') || li.textContent.trim();
                var linkEl = $('a', li);
                var url = linkEl ? linkEl.getAttribute('href') : '#';
                var colonIdx = rawLabel.indexOf(':');
                if (colonIdx === -1) {
                    // No colon = standalone CTA button (e.g. "Donate")
                    // Update the header donate button with this label and URL
                    var donateBtn = $('#header-donate-btn');
                    if (donateBtn) {
                        donateBtn.textContent = rawLabel;
                        donateBtn.href = url;
                    }
                    return;
                }
                var parent = rawLabel.substring(0, colonIdx).trim();
                var child = rawLabel.substring(colonIdx + 1).trim();
                if (!subs[parent]) subs[parent] = [];
                subs[parent].push({ label: child, url: url });
            });
            secSrc.parentNode.removeChild(secSrc);
        }

        // Transform primary items with href containing "#" into dropdown parents
        $$('.nav-item', navMenu).forEach(function (li) {
            var link = $('a', li);
            if (!link) return;
            var label = (li.getAttribute('data-nav-label') || link.textContent).trim();
            var href = link.getAttribute('href') || '';

            // Dropdown marker: URL contains "#" as the fragment destination
            var hashPos = href.indexOf('#');
            var isDropdownMarker = (hashPos !== -1 && href.substring(hashPos) === '#');
            if (isDropdownMarker && subs[label]) {
                li.classList.add('has-dropdown');

                // Replace the <a> with a <button> toggle
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'nav-dropdown-toggle';
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-haspopup', 'true');
                btn.innerHTML = label + ' <svg class="nav-caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                link.parentNode.replaceChild(btn, link);

                // Build the dropdown <ul>
                var dropdown = document.createElement('ul');
                dropdown.className = 'nav-dropdown';
                dropdown.setAttribute('role', 'list');
                subs[label].forEach(function (item) {
                    var subLi = document.createElement('li');
                    var subA = document.createElement('a');
                    subA.href = item.url;
                    subA.textContent = item.label;
                    subLi.appendChild(subA);
                    dropdown.appendChild(subLi);
                });
                li.appendChild(dropdown);
            }
        });

        // Move the "Donate" nav item into the header-actions slot as a styled button.
        // Any primary nav item whose URL contains "/donate" gets extracted.
        var donateSlot = $('#donate-btn-slot');
        if (donateSlot) {
            $$('.nav-item', navMenu).forEach(function (li) {
                var link = $('a', li);
                if (!link) return;
                var href = link.getAttribute('href') || '';
                if (href.indexOf('/donate') !== -1) {
                    // Create styled donate button
                    var donateBtn = document.createElement('a');
                    donateBtn.className = 'btn btn-accent header-donate';
                    donateBtn.href = href;
                    donateBtn.id = 'header-donate-btn';
                    donateBtn.textContent = link.textContent.trim();
                    donateSlot.parentNode.replaceChild(donateBtn, donateSlot);
                    // Remove from the nav list
                    li.parentNode.removeChild(li);
                }
            });
        }

        // Build footer link columns from the same parsed secondary nav data.
        // "Explore" gets project/gallery/event links (stripped of parent prefix).
        // "Get Involved" gets about/contact/donate links.
        var footerExplore = $('#footer-explore');
        var footerInvolved = $('#footer-involved');
        if (footerExplore && footerInvolved) {
            var involvedKeys = ['about', 'contact', 'donate'];
            // Flatten all sub-items from the subs object
            Object.keys(subs).forEach(function (parent) {
                subs[parent].forEach(function (item) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = item.url;
                    a.textContent = item.label;
                    li.appendChild(a);
                    // Decide which column: if URL contains about/contact/donate → Get Involved
                    var isInvolved = involvedKeys.some(function (k) { return item.url.indexOf('/' + k) !== -1; });
                    if (isInvolved) {
                        footerInvolved.appendChild(li);
                    } else {
                        footerExplore.appendChild(li);
                    }
                });
            });
            // Also add Donate to Get Involved if it was a primary nav item
            var donateBtn = $('#header-donate-btn');
            if (donateBtn && footerInvolved) {
                var donateLi = document.createElement('li');
                var donateA = document.createElement('a');
                donateA.href = donateBtn.href;
                donateA.textContent = donateBtn.textContent;
                donateLi.appendChild(donateA);
                footerInvolved.appendChild(donateLi);
            }
        }
    })();

    /* ------------------------------------------------------------------
       Dropdown menus (Program, Gallery, Get Involved)
       - Desktop: CSS opens them on hover.
       - Click/keyboard: toggles .is-open (works on touch + accessibility).
    ------------------------------------------------------------------ */
    var dropdownToggles = $$('.nav-dropdown-toggle');

    dropdownToggles.forEach(function (toggle) {
        var parent = toggle.parentElement;

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            var willOpen = !parent.classList.contains('is-open');

            // Close other open dropdowns
            $$('.nav-item.has-dropdown.is-open').forEach(function (item) {
                if (item !== parent) {
                    item.classList.remove('is-open');
                    var t = $('.nav-dropdown-toggle', item);
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });

            parent.classList.toggle('is-open', willOpen);
            toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
    });

    // Close any open dropdown when clicking outside the nav
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item.has-dropdown')) {
            $$('.nav-item.has-dropdown.is-open').forEach(function (item) {
                item.classList.remove('is-open');
                var t = $('.nav-dropdown-toggle', item);
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }
    });

    /* ------------------------------------------------------------------
       Language toggle (English default; Hindi via Google Website Translate)
       - English is the default on first visit.
       - Clicking हिं translates the whole page to Hindi.
       - Clicking EN restores English.
       - The choice is remembered across pages via the googtrans cookie.
    ------------------------------------------------------------------ */
    var langBtns = $$('.lang-btn');

    function getStoredLang() {
        // Prefer the live googtrans cookie, fall back to localStorage
        var m = document.cookie.match(/googtrans=\/[^\/]+\/(\w+)/);
        if (m && m[1]) { return m[1] === 'hi' ? 'hi' : 'en'; }
        try { return localStorage.getItem('sps-lang') === 'hi' ? 'hi' : 'en'; } catch (e) { return 'en'; }
    }

    // Build the list of domain scopes a googtrans cookie might live on, so we
    // can reliably clear it (Google may set it on the bare host AND ".host",
    // and on platforms like ghost.io it can sit on the parent domain too).
    function cookieDomains() {
        var host = window.location.hostname;
        var domains = ['', host, '.' + host];
        var parts = host.split('.');
        // Add progressively broader parent domains (e.g. ".ghost.io")
        for (var i = 1; i < parts.length - 1; i++) {
            domains.push('.' + parts.slice(i).join('.'));
        }
        return domains;
    }

    // Remove every googtrans cookie variant across all relevant domains/paths.
    function clearGoogTransCookies() {
        var expired = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        cookieDomains().forEach(function (d) {
            document.cookie = expired + (d ? '; domain=' + d : '') + ';';
        });
    }

    // Set the googtrans cookie that Google Translate reads (/en/hi format).
    // For English we simply clear the cookie so the original page shows.
    function setGoogTransCookie(lang) {
        clearGoogTransCookies();
        if (lang === 'hi') {
            var value = '/en/hi';
            cookieDomains().forEach(function (d) {
                document.cookie = 'googtrans=' + value + '; path=/' + (d ? '; domain=' + d : '') + ';';
            });
        }
    }

    // Google Translate leaves a "#googtrans(...)" hash in the URL. If it stays,
    // a reload re-applies the old language. Strip it before reverting.
    function clearTransHash() {
        if (window.location.hash.indexOf('googtrans') !== -1) {
            var cleanUrl = window.location.pathname + window.location.search;
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', cleanUrl);
            } else {
                window.location.hash = '';
            }
        }
    }

    // Try to drive the hidden Google Translate <select>; retry until it loads
    function triggerGoogleTranslate(lang, attempt) {
        attempt = attempt || 0;
        var combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = (lang === 'hi') ? 'hi' : 'en';
            combo.dispatchEvent(new Event('change'));
            return;
        }
        if (attempt < 25) {
            setTimeout(function () { triggerGoogleTranslate(lang, attempt + 1); }, 250);
        }
    }

    function updateLangButtons(lang) {
        langBtns.forEach(function (btn) {
            var isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function setLang(lang) {
        updateLangButtons(lang);
        try { localStorage.setItem('sps-lang', lang); } catch (e) {}
        setGoogTransCookie(lang);

        if (lang === 'hi') {
            triggerGoogleTranslate('hi', 0);
        } else {
            // Restoring English: clear the leftover #googtrans hash, then reload
            // so Google Translate fully reverts the DOM back to the original.
            clearTransHash();
            window.location.reload();
        }
    }

    langBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var lang = btn.getAttribute('data-lang');
            // Avoid a needless reload if already in English
            if (lang === 'en' && getStoredLang() === 'en') { return; }
            setLang(lang);
        });
    });

    // On load: reflect the remembered choice. If Hindi, re-apply it once the
    // widget is ready. English stays the default for first-time visitors.
    (function initLang() {
        var current = getStoredLang();
        updateLangButtons(current);
        if (current === 'hi') {
            triggerGoogleTranslate('hi', 0);
        }
    })();

    /* ------------------------------------------------------------------
       Stat counter animation
       Uses IntersectionObserver — counts up to the final value once the
       stats band enters the viewport.  Numbers with "," in the rendered
       HTML are handled via the data-target attribute.
    ------------------------------------------------------------------ */
    var statNumbers = $$('.stat-number[data-target]');

    if (statNumbers.length && 'IntersectionObserver' in window) {
        var counted = false;

        function easeOutQuad(t) { return t * (2 - t); }

        function animateCount(el, target, suffix, duration) {
            var start  = null;
            var startN = 0;

            function step(timestamp) {
                if (!start) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                var eased    = easeOutQuad(progress);
                var current  = Math.round(eased * (target - startN) + startN);
                // Format with comma for thousands
                el.textContent = current.toLocaleString('en-IN') + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }

        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    statNumbers.forEach(function (el) {
                        var target = parseInt(el.getAttribute('data-target'), 10);
                        var suffix = el.getAttribute('data-suffix') || '';
                        animateCount(el, target, suffix, 1600);
                    });
                }
            });
        }, { threshold: 0.4 });

        var statsBand = $('.stats-band');
        if (statsBand) statsObserver.observe(statsBand);
    }

    /* ------------------------------------------------------------------
       Scroll-reveal for sections (subtle fade-in-up)
       Gracefully does nothing if IntersectionObserver is unavailable.
    ------------------------------------------------------------------ */
    if ('IntersectionObserver' in window) {
        // Add initial state via JS (not CSS) so it only applies when JS is on
        var revealEls = $$('.section-head, .card, .stat-cell, .timeline-item, .event-item, .donate-card, .gallery-item');
        revealEls.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        });

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ------------------------------------------------------------------
       Hero background slideshow
       Reads images from a post tagged "hero-slider" (rendered hidden into
       #hero-bg as .hero-slides-src). Each <img> becomes a rotating slide.
       If only one image (or none) exists, it just shows statically.
    ------------------------------------------------------------------ */
    (function heroSlider() {
        var heroBg = $('#hero-bg');
        if (!heroBg) return;

        var src = $('.hero-slides-src', heroBg);
        if (!src) return; // static fallback <img> already in place

        // Collect image URLs from the hidden post content
        var imgs = $$('img', src);
        var urls = imgs.map(function (im) { return im.getAttribute('src'); })
                       .filter(function (u) { return !!u; });

        // Clean up the hidden source node
        src.parentNode.removeChild(src);

        if (urls.length === 0) return;

        // Build slide layers
        var slides = urls.map(function (url, i) {
            var slide = document.createElement('div');
            slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
            slide.style.backgroundImage = 'url("' + url + '")';
            heroBg.appendChild(slide);
            return slide;
        });

        if (slides.length < 2) return; // single image: nothing to rotate

        var current = 0;
        var DELAY = 5000; // 5s per slide

        setInterval(function () {
            slides[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
        }, DELAY);
    })();

    /* ------------------------------------------------------------------
       Client-side pagination
       Any container with [data-paginate] splits its direct children into
       pages of N (data-paginate="6"). Builds Prev / page-numbers / Next.
    ------------------------------------------------------------------ */
    $$('[data-paginate]').forEach(function (grid) {
        var perPage = parseInt(grid.getAttribute('data-paginate'), 10) || 6;
        var items = Array.from(grid.children);
        var total = items.length;
        if (total <= perPage) return; // no pagination needed

        var pages = Math.ceil(total / perPage);
        var currentPage = 1;

        // Build the controls
        var nav = document.createElement('nav');
        nav.className = 'pagination';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Pagination');

        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'btn pagination-link';
        prev.innerHTML = '&larr; Prev';

        var status = document.createElement('span');
        status.className = 'pagination-pages';

        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'btn pagination-link';
        next.innerHTML = 'Next &rarr;';

        nav.appendChild(prev);
        nav.appendChild(status);
        nav.appendChild(next);
        grid.parentNode.insertBefore(nav, grid.nextSibling);

        function buildNumbers() {
            status.innerHTML = '';
            for (var p = 1; p <= pages; p++) {
                (function (p) {
                    var b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'pagination-num' + (p === currentPage ? ' is-active' : '');
                    b.textContent = p;
                    b.addEventListener('click', function () { goToPage(p); });
                    status.appendChild(b);
                })(p);
            }
        }

        function render() {
            items.forEach(function (item, i) {
                var start = (currentPage - 1) * perPage;
                var end = start + perPage;
                item.style.display = (i >= start && i < end) ? '' : 'none';
            });
            prev.disabled = currentPage === 1;
            next.disabled = currentPage === pages;
            prev.classList.toggle('is-disabled', currentPage === 1);
            next.classList.toggle('is-disabled', currentPage === pages);
            buildNumbers();
        }

        function goToPage(p) {
            currentPage = Math.min(Math.max(1, p), pages);
            render();
            // Scroll the grid back into view on page change
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        prev.addEventListener('click', function () { goToPage(currentPage - 1); });
        next.addEventListener('click', function () { goToPage(currentPage + 1); });

        render();
    });

})();
