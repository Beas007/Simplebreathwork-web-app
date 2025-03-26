// Breathing Techniques Data
const techniques = {
    box: {
        phases: [4, 4, 4, 4], // Inhale, Hold, Exhale, Hold
        description: "Military technique for stress control"
    },
    wimhof: {
        phases: [4, 0, 4, 0],
        description: "Cold exposure breathing method"
    }
};

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('day-mode');
    document.body.classList.toggle('night-mode');
    document.getElementById('theme-toggle').textContent = 
        document.body.classList.contains('night-mode') ? '☀️ Day Mode' : '🌙 Night Mode';
});

// Start Breathing Session
document.querySelectorAll('.start-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const technique = e.target.closest('.card').dataset.technique;
        startBreathingSession(technique);
    });
});

function startBreathingSession(technique) {
    const phases = techniques[technique].phases;
    let currentPhase = 0;
    
    document.getElementById('breathing-overlay').style.display = 'flex';
    
    const interval = setInterval(() => {
        if(currentPhase >= phases.length) {
            clearInterval(interval);
            document.getElementById('breathing-overlay').style.display = 'none';
            return;
        }
        
        updateAnimation(phases[currentPhase]);
        currentPhase++;
    }, phases[currentPhase] * 1000);
}
// Language Support
const translations = {
    en: { start: 'Begin Session' },
    es: { start: 'Comenzar Sesión' }
};

// Bandwidth Detection
if (navigator.connection?.effectiveType === '4g') {
    loadHighResAnimations();
}