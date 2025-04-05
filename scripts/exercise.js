document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // DOM elements
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type');
    const circle = document.querySelector('.circle');
    const timer = document.querySelector('.timer');
    const breathingIndicator = document.querySelector('.breathing-indicator');
    const breathingText = document.querySelector('.breathing-text');
    const setCounter = document.querySelector('.set-counter');

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
            sequence: ['Deep Inhale', 'Exhale'],
            durations: [4, 4],
            background: {
                light: '#E6F3FF',
                dark: '#1a2432'
            },
            rounds: 30,
            afterRounds: [
                { phase: 'Final Exhale', duration: 2 },
                { phase: 'Hold Empty', duration: 15 },
                { phase: 'Recovery Breath', duration: 4 },
                { phase: 'Recovery Hold', duration: 15 }
            ],
            sets: 3
        }
    };

    const exercise = exercises[exerciseType];

    function updateBackground() {
        const theme = document.documentElement.getAttribute('data-theme');
        document.body.style.background = exercise.background[theme];
    }

    function updateBreathingIndicator(phase) {
        breathingIndicator.className = 'breathing-indicator';
        if (phase.includes('Inhale') || phase.includes('Recovery Breath')) {
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

    function updateBreathAnimation(phase, currentRound = null, currentSet = null) {
        const animations = {
              // Regular breathing patterns
              'Inhale': 'expand 4s ease-in-out forwards',
              'Exhale': phase === 'Exhale' && exerciseType === '48' ? 
                       'contract 8s ease-in-out forwards' : 
                       'contract 4s ease-in-out forwards',
              'Hold': 'hold 2s ease-in-out infinite',
              
              // Wim Hof specific patterns
              'Deep Inhale': 'expand 4s ease-in-out forwards',
              'Final Exhale': 'contract 2s ease-in-out forwards',
              'Hold Empty': 'hold 2s ease-in-out infinite',
              'Recovery Breath': 'expand 4s ease-in-out forwards',
              'Recovery Hold': 'hold 2s ease-in-out infinite'
          };
  
          // Reset animation
          circle.style.animation = 'none';
          circle.offsetHeight; // Force reflow
          circle.style.animation = animations[phase] || 'none';
  
          // Update text display
          if (exerciseType === 'wim-hof' && currentRound !== null) {
              breathingText.textContent = `${phase} ${currentRound}/30`;
              if (currentSet !== null) {
                  setCounter.textContent = `Set ${currentSet}/3`;
              }
          } else {
              breathingText.textContent = phase;
          }
      }

    function startExercise() {
        if (exerciseType === 'wim-hof') {
            startWimHofExercise();
        } else {
            startRegularExercise();
        }
    }

    function startWimHofExercise() {
        let currentSet = 1;
        let currentRound = 1;
        let currentPhase = 0;
        let timeLeft = exercise.durations[0];
        let isInAfterRounds = false;
        let afterRoundIndex = 0;

        updateTimer(timeLeft);
        updateBreathAnimation(exercise.sequence[0], currentRound, currentSet);
        updateBreathingIndicator(exercise.sequence[0]);

        const intervalId = setInterval(() => {
            timeLeft--;
            updateTimer(timeLeft);

            if (timeLeft === 0) {
                if (!isInAfterRounds) {
                    currentPhase = (currentPhase + 1) % exercise.sequence.length;
                    
                    if (currentPhase === 0) {
                        currentRound++;
                        if (currentRound > exercise.rounds) {
                            isInAfterRounds = true;
                            afterRoundIndex = 0;
                            timeLeft = exercise.afterRounds[0].duration;
                            updateBreathAnimation(exercise.afterRounds[0].phase, null, currentSet);
                            updateBreathingIndicator(exercise.afterRounds[0].phase);
                            return;
                        }
                    }

                    timeLeft = exercise.durations[currentPhase];
                    updateBreathAnimation(exercise.sequence[currentPhase], currentRound, currentSet);
                    updateBreathingIndicator(exercise.sequence[currentPhase]);

                } else {
                    afterRoundIndex++;
                    if (afterRoundIndex >= exercise.afterRounds.length) {
                        currentSet++;
                        if (currentSet > exercise.sets) {
                            clearInterval(intervalId);
                            completeExercise();
                            return;
                        }
                        // Reset for next set
                        isInAfterRounds = false;
                        currentRound = 1;
                        currentPhase = 0;
                        timeLeft = exercise.durations[0];
                        updateBreathAnimation(exercise.sequence[0], currentRound, currentSet);
                        updateBreathingIndicator(exercise.sequence[0]);
                    } else {
                        timeLeft = exercise.afterRounds[afterRoundIndex].duration;
                        updateBreathAnimation(exercise.afterRounds[afterRoundIndex].phase, null, currentSet);
                        updateBreathingIndicator(exercise.afterRounds[afterRoundIndex].phase);
                    }
                }
            }
        }, 1000);
    }

    function startRegularExercise() {
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

    if ('ontouchstart' in window) {
        document.body.style.WebkitTapHighlightColor = 'transparent';
    }
});