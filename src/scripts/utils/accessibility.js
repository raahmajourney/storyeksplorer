export function setupAccessibility() {
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            setTimeout(() => mainContent.removeAttribute('tabindex'), 1000);
        });
    }

    // Keyboard navigation for hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNavigation();
            }
        });
    }

    // Toggle navigation for mobile
    function toggleNavigation() {
        const navigation = document.querySelector('.navigation');
        navigation.classList.toggle('active');
    }

    // Add aria-labels to icons
    document.querySelectorAll('.fas, .far').forEach(icon => {
        if (!icon.getAttribute('aria-hidden') && !icon.closest('button, a')) {
            icon.setAttribute('aria-hidden', 'true');
        }
    });

    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        if (!img.getAttribute('role') || img.getAttribute('role') !== 'presentation') {
            img.setAttribute('alt', '');
        }
    });
}

export function setupFormAccessibility() {
    // Ensure all form controls have labels
    document.querySelectorAll('input, textarea, select').forEach(control => {
        if (!control.id) return;
        
        if (!document.querySelector(`label[for="${control.id}"]`)) {
            const label = document.createElement('label');
            label.setAttribute('for', control.id);
            label.textContent = control.placeholder || control.name || 'Input field';
            control.before(label);
        }
    });
}