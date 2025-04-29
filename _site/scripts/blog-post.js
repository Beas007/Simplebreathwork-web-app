// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: DOMContentLoaded fired.");

    // Defer execution slightly to ensure DOM is fully settled, especially for TOC generation
    setTimeout(() => {
        console.log("Blog Post Script: Initializing inside setTimeout");
        setupTocToggle(); // Setup the dropdown toggle first
        generateTOC(); // Generate TOC content AFTER setup and slight delay
        // setupScrollSpy(); // Scroll spy is less practical with a dropdown, disabled for now
        setupInteractions(); // Setup like/share buttons
    }, 0); // 0ms timeout pushes execution to the end of the event queue
});

/**
 * Sets up the toggle functionality for the Table of Contents dropdown menu.
 * Handles button clicks, clicks outside, Escape key, and link clicks within the TOC.
 */
function setupTocToggle() {
    const toggleButton = document.getElementById('toc-toggle-button');
    const tocDropdown = document.getElementById('toc-dropdown-menu');

    if (!toggleButton || !tocDropdown) {
        console.warn("TOC toggle button or dropdown menu not found.");
        return;
    }

    // Function to open/close TOC
    const toggleToc = (show) => {
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);
        // console.log(`TOC Toggled: ${isOpen ? 'Open' : 'Closed'}`); // Optional debug log
    };

    // Toggle on button click
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing via document listener
        toggleToc();
    });

    // Close when clicking a TOC link and scroll smoothly
    tocDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Prevent default jump
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            toggleToc(false); // Close after clicking
        }
    });

    // Close when clicking outside the dropdown or toggle button
    document.addEventListener('click', (e) => {
        if (tocDropdown.classList.contains('is-open') &&
            !tocDropdown.contains(e.target) &&
            e.target !== toggleButton &&
            !toggleButton.contains(e.target)) {
            toggleToc(false);
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
            toggleToc(false);
        }
    });

    console.log("TOC Toggle Initialized");
}

/**
 * Generates the Table of Contents list by finding H2 and H3 headings with IDs
 * within the '.article-content' container and populating the TOC dropdown.
 */
function generateTOC() {
    const tocMenu = document.getElementById('toc-dropdown-menu')?.querySelector('ul');
    const articleContent = document.querySelector('.article-content');

    if (!tocMenu || !articleContent) {
        console.warn("TOC menu UL or article content container not found for TOC generation.");
        // Ensure placeholder is cleared even on failure
        if(tocMenu) tocMenu.innerHTML = '<li>Error loading TOC.</li>';
        return;
    }

    // Find all H2 and H3 headings within the article content that have an ID attribute
    const headings = articleContent.querySelectorAll('h2[id], h3[id]');
    console.log(`Found ${headings.length} headings for TOC.`); // Crucial log for debugging

    tocMenu.innerHTML = ''; // Clear placeholder ('Loading...')

    if (headings.length === 0) {
        // Provide feedback if no headings with IDs are found
        tocMenu.innerHTML = '<li>No sections found in this article.</li>';
        console.warn("No headings with IDs found within .article-content for TOC."); // Add warning
        return;
    }

    // Create list items and links for each heading
    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#${heading.id}`; // Link to the heading's ID
        // Get heading text, remove leading numbers/punctuation/spaces for cleaner TOC text
        link.textContent = (heading.textContent || '').replace(/^\d+\.?\s*/, '').trim();

        // Add a class for styling subheadings differently if needed (e.g., indentation)
        if (heading.tagName === 'H3') {
            listItem.classList.add('subheading');
        }

        listItem.appendChild(link);
        tocMenu.appendChild(listItem);
    });
    console.log("TOC Generated Successfully"); // Confirmation log
}

/**
 * Sets up event listeners for interaction buttons like 'Like', 'Comment', and 'Share'.
 */
function setupInteractions() {
    console.log("Setting up interactions...");

    // Like Button Functionality
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            const icon = likeButton.querySelector('i.fa-heart'); // Target the heart icon specifically
            if (icon) {
                // Toggle between Font Awesome 'regular' (far) and 'solid' (fas) styles
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
            // Optional: Add logic here to send like status to a server
            console.log('Like button toggled. Liked state:', likeButton.classList.contains('liked'));
        });
    } else { console.warn("Like button not found."); }

    // Comment Button Functionality (Placeholder)
    const commentButton = document.querySelector('.comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            console.log('Comment button clicked');
            // Future logic: e.g., scroll to a comments section or open a modal
            // const commentsSection = document.getElementById('comments');
            // if (commentsSection) commentsSection.scrollIntoView({ behavior: 'smooth' });
        });
    } else { console.warn("Comment button not found."); }

    // Share Button Functionality (Copy Link)
    const copyLinkButton = document.querySelector('.share-buttons a[aria-label="Copy link"]');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent following the '#' href
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalIconHTML = copyLinkButton.innerHTML;
                // Temporarily show a checkmark
                copyLinkButton.innerHTML = '<i class="fas fa-check"></i>';
                copyLinkButton.style.pointerEvents = 'none'; // Disable clicking briefly
                setTimeout(() => {
                    copyLinkButton.innerHTML = originalIconHTML; // Restore original icon
                    copyLinkButton.style.pointerEvents = 'auto'; // Re-enable clicking
                }, 1500); // Show checkmark for 1.5 seconds
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                // Optionally provide user feedback about the failure
            });
        });
    } else { console.warn("Copy link button not found."); }

    // Setup Social Share Links
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    setupShareButton('.share-buttons a[aria-label="Share on Twitter"]', `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`);
    setupShareButton('.share-buttons a[aria-label="Share on Facebook"]', `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
    setupShareButton('.share-buttons a[aria-label="Share on LinkedIn"]', `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`);

    console.log("Interactions Initialized");
}

/**
 * Helper function to set the href for social share buttons.
 * @param {string} selector - The CSS selector for the share button's anchor tag.
 * @param {string} url - The fully constructed share URL.
 */
function setupShareButton(selector, url) {
    const button = document.querySelector(selector);
    if (button) {
        button.href = url;
        // Ensure target="_blank" and rel="noopener noreferrer" are set for security and usability
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
    } else {
        console.warn(`Share button not found: ${selector}`);
    }
}