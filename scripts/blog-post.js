// This script should ONLY be loaded on individual blog post pages.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Post Script: DOMContentLoaded fired.");


    const toggleToc = (show) => {
        const isOpen = show !== undefined ? show : !tocDropdown.classList.contains('is-open');
        tocDropdown.classList.toggle('is-open', isOpen);
        toggleButton.setAttribute('aria-expanded', isOpen);

    };

    // Toggle on button click
    toggleButton.addEventListener('click', (e) => {

        toggleToc();
        });
    });

    // Close when clicking a TOC link and scroll smoothly
    tocDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            toggleToc(false);
        }
    });

    document.addEventListener('click', (e) => {
        if (tocDropdown.classList.contains('is-open') &&
            !tocDropdown.contains(e.target) &&
            e.target !== toggleButton &&
            !toggleButton.contains(e.target)) {
            toggleToc(false);
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tocDropdown.classList.contains('is-open')) {
            toggleToc(false);
        }
    }
);

/**
 * Generates the Table of Contents list by finding H2 and H3 headings with IDs
 */

/**
 * Generates the Table of Contents list by finding H2 and H3 headings with IDs

    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');


        // Get heading text, remove leading numbers/punctuation/spaces for cleaner TOC text
        link.textContent = (heading.textContent || '').replace(/^\d+\.?\s*/, '').trim();

        // Add a class for styling subheadings differently if needed (e.g., indentation)
        if (heading.tagName === 'H3') {
            listItem.classList.add('subheading');
        }

        listItem.appendChild(link);
        tocMenu.appendChild(listItem);
    
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
        // Add smooth scrolling to the link});
