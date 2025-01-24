document.addEventListener('DOMContentLoaded', function() {
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

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - window.innerHeight / 2 && pageYOffset < sectionTop + sectionHeight - window.innerHeight / 2) {
                current = section.getAttribute('id');
            }

            // Add visible class for fade-in effect
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

        // Prevent scrolling from home section to about section
        const homeSection = document.querySelector('.home-section');
        if (pageYOffset > homeSection.offsetHeight) {
            window.scrollTo(0, homeSection.offsetHeight);
        }
    });

    // Trigger fade-in effect on load
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - window.innerHeight / 1.3) {
            section.classList.add('visible');
        }
    });

    // Disable right-click on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });

    // Smooth scrolling for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
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