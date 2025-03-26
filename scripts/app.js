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
});