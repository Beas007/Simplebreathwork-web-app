// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: DOMContentLoaded fired.");

    // Find the main article container first
    const articleContainer = document.querySelector('.article-content');

    if (!articleContainer) {
        console.error("Blog Post Script: '.article-content' container not found. Cannot initialize.");
        // Optionally hide the TOC and interactions if the container isn't found
        document.querySelector('.toc-container')?.style.display = 'none';
        document.querySelector('.article-interactions')?.style.display = 'none';
        return; // Stop execution if the container is missing
    }

    console.log("Blog Post Script: '.article-content' container found. Initializing...");

    // Now call initialization functions, passing the container
    setupTocToggle(articleContainer); 
    generateTOC(articleContainer); 
    setupInteractions(articleContainer); 

    console.log("Blog Post Script: Initialization finished.");
});

/**
 * Sets up the toggle functionality for the Table of Contents dropdown menu,
 * searching for elements within the given container.
 * @param {Element} container - The DOM element to search within (e.g., the article).
 */
function setupTocToggle(container) {
    // Search for elements *within* the container
    const toggleButton = container.querySelector('#toc-toggle-button');
    const tocDropdown = container.querySelector('#toc-dropdown-menu');

    if (!toggleButton || !tocDropdown) {
        console.warn("setupTocToggle: TOC toggle button or dropdown menu not found within container.");
        // Optionally hide the TOC controls if elements aren't found
        container.querySelector('.toc-container')?.style.display = 'none';
        return;
    }

    // Function to open/close TOC (same logic as before)
    const toggleToc = (show) => {
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);
        // console.log(`TOC Toggled: ${isOpen ? 'Open' : 'Closed'}`);
    };

    // Toggle on button click
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleToc();
    });

    // Close when clicking a TOC link and scroll smoothly
    tocDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            // Find the target element in the *global* document for scrolling
            const targetId = e.target.getAttribute('href'); // e.g. "#Executive Summary"
            const targetElement = document.querySelector(targetId); 
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            toggleToc(false); 
        }
    });

    // Close when clicking outside the dropdown or toggle button (requires global listeners)
    document.addEventListener('click', (e) => {
        if (tocDropdown.classList.contains('is-open') &&
            !tocDropdown.contains(e.target) &&
            e.target !== toggleButton &&
            !toggleButton.contains(e.target)) {
            toggleToc(false);
        }
    });

    // Close on Escape key press (global listener)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
            toggleToc(false);
        }
    });

    console.log("setupTocToggle: TOC Toggle Initialized within container.");
}

/**
 * Generates the Table of Contents list by finding H2 and H3 headings with IDs
 * within the given container and populating the TOC dropdown.
 * @param {Element} container - The DOM element to search within (e.g., the article).
 */
function generateTOC(container) {
    // Search for the TOC list UL within the container
    const tocMenu = container.querySelector('#toc-list'); // Search by ID
    const articleBody = container.querySelector('.article-body'); // Search for the body containing headings

    if (!tocMenu || !articleBody) {
        console.warn("generateTOC: TOC list UL or article body container not found within container.");
         if(tocMenu) tocMenu.innerHTML = '<li>Error loading TOC structure.</li>';
        return;
    }

    // Find all H2 and H3 headings *within the article body* that have an ID attribute
    const headings = articleBody.querySelectorAll('h2[id], h3[id]');
    console.log(`generateTOC: Found ${headings.length} headings with IDs for TOC.`);

    tocMenu.innerHTML = ''; // Clear placeholder

    if (headings.length === 0) {
        tocMenu.innerHTML = '<li>No sections found in this article.</li>';
        console.warn("generateTOC: No headings with IDs found within .article-body for TOC.");
        // Optionally hide the whole TOC control if no headings
        // container.querySelector('.toc-container')?.style.display = 'none';
        return;
    }

    // Create list items and links for each heading (same logic as before)
    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#${heading.id}`;
        // Get heading text, remove leading numbers/punctuation/spaces for cleaner TOC text
        link.textContent = (heading.textContent || '').replace(/^\d+\.?\s*/, '').trim();

        // Add a class for styling subheadings differently if needed (e.g., indentation)
        if (heading.tagName === 'H3') {
            listItem.classList.add('subheading');
        }

        listItem.appendChild(link);
        tocMenu.appendChild(listItem);
    });
    console.log("generateTOC: TOC Generated Successfully");
}

/**
 * Sets up event listeners for interaction buttons like 'Like', 'Comment', and 'Share',
 * searching for elements within the given container.
 * @param {Element} container - The DOM element to search within (e.g., the article).
 */
function setupInteractions(container) {
    console.log("setupInteractions: Setting up interactions within container...");

    // Find the interaction buttons container within the main container
    const interactionsContainer = container.querySelector('.article-interactions');
    if (!interactionsContainer) {
         console.warn("setupInteractions: Interactions container (.article-interactions) not found within main container.");
         return; // Stop if the main container isn't found
    }

    // Like Button Functionality (search within interactions container)
    const likeButton = interactionsContainer.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            const icon = likeButton.querySelector('i.fa-heart');
            if (icon) {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
            console.log('setupInteractions: Like button toggled. Liked state:', likeButton.classList.contains('liked'));
        });
    } else { console.warn("setupInteractions: Like button not found."); }

    // Comment Button Functionality (Placeholder - search within interactions container)
    const commentButton = interactionsContainer.querySelector('.comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            console.log('setupInteractions: Comment button clicked');
            // Future logic
        });
    } else { console.warn("setupInteractions: Comment button not found."); }

    // Share Button Functionality (Copy Link - search within interactions container)
    const copyLinkButton = interactionsContainer.querySelector('.share-buttons a[aria-label="Copy link"]');
     if (copyLinkButton) {
        copyLinkButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalIconHTML = copyLinkButton.innerHTML;
                copyLinkButton.innerHTML = '<i class="fas fa-check"></i>';
                copyLinkButton.style.pointerEvents = 'none';
                setTimeout(() => {
                    copyLinkButton.innerHTML = originalIconHTML;
                    copyLinkButton.style.pointerEvents = 'auto';
                }, 1500);
            }).catch(err => {
                console.error('setupInteractions: Failed to copy link: ', err);
            });
        });
    } else { console.warn("setupInteractions: Copy link button not found."); }

    // Setup Social Share Links (search within interactions container)
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    // Pass the interactionsContainer to the helper, or re-query
    setupShareButton(interactionsContainer, '[aria-label="Share on Twitter"]', `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`);
    setupShareButton(interactionsContainer, '[aria-label="Share on Facebook"]', `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
    setupShareButton(interactionsContainer, '[aria-label="Share on LinkedIn"]', `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`);

    console.log("setupInteractions: Interactions Initialized within container.");
}

/**
 * Helper function to set the href for social share buttons,
 * searching within a given container.
 * @param {Element} container - The DOM element to search within (e.g., .article-interactions).
 * @param {string} selector - The CSS selector for the share button's anchor tag (relative to container).
 * @param {string} url - The fully constructed share URL.
 */
function setupShareButton(container, selector, url) {
    // Search for the button *within the provided container*
    const button = container.querySelector(selector);
    if (button) {
        button.href = url;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
    } else {
        console.warn(`setupShareButton: Share button not found: ${selector}`);
    }
}