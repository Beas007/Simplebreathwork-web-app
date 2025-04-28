// --- Core UI Initialization Functions ---
// These functions will be called by template-loader.js after app.js is loaded.

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    if (!themeToggle || !themeIcon) {
        console.warn('Theme toggle elements not found. Skipping theme initialization.'); // Use warn
        return;
    }

    // Helper function within initializeTheme
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
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
    console.log("Theme Initialized"); // Confirmation log
}

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (!hamburger || !navMenu) {
        console.warn('Navigation elements (.hamburger or .nav-menu) not found. Skipping navigation initialization.'); // Use warn
        return;
    }

    // Helper function within initializeNavigation
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Toggle menu
    hamburger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior if hamburger is an <a>
        e.stopPropagation(); // Prevent click bubbling up to document listener immediately
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking menu items
    navMenu.querySelectorAll('a, button').forEach(item => {
        // Only add listener if it's a link likely to navigate away or scroll
        if (item.tagName === 'A' && item.getAttribute('href')?.startsWith('#')) {
             item.addEventListener('click', closeMenu);
        } else if (item.tagName === 'A' && !item.getAttribute('href')?.startsWith('#')) {
             // Optional: Close menu immediately for external links, though page load will do it
             // item.addEventListener('click', closeMenu);
        } else if (item.tagName === 'BUTTON') {
             item.addEventListener('click', closeMenu);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if the menu is active AND the click was outside both hamburger and navMenu
        if (navMenu.classList.contains('active') &&
            !hamburger.contains(e.target) &&
            !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    console.log("Navigation Initialized"); // Confirmation log
}

function initializeCardFlipping() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return; // Don't run if no cards on page

    cards.forEach(card => {
        const button = card.querySelector('.start-btn'); // Assuming this button triggers flip
        const cardInner = card.querySelector('.card-inner');

        if (!cardInner) return; // Skip card if structure is wrong

        card.addEventListener('click', (event) => {
            // Allow clicking anywhere on the card EXCEPT the button if already flipped
            const isFlipped = cardInner.classList.contains('is-flipped');
            const clickedButton = button && (event.target === button || button.contains(event.target));

            // If the button is clicked AND the card is already flipped, do nothing
            // (prevents immediate unflip if button is inside the flipped content)
            if (clickedButton && isFlipped) {
                return;
            }

            // Otherwise, toggle the flip state
            cardInner.classList.toggle('is-flipped');
        });
    });

    // Unflip cards when clicking outside *any* card
    document.addEventListener('click', (event) => {
        // If the click target is NOT inside a .card element
        if (!event.target.closest('.card')) {
            document.querySelectorAll('.card-inner.is-flipped')
                .forEach(flippedCardInner => flippedCardInner.classList.remove('is-flipped'));
        }
    });
    console.log("Card Flipping Initialized"); // Confirmation log
}

function initializeReadMore() {
    const heroDescription = document.getElementById('hero-description');
    const readMoreToggle = document.getElementById('read-more-toggle');
    const RESIZE_DEBOUNCE = 150;

    if (!heroDescription || !readMoreToggle) {
        // Don't log error, just return silently if elements aren't on the page
        return;
    }

    function checkClampAndUpdateButton() {
        // Check if text is clamped (requires CSS like -webkit-line-clamp)
        // A common way to check is if scrollHeight > clientHeight
        const isClamped = heroDescription.scrollHeight > heroDescription.clientHeight + 1; // +1 for tolerance
        const isExpanded = heroDescription.classList.contains('expanded');

        if (isClamped || isExpanded) {
            readMoreToggle.style.display = 'inline-block'; // Show button
            readMoreToggle.textContent = isExpanded ? 'Read Less' : 'Read More';
            readMoreToggle.setAttribute('aria-expanded', isExpanded);
        } else {
            readMoreToggle.style.display = 'none'; // Hide button if not needed
        }
    }

    readMoreToggle.addEventListener('click', () => {
        heroDescription.classList.toggle('expanded');
        checkClampAndUpdateButton(); // Update button text/state immediately
    });

    // Initial check
    // Use requestAnimationFrame to ensure layout is calculated
    requestAnimationFrame(checkClampAndUpdateButton);

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkClampAndUpdateButton, RESIZE_DEBOUNCE);
    });
    console.log("Read More Initialized"); // Confirmation log
}

function updateCopyrightYear() {
    const copyrightElement = document.getElementById('copyright-year');
    if (copyrightElement) {
        copyrightElement.textContent = new Date().getFullYear();
        console.log("Copyright Year Updated"); // Confirmation log
    }
}


// --- Article Card Generation ---
// Central function to create HTML for an article card
// Takes an 'options' object to control output (e.g., includeImage)
function createArticleCardHTML(article, options = { includeImage: true }) {
    // Basic validation of required article properties
    if (!article || !article.url || !article.title || !article.excerpt || !article.date || !article.category) {
        console.warn("Skipping article card due to missing data:", article);
        return ''; // Return empty string for invalid data
    }
    // Check image path only if we intend to include it
    if (options.includeImage && !article.image) {
         console.warn("Skipping article image because path is missing, but includeImage was true:", article);
         options.includeImage = false; // Force disable image if path is missing
    }

    const date = new Date(article.date);
    // Add error handling for invalid dates
    const formattedDate = !isNaN(date)
        ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Date N/A';

    // Conditionally include the image container based on options
    const imageHTML = options.includeImage && article.image
        ? `<div class="article-image-container">
               <img src="${article.image}" alt="${article.title}|| 'Article image'}" class="article-image" loading="lazy">
           </div>`
        : '';
         // Empty string if image is not included
// Ensure category exists or provide fallback
const category = article.category || 'General';

    // Construct the card HTML
    return `
        <article class="article-card">
            ${imageHTML}
            <div class="article-content">
                <div class="article-meta">
                   ${category ? `<span class="article-category">${category}</span>` : ''}
                   ${formattedDate !== 'Date N/A' ? `<time datetime="${article.date}" class="article-date">${formattedDate}</time>` : ''}
                </div>
                <h3 class="article-title">${article.title || 'Untitled Article'}</h3>
                <p class="article-excerpt">${article.excerpt || 'No excerpt available.'}</p>
                <a href="${article.url || '#'}" class="article-link">Read More →</a>
            </div>
        </article>
    `;
}

// --- Article Loading Functions ---
// These functions use the globally available 'articlesData' loaded by template-loader.js

// Function to load LATEST articles onto the HOMEPAGE (no images)
function loadHomepageArticles() {
    const container = document.getElementById('homepage-articles-grid'); // Target specific ID
    if (!container) return; // Exit if container not found on the current page

    console.log("Attempting to load homepage articles...");

    // Verify articlesData exists and is an array
    if (typeof articlesData === 'undefined' || !Array.isArray(articlesData)) {
        container.innerHTML = '<p>Error: Articles data is not available.</p>';
        console.error("articlesData is missing or not an array when loading homepage articles.");
        return;
    }

    // --- MODIFIED LOGIC ---
    // 1. Find the specific Wim Hof article by its URL (WITH leading slash)
    const wimHofArticle = articlesData.find(article => article.url === '/blog/wim-hof-breathing.html'); // <-- CORRECTED URL

    // 2. Get other articles, sorted by date, excluding the Wim Hof one (WITH leading slash)
    const sortedOtherArticles = [...articlesData]
        .filter(article => article.url !== '/blog/wim-hof-breathing.html') // <-- CORRECTED URL
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Determine the articles to display (Wim Hof + up to 2 others)
    let homepageArticles = [];
    if (wimHofArticle) {
        homepageArticles.push(wimHofArticle); // Add Wim Hof first if found
        console.log("Found Wim Hof article:", wimHofArticle); // Add log to confirm
    } else {
        console.warn("Wim Hof article not found with URL '/blog/wim-hof-breathing.html'"); // Add warning if not found
    }
    // Add the next latest articles (up to 2) to fill the remaining spots
    homepageArticles = homepageArticles.concat(sortedOtherArticles.slice(0, 3 - homepageArticles.length));

    // --- END MODIFIED LOGIC ---


    if (homepageArticles.length === 0) {
        container.innerHTML = '<p>No articles available yet.</p>';
        return;
    }
    console.log("Wim Hof Article Found:", wimHofArticle); // See if it was found
console.log("Other Articles Sorted:", sortedOtherArticles); // See the other articles
console.log("Final Homepage Articles Array:", homepageArticles); // See the final list being used

    // Generate HTML using the card function, explicitly disabling images
    // CORRECTED: Use 'false', not 'TextTrackCue'
    container.innerHTML = homepageArticles.map(article =>
        createArticleCardHTML(article, { includeImage: false })
    ).join('');

    console.log(`Loaded ${homepageArticles.length} articles onto homepage.`);
}

// Function to load ALL articles onto the BLOG INDEX page (with images)
function loadAllBlogArticles() {
    const container = document.getElementById('blog-posts-container'); // Target specific ID
    if (!container) return; // Exit if container not found on the current page

    console.log("Attempting to load all blog articles...");

    // Verify articlesData exists and is an array
    if (typeof articlesData === 'undefined' || !Array.isArray(articlesData)) {
        container.innerHTML = '<p>Error: Articles data is not available.</p>';
        console.error("articlesData is missing or not an array when loading all blog articles.");
        return;
    }

    // Sort articles by date, newest first
    const sortedArticles = [...articlesData].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedArticles.length === 0) {
        container.innerHTML = '<p>No articles available yet. Check back soon!</p>';
        return;
    }

    // Generate HTML using the card function with default options (images included)
    container.innerHTML = sortedArticles.map(article => createArticleCardHTML(article)).join('');
    console.log(`Loaded ${sortedArticles.length} articles onto blog index page.`);
}

// --- Potentially Deferred or Idle Functions ---
// Example: Load feedback script only when browser is idle
function loadDeferredScripts() {
    // Check if requestIdleCallback is supported
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            // Check if script already exists
            if (!document.querySelector('script[src="/scripts/feedback.js"]')) {
                const script = document.createElement('script');
                script.src = '/scripts/feedback.js'; // Example script
                script.async = true; // Load asynchronously
                document.body.appendChild(script);
                console.log("Deferred script loaded: feedback.js");
            }
        }, { timeout: 2000 }); // Optional timeout
    } else {
        // Fallback for older browsers: load after a delay
        setTimeout(() => {
             if (!document.querySelector('script[src="/scripts/feedback.js"]')) {
                const script = document.createElement('script');
                script.src = '/scripts/feedback.js';
                script.async = true;
                document.body.appendChild(script);
                console.log("Deferred script loaded (fallback): feedback.js");
             }
        }, 3000); // Load after 3 seconds
    }
}

// Note: updateCopyrightYear and loadDeferredScripts might still be called
// from template-loader.js if needed on all pages, or conditionally.
// For now, they are defined here but not called automatically.
// template-loader.js should call them if desired.
// Example call in template-loader.js:
// if (typeof updateCopyrightYear === 'function') updateCopyrightYear();
// if (typeof loadDeferredScripts === 'function') loadDeferredScripts();