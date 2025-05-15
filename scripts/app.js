// --- Core UI Initialization Functions ---
// These functions are called once the DOM is fully loaded.

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    // Use optional chaining (?) in case themeToggle itself is null
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    if (!themeToggle || !themeIcon) {
        // This is expected on pages without the toggle, so use console.debug or remove log
        // console.debug('Theme toggle elements not found. Skipping theme initialization.');
        return;
    }

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || 'light'; // Default to light theme regardless of system preference

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    console.log("Theme Initialized");
}

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (!hamburger || !navMenu) {
        // console.debug('Navigation elements (.hamburger or .nav-menu) not found. Skipping navigation initialization.');
        return;
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    navMenu.querySelectorAll('a, button').forEach(item => {
        // Close menu on any link click or button click within the menu
        item.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !hamburger.contains(e.target) &&
            !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    console.log("Navigation Initialized");
}

function initializeCardFlipping() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return; // Exit if no cards on the current page

    cards.forEach(card => {
        const button = card.querySelector('.start-btn');
        const cardInner = card.querySelector('.card-inner');

        if (!cardInner) return;

        card.addEventListener('click', (event) => {
            const isFlipped = cardInner.classList.contains('is-flipped');
            const clickedButton = button && (event.target === button || button.contains(event.target));

            // Prevent button click from immediately un-flipping if button is on back
            if (clickedButton && isFlipped) {
                 // If the button click should navigate, let it do so
                 // If it's just for interaction within the card, prevent propagation
                 // event.stopPropagation(); // Uncomment if needed
                return;
            }
             // Allow clicking anywhere else on the card to toggle flip
             if (!clickedButton) {
                cardInner.classList.toggle('is-flipped');
             }

        });
         // Ensure button click still works even if card doesn't flip
         if (button) {
            button.addEventListener('click', (event) => {
                // If the button has an onclick or href, it will proceed
                // We might stop propagation if the card flip listener is doing something unwanted
                 event.stopPropagation(); // Prevent card listener from re-flipping maybe? Test this.
                console.log("Start button clicked");
            });
        }
    });

    // Unflip cards when clicking outside *any* card
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.card')) {
            document.querySelectorAll('.card-inner.is-flipped')
                .forEach(flippedCardInner => flippedCardInner.classList.remove('is-flipped'));
        }
    });
    console.log("Card Flipping Initialized");
}

function initializeReadMore() {
    const heroDescription = document.getElementById('hero-description');
    const readMoreToggle = document.getElementById('read-more-toggle');
    const RESIZE_DEBOUNCE = 150;

    if (!heroDescription || !readMoreToggle) {
        return; // Elements not present on this page
    }

    function checkClampAndUpdateButton() {
        const isClamped = heroDescription.scrollHeight > heroDescription.clientHeight + 1;
        const isExpanded = heroDescription.classList.contains('expanded');

        if (isClamped || isExpanded) {
            readMoreToggle.style.display = 'inline-block';
            readMoreToggle.textContent = isExpanded ? 'Read Less' : 'Read More';
            readMoreToggle.setAttribute('aria-expanded', isExpanded);
        } else {
            readMoreToggle.style.display = 'none';
        }
    }

    readMoreToggle.addEventListener('click', () => {
        heroDescription.classList.toggle('expanded');
        checkClampAndUpdateButton();
    });

    requestAnimationFrame(checkClampAndUpdateButton);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkClampAndUpdateButton, RESIZE_DEBOUNCE);
    });
    console.log("Read More Initialized");
}

function updateCopyrightYear() {
    const copyrightElement = document.getElementById('copyright-year');
    if (copyrightElement) {
        copyrightElement.textContent = new Date().getFullYear();
        console.log("Copyright Year Updated");
    }
}

// --- Labour Breathwork Interaction Logic ---
function initializeLabourBreathwork() {
    // Elements
    const labourOptionsBtn = document.querySelector('.labour-options-btn');
    const labourPopup = document.getElementById('labour-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    const startOptionBtns = document.querySelectorAll('.start-option-btn');
    const infoOptionBtns = document.querySelectorAll('.info-option-btn');
    const labourPatternedModal = document.getElementById('labour-patterned-modal');
    const labourPushModal = document.getElementById('labour-push-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // If required elements don't exist, skip initialization
    if (!labourOptionsBtn || !labourPopup) {
        console.debug('Labour breathwork elements not found. Skipping initialization.');
        return;
    }
    
// ADD THIS CODE HERE - Check URL parameters when page loads
    const urlParams = new URLSearchParams(window.location.search);
    
    // If returning from a labour breathing exercise
    if (urlParams.get('showLabourTechniques') === 'true') {
        // Show the labour techniques popup
        if (labourPopup) {
            labourPopup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Clean up the URL (optional)
            history.replaceState({}, document.title, window.location.pathname);
        }
    }
    

    // Open technique selection popup when button is clicked
    labourOptionsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        labourPopup.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close popup when X is clicked
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            labourPopup.style.display = 'none';
            document.body.style.overflow = ''; // Enable scrolling
        });
    }
    
    // Close popup when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === labourPopup) {
            labourPopup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Navigate to exercise page for Slow Deep Breathing
    startOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const technique = this.closest('.technique-option').getAttribute('data-technique');
            window.location.href = `/exercise/?type=${technique}`;
        });
    });
    
    // Open info modals for the static techniques
    infoOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const technique = this.closest('.technique-option').getAttribute('data-technique');
            
            // Close the technique selection popup
            labourPopup.style.display = 'none';
            
            // Open the appropriate modal
            if (technique === 'labour-patterned' && labourPatternedModal) {
                labourPatternedModal.style.display = 'block';
            } else if (technique === 'labour-push' && labourPushModal) {
                labourPushModal.style.display = 'block';
            }
        });
    });
    
    // Close modals when X is clicked
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.info-modal').style.display = 'none';
            document.body.style.overflow = '';
        });
    });
    
    // Close modals when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('info-modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Add escape key functionality to close popups and modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (labourPopup) labourPopup.style.display = 'none';
            if (labourPatternedModal) labourPatternedModal.style.display = 'none';
            if (labourPushModal) labourPushModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    console.log("Labour Breathwork Initialized");
}

// --- Potentially Deferred or Idle Functions ---
function loadDeferredScripts() {
    // Example: Load feedback script only when browser is idle
    const feedbackScriptSrc = '/scripts/feedback.js'; // Define script source

    // Check if script already exists (e.g., added by Eleventy's additional_scripts)
    if (document.querySelector(`script[src="${feedbackScriptSrc}"]`)) {
        console.log("Deferred script (feedback.js) already loaded.");
        return;
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            const script = document.createElement('script');
            script.src = feedbackScriptSrc;
            script.async = true;
            document.body.appendChild(script);
            console.log("Deferred script loaded via requestIdleCallback: feedback.js");
        }, { timeout: 2000 });
    } else {
        setTimeout(() => {
             // Double check it wasn't added by Eleventy in the meantime
             if (!document.querySelector(`script[src="${feedbackScriptSrc}"]`)) {
                const script = document.createElement('script');
                script.src = feedbackScriptSrc;
                script.async = true;
                document.body.appendChild(script);
                console.log("Deferred script loaded via setTimeout fallback: feedback.js");
             }
        }, 3000);
    }
}

// --- Global Initialization ---
// Wait for the DOM to be fully loaded before running any initialization code
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing scripts...");

    // Initialize components present on potentially all pages
    initializeTheme();
    initializeNavigation();
    updateCopyrightYear();

    // Initialize components specific to certain pages
    // These functions will check internally if their elements exist
    initializeCardFlipping();
    initializeReadMore();
    initializeLabourBreathwork(); // Added the labour breathwork initialization

    // Load less critical scripts after a delay or when idle
    // loadDeferredScripts(); // Uncomment if you want to use this

    console.log("Global scripts initialized.");
});