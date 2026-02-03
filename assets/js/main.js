// ==================== DOM ELEMENTS ====================
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.navbar-toggler');
const mobileMenu = document.querySelector('.navbar-collapse');

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');

    if (isDark) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    } else {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }
}

// ==================== BACK TO TOP BUTTON ====================
function initBackToTop() {
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', toggleBackToTop);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTop() {
    if (backToTopBtn) {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    if (mobileMenuBtn && mobileMenu) {
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && mobileMenu.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(mobileMenu, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsCollapse = new bootstrap.Collapse(mobileMenu, {
                    toggle: false
                });
                bsCollapse.hide();
            });
        });
    }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-counter'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// ==================== GALLERY FILTER ====================
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const galleryItems = document.querySelectorAll('[data-category]');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.add('show');
                        }, 10);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ==================== IMAGE COMPARISON SLIDER ====================
function initImageComparison() {
    const comparisonContainers = document.querySelectorAll('.image-comparison');

    comparisonContainers.forEach(container => {
        const slider = container.querySelector('.comparison-slider');
        const overlay = container.querySelector('.comparison-overlay');
        let isDragging = false;

        if (slider && overlay) {
            const updateSliderPosition = (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const position = ((x - rect.left) / rect.width) * 100;

                if (position >= 0 && position <= 100) {
                    slider.style.left = `${position}%`;
                    overlay.style.width = `${position}%`;
                }
            };

            slider.addEventListener('mousedown', () => isDragging = true);
            slider.addEventListener('touchstart', () => isDragging = true);

            document.addEventListener('mousemove', (e) => {
                if (isDragging) updateSliderPosition(e);
            });

            document.addEventListener('touchmove', (e) => {
                if (isDragging) updateSliderPosition(e);
            });

            document.addEventListener('mouseup', () => isDragging = false);
            document.addEventListener('touchend', () => isDragging = false);

            // Initialize slider position
            slider.style.left = '50%';
            overlay.style.width = '50%';
        }
    });
}

// ==================== FORM VALIDATION ====================
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// ==================== TESTIMONIAL SLIDER ====================
function initTestimonialSlider() {
    const testimonialSliders = document.querySelectorAll('.testimonial-slider');

    testimonialSliders.forEach(slider => {
        const items = slider.querySelectorAll('.testimonial-item');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        let currentIndex = 0;

        if (items.length > 0) {
            const showSlide = (index) => {
                items.forEach((item, i) => {
                    item.style.display = i === index ? 'block' : 'none';
                });
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % items.length;
                showSlide(currentIndex);
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                showSlide(currentIndex);
            };

            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);

            // Auto-play
            setInterval(nextSlide, 5000);

            // Initialize first slide
            showSlide(0);
        }
    });
}

// ==================== COUNTDOWN TIMER ====================
function initCountdown() {
    const countdownElements = document.querySelectorAll('[data-countdown]');

    countdownElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-countdown')).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                element.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${minutes}</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${seconds}</span>
                        <span class="countdown-label">Seconds</span>
                    </div>
                `;
            } else {
                element.innerHTML = '<p class="text-center">The countdown has ended!</p>';
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && href !== '#0') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ==================== LAZY LOADING ====================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==================== ACTIVE NAVIGATION ====================
function initActiveNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        // Remove query strings and hashes
        const cleanLinkHref = linkHref.split('?')[0].split('#')[0];

        if (cleanLinkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initBackToTop();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initGalleryFilter();
    initImageComparison();
    initFormValidation();
    initTestimonialSlider();
    initCountdown();
    initSmoothScroll();
    initLazyLoading();
    initActiveNavigation();

    // Add loading complete class
    document.body.classList.add('loaded');
});

// ==================== WINDOW RESIZE HANDLER ====================
window.addEventListener('resize', debounce(() => {
    // Re-initialize components that depend on window size
    initImageComparison();
}, 250));

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// ==================== PERFORMANCE MONITORING ====================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}
