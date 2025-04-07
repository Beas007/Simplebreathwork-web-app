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
});