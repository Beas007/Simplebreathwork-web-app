// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: DOMContentLoaded fired.");

    // --- TOC Elements ---
    const toggleButton = document.getElementById('toc-toggle-button');
    const tocDropdown = document.getElementById('toc-dropdown-menu');
    const tocMenu = tocDropdown?.querySelector('.toc ul'); // Use optional chaining in case tocDropdown isn't found
    const articleBody = document.querySelector('.article-body-main');

     // --- REMOVED the redundant if/else block that used 'articleContentElement' ---

    // --- Early exit if essential TOC elements aren't found ---
    // Note: toggleButton might be null on desktop if removed from HTML, adjust check if needed
    // Or rely on CSS to hide it and keep the JS logic for mobile.
    // Let's assume the button IS present in HTML for mobile compatibility.
    if (!tocDropdown || !tocMenu || !articleBody) { // Removed toggleButton from this check for now
        console.warn("Essential TOC container elements (.toc-dropdown-menu, .toc ul, .article-body-main) not found. TOC functionality disabled.");
        if (toggleButton && !tocDropdown) { // Keep check for hiding button if dropdown missing
             toggleButton.style.display = 'none';
        }
        // Clear loading message if container exists but body doesn't
        if(tocMenu && !articleBody) {
            tocMenu.innerHTML = '<li>Error finding article content.</li>';
        }
        return; // Stop executing the rest of the TOC script
    }
    // If toggle button is essential for mobile, you might add a check here
    // if (!toggleButton) console.warn("TOC toggle button not found, mobile toggle may fail.");


    // --- TOC Toggle Functionality (Keep for Mobile) ---
    const toggleToc = (show) => {
        // Check if button exists before using it
        if (!toggleButton) return;
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);
    };

    // Toggle on button click (Only add listener if button exists)
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from immediately closing via document listener
            toggleToc();
        });
    }


    // Close when clicking a TOC link and scroll smoothly (if links are added)
    tocDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            // Find the target element
            const targetId = e.target.getAttribute('href');
            // Use try-catch for invalid selectors potentially created by IDs
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Smooth scroll
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Close TOC after clicking (only if toggle button exists - i.e. mobile view)
                    if (toggleButton) {
                        toggleToc(false);
                    }
                    // Prevent default anchor jump
                    e.preventDefault();
                }
            } catch (error) {
                console.error("Error finding or scrolling to target:", targetId, error);
            }
        }
    });

    // Close when clicking outside (Only if toggle button exists - i.e. mobile view)
    if (toggleButton) {
        document.addEventListener('click', (e) => {
            if (tocDropdown.classList.contains('is-open') &&
                !tocDropdown.contains(e.target) &&
                e.target !== toggleButton &&
                !toggleButton.contains(e.target)) {
                toggleToc(false);
            }
        });
    }


    // Close with Escape key (Only if toggle button exists - i.e. mobile view)
     if (toggleButton) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
                toggleToc(false);
            }
        });
     }


    // --- TOC Generation ---
    // Use the 'articleBody' variable defined earlier which selects '.article-body-main'
    const headings = articleBody.querySelectorAll('h2[id], h3[id]'); // Only select headings with IDs

    if (headings.length === 0) {
        tocMenu.innerHTML = '<li>No sections found.</li>'; // Update placeholder
        console.warn("No H2 or H3 headings with IDs found in .article-body-main for TOC."); // Updated warning message
    } else {
        tocMenu.innerHTML = ''; // Clear the "Loading..." placeholder

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
    }

    // --- Copy Link Button Functionality ---
    // ... (Keep existing copy link code) ...
    const copyButton = document.getElementById('copy-link-button');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const urlToCopy = window.location.href; // Get the current page URL
            navigator.clipboard.writeText(urlToCopy).then(() => {
                // Success feedback (optional)
                const icon = copyButton.querySelector('i');
                const originalIconClass = icon.className;
                copyButton.setAttribute('aria-label', 'Link copied!'); // Update aria-label
                icon.className = 'fas fa-check'; // Change icon to checkmark

                // Revert after a short delay
                setTimeout(() => {
                    icon.className = originalIconClass; // Restore original icon
                    copyButton.setAttribute('aria-label', 'Copy link to clipboard'); // Restore original aria-label
                }, 2000); // Revert after 2 seconds

            }).catch(err => {
                console.error('Failed to copy link: ', err);
                // You could add fallback logic here if needed (e.g., prompt)
                copyButton.setAttribute('aria-label', 'Failed to copy');
                setTimeout(() => {
                    copyButton.setAttribute('aria-label', 'Copy link to clipboard');
                }, 2000);
            });
        });
    }
    // --- End Copy Link Button Functionality ---


}); // END of DOMContentLoaded listener