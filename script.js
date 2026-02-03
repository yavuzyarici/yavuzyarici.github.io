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

// Update on scroll with throttling for performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        updateActiveNavLink();
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
// Navbar Shadow on Scroll
// ==================== //
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
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
