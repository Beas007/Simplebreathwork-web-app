document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check if user has previously selected a theme
    const currentTheme = (() => {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (e) {
            console.warn('localStorage not available:', e);
            return 'light';
        }
    })();

    html.setAttribute('data-theme', currentTheme);
    updateThemeToggleButton(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleButton(newTheme);
    });

    function updateThemeToggleButton(theme) {
        themeToggle.textContent = theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }

    // Card Flipping Functionality
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const button = card.querySelector('.start-btn');
        const cardInner = card.querySelector('.card-inner');
   
        card.addEventListener('click', (event) => {
            const isFlipped = cardInner.classList.contains('is-flipped');
            const clickedButton = event.target === button || button.contains(event.target);
   
            if (clickedButton && isFlipped) {
                return;
            }
   
            cardInner.classList.toggle('is-flipped');
        });
    });
   
    // Unflip cards when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.card')) {
            document.querySelectorAll('.card-inner.is-flipped').forEach(cardInner => {
                cardInner.classList.remove('is-flipped');
            });
        }
    });

    // Copyright Year Update
    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    // Read More / Read Less Functionality
    const heroDescription = document.getElementById('hero-description');
    const readMoreToggle = document.getElementById('read-more-toggle');
    const RESIZE_DEBOUNCE = 150;

    // Element existence check
    if (!heroDescription) {
        console.error("Read More Error: Element with ID 'hero-description' not found.");
    }
    if (!readMoreToggle) {
        console.error("Read More Error: Element with ID 'read-more-toggle' not found.");
    }

    const checkClampAndUpdateButton = () => {
        if (!heroDescription || !readMoreToggle) return;

        const isSmallScreen = window.matchMedia('(max-width: 991px)').matches;

        if (isSmallScreen) {
            let needsButton = false;
            const originallyExpanded = heroDescription.classList.contains('expanded');

            if (originallyExpanded) {
                heroDescription.classList.remove('expanded');
            }

            const isClamped = heroDescription.scrollHeight > (heroDescription.clientHeight + 1);

            if (originallyExpanded) {
                heroDescription.classList.add('expanded');
            }

            needsButton = isClamped || originallyExpanded;

            if (needsButton) {
                readMoreToggle.style.display = 'inline-block';
                if (heroDescription.classList.contains('expanded')) {
                    readMoreToggle.textContent = 'Read Less';
                    readMoreToggle.setAttribute('aria-expanded', 'true');
                } else {
                    readMoreToggle.textContent = 'Read More';
                    readMoreToggle.setAttribute('aria-expanded', 'false');
                }
            } else {
                readMoreToggle.style.display = 'none';
            }
        } else {
            heroDescription.classList.remove('expanded');
            readMoreToggle.style.display = 'none';
            readMoreToggle.textContent = 'Read More';
            readMoreToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (readMoreToggle && heroDescription) {
        readMoreToggle.addEventListener('click', () => {
            heroDescription.classList.toggle('expanded');
            checkClampAndUpdateButton();
        });
    }

    // Initial check with slight delay for rendering
    requestAnimationFrame(() => {
        checkClampAndUpdateButton();
    });

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkClampAndUpdateButton, RESIZE_DEBOUNCE);
    });
});