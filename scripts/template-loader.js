document.addEventListener('DOMContentLoaded', async () => {
    console.log("Template Loader: DOMContentLoaded"); // Debug log
    try {
        // 1. Load HTML Components (Header/Footer)
        await loadComponent('header-placeholder', '/components/header.html');
        await loadComponent('footer-placeholder', '/components/footer.html');
        console.log("Template Loader: Components loaded"); // Debug log

        // 2. Load Article Data (Globally needed)
        await loadScript('/scripts/articles-data.js');
        console.log("Template Loader: Article data loaded"); // Debug log

        // 3. Load Core App Logic (Theme, Nav, Article Loading Functions)
        await loadScript('/scripts/app.js');
        console.log("Template Loader: App.js loaded"); // Debug log

        // 4. Initialize Core UI (Theme & Nav - needed on ALL pages with header)
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        } else { console.error("initializeTheme function not found after loading app.js"); }

        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
        } else { console.error("initializeNavigation function not found after loading app.js"); }

        // 5. Load Page-Specific Article Content (Conditionally)
        // Check if we are on the homepage and call its specific loader
        if (document.getElementById('homepage-articles-grid')) {
            if (typeof loadHomepageArticles === 'function') {
                loadHomepageArticles();
            } else { console.error("loadHomepageArticles function not found after loading app.js"); }
        }
        // Check if we are on the blog index page and call its specific loader
        else if (document.getElementById('blog-posts-container')) {
             if (typeof loadAllBlogArticles === 'function') {
                loadAllBlogArticles();
            } else { console.error("loadAllBlogArticles function not found after loading app.js"); }
        }

        console.log("Template Loader: Finished"); // Debug log

    } catch (error) {
        console.error('Error during template loading:', error);
        handleError(error); // Pass error for better debugging
    }
});

// --- Helper Functions (Ensure these are robust) ---

async function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return; // Don't error if placeholder isn't on page

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
        }
        placeholder.innerHTML = await response.text();
    } catch (error) {
        console.error(`Component loading failed for ${placeholderId} (${componentPath}):`, error);
        // Optionally display error in placeholder: placeholder.innerHTML = 'Error loading content.';
        throw error; // Re-throw to be caught by the main try/catch
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
        script.async = false; // Load sequentially
        script.onload = () => {
            console.log(`Script loaded successfully: ${src}`); // Debug log
            resolve();
        };
        script.onerror = (event) => {
            console.error(`Failed to load script: ${src}`, event);
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.body.appendChild(script);
    });
}

function handleError(error) {
    console.error('Page loading encountered issues. Check console for details.', error);
    // Optionally display a user-facing message
    // const errorDiv = document.createElement('div');
    // errorDiv.textContent = 'Sorry, there was an error loading parts of the page. Please try refreshing.';
    // errorDiv.style.color = 'red';
    // errorDiv.style.padding = '1rem';
    // document.body.prepend(errorDiv);
}