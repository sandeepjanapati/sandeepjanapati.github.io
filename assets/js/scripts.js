/* Native animation + Canvas 2D: no build step or GPU-specific dependency. */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const mobile = matchMedia('(max-width: 900px)');
    let paused = reducedMotion.matches;
    let swiper;
    const sections = [...document.querySelectorAll('main section')];
    const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sidebar = document.querySelector('.sidebar');
    const menu = document.querySelector('.hamburger-menu');
    const backdrop = document.querySelector('.menu-backdrop');
    const profileProgress = document.querySelector('.profile-progress-value');
    const backToTop = document.querySelector('.back-to-top');
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    document.querySelector('.nav-menu').prepend(indicator);
    const main = document.querySelector('main');
    const ownedAnimations = new Set();

    function animate(element, frames, options = {}) {
        if (paused || !element.animate) return;
        const animation = element.animate(frames, {
            duration: 800, fill: 'backwards', easing: 'cubic-bezier(.22, 1, .36, 1)', ...options
        });
        ownedAnimations.add(animation);
        animation.finished.then(() => ownedAnimations.delete(animation), () => ownedAnimations.delete(animation));
        return animation;
    }

    function setMenu(open) {
        open = open && mobile.matches;
        if (!open && mobile.matches && sidebar.contains(document.activeElement)) menu.focus();
        main.inert = open;
        backToTop.inert = open;
        sidebar.classList.toggle('active', open);
        backdrop.classList.toggle('active', open);
        menu.setAttribute('aria-expanded', String(open));
        sidebar.inert = mobile.matches && !open;
        if (open) {
            sidebar.querySelectorAll('.nav-link').forEach((link, i) => animate(link,
                [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }],
                { duration: 500, delay: i * 30 }));
        }
    }
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    backdrop.addEventListener('click', () => setMenu(false));
    sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            setMenu(false);
            menu.focus();
        }
        if (event.key === 'Tab' && mobile.matches && sidebar.classList.contains('active')) {
            const controls = [menu, ...sidebar.querySelectorAll('a[href]')];
            const index = controls.indexOf(document.activeElement);
            if (event.shiftKey && index <= 0) {
                event.preventDefault();
                controls[controls.length - 1].focus();
            } else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) {
                event.preventDefault();
                menu.focus();
            }
        }
    });
    mobile.addEventListener('change', () => {
        const toggleHadFocus = document.activeElement === menu;
        setMenu(false);
        if (!mobile.matches && toggleHadFocus) (sidebar.querySelector('[aria-current]') || links[0]).focus();
    });
    document.body.classList.add('enhanced');
    setMenu(false);

    // Articles follow pronunciation ("an em-el engineer"), not just spelling.
    const hour = new Date().getHours();
    document.querySelector('.intro-text').textContent = hour >= 5 && hour < 12 ? "Good Morning, I'm"
        : hour < 17 && hour >= 12 ? "Good Afternoon, I'm" : hour >= 17 && hour < 21 ? "Good Evening, I'm" : "Hey there, I'm";
    const roles = ['AI Engineer', 'Data Scientist', 'ML Engineer', 'Coder', 'Fast Learner', 'Creative Thinker'];
    const articles = ['An', 'A', 'An', 'A', 'A', 'A'];
    const article = document.querySelector('#role-article');
    const typed = document.querySelector('#typed-text');
    let role = 0;
    let letters = roles[0].length;
    let deleting = true;
    let typingTimer;
    typed.textContent = roles[0];
    function type() {
        clearTimeout(typingTimer);
        if (paused || document.hidden) return;
        letters += deleting ? -1 : 1;
        typed.textContent = roles[role].slice(0, letters);
        let delay = deleting ? 45 : 85;
        if (letters === 0) {
            deleting = false;
            role = (role + 1) % roles.length;
            article.textContent = `${articles[role]} `;
            delay = 250;
        }
        if (letters === roles[role].length) { deleting = true; delay = 2200; }
        typingTimer = setTimeout(type, delay);
    }

    // Intersection triggers target individual items, not tall parent sections.
    const surfaces = document.querySelectorAll('.certification-item, .skill-box, .education-box, .experience-box, #achievements li, .contact-content');
    surfaces.forEach(element => element.classList.add('surface'));
    const revealTargets = document.querySelectorAll('section h2, .skills-subsection h3, .interest-item, .surface');
    if ('IntersectionObserver' in window) {
        const reveal = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting);
            visible.forEach((entry, i) => {
                animate(entry.target, [
                    { opacity: .1, transform: 'translateY(28px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { delay: Math.min(i, 5) * 55 });
                reveal.unobserve(entry.target);
            });
        }, { threshold: .08 });
        revealTargets.forEach(element => reveal.observe(element));
    }
    document.querySelectorAll('.home-content > *').forEach((element, i) => {
        animate(element, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { delay: i * 75, duration: 950 });
    });

    // Lighting moves inside stationary hit areas; never competes with Swiper transforms.
    let pointerFrame = 0;
    let pointerEvent;
    function resolvePointerTarget(event) {
        const target = event?.target;
        if (target instanceof Element) return target;
        if (typeof event?.clientX === 'number' && typeof event?.clientY === 'number') {
            return document.elementFromPoint(event.clientX, event.clientY);
        }
        return null;
    }
    document.addEventListener('pointermove', event => {
        if (!finePointer.matches || paused) return;
        pointerEvent = event;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
            pointerFrame = 0;
            const target = resolvePointerTarget(pointerEvent);
            const surface = target?.closest('.surface');
            if (!surface) return;
            const rect = surface.getBoundingClientRect();
            surface.style.setProperty('--pointer-x', `${pointerEvent.clientX - rect.left}px`);
            surface.style.setProperty('--pointer-y', `${pointerEvent.clientY - rect.top}px`);
        });
    }, { passive: true });

    // CSS keeps a scrollable project strip available if the CDN cannot load.
    if (typeof Swiper !== 'undefined') {
        swiper = new Swiper('.mySwiper', {
            effect: 'coverflow', slidesPerView: 'auto', centeredSlides: true,
            loop: true, speed: paused ? 0 : 750, spaceBetween: 24,
            coverflowEffect: { rotate: 0, stretch: 0, depth: 109.25, modifier: 1, slideShadows: false },
            grabCursor: true, watchSlidesProgress: true,
            keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
            mousewheel: { forceToAxis: true, sensitivity: .8 },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            autoplay: { delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true },
            a11y: { enabled: true, prevSlideMessage: 'Previous project', nextSlideMessage: 'Next project' },
            on: {
                slideChangeTransitionStart() {
                    const slide = this.slides[this.activeIndex];
                    if (!slide) return;
                    slide.querySelectorAll('.project-header, .project-highlights, .project-tech, .project-buttons').forEach((element, i) => {
                        animate(element, [{ opacity: .45, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: i * 50 });
                    });
                }
            }
        });
    }
    let carouselVisible = false;
    function syncAutoplay() {
        if (!swiper) return;
        const stop = paused || document.hidden || !carouselVisible || (finePointer.matches && swiper.el.matches(':hover')) || swiper.el.contains(document.activeElement);
        if (stop) swiper.autoplay.stop();
        else if (!swiper.autoplay.running) swiper.autoplay.start();
    }
    const carousel = document.querySelector('.mySwiper');
    ['mouseenter', 'mouseleave', 'focusin'].forEach(name => carousel.addEventListener(name, syncAutoplay));
    carousel.addEventListener('focusout', () => requestAnimationFrame(syncAutoplay));
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            carouselVisible = entries[0].isIntersecting;
            syncAutoplay();
        }, { threshold: .1 }).observe(carousel);
    } else { carouselVisible = true; }

    // Keep counters at their final values if motion is disabled or interrupted.
    const counters = [...document.querySelectorAll('.counter')];
    const countFrames = new Map();
    function finishCounters() {
        counters.forEach(element => {
            cancelAnimationFrame(countFrames.get(element));
            element.textContent = element.dataset.target + (element.dataset.suffix || '');
        });
    }
    finishCounters();
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            const start = performance.now();
            const target = Number(element.dataset.target);
            const suffix = element.dataset.suffix || '';
            function tick(now) {
                if (paused) { element.textContent = target + suffix; return; }
                const p = Math.min((now - start) / 1600, 1);
                element.textContent = Math.round(target * (1 - (1 - p) ** 3)) + suffix;
                if (p < 1) countFrames.set(element, requestAnimationFrame(tick));
            }
            if (!paused) countFrames.set(element, requestAnimationFrame(tick));
            counterObserver.unobserve(element);
        }), { threshold: .5 });
        counters.forEach(element => counterObserver.observe(element));
    }

    // Copy buttons are separate from native phone/email link actions.
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.append(toastContainer);
    function toast(message) {
        const element = document.createElement('div');
        element.className = 'toast';
        element.textContent = message;
        toastContainer.append(element);
        animate(element, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 350 });
        setTimeout(() => element.remove(), 2500);
    }
    async function copy(text) {
        if (navigator.clipboard && isSecureContext) return navigator.clipboard.writeText(text);
        const input = document.createElement('textarea');
        input.value = text;
        input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.append(input);
        const focused = document.activeElement;
        try {
            input.select();
            if (!document.execCommand('copy')) throw new Error('Copy failed');
        } finally { input.remove(); focused?.focus({ preventScroll: true }); }
    }
    document.querySelectorAll('.social-item').forEach(item => {
        const link = item.querySelector('a[href^="tel:"], a[href^="mailto:"]');
        if (!link) return;
        const label = link.protocol === 'tel:' ? 'Phone number' : 'Email address';
        const value = link.getAttribute('href').replace(/^(tel:|mailto:)/, '');
        const icon = document.createElement('button');
        icon.type = 'button';
        icon.className = 'copy-icon';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.4');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M8 8h11v12H8z M16 8V4H4v12h4');
        svg.append(path);
        icon.append(svg);
        icon.setAttribute('aria-label', `Copy ${label.toLowerCase()}`);
        icon.title = `Copy ${label.toLowerCase()}`;
        link.parentElement.append(icon);
        icon.addEventListener('click', () => {
            copy(value).then(() => toast(`${label} copied to clipboard!`))
                .catch(() => toast('Failed to copy. Please try manually.'));
        });
    });

    // Frontend-only form: never transmit data or imply successful delivery.
    const contactTabs = [...document.querySelectorAll('.contact-tabs [role="tab"]')];
    const contactIndicator = document.createElement('span');
    contactIndicator.className = 'contact-tab-indicator';
    contactIndicator.setAttribute('aria-hidden', 'true');
    document.querySelector('.contact-tabs').append(contactIndicator);
    let contactIndicatorAnimation;
    let selectedContactTab = null;
    let contactPanelAnimation;
    function selectContactTab(tab) {
        if (tab === selectedContactTab) return;
        const previousTab = selectedContactTab;
        const previousTransform = getComputedStyle(contactIndicator).transform;
        contactIndicatorAnimation?.cancel();
        const targetPercent = contactTabs.indexOf(tab) * 100;
        const nextTransform = `translateX(${targetPercent}%) scaleX(.94)`;
        contactIndicator.style.transform = nextTransform;
        if (previousTab) {
            const direction = contactTabs.indexOf(tab) > contactTabs.indexOf(previousTab) ? 1 : -1;
            contactIndicatorAnimation = animate(contactIndicator, [
                { transform: previousTransform, offset: 0 },
                { transform: `translateX(${targetPercent - direction * 42}%) scaleX(1.12) scaleY(.88)`, offset: .42 },
                { transform: `translateX(${targetPercent}%) scaleX(.90) scaleY(1.04)`, offset: .78 },
                { transform: nextTransform, offset: 1 }
            ], { duration: 520, easing: 'cubic-bezier(.3, 0, .2, 1)' });
        }
        contactPanelAnimation?.cancel();
        contactTabs.forEach(item => {
            const selected = item === tab;
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
            const panel = document.getElementById(item.getAttribute('aria-controls'));
            panel.hidden = !selected;
            panel.inert = !selected;
            panel.style.visibility = selected ? 'visible' : 'hidden';
        });
        selectedContactTab = tab;
        if (previousTab) {
            const panel = document.getElementById(tab.getAttribute('aria-controls'));
            contactPanelAnimation = animate(panel, [
                { opacity: .45 },
                { opacity: 1 }
            ], { duration: 220 });
        }
    }
    contactTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectContactTab(tab));
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % contactTabs.length;
            if (event.key === 'ArrowLeft') next = (index + contactTabs.length - 1) % contactTabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = contactTabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            selectContactTab(contactTabs[next]);
            contactTabs[next].focus();
        });
    });
    document.querySelector('.contact-tabs').hidden = false;
    selectContactTab(contactTabs[0]);
    const contactEmail = document.querySelector('#contact-email');
    function validateContactEmail() {
        const value = contactEmail.value;
        const [local = '', domain = ''] = value.split('@');
        const valid = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value)
            && local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..')
            && domain.split('.').every(label => label.length <= 63 && !label.startsWith('-') && !label.endsWith('-'));
        contactEmail.setCustomValidity(!value || valid ? '' : 'Enter a valid email address, such as name@example.com.');
    }
    contactEmail.addEventListener('input', validateContactEmail);
    contactEmail.addEventListener('blur', () => {
        contactEmail.value = contactEmail.value.trim();
        validateContactEmail();
        if (contactEmail.value) contactEmail.reportValidity();
    });
    document.querySelector('#contact-form').addEventListener('submit', event => {
        event.preventDefault();
        validateContactEmail();
        event.currentTarget.reportValidity();
        // Enable Send only when a real delivery endpoint is integrated.
    });

    // Scroll work is batched once per frame. Layout remains in normal document flow.
    let scrollFrame = 0;
    let sceneProgress = 0;
    let activeSectionId = sections[0].id;
    let onGlobeSectionChange = null;
    let onGlobeScroll = null;
    function updateScroll() {
        scrollFrame = 0;
        let active = sections[0];
        const height = innerHeight;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (height * .8 - rect.top) / (rect.height + height * .3)));
            section.style.setProperty('--section-progress', progress.toFixed(3));
            if (rect.top <= height * .45) { active = section; sceneProgress = index + progress; }
        });
        if (active.id !== activeSectionId) {
            activeSectionId = active.id;
            onGlobeSectionChange?.();
        }
        links.forEach(link => {
            const selected = link.hash === `#${active.id}`;
            link.classList.toggle('active', selected);
            if (selected) {
                link.setAttribute('aria-current', 'location');
                indicator.style.setProperty('--nav-top', `${link.offsetTop}px`);
                indicator.style.setProperty('--nav-height', `${link.offsetHeight}px`);
            } else link.removeAttribute('aria-current');
        });
        const distance = document.documentElement.scrollHeight - height;
        const pageProgress = distance > 0 ? Math.max(0, Math.min(1, scrollY / distance)) : 0;
        profileProgress.style.strokeDashoffset = String(100 * (1 - pageProgress));
        backToTop.classList.toggle('show', scrollY > 300);
        onGlobeScroll?.();
    }
    function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
    addEventListener('scroll', scheduleScroll, { passive: true });
    addEventListener('resize', scheduleScroll, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.querySelector('main'));
    document.fonts?.ready.then(scheduleScroll);
    backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: paused ? 'instant' : 'smooth' }));
    updateScroll();

    // An original mathematical wire surface, projected in 2D. No models or loading gate.
    const canvas = document.querySelector('#ambient-canvas');
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let time = 0;
    let quality = 1;
    let slowFrames = 0;
    let rotationYaw = 0;
    let automaticYawOffset = 0;
    function automaticYaw() {
        return Math.sin((sceneProgress * .32 + time * .085) * .3) * .22;
    }
    const rotationRoll = +.4;
    let manuallyRotated = false;
    let globeBounds = null;
    let displayedYaw = 0;
    let interactionFrame = 0;
    function takeControl() {
        if (!manuallyRotated) {
            rotationYaw = displayedYaw;
        }
        manuallyRotated = true;
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
    }
    function rotateFromWheel(dx, dy) {
        takeControl();
        const sensitivity = .65 / Math.max(100, globeBounds.radius);
        const c = Math.cos(rotationRoll);
        const s = Math.sin(rotationRoll);
        rotationYaw += (dx * c + dy * s) * sensitivity;
        redrawInteraction();
    }
    function redrawInteraction() {
        if (interactionFrame || frame || document.hidden) return;
        interactionFrame = requestAnimationFrame(() => {
            interactionFrame = 0;
            draw();
        });
    }
    function overGlobe(event) {
        if (!context || !globeBounds || sidebar.classList.contains('active')) return false;
        const target = resolvePointerTarget(event);
        if (target && target.closest('a, button, input, textarea, select, .swiper, .sidebar, .header, .menu-backdrop, .surface, .interest-item, .skill-box, .education-box, .experience-box, .contact-content, p, h1, h2, h3, li')) return false;
        return Math.hypot(event.clientX - globeBounds.x, event.clientY - globeBounds.y) <= globeBounds.radius;
    }
    // Resume scene-driven motion from the user's last angle, with no snap.
    // Rebase against the current section phase; later phase changes accumulate
    // naturally on top of that pose, including across repeated interactions.
    onGlobeSectionChange = () => {
        if (!manuallyRotated) return;
        automaticYawOffset = rotationYaw - automaticYaw();
        manuallyRotated = false;
        if (!paused && !document.hidden && context && !frame) {
            cancelAnimationFrame(interactionFrame);
            interactionFrame = 0;
            lastTime = 0;
            frame = requestAnimationFrame(render);
        } else redrawInteraction();
    };
    onGlobeScroll = () => { if (!manuallyRotated) redrawInteraction(); };
    // Trackpad two-finger swipes arrive as wheel events, not touch events.
    // Native momentum supplies the glide; do not add a second inertia impulse.
    document.addEventListener('wheel', event => {
        if (event.ctrlKey || event.metaKey || !event.cancelable || !overGlobe(event)) return;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
        const dx = Math.max(-180, Math.min(180, event.deltaX * unit));
        const dy = Math.max(-180, Math.min(180, event.deltaY * unit));
        if (!dx && !dy) return;
        event.preventDefault();
        rotateFromWheel(dx, dy);
    }, { passive: false });
    function resizeCanvas() {
        width = innerWidth;
        height = innerHeight;
        const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2400000 / (width * height)));
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context?.setTransform(ratio, 0, 0, ratio, 0, 0);
        draw();
    }
    function draw() {
        if (!context) return;
        context.clearRect(0, 0, width, height);
        const compact = width <= 900;
        const radius = Math.min(width * (compact ? .55 : .29), height * .49, 480);
        const centerX = width * (compact ? .87 : .85);
        const centerY = height * .48;
        const phase = sceneProgress * .32 + time * .085;
        // Quality reduction changes tessellation, never guide spacing.
        const rows = 19;
        const columns = quality === 1 ? (compact ? 64 : 96) : 48;
        // North–south axis is fixed; automatic motion and gestures only change yaw.
        const angle = rotationRoll;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const yaw = manuallyRotated ? rotationYaw : automaticYawOffset + automaticYaw();
        displayedYaw = yaw;
        globeBounds = { x: centerX, y: centerY, radius: radius * .58 };
        // A single projection owns orientation, curvature, depth and movement.
        function rotatedPoint(longitude, latitude) {
            const x = Math.cos(latitude) * Math.cos(longitude + yaw);
            const z = Math.cos(latitude) * Math.sin(longitude + yaw);
            const y = Math.sin(latitude);
            return [x, y, z];
        }
        function project(longitude, latitude) {
            const [x, y, z] = rotatedPoint(longitude, latitude);
            const depth = 1 / (1.8 - z * .22);
            return [centerX + (x * cos - y * sin) * radius * depth,
                centerY + (x * sin + y * cos) * radius * depth];
        }
        for (let row = 0; row < rows; row++) {
            const latitude = (row / (rows - 1) - .5) * Math.PI * .93;
            for (let column = 0; column < columns; column++) {
                const longitude = column / columns * Math.PI * 2;
                const nextLongitude = (column + 1) / columns * Math.PI * 2;
                const midLongitude = (longitude + nextLongitude) / 2;
                const foreground = rotatedPoint(midLongitude, latitude)[2] > 0;
                const emphasis = foreground ? 1 : .72;
                context.strokeStyle = `rgba(94, 165, 231, ${(compact ? .085 : .14) * emphasis})`;
                context.beginPath();
                context.moveTo(...project(longitude, latitude));
                context.lineTo(...project(nextLongitude, latitude));
                context.lineWidth = .8;
                context.stroke();
            }
        }
        // Subdued meridians reveal yaw without competing with latitude rings.
        const meridians = 12;
        const segments = columns / 2;
        for (let meridian = 0; meridian < meridians; meridian++) {
            const longitude = meridian / meridians * Math.PI * 2;
            for (let segment = 0; segment < segments; segment++) {
                const latitude = (segment / segments - .5) * Math.PI;
                const nextLatitude = ((segment + 1) / segments - .5) * Math.PI;
                const depth = rotatedPoint(longitude, (latitude + nextLatitude) / 2)[2];
                const opacity = (compact ? .035 : .055) * (.35 + .65 * (depth + 1) / 2);
                context.strokeStyle = `rgba(94, 165, 231, ${opacity})`;
                context.beginPath();
                context.moveTo(...project(longitude, latitude));
                context.lineTo(...project(longitude, nextLatitude));
                context.lineWidth = .8;
                context.stroke();
            }
        }
        // Fine architectural guide lines, deliberately not a particle storm.
        context.strokeStyle = 'rgba(162, 192, 225, .055)';
        context.beginPath();
        context.moveTo(centerX - radius, centerY);
        context.lineTo(centerX + radius, centerY);
        context.moveTo(centerX, centerY - radius);
        context.lineTo(centerX, centerY + radius);
        context.stroke();
    }
    function render(now) {
        frame = 0;
        if (paused || manuallyRotated || document.hidden || !context) return;
        const elapsed = lastTime ? now - lastTime : 16;
        if (elapsed > 35) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
        if (slowFrames > 45) quality = .65;
        time += Math.min(elapsed, 50) / 1000;
        lastTime = now;
        draw();
        frame = requestAnimationFrame(render);
    }
    function syncMotion() {
        clearTimeout(typingTimer);
        cancelAnimationFrame(frame);
        cancelAnimationFrame(interactionFrame);
        interactionFrame = 0;
        frame = 0;
        lastTime = 0;
        document.body.classList.toggle('motion-paused', paused);
        if (paused) {
            // Do not cancel Swiper-owned CSS transitions through the global API.
            ownedAnimations.forEach(animation => animation.cancel());
            ownedAnimations.clear();
            if (swiper?.animating) {
                // Complete the selected slide and fire its normal transition end
                // so Swiper also removes its pending wrapper event listener.
                swiper.setTransition(0);
                swiper.wrapperEl.dispatchEvent(new Event('transitionend', { bubbles: true }));
                if (swiper.animating) swiper.transitionEnd();
            }
            finishCounters();
            typed.textContent = roles[role];
            article.textContent = `${articles[role]} `;
            letters = roles[role].length;
            deleting = true;
        }
        if (swiper) swiper.params.speed = paused ? 0 : 750;
        syncAutoplay();
        draw();
        if (!paused && !document.hidden) {
            typingTimer = setTimeout(type, 2200);
            if (!manuallyRotated && context) frame = requestAnimationFrame(render);
        }
    }
    reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
    document.addEventListener('visibilitychange', syncMotion);
    addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    syncMotion();
});