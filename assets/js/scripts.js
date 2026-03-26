document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const typedText = document.getElementById('typed-text');
    const cursor = document.querySelector('.cursor');
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

    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - window.innerHeight / 2 && pageYOffset < sectionTop + sectionHeight - window.innerHeight / 2) {
                current = section.getAttribute('id');
            }

            if (pageYOffset >= sectionTop - window.innerHeight / 1.3) {
                section.classList.add('visible');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - window.innerHeight / 1.3) {
            section.classList.add('visible');
        }
    });

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    });


    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');

    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });


    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnHamburger = hamburgerMenu.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnHamburger) {
            sidebar.classList.remove('active');
        }
    });



    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
            touchEnd: function (swiper) {
                let threshold = swiper.width * 0.2;
                let diff = swiper.touches.startX - swiper.touches.currentX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        swiper.slideNext();
                    } else {
                        swiper.slidePrev();
                    }
                } else {
                    swiper.slideTo(swiper.activeIndex);
                }
            }
        }
    });


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
});


document.addEventListener('keyup', function (e) {
    if (e.key == 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled on this website.');
    }
});

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key == 'p') {
        alert('Printing is disabled on this website.');
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});

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