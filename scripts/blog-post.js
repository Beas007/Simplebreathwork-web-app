/// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: Initializing");
    setupTocToggle(); // Setup the dropdown toggle first
    generateTOC(); // Generate TOC content
    // setupScrollSpy(); // Scroll spy is less practical with a dropdown, disabled for now
    setupInteractions(); // Setup like/share buttons
});

function setupTocToggle() {
    const toggleButton = document.getElementById('toc-toggle-button');
    const tocDropdown = document.getElementById('toc-dropdown-menu');

    if (!toggleButton || !tocDropdown) {
        console.warn("TOC toggle button or dropdown menu not found.");
        return;
    }

    // Function to open/close TOC
    const toggleToc = (show) => {
        // Determine the desired state (open or closed)
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');

        // Apply the class and update ARIA attribute
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);

        console.log(`TOC Toggled: ${isOpen ? 'Open' : 'Closed'}`);
    };

    // Toggle on button click
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing via document listener
        toggleToc(); // Toggle based on current state
    });

    // Close when clicking a TOC link
    tocDropdown.addEventListener('click', (e) => {
        // Check if the clicked element is an anchor link within the TOC
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Smooth scroll to the target section if it exists
            if (targetElement) {
                e.preventDefault(); // Prevent the default anchor jump
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Close the TOC dropdown after clicking a link
            toggleToc(false);
        }
    });

    // Close when clicking anywhere outside the dropdown or the toggle button
    document.addEventListener('click', (e) => {
        if (tocDropdown.classList.contains('is-open') &&
            !tocDropdown.contains(e.target) && // Click was outside the dropdown content
            e.target !== toggleButton && // Click was not the toggle button itself
            !toggleButton.contains(e.target)) { // Click was not inside the toggle button (e.g., icon)
            toggleToc(false); // Close the dropdown
        }
    });

    // Close on Escape key press for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
            toggleToc(false); // Close the dropdown
        }
    });

    console.log("TOC Toggle Initialized");
}


function generateTOC() {
    // Find the UL element inside the dropdown container
    const tocMenu = document.getElementById('toc-dropdown-menu')?.querySelector('ul');
    const articleContent = document.querySelector('.article-content'); // Main content area

    if (!tocMenu || !articleContent) {
        console.warn("TOC menu UL (#toc-dropdown-menu ul) or article content container (.article-content) not found for TOC generation.");
        return;
    }

    // Find all H2 and H3 headings within the article content that have an ID
    const headings = articleContent.querySelectorAll('h2[id], h3[id]');
    console.log(`Found ${headings.length} headings for TOC.`);

    tocMenu.innerHTML = ''; // Clear any existing items (like placeholders)

    if (headings.length === 0) {
        // Provide feedback if no headings with IDs are found
        tocMenu.innerHTML = '<li>No sections found in this article.</li>';
        return;
    }

    // Create list items and links for each heading
    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#${heading.id}`; // Link to the heading's ID
        // Get heading text, remove leading numbers/spaces for cleaner TOC text
        link.textContent = (heading.textContent || '').replace(/^\d+\.?\s*/, '').trim();

        // Add a class for styling subheadings differently if needed
        if (heading.tagName === 'H3') {
            listItem.classList.add('subheading');
        }

        listItem.appendChild(link);
        tocMenu.appendChild(listItem);
    });
    console.log("TOC Generated");
}

// Scroll Spy is disabled for dropdown TOC as it's less practical when hidden.
/*
function setupScrollSpy() {
    // ... (Original scroll spy code can be kept here, commented out) ...
    console.log("ScrollSpy Disabled for Dropdown TOC");
}
*/

function setupInteractions() {
    // --- Interaction logic for like, comment, share buttons ---
    console.log("Setting up interactions...");

    // Like button
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            const icon = likeButton.querySelector('i');
            if (icon) {
                // Toggle between Font Awesome 'regular' (far) and 'solid' (fas) styles
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
            console.log('Like button toggled');
            // Future: Add actual like logic (e.g., API call) here
        });
    } else { console.warn("Like button not found."); }

    // Comment button (Example: scroll to comments)
    const commentButton = document.querySelector('.comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            console.log('Comment button clicked');
            // Example: Scroll to a potential comment section
            // document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    } else { console.warn("Comment button not found."); }

    // Copy link button
    const copyLinkButton = document.querySelector('.share-buttons a[aria-label="Copy link"]');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalIconHTML = copyLinkButton.innerHTML; // Store original icon
                copyLinkButton.innerHTML = '<i class="fas fa-check"></i>'; // Show checkmark
                copyLinkButton.disabled = true; // Briefly disable button
                // Revert after a short delay
                setTimeout(() => {
                    copyLinkButton.innerHTML = originalIconHTML;
                    copyLinkButton.disabled = false;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                // Optional: Provide user feedback on failure
            });
        });
    } else { console.warn("Copy link button not found."); }

    // Setup other share buttons (construct URLs dynamically)
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    setupShareButton('.share-buttons a[aria-label="Share on Twitter"]', `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`);
    setupShareButton('.share-buttons a[aria-label="Share on Facebook"]', `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
    setupShareButton('.share-buttons a[aria-label="Share on LinkedIn"]', `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`);

    console.log("Interactions Initialized");
}

// Helper function to set up share button URLs and attributes
function setupShareButton(selector, url) {
    const button = document.querySelector(selector);
    if (button) {
        button.href = url;
        button.target = '_blank'; // Open in a new tab
        button.rel = 'noopener noreferrer'; // Security best practice
    } else {
        console.warn(`Share button not found: ${selector}`);
    }
}

// Note: Inline style injection for the like button was removed.
// It's better to handle the .liked state styles purely in blog-post.css.