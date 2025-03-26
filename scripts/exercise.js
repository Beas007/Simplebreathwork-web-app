document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type');
    const circle = document.querySelector('.circle');
    const timer = document.querySelector('.timer');
    const breathingIndicator = document.querySelector('.breathing-indicator');
    const breathingText = document.querySelector('.breathing-text');

    const exercises = {
        'box': {
            sequence: ['Inhale', 'Hold', 'Exhale', 'Hold'],
            durations: [4, 4, 4, 4],
            background: {
                light: '#E8F4F8',
                dark: '#1a2327'
            },
            rounds: 5
        },
        '48': {
            sequence: ['Inhale', 'Exhale'],
            durations: [4, 8],
            background: {
                light: '#FFF5F5',
                dark: '#272121'
            },
            rounds: 6
        },
        'wim-hof': {
            sequence: ['Deep Inhale', 'Quick Exhale', 'Hold'],
            durations: [2, 1, 15],
            background: {
                light: '#E6F3FF',
                dark: '#1a2432'
            },
            rounds: 3
        }
    };

    const exercise = exercises[exerciseType];

    function updateBackground() {
        const theme = document.documentElement.getAttribute('data-theme');
        document.body.style.background = exercise.background[theme];
    }

    function updateBreathingIndicator(phase) {
        breathingIndicator.className = 'breathing-indicator';
        if (phase.includes('Inhale')) {
            breathingIndicator.classList.add('inhale');
        } else if (phase.includes('Exhale')) {
            breathingIndicator.classList.add('exhale');
        }
    }

    function updateTimer(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateBreathAnimation(phase) {
        const animations = {
            'Inhale': 'expand 4s ease-in-out forwards',
            'Deep Inhale': 'expand 2s ease-in-out forwards',
            'Exhale': 'contract 8s ease-in-out forwards',
            'Quick Exhale': 'contract 1s ease-in-out forwards',
            'Hold': 'hold 2s ease-in-out infinite'
        };
        circle.style.animation = animations[phase] || 'none';
        breathingText.textContent = phase;
    }

    function startExercise() {
        let currentRound = 1;
        let currentPhase = 0;
        let timeLeft = exercise.durations[0];

        updateTimer(timeLeft);
        updateBreathAnimation(exercise.sequence[0]);
        updateBreathingIndicator(exercise.sequence[0]);

        const intervalId = setInterval(() => {
            timeLeft--;
            updateTimer(timeLeft);

            if (timeLeft === 0) {
                currentPhase = (currentPhase + 1) % exercise.sequence.length;
                
                if (currentPhase === 0) {
                    currentRound++;
                    if (currentRound > exercise.rounds) {
                        clearInterval(intervalId);
                        completeExercise();
                        return;
                    }
                }

                timeLeft = exercise.durations[currentPhase];
                updateBreathAnimation(exercise.sequence[currentPhase]);
                updateBreathingIndicator(exercise.sequence[currentPhase]);
            }
        }, 1000);
    }

    function completeExercise() {
        circle.style.animation = 'none';
        breathingText.textContent = 'Exercise Complete';
        breathingIndicator.style.opacity = '0';
        
        setTimeout(() => {
            if (confirm('Would you like to do another round?')) {
                window.location.reload();
            } else {
                window.location.href = './index.html';
            }
        }, 3000);
    }

    updateBackground();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateBackground();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    let countdown = 3;
    breathingText.textContent = `Starting in ${countdown}...`;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            breathingText.textContent = `Starting in ${countdown}...`;
        } else {
            clearInterval(countdownInterval);
            startExercise();
        }
    }, 1000);
});