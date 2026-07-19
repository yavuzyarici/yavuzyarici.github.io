// ==================== //
// Smooth Scroll Navigation
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== //
// Active Navigation Highlighting
// ==================== //
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeight = document.querySelector('.navbar').offsetHeight;

    let current = '';
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // If we're at the top of the page, highlight "home"
    if (scrollPosition < 100) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1); // Remove the '#'
        if (href === current) {
            link.classList.add('active');
        }
    });
}

// ==================== //
// Navbar Shadow on Scroll
// ==================== //
function updateNavbarShadow() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 10);
}

// Update on scroll with throttling for performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        updateActiveNavLink();
        updateNavbarShadow();
    });
});

// Update on load
document.addEventListener('DOMContentLoaded', function() {
    updateActiveNavLink();

    // Update year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// ==================== //
// External Links
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// ==================== //
// Intersection Observer for Fade-in Animations
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
    // Respect users who have asked for reduced motion — leave content static.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Apply fade-in to cards
    const animatedElements = document.querySelectorAll(
        '.publication-card, .experience-card, .education-card, .contact-item, .tag'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });
});

// ==================== //
// Mobile Navigation Toggle
// ==================== //
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function() {
        setOpen(!menu.classList.contains('open'));
    });

    // Collapse after picking a destination
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            setOpen(false);
        });
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Reset state when resizing back up to desktop, so the menu can't be
    // left stuck in the collapsed-but-open state.
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) setOpen(false);
    });
});

// ==================== //
// Keyboard Navigation Accessibility
// ==================== //
document.addEventListener('keydown', function(e) {
    // Press '/' to focus on first navigation link
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            firstNavLink.focus();
        }
    }
});
