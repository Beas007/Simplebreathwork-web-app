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
    });
