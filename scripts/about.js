document.addEventListener('DOMContentLoaded', () => {
    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Audio elements
    const playButton = document.getElementById('playButton');
    let speechSynthesis = window.speechSynthesis;
    let speaking = false;
    let currentUtterance = null;

    // Initialize theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });

    // Audio playback handler
    playButton.addEventListener('click', () => {
        if (speaking) {
            stopSpeaking();
        } else {
            startSpeaking();
        }
    });

    // Theme button update
    function updateThemeButton(theme) {
        themeToggle.textContent = theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode';
        themeToggle.setAttribute('aria-label', 
            `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
        );
    }

    // Audio functions
    function startSpeaking() {
        const content = document.querySelector('.about-content').textContent;
        currentUtterance = new SpeechSynthesisUtterance(content);
        
        // Configure speech settings
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;

        // Event handlers for speech
        currentUtterance.onstart = () => {
            speaking = true;
            playButton.textContent = '🔇 Stop Audio';
            playButton.setAttribute('aria-label', 'Stop audio playback');
        };

        currentUtterance.onend = () => {
            speaking = false;
            playButton.textContent = '🔊 Listen to This Page';
            playButton.setAttribute('aria-label', 'Listen to page content');
            currentUtterance = null;
        };

        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            speaking = false;
            playButton.textContent = '🔊 Listen to This Page';
            currentUtterance = null;
        };

        speechSynthesis.speak(currentUtterance);
    }

    function stopSpeaking() {
        if (speaking) {
            speechSynthesis.cancel();
            speaking = false;
            playButton.textContent = '🔊 Listen to This Page';
            playButton.setAttribute('aria-label', 'Listen to page content');
            currentUtterance = null;
        }
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (speaking) {
            speechSynthesis.cancel();
        }
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && speaking) {
            stopSpeaking();
        }
    });
});