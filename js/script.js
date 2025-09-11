document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION & LANGUAGE SWITCHER LOGIC ---
    const translations = {};
    const rtlStylesheet = document.createElement('link');
    rtlStylesheet.rel = 'stylesheet';
    rtlStylesheet.href = 'css/rtl.css';
    rtlStylesheet.id = 'rtl-stylesheet';

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load ${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            console.error('Translation Error:', error);
            if (lang !== 'en') await loadTranslations('en');
        }
    }

    function applyTranslations(lang) {
        const translatableElements = document.querySelectorAll('[data-translate-key]');
        translatableElements.forEach(el => {
            const key = el.dataset.translateKey;
            const translation = translations[lang]?.[key];
            if (translation) {
                el.innerHTML = translation;
            }
        });
        document.title = translations[lang]?.metaTitle || 'Ilias El Mabrak Portfolio';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', translations[lang]?.metaDescription || '');
        }
    }

    async function setLanguage(lang) {
        if (!translations[lang]) {
            await loadTranslations(lang);
        }
        applyTranslations(lang);
        document.documentElement.lang = lang;

        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            if (!document.getElementById('rtl-stylesheet')) {
                document.head.appendChild(rtlStylesheet);
            }
        } else {
            document.documentElement.dir = 'ltr';
            const existingRtlSheet = document.getElementById('rtl-stylesheet');
            if (existingRtlSheet) {
                document.head.removeChild(existingRtlSheet);
            }
        }

        updateSwitcherDisplay(lang);
        localStorage.setItem('preferredLanguage', lang);
    }

    function updateSwitcherDisplay(lang) {
        document.querySelectorAll('.language-switcher').forEach(switcher => {
            const option = switcher.querySelector(`.lang-options li[data-lang="${lang}"]`);
            if (option) {
                const flag = option.querySelector('.lang-flag').textContent;
                const text = option.textContent.trim().split(' ').pop();

                // FIX: Corrected class selectors to match the HTML (.lang-flag and .lang-text)
                const displayFlag = switcher.querySelector('.selected-lang .lang-flag');
                const displayText = switcher.querySelector('.selected-lang .lang-text');

                // Add a check to ensure elements exist before trying to set their text content
                if (displayFlag) displayFlag.textContent = flag;
                if (displayText) displayText.textContent = text;
            }
            switcher.classList.remove('active');
        });
    }

    function setupLanguageSwitchers() {
        document.querySelectorAll('.language-switcher').forEach(switcher => {
            switcher.querySelector('.selected-lang').addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other switchers before opening this one
                document.querySelectorAll('.language-switcher.active').forEach(s => {
                    if (s !== switcher) s.classList.remove('active');
                });
                switcher.classList.toggle('active');
            });
            switcher.querySelector('.lang-options').addEventListener('click', (e) => {
                const li = e.target.closest('li');
                if (li?.dataset.lang) {
                    setLanguage(li.dataset.lang);
                }
            });
        });
    }

    // Clone switcher for mobile
    const desktopSwitcher = document.querySelector('.header > .language-switcher');
    const mobileNav = document.getElementById('mobile-nav');
    if (desktopSwitcher && mobileNav) {
        const switcherClone = desktopSwitcher.cloneNode(true);
        mobileNav.appendChild(switcherClone);
    }

    setupLanguageSwitchers();

    document.addEventListener('click', () => {
        document.querySelectorAll('.language-switcher.active').forEach(s => s.classList.remove('active'));
    });

    // Determine and set initial language
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (['en', 'fr', 'ar'].includes(browserLang) ? browserLang : 'en');
    setLanguage(initialLang);


    // --- ORIGINAL SCRIPT LOGIC ---

    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
    });

    // Particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 5 + 8}s`;
            const size = `${Math.random() * 4 + 2}px`;
            particle.style.width = size;
            particle.style.height = size;
            particle.style.background = `hsl(170, 100%, ${Math.random() * 20 + 70}%)`;
            particlesContainer.appendChild(particle);
        }
    }

    // Smooth Scrolling
    function initSmoothScrolling() {
        document.querySelectorAll('.nav-links a, .footer-section a, .hero-buttons a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetSection.offsetTop - headerHeight + 1;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                        const mobileNav = document.getElementById('mobile-nav');
                        const hamburger = document.getElementById('hamburger');
                        if (mobileNav && mobileNav.classList.contains('active')) {
                            mobileNav.classList.remove('active');
                            if (hamburger) hamburger.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            });
        });
    }

    // Scroll Animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animated-element').forEach(el => observer.observe(el));
    }

    // Header Scroll Effect
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    // Contact Form
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', () => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '⏳ Sending...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }

    // Scroll Spy
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        if (sections.length === 0 || navLinks.length === 0) return;

        window.addEventListener('scroll', () => {
            let current = '';
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 3D Card Effects
    function initCard3DEffects() {
        document.querySelectorAll('.skill-card, .service-card, .project-card, .stat-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // Typing Animation
    function typeWriter(element, roles, speed = 100, delay = 2000) {
        let roleIndex = 0, charIndex = 0, isDeleting = false;
        const animatedSpan = element.querySelector('[aria-hidden="true"]');
        if (!animatedSpan) return;
        function type() {
            const currentRole = roles[roleIndex];
            animatedSpan.textContent = isDeleting ? currentRole.substring(0, charIndex - 1) : currentRole.substring(0, charIndex + 1);
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            if (!isDeleting && charIndex === currentRole.length + 1) {
                isDeleting = true;
                setTimeout(type, delay);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, speed);
            } else {
                setTimeout(type, isDeleting ? speed / 2 : speed);
            }
        }
        type();
    }

    // Counter Animation
    function animateCounters() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = parseInt(target.textContent.replace(/[^0-9]/g, ''));
                    if (isNaN(finalNumber)) return;
                    const suffix = target.textContent.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = finalNumber / 100;
                    const interval = setInterval(() => {
                        current += increment;
                        if (current >= finalNumber) {
                            clearInterval(interval);
                            target.textContent = finalNumber + suffix;
                        } else {
                            target.textContent = Math.ceil(current) + suffix;
                        }
                    }, 20);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.7 });
        document.querySelectorAll('.stat-number').forEach(counter => observer.observe(counter));
    }

    // Mobile Navigation
    function initMobileNav() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (!hamburger || !mobileNav) return;
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Parallax Effect for Hero Background (Subtle)
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero && window.pageYOffset < window.innerHeight) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${window.pageYOffset * 0.1}px)`;
            }
        }
    });

    // Initialize all functions
    createParticles();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initContactForm();
    initScrollSpy();
    initCard3DEffects();
    animateCounters();
    initMobileNav();
    const heroRoleElement = document.querySelector('.hero-role');
    if (heroRoleElement && heroRoleElement.dataset.roles) {
        try {
            const roles = JSON.parse(heroRoleElement.dataset.roles);
            typeWriter(heroRoleElement, roles);
        } catch (e) {
            console.error("Could not parse roles for typewriter:", e);
        }
    }
});