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