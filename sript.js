
document.addEventListener('DOMContentLoaded', () => {

   

    // ============================
    // TYPEWRITER ANIMATION
    // ============================
    const roles = [
        "Étudiante en informatique",
        "Passionnée par l'IA",
        "Développeuse Web",
        "Future Data Scientist"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElement = document.querySelector('.typed-text');

    function typeRole() {
        if (!typedTextElement) return;

        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            typedTextElement.textContent = currentRole.substring(0, charIndex);
            charIndex++;

            if (charIndex > currentRole.length) {
                isDeleting = true;
                setTimeout(typeRole, 2000);
                return;
            }
        } else {
            typedTextElement.textContent = currentRole.substring(0, charIndex);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeRole, typingSpeed);
    }

    if (typedTextElement) {
        setTimeout(typeRole, 500);
    }

    // ============================
    // ANIMATION DES CARTES DE PROJETS
    // ============================
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            projectObserver.observe(card);
        });
    }

    // ============================
    // FORMULAIRE CONTACT
    // ============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formMessage = contactForm.querySelector('.form-message');
        const inputs = contactForm.querySelectorAll('input, textarea');

        // Validation en temps réel
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        function validateField(field) {
            const formGroup = field.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');

            formGroup.classList.remove('error', 'success');

            if (field.value.trim() === '') {
                formGroup.classList.add('error');
                if (errorMessage) errorMessage.textContent = 'Ce champ est requis';
                return false;
            }

            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Email invalide';
                    return false;
                }
            }

            if (field.name === 'message' && field.value.trim().length < 10) {
                formGroup.classList.add('error');
                if (errorMessage) errorMessage.textContent = 'Le message doit contenir au moins 10 caractères';
                return false;
            }

            formGroup.classList.add('success');
            return true;
        }

        // Soumission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });

            if (!isValid) {
                showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
                return;
            }

            if (submitBtn) submitBtn.classList.add('loading');
            if (formMessage) formMessage.style.display = 'none';

            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
                showMessage('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
                contactForm.reset();

                inputs.forEach(input => {
                    input.parentElement.classList.remove('success', 'error');
                });
            }, 2000);
        });

        function showMessage(message, type) {
            if (!formMessage) return;
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // ============================
    // PARTICULES CANVAS
    // ============================
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = Math.random() * 0.5 + 0.2;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.y * 0.01) * 0.5;

                if (this.y > canvas.height) this.reset();
            }

            draw() {
                ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particlesArray = [];
        const numberOfParticles = 80;

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // ============================
    // EFFETS PARALLAX & HERO
    // ============================
    let scrollPosition = 0;
    window.addEventListener('scroll', () => {
        scrollPosition = window.pageYOffset;

        const orbs = document.querySelectorAll('.gradient-orb');
        if (orbs.length > 0) {
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.05;
                orb.style.transform = `translateY(${scrollPosition * speed}px)`;
            });
        }

        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollPosition < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollPosition / window.innerHeight);
        }
    });

    // ============================
    // ANIMATION SECTIONS
    // ============================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

    // ============================
    // CURSEUR PERSONNALISÉ
    // ============================
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateCursorFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursorFollower);
    }

    animateCursorFollower();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // ============================
    // SCROLL TO TOP
    // ============================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
