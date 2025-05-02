// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: DOMContentLoaded fired.");

    // --- TOC Elements ---
    const toggleButton = document.getElementById('toc-toggle-button');
    const tocDropdown = document.getElementById('toc-dropdown-menu');
    const tocMenu = tocDropdown?.querySelector('.toc ul'); // Use optional chaining in case tocDropdown isn't found
    const articleBody = document.querySelector('.article-body');

    // --- Early exit if essential TOC elements aren't found ---
    if (!toggleButton || !tocDropdown || !tocMenu || !articleBody) {
        console.warn("TOC elements not found. TOC functionality disabled.");
        // Optionally hide the toggle button if the container is missing
        if (toggleButton && !tocDropdown) {
            toggleButton.style.display = 'none';
        }
        return; // Stop executing the rest of the TOC script
    }

    // --- TOC Toggle Functionality ---
    const toggleToc = (show) => {
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);
    };

    // Toggle on button click
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing via document listener
        toggleToc();
    });

    // Close when clicking a TOC link and scroll smoothly (if links are added)
    tocDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            // Find the target element
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Smooth scroll
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close TOC after clicking
                toggleToc(false);
                // Prevent default anchor jump
                e.preventDefault();
            }
        }
    });

    // Close when clicking outside the TOC dropdown or button
    document.addEventListener('click', (e) => {
        if (tocDropdown.classList.contains('is-open') &&
            !tocDropdown.contains(e.target) &&
            e.target !== toggleButton &&
            !toggleButton.contains(e.target)) {
            toggleToc(false);
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
            toggleToc(false);
        }
    });

    // --- TOC Generation ---
    const headings = articleBody.querySelectorAll('h2[id], h3[id]'); // Only select headings with IDs

    if (headings.length === 0) {
        tocMenu.innerHTML = '<li>No sections found.</li>'; // Update placeholder
        console.warn("No H2 or H3 headings with IDs found in .article-body for TOC.");
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