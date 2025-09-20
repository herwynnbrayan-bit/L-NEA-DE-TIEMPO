// Timeline Interactive Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Timeline Loaded Successfully');

    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todos los eventos del timeline
    document.querySelectorAll('.timeline-event').forEach(event => {
        observer.observe(event);
    });

    // Efecto parallax para la línea del timeline
    const timelineLine = document.querySelector('.timeline-line');
    let ticking = false;

    function updateTimeline() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.1;

        if (timelineLine) {
            timelineLine.style.transform = `translateX(-50%) translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateTimeline);
            ticking = true;
        }
    }

    // Scroll listener con throttling
    window.addEventListener('scroll', requestTick, { passive: true });

    // Efectos hover mejorados
    document.querySelectorAll('.event-content').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth scroll para navegación interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Preloader opcional
    function showPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="spinner"></div>
                <p>Cargando Timeline...</p>
            </div>
        `;
        document.body.appendChild(preloader);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 1500);
    }

    // Performance monitoring
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        }
    }

    // Lazy loading para imágenes (si las agregas después)
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowUp') {
            window.scrollBy({
                top: -window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        }
    });

    // Analytics tracking (opcional)
    function trackEvent(action, category = 'Timeline', label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) {
                trackEvent('scroll_depth', 'Engagement', `${maxScroll}%`);
            }
        }
    }, { passive: true });

    // Initialize features
    logPerformance();
    setupLazyLoading();

    console.log('✅ All interactive features loaded');
});

// Service Worker registration (opcional para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling global
window.addEventListener('error', function(e) {
    console.error('Timeline Error:', e.error);
    trackEvent('javascript_error', 'Error', e.message);
});

// Resize handler
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalcular posiciones si es necesario
        console.log('Window resized, recalculating positions');
    }, 250);
}, { passive: true });