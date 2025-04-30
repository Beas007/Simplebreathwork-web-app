document.addEventListener('DOMContentLoaded', async () => {
    console.log("Template Loader: DOMContentLoaded"); // Debug log

    try {
        // 1. Load HTML Components (Header/Footer)
        // Use the *actual* generated paths from the _site folder
        // Assuming Eleventy creates components/header/index.html and components/footer/index.html
        await loadComponent('header-placeholder', '/components/header.html'); // Changed path
        await loadComponent('footer-placeholder', '/components/footer.html'); // Changed path
        console.log("Template Loader: Components loaded"); // Debug log

        // 2. Load Required Scripts SEQUENTIALLY
        // Load article data logic first
        await loadScript('/scripts/articles-data.js');
        console.log("Template Loader: articles-data.js loaded"); // Debug log

        // Then load core app logic (where initializeTheme, initializeNavigation,
        // loadHomepageArticles, loadAllBlogArticles are defined)
        await loadScript('/scripts/app.js');
        console.log("Template Loader: app.js loaded"); // Debug log

         // Load blog post specific script only if on a blog post page
        if (document.body.classList.contains('blog-post-page-body-class')) { // <--- IMPORTANT: You need a class on the <body> of blog post pages
             await loadScript('/scripts/blog-post.js');
             console.log("Template Loader: blog-post.js loaded"); // Debug log
        }


        // 3. Now that scripts are loaded, Initialize Core UI (Theme & Nav - needed on ALL pages with header)
        if (typeof initializeTheme === 'function') {
            initializeTheme();
            console.log("Template Loader: initializeTheme executed"); // Debug log
        } else { console.error("initializeTheme function not found after loading app.js"); }

        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
             console.log("Template Loader: initializeNavigation executed"); // Debug log
        } else { console.error("initializeNavigation function not found after loading app.js"); }


        // 4. Conditionally Run Page-Specific Article Loading Functions
        // Check if we are on the homepage and call its specific loader (function is now defined in app.js)
        if (document.getElementById('homepage-articles-grid')) {
            if (typeof loadHomepageArticles === 'function') {
                // Pass articlesData if needed, or assume app.js accesses window.articlesData
                loadHomepageArticles();
                 console.log("Template Loader: loadHomepageArticles executed"); // Debug log
            } else { console.error("loadHomepageArticles function not found after loading app.js"); }
        }
        // Check if we are on the blog index page and call its specific loader (function is now defined in app.js)
        else if (document.getElementById('blog-posts-container')) {
             if (typeof loadAllBlogArticles === 'function') {
                 // Pass articlesData if needed, or assume app.js accesses window.articlesData
                loadAllBlogArticles();
                console.log("Template Loader: loadAllBlogArticles executed"); // Debug log
            } else { console.error("loadAllBlogArticles function not found after loading app.js"); }
        }
         // Note: Blog post content is loaded via Eleventy, not JS in this setup,
         // but blog-post.js (for TOC etc.) is loaded above if on a blog post page.


        console.log("Template Loader: All initializations attempted."); // Debug log

    } catch (error) {
        console.error('Error during template loading:', error);
        handleError(error); // Pass error for better debugging
    }
});

// --- Helper Functions ---

async function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.log(`Placeholder ${placeholderId} not found on this page.`); // Debug log
        return; // Don't error if placeholder isn't on page (e.g., a page without a header)
    }

    try {
        console.log(`Attempting to fetch component: ${componentPath}`); // Debug log
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
        }
        placeholder.innerHTML = await response.text();
        console.log(`Component ${placeholderId} loaded successfully from ${componentPath}.`); // Debug log
    } catch (error) {
        console.error(`Component loading failed for ${placeholderId} (${componentPath}):`, error);
        placeholder.innerHTML = `<p style="color: red;">Error loading component.</p>`; // Display error on page
        // Do NOT re-throw here unless you want the *entire* DOMContentLoaded chain to stop
        // Instead, handle gracefully.
    }
}

// This function is specifically for loading the articlesData.json file.
// It should *not* call loadHomepageArticles or loadAllBlogArticles itself.
async function loadArticleData() {
    try {
        console.log("Attempting to fetch article data from /data/articles.json"); // Debug log
        const response = await fetch('/data/articles.json'); // Fetch article data
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        window.articlesData = data; // Assign data to global scope
        console.log("Article data loaded successfully:", window.articlesData);
        return data; // Return the data if needed elsewhere
    } catch (error) {
        console.error("Could not load article data:", error);
        // Display error on relevant sections if possible, without crashing.
        const articleContainer = document.getElementById('homepage-articles-grid') || document.getElementById('blog-posts-container');
        if (articleContainer) {
            articleContainer.innerHTML = '<p class="error-message">Sorry, could not load articles at this time.</p>';
        }
        window.articlesData = []; // Set to empty array on error
        throw error; // Re-throw so the main handler can log/handle if necessary
    }
}


function loadScript(src) {
    // Prevent duplicate loading
    if (document.querySelector(`script[src="${src}"]`)) {
        console.log(`Script already loaded: ${src}`); // Debug log
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        // Use `defer` instead of `async` if script order matters (e.g., app.js needs articles-data.js)
        // Or keep async: false for sequential loading after DOMContentLoaded.
        // For scripts loaded *after* DOMContentLoaded, async=false often makes sense if dependencies exist.
        script.async = false; // Load sequentially if called in order

        script.onload = () => {
            console.log(`Script loaded successfully: ${src}`); // Debug log
            resolve();
        };
        script.onerror = (event) => {
            console.error(`Failed to load script: ${src}`, event);
            reject(new Error(`Failed to load script: ${src}`));
        };
        // Append to head for better practice with async/defer, or body if execution order is critical after DOMContentLoaded
        document.head.appendChild(script); // Append to head
    });
}

function handleError(error) {
    console.error('A critical error occurred during page initialization.', error);
    // Display a user-facing message for critical errors if desired
    // const errorDiv = document.createElement('div');
    // errorDiv.textContent = 'Sorry, the page failed to load correctly. Please try refreshing.';
    // errorDiv.style.color = 'red';
    // errorDiv.style.padding = '1rem';
    // document.body.prepend(errorDiv);
}

// Call loadArticleData separately if it's needed before DOMContentLoaded,
// but typically you wait for DOMContentLoaded for most UI interactions.
// Let's move the call to articles-data.js loading *inside* the DOMContentLoaded block.

// Note: The old `loadArticleData` function was duplicated and modified.
// I've provided a cleaner version above that only fetches data.
// The logic to *use* window.articlesData for display should be in app.js,
// and functions like loadHomepageArticles should be called *after* app.js loads.