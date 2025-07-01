export function setupViewTransitions() {
    // Enable view transitions API
    if (!document.startViewTransition) {
        document.startViewTransition = (callback) => {
            callback();
            return {
                ready: Promise.resolve(),
                updateCallbackDone: Promise.resolve(),
                finished: Promise.resolve()
            };
        };
    }

    // Handle navigation with transitions
    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a');
        if (!anchor) return;

        const url = new URL(anchor.href);
        if (url.origin !== location.origin) return;

        event.preventDefault();
        
        document.startViewTransition(() => {
            window.location.href = url.href;
        });
    });
}

export function applyCustomTransition() {
    // Custom transition styles
    const style = document.createElement('style');
    style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
            animation-duration: 0.5s;
        }
        
        ::view-transition-old(root) {
            animation-name: slide-out;
        }
        
        ::view-transition-new(root) {
            animation-name: slide-in;
        }
        
        @keyframes slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-50px); opacity: 0; }
        }
        
        @keyframes slide-in {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}