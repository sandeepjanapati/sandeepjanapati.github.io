// ============================================================
// PORTFOLIO WEBSITE - MAIN JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // --------------------------------------------------------
    // 1. PRELOADER
    // --------------------------------------------------------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Minimum display time for preloader
        const minDisplayTime = 800;
        const startTime = performance.now();

        function hidePreloader() {
            const elapsed = performance.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                preloader.classList.add('fade-out');
                preloader.addEventListener('transitionend', () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading');
                }, { once: true });
            }, remaining);
        }

        // Hide once everything is loaded
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }

    // --------------------------------------------------------
    // 2. CORE DOM REFERENCES
    // --------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const typedText = document.getElementById('typed-text');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const backToTopBtn = document.getElementById('back-to-top');

    // --------------------------------------------------------
    // 3. DYNAMIC TIME-BASED GREETING
    // --------------------------------------------------------
    const introText = document.querySelector('.intro-text');
    if (introText) {
        const hour = new Date().getHours();
        let greeting = '';

        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning, I\'m';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon, I\'m';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good Evening, I\'m';
        } else {
            greeting = 'Hey there, I\'m';
        }

        introText.textContent = greeting;

        // Add a subtle entrance animation
        introText.style.opacity = '0';
        introText.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
            introText.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            introText.style.opacity = '1';
            introText.style.transform = 'translateY(0)';
        });
    }

    // --------------------------------------------------------
    // 4. TYPING EFFECT
    // --------------------------------------------------------
    const words = ['Data Scientist ', 'Coder ', 'Fast Learner ', 'Creative Thinker ', 'ML Engineer '];
    let wordIndex = 0;
    let letterIndex = 0;
    let currentWord = '';
    let isDeleting = false;

    function type() {
        if (isDeleting) {
            currentWord = words[wordIndex].substring(0, letterIndex--);
        } else {
            currentWord = words[wordIndex].substring(0, letterIndex++);
        }

        typedText.textContent = currentWord;

        if (!isDeleting && letterIndex === words[wordIndex].length) {
            setTimeout(() => {
                isDeleting = true;
                setTimeout(type, 500);
            }, 2000);
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 100 : 200);
        }
    }

    type();

    // --------------------------------------------------------
    // 5. TOUCH DEVICE DETECTION
    // --------------------------------------------------------
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --------------------------------------------------------
    // 7. MAGNETIC BUTTON EFFECT
    // --------------------------------------------------------
    const magneticButtons = document.querySelectorAll(
        '.btn, .github-btn, .webapp-btn, .back-to-top, .certification-item, .education-logo, .company-logo'
    );

    function initMagneticButtons() {
        if (isTouchDevice) return; // Skip on touch devices

        magneticButtons.forEach(btn => {
            const strength = 25; // Magnetic pull strength in pixels
            const triggerArea = 1.5; // Multiplier for trigger zone

            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distX = e.clientX - centerX;
                const distY = e.clientY - centerY;

                // Calculate distance from center
                const distance = Math.sqrt(distX * distX + distY * distY);
                const maxDist = Math.max(rect.width, rect.height) * triggerArea;

                if (distance < maxDist) {
                    const pullX = (distX / maxDist) * strength;
                    const pullY = (distY / maxDist) * strength;
                    this.style.transform = `translate(${pullX}px, ${pullY}px)`;
                    this.style.transition = 'transform 0.2s ease-out';
                }
            });

            btn.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.transition = 'transform 0.4s ease-out';

                // Reset after transition
                setTimeout(() => {
                    this.style.transition = '';
                }, 400);
            });
        });
    }

    initMagneticButtons();

    // --------------------------------------------------------
    // 8. SCROLL-TRIGGERED SKILL ANIMATIONS
    // --------------------------------------------------------
    const skillBoxes = document.querySelectorAll('.skill-box');
    let skillsAnimated = false;

    function animateSkillBoxes() {
        if (skillsAnimated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

        if (isVisible) {
            skillsAnimated = true;

            skillBoxes.forEach((box, index) => {
                // Set initial state
                box.style.opacity = '0';
                box.style.transform = 'scale(0.3) translateY(30px)';

                // Staggered bounce-in animation
                setTimeout(() => {
                    box.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    box.style.opacity = '1';
                    box.style.transform = 'scale(1) translateY(0)';
                }, index * 60);
            });
        }
    }

    // Set initial state for skill boxes
    skillBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'scale(0.3) translateY(30px)';
    });

    // --------------------------------------------------------
    // 9. CONTACT COPY-TO-CLIPBOARD
    // --------------------------------------------------------
    const toastContainer = createToastContainer();

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        return container;
    }

    function showToast(message, duration = 2500) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">✓</span>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-visible');
        });

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            toast.classList.add('toast-exit');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return Promise.resolve();
        } catch (err) {
            document.body.removeChild(textarea);
            return Promise.reject(err);
        }
    }

    // Make contact items copyable
    function initCopyableContacts() {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        const socialItems = contactSection.querySelectorAll('.social-item');

        socialItems.forEach(item => {
            const link = item.querySelector('a[href^="tel:"], a[href^="mailto:"]');
            if (!link) return;

            const href = link.getAttribute('href');
            let copyText = '';
            let label = '';

            if (href.startsWith('tel:')) {
                copyText = href.replace('tel:', '');
                label = 'Phone number';
            } else if (href.startsWith('mailto:')) {
                copyText = href.replace('mailto:', '');
                label = 'Email address';
            }

            if (copyText) {
                // Add copy indicator
                item.style.cursor = 'pointer';
                item.setAttribute('title', `Click to copy ${label}`);

                // Add copy icon
                const copyIcon = document.createElement('span');
                copyIcon.className = 'copy-icon';
                copyIcon.innerHTML = '📋';
                copyIcon.style.opacity = '0';
                copyIcon.style.transition = 'opacity 0.3s ease';
                copyIcon.style.marginLeft = '8px';
                copyIcon.style.fontSize = '0.85rem';
                item.appendChild(copyIcon);

                // Show icon on hover
                item.addEventListener('mouseenter', () => {
                    copyIcon.style.opacity = '1';
                });
                item.addEventListener('mouseleave', () => {
                    copyIcon.style.opacity = '0';
                });

                // Copy on click
                item.addEventListener('click', (e) => {
                    // Don't prevent link default if they click directly on the link
                    if (e.target.closest('a')) {
                        e.preventDefault();
                    }

                    copyToClipboard(copyText)
                        .then(() => {
                            showToast(`${label} copied to clipboard!`);
                            // Brief visual feedback
                            copyIcon.innerHTML = '✅';
                            setTimeout(() => {
                                copyIcon.innerHTML = '📋';
                            }, 1500);
                        })
                        .catch(() => {
                            showToast('Failed to copy. Please try manually.');
                        });
                });
            }
        });
    }

    initCopyableContacts();

    // --------------------------------------------------------
    // 11. NAVIGATION & SCROLL HANDLING
    // --------------------------------------------------------

    // Initial visibility check for sections already in view on load
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - window.innerHeight / 1.3) {
            section.classList.add('visible');
        }
    });

    // Prevent right-click on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    });

    // Hamburger menu toggle
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnHamburger = hamburgerMenu.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnHamburger) {
            sidebar.classList.remove('active');
        }
    });

    // Combined scroll handler
    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - window.innerHeight / 2 && window.scrollY < sectionTop + sectionHeight - window.innerHeight / 2) {
                current = section.getAttribute('id');
            }

            if (window.scrollY >= sectionTop - window.innerHeight / 1.3) {
                section.classList.add('visible');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Trigger skill animations on scroll
        animateSkillBoxes();
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --------------------------------------------------------
    // 12. SWIPER INITIALIZATION
    // --------------------------------------------------------
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        speed: 500,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
        },
        grabCursor: true,
        resistanceRatio: 0.85,
        freeMode: false,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
        },
        on: {
            touchEnd: function () {
                let threshold = this.width * 0.2;
                let diff = this.touches.startX - this.touches.currentX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.slideNext();
                    } else {
                        this.slidePrev();
                    }
                } else {
                    this.slideTo(this.activeIndex);
                }
            }
        }
    });

    // --------------------------------------------------------
    // 13. SMOOTH SCROLL FOR BUTTONS
    // --------------------------------------------------------
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --------------------------------------------------------
    // 14. STAGGER ANIMATIONS
    // --------------------------------------------------------
    const staggerSelectors = [
        '.skill-box',
        '.certification-item',
        '.interest-item',
        '.education-box',
        '.experience-box',
        '#achievements ul li'
    ];

    staggerSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('stagger-item');
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('revealed');
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        staggerObserver.observe(section);
    });

    // --------------------------------------------------------
    // 15. COUNTER ANIMATION
    // --------------------------------------------------------
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);
                        counter.textContent = current + suffix;
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        }
                    }

                    requestAnimationFrame(updateCount);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('#achievements').forEach(section => {
        counterObserver.observe(section);
    });

    // --------------------------------------------------------
    // 16. INITIAL SKILL ANIMATION CHECK
    // --------------------------------------------------------
    animateSkillBoxes();

}); // End DOMContentLoaded


// ============================================================
// GLOBAL EVENT LISTENERS (Outside DOMContentLoaded)
// ============================================================

// Disable PrintScreen
document.addEventListener('keyup', function (e) {
    if (e.key == 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled on this website.');
    }
});

// Disable Ctrl+P (Print)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key == 'p') {
        alert('Printing is disabled on this website.');
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});


// ============================================================
// PARTICLES.JS INITIALIZATION
// ============================================================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#ffffff', '#1e90ff', '#87ceeb']
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.4,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#1e90ff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    });
}