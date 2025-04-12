document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check if user has previously selected a theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeToggleButton(currentTheme);

    themeToggle.addEventListener('click', () => {
        // Toggle between light and dark themes
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        
        // Update HTML attribute
        html.setAttribute('data-theme', newTheme);

        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update button text
        updateThemeToggleButton(newTheme);
    });

    function updateThemeToggleButton(theme) {
        themeToggle.textContent = theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
       // --- Add this new code for card flipping ---
       const cards = document.querySelectorAll('.card');

       cards.forEach(card => {
           // Get the button inside this specific card to prevent immediate navigation
           // if the button itself is tapped while the card is not flipped.
           const button = card.querySelector('.start-btn');
   
           card.addEventListener('click', (event) => {
               // Check if the click was directly on the button
               // If the card is already flipped, clicking the button should navigate,
               // otherwise, the click should flip the card.
               const cardInner = card.querySelector('.card-inner');
               const isFlipped = cardInner.classList.contains('is-flipped');
               const clickedButton = event.target === button || button.contains(event.target);
   
               // If the button was clicked *while the card was flipped*, allow default action (navigation)
               if (clickedButton && isFlipped) {
                   // Don't prevent the button's inline onclick navigation
                   return;
               }
   
               // If the card itself (or anything else inside *except* the button when flipped) is clicked,
               // toggle the flip state.
               cardInner.classList.toggle('is-flipped');
   
               // Optional: Prevent click from bubbling further if needed
               // event.stopPropagation();
           });
       });
   
       // Optional: Add logic to unflip cards when clicking outside
       document.addEventListener('click', (event) => {
           // If the click was outside any card, unflip all cards
           if (!event.target.closest('.card')) {
               document.querySelectorAll('.card-inner.is-flipped').forEach(cardInner => {
                   cardInner.classList.remove('is-flipped');
               });
           }
       });
       // --- End of new card flipping code ---
       document.getElementById('copyright-year').textContent = new Date().getFullYear();
       // --- Add this code for Read More / Read Less ---
       console.log("Initializing Read More script..."); // Debug: Script starts

       const heroDescription = document.getElementById('hero-description');
       const readMoreToggle = document.getElementById('read-more-toggle');

       // Check if elements exist right away
       if (!heroDescription) {
           console.error("Read More Error: Element with ID 'hero-description' not found.");
       }
       if (!readMoreToggle) {
           console.error("Read More Error: Element with ID 'read-more-toggle' not found.");
       }

       // Function to check if text is clamped and update button
       const checkClampAndUpdateButton = () => {
           // Only proceed if both elements were found
           if (!heroDescription || !readMoreToggle) return;

           console.log("checkClampAndUpdateButton function running..."); // Debug: Function called

           const isSmallScreen = window.matchMedia('(max-width: 991px)').matches;
           console.log(`Is small screen (<992px)? ${isSmallScreen}`); // Debug: Screen size check

           if (isSmallScreen) {
               // Determine if the element is currently visually clamped
               let needsButton = false;
               const originallyExpanded = heroDescription.classList.contains('expanded');

               // Temporarily remove 'expanded' to measure natural clamp state if needed
               if (originallyExpanded) {
                    heroDescription.classList.remove('expanded');
               }

               // Calculate if clamping is happening (scrollHeight > clientHeight)
               // Add a small tolerance (e.g., 1px)
               const isClamped = heroDescription.scrollHeight > (heroDescription.clientHeight + 1);
               console.log(`Scroll Height: ${heroDescription.scrollHeight}, Client Height: ${heroDescription.clientHeight}, Is Clamped? ${isClamped}`); // Debug: Height check

               // Put 'expanded' back if it was there
                if (originallyExpanded) {
                    heroDescription.classList.add('expanded');
               }

               // Button needed if clamping occurs OR if it's already expanded
               needsButton = isClamped || originallyExpanded;
               console.log(`Button needed? ${needsButton}`); // Debug: Button visibility logic

               if (needsButton) {
                   readMoreToggle.style.display = 'inline-block'; // Show the button
                   // Update button text and ARIA based on expansion state
                   if (heroDescription.classList.contains('expanded')) {
                       readMoreToggle.textContent = 'Read Less';
                       readMoreToggle.setAttribute('aria-expanded', 'true');
                   } else {
                       readMoreToggle.textContent = 'Read More';
                       readMoreToggle.setAttribute('aria-expanded', 'false');
                   }
               } else {
                   // Hide button if no clamping occurs and it's not expanded
                   readMoreToggle.style.display = 'none';
               }
           } else {
               // On larger screens: ensure text isn't clamped, hide button
               console.log("Large screen: Hiding button, ensuring text is not expanded."); // Debug
               heroDescription.classList.remove('expanded'); // Remove expanded state
               readMoreToggle.style.display = 'none'; // Hide button
               // Reset button text/ARIA for consistency
                readMoreToggle.textContent = 'Read More';
                readMoreToggle.setAttribute('aria-expanded', 'false');
           }
       };

       // Add event listener ONLY if elements exist
       if (readMoreToggle && heroDescription) {
           readMoreToggle.addEventListener('click', () => {
               console.log("Read More/Less button clicked!"); // Debug: Click event
               heroDescription.classList.toggle('expanded');
               // Re-check state immediately after toggle to update button based on new state
               checkClampAndUpdateButton(); // Call the check function AFTER toggling
           });
       }

       // Check state on initial load
       // Use setTimeout to slightly delay initial check, allowing browser rendering
       setTimeout(checkClampAndUpdateButton, 50); // Delay slightly

       // Check on window resize (debounced)
       let resizeTimer;
       window.addEventListener('resize', () => {
           clearTimeout(resizeTimer);
           resizeTimer = setTimeout(checkClampAndUpdateButton, 150);
       });

       // --- End of Read More / Read Less code ---
       
});