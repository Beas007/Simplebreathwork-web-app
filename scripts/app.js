document.addEventListener('DOMContentLoaded', () => {
    // Wait for template loader to complete
    const templateLoader = new Promise((resolve) => {
        const checkComponents = setInterval(() => {
            const header = document.querySelector('.navbar');
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (header && hamburger && navMenu) {
                clearInterval(checkComponents);
                resolve();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkComponents);
            console.error('Timeout waiting for components');
            resolve();
        }, 5000);
    });

    // Initialize after components are loaded
    templateLoader.then(() => {
        initializeNavigation();
        initializeTheme();
        initializeCardFlipping();
        initializeReadMore();
        updateCopyrightYear();
    });


    function initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');

        if (!themeToggle || !themeIcon) {
            console.error('Theme toggle elements not found');
            return;
        }

        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);

        // Handle theme toggle
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }
    function initializeNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (!hamburger || !navMenu) {
            console.error('Navigation elements not found');
            return;
        }

        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
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
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    }

    // Card Flipping functionality
    function initializeCardFlipping() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const button = card.querySelector('.start-btn');
            const cardInner = card.querySelector('.card-inner');
       
            card.addEventListener('click', (event) => {
                const isFlipped = cardInner.classList.contains('is-flipped');
                const clickedButton = event.target === button || button?.contains(event.target);
       
                if (clickedButton && isFlipped) return;
                cardInner.classList.toggle('is-flipped');
            });
        });
       
        // Unflip cards when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.card')) {
                document.querySelectorAll('.card-inner.is-flipped')
                    .forEach(card => card.classList.remove('is-flipped'));
            }
        });
    }

    // Read More functionality
    function initializeReadMore() {
        const heroDescription = document.getElementById('hero-description');
        const readMoreToggle = document.getElementById('read-more-toggle');
        const RESIZE_DEBOUNCE = 150;

        if (!heroDescription || !readMoreToggle) {
            console.error('Read More elements not found');
            return;
        }

        function checkClampAndUpdateButton() {
            const isSmallScreen = window.matchMedia('(max-width: 991px)').matches;

            if (isSmallScreen) {
                const originallyExpanded = heroDescription.classList.contains('expanded');
                if (originallyExpanded) heroDescription.classList.remove('expanded');

                const isClamped = heroDescription.scrollHeight > (heroDescription.clientHeight + 1);
                if (originallyExpanded) heroDescription.classList.add('expanded');

                const needsButton = isClamped || originallyExpanded;

                readMoreToggle.style.display = needsButton ? 'inline-block' : 'none';
                if (needsButton) {
                    readMoreToggle.textContent = heroDescription.classList.contains('expanded') ? 'Read Less' : 'Read More';
                    readMoreToggle.setAttribute('aria-expanded', heroDescription.classList.contains('expanded'));
                }
            } else {
                heroDescription.classList.remove('expanded');
                readMoreToggle.style.display = 'none';
                readMoreToggle.textContent = 'Read More';
                readMoreToggle.setAttribute('aria-expanded', 'false');
            }
        }

        readMoreToggle.addEventListener('click', () => {
            heroDescription.classList.toggle('expanded');
            checkClampAndUpdateButton();
        });

        // Initial check
        requestAnimationFrame(checkClampAndUpdateButton);

        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkClampAndUpdateButton, RESIZE_DEBOUNCE);
        });
    }

    // Update copyright year
    function updateCopyrightYear() {
        const copyrightElement = document.getElementById('copyright-year');
        if (copyrightElement) {
            copyrightElement.textContent = new Date().getFullYear();
        }
    }

    // Load deferred scripts
    function loadDeferredScripts() {
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                const script = document.createElement('script');
                script.src = '/scripts/feedback.js';
                document.body.appendChild(script);
            });
        }
    }
});