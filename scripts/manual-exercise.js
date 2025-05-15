document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const circle = document.querySelector('.circle');
    const mainText = document.querySelector('.main-text');
    const subText = document.querySelector('.sub-text');
    const startButton = document.getElementById('start-session');
    const phaseControls = document.getElementById('phase-controls');
    const stopSessionButton = document.getElementById('stop-session');
    const techniqueName = document.getElementById('technique-name');
    const techniqueDescription = document.getElementById('technique-description');

    // Get technique type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type') || 'labour-patterned';
    
    // Set data attribute on body for CSS targeting
    document.body.dataset.currentTechnique = exerciseType;
    
    // Define the phases for each technique with "next" property for circle navigation
    const techniques = {
        'labour-patterned': {
            name: "Patterned Breathing",
            description: "Follow the contraction wave",
            phases: {
                "start": { main: "Start Contraction", sub: "Tap circle when ready to inhale", animation: "inhale", next: "easy-inhale" },
                "easy-inhale": { main: "Easy Inhale", sub: "Tap circle when ready to exhale", animation: "inhale", next: "easy-exhale" },
                "easy-exhale": { main: "Easy Exhale", sub: "Tap circle when ready to inhale again", animation: "exhale", next: "building-inhale" },
                "building-inhale": { main: "Building Intensity", sub: "Tap circle when ready to exhale", animation: "inhale", next: "building-exhale" },
                "building-exhale": { main: "Building Intensity", sub: "Tap circle when ready for peak", animation: "exhale", next: "peak-quick" },
                "peak-quick": { main: "Peak Intensity", sub: "Tap circle when peak is easing", animation: "quick-breath", next: "easing-inhale" },
                "easing-inhale": { main: "Easing Down", sub: "Tap circle when ready to exhale", animation: "inhale", next: "easing-exhale" },
                "easing-exhale": { main: "Easing Down", sub: "Tap circle when ready to finish", animation: "exhale", next: "end" },
                "end": { main: "End Contraction", sub: "Tap circle to rest", animation: "inhale", next: "rest" },
                "rest": { main: "Between Contractions", sub: "Tap circle when ready for next contraction", animation: "rest", next: "start" }
            }
        },
        'labour-push': {
            name: "Exhale Pushing",
            description: "Work with your body's urge to push",
            phases: {
                "urge": { main: "Feel Urge to Push", sub: "Tap circle when ready to inhale", animation: "rest", next: "inhale" },
                "inhale": { main: "Take a Deep Breath", sub: "Tap circle when ready to push", animation: "inhale", next: "push" },
                "push": { main: "Exhale & Push Down", sub: "Tap circle when push is complete", animation: "push", next: "release" },
                "release": { main: "Release & Relax", sub: "Tap circle when ready to rest", animation: "exhale", next: "rest" },
                "rest": { main: "Between Pushes", sub: "Tap circle when feeling urge again", animation: "rest", next: "urge" }
            }
        }
    };

    // Check if technique exists
    if (!techniques[exerciseType]) {
        console.error(`Exercise type '${exerciseType}' not found`);
        window.location.href = '/';
        return;
    }

    // Set page title and description
    const technique = techniques[exerciseType];
    techniqueName.textContent = technique.name;
    techniqueDescription.textContent = technique.description;
    document.title = `${technique.name} - Manual Guide`;

    // Session variables
    let isSessionActive = false;
    let currentPhase = null;

    // Update the UI based on selected phase
    function updatePhaseUI(phaseId) {
        const phase = technique.phases[phaseId];
        
        // Update text
        mainText.textContent = phase.main;
        subText.textContent = phase.sub;
        
        // Update circle animation
        circle.className = 'circle';
        void circle.offsetWidth; // Force reflow
        circle.classList.add(phase.animation);
        
        if (isSessionActive) {
            circle.classList.add('clickable'); // Visual indicator that circle is interactive
        }
        
        // Update button states
        document.querySelectorAll('.phase-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.phase === phaseId);
        });
        
        currentPhase = phaseId;
    }

    // Handle circle click to progress through breathing phases
    function handleCircleClick() {
        if (!isSessionActive || !currentPhase) return;
        
        const nextPhaseId = technique.phases[currentPhase].next;
        if (nextPhaseId) {
            updatePhaseUI(nextPhaseId);
        }
    }

    // Start session
    function startSession() {
        isSessionActive = true;
        
        // Update UI elements
        startButton.style.display = 'none';
        phaseControls.style.display = 'block';
        
        // Load phase buttons for this technique
        loadPhaseButtons();
        
        // Default to the first phase
        const firstPhase = Object.keys(technique.phases)[0];
        updatePhaseUI(firstPhase);
        
        // Add circle interaction cue
        circle.classList.add('clickable');
    }
    
    // Load the appropriate phase buttons
    function loadPhaseButtons() {
        const phaseButtons = document.querySelector('.phase-buttons');
        
        // Clear existing buttons
        phaseButtons.innerHTML = '';
        
        // Create buttons for this technique (keeping buttons as a fallback)
       if (exerciseType === 'labour-push') {
        // Simplified push buttons - just 3 key phases
        createPhaseButton('urge', 'Begin Push');
        createPhaseButton('push', 'Active Push');
        createPhaseButton('release', 'Recovery');
    } else {
        // Simplified patterned breathing - just 5 key phases
        createPhaseButton('start', 'Start Contraction');
        createPhaseButton('building-inhale', 'Building Phase');
        createPhaseButton('peak-quick', 'Peak Intensity');
        createPhaseButton('easing-inhale', 'Easing Phase');
        createPhaseButton('rest', 'Rest Between');
    }
    
    // Add event listeners to buttons
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isSessionActive) {
                updatePhaseUI(btn.dataset.phase);
            }
        });
    });
    }
    
    // Helper to create phase button
    function createPhaseButton(phaseId, label) {
        const phaseButtons = document.querySelector('.phase-buttons');
        const button = document.createElement('button');
        button.className = 'phase-btn';
        button.dataset.phase = phaseId;
        button.textContent = label; // Use the full label text
        phaseButtons.appendChild(button);
    }

    // Stop session
    function stopSession() {
        isSessionActive = false;
        
        // Reset UI elements
        phaseControls.style.display = 'none';
        startButton.style.display = 'block';
        
        // Reset text and circle
        mainText.textContent = 'Ready to Begin';
        subText.textContent = 'Select a phase below';
        circle.className = 'circle';
        circle.classList.remove('clickable');
        
        currentPhase = null;
    }

    // Event listeners
    startButton.addEventListener('click', startSession);
    stopSessionButton.addEventListener('click', stopSession);
    circle.addEventListener('click', handleCircleClick); // Add circle click handler
    
    // Add hover effect to indicate circle is clickable
    circle.addEventListener('mouseenter', () => {
        if (isSessionActive) {
            circle.classList.add('hover');
        }
    });
    
    circle.addEventListener('mouseleave', () => {
        circle.classList.remove('hover');
    });
    
    const exitButton = document.querySelector('.exit-btn');
if (exitButton) {
    exitButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default navigation
        window.location.href = '/index.html?showLabourTechniques=true';
    });
}

    // Initialize page state
    console.log(`Manual exercise initialized for: ${technique.name}`);
});