document.addEventListener('DOMContentLoaded', () => {
    generateTOC();
    setupScrollSpy();
    setupInteractions(); // Placeholder for like/comment/share logic
});

function generateTOC() {
    const tocMenu = document.getElementById('toc-menu')?.querySelector('ul');
    const articleContent = document.querySelector('.article-content');
    if (!tocMenu || !articleContent) return;

    const headings = articleContent.querySelectorAll('h2[id], h3[id]'); // Select h2 and h3 with IDs

    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.replace(/^\d+\.?\s*/, ''); // Remove leading numbers like "1. " or "3.1 "

        if (heading.tagName === 'H3') {
            listItem.classList.add('subheading'); // Add class for styling subheadings
        }

        listItem.appendChild(link);
        tocMenu.appendChild(listItem);
    });
}

function setupScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc a');
    const headings = Array.from(document.querySelectorAll('.article-content h2[id], .article-content h3[id]'));

    if (!tocLinks.length || !headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.toc a[href="#${id}"]`);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) { // Adjust threshold as needed
                 tocLinks.forEach(link => link.classList.remove('active'));
                 if(correspondingLink) {
                    correspondingLink.classList.add('active');
                 }
            }
            // Optional: remove active class when scrolling out, but can be jumpy
            // else {
            //     if(correspondingLink) {
            //        correspondingLink.classList.remove('active');
            //     }
            // }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px', // Trigger when heading is near vertical center
        threshold: 0 // Trigger as soon as it enters/leaves the margin
    });

     // Fallback for initial load or when no intersection is detected initially
    let currentActiveFound = false;
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            // Check if the top of the heading is above the middle of the viewport
            if (rect.top < window.innerHeight / 2) {
                currentSectionId = heading.id;
            }
        });

        if (currentSectionId) {
             tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                    currentActiveFound = true;
                }
            });
        } else if (!currentActiveFound && tocLinks.length > 0) {
             // If scrolled to top and no section is active, activate the first one
             tocLinks.forEach(link => link.classList.remove('active'));
             tocLinks[0].classList.add('active');
        }
    }, { passive: true });


    headings.forEach(heading => observer.observe(heading));

     // Initial check on load
     setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
}


function setupInteractions() {
    // Placeholder for like button functionality
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            // Add logic to toggle like state, update count (requires backend/storage)
            likeButton.classList.toggle('liked');
            const icon = likeButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('far'); // Toggle empty heart
                icon.classList.toggle('fas'); // Toggle solid heart
            }
            console.log('Like button clicked');
        });
    }

    // Placeholder for comment button functionality
    const commentButton = document.querySelector('.comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            // Add logic to scroll to comment section or open a modal
            console.log('Comment button clicked');
            // Example: document.getElementById('comment-section').scrollIntoView();
        });
    }

     // Add copy link functionality
    const copyLinkButton = document.querySelector('.share-buttons a[aria-label="Copy link"]');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Optional: Show a temporary confirmation message
                const originalIcon = copyLinkButton.innerHTML;
                copyLinkButton.innerHTML = '<i class="fas fa-check"></i>'; // Show checkmark
                setTimeout(() => {
                    copyLinkButton.innerHTML = originalIcon; // Revert icon
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        });
    }

    // Add logic for actual Facebook, Twitter, LinkedIn sharing
    // You'll need to construct the correct share URLs
    // Example for Twitter:
    // const twitterButton = document.querySelector('.share-buttons a[aria-label="Share on Twitter"]');
    // if (twitterButton) {
    //     const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`;
    //     twitterButton.href = shareUrl;
    // }
}

// Add basic style for liked state (can be enhanced)
const style = document.createElement('style');
style.textContent = `
.like-button.liked {
    color: red; /* Or your theme's accent color */
    border-color: red;
}
`;
document.head.appendChild(style);