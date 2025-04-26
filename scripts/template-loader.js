document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load components
        await loadComponent('header-placeholder', '/components/header.html');
        await loadComponent('footer-placeholder', '/components/footer.html');
        
        // Initialize scripts after components are loaded
        await loadScript('/scripts/app.js');
        
        // Initialize theme and navigation after all scripts are loaded
        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
        }
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        }
    } 
    catch (error) {
        console.error('Error during template loading:', error);
        handleError();
    }
});

async function loadComponent(placeholderId, componentPath) { // componentPath is now absolute e.g., /components/header.html
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        // console.warn(`Placeholder not found: ${placeholderId}`); // Optional warning
        return; // Don't stop execution if a placeholder isn't on the page
    }

    try {
        // Fetch uses the absolute path directly
        const response = await fetch(componentPath);
        if (!response.ok) {
            // Log the specific path that failed
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        const html = await response.text();
        placeholder.innerHTML = html; // Replace placeholder content
    } catch (error) {
        // Log error but don't necessarily throw to stop everything
        console.error(`Component loading failed for ${placeholderId}: ${error.message}`);
        // Optionally call handleError or display specific message
    }
}

function loadScript(src) { // src should be an absolute path e.g., /scripts/app.js
    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
        return Promise.resolve(); // Already loaded
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Ensure sequential loading if needed
        script.onload = resolve;
        script.onerror = (err) => {
            console.error(`Failed to load script: ${src}`, err); // Log script loading errors
            reject(err);
        };
        document.body.appendChild(script);
    });
}

// Ensure handleError is defined
function handleError() {
    console.error('Page loading encountered issues. Check console for details.');
    // You could add a user-facing message here if needed
    // Example: document.body.insertAdjacentHTML('afterbegin', '<div class="error-message">Failed to load page components.</div>');
}