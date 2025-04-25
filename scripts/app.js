document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize Navigation
    function initializeNavigation() {
        if (!hamburger || !navMenu) {
            console.error('Navigation elements not found');
            return;
        }

        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking menu items
        navMenu.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && 
                !navMenu.contains(e.target) && 
                !themeToggle.contains(e.target) && 
                navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Initialize Navigation
    initializeNavigation();

    // Theme functionality
    function initializeTheme() {
        const html = document.documentElement;
        
        // Get saved theme
        const savedTheme = (() => {
            try {
                return localStorage.getItem('theme') || 'light';
            } catch (e) {
                console.warn('localStorage not available:', e);
                return 'light';
            }
        })();

        // Set initial theme
        html.setAttribute('data-theme', savedTheme);
        updateThemeToggleButton(savedTheme);

        // Theme toggle handler
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleButton(newTheme);
        });
    }

    function updateThemeToggleButton(theme) {
        themeToggle.textContent = theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }

    // Initialize Theme
    initializeTheme();

    // ...existing card flipping code...
    // ...existing copyright year code...
    // ...existing read more functionality...
    // ...existing script loading code...

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
     // Defer non-critical scripts
     if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            loadScript('/scripts/feedback.js');
        });
    }
});