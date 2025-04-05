document.addEventListener('DOMContentLoaded', () => {
    function animateBreathingText(mainText, subText = '') {
        const textContainer = document.querySelector('.breathing-text-container');
        textContainer.innerHTML = `
            <div class="main-text fade-in">${mainText}</div>
            ${subText ? `<div class="sub-text fade-in">${subText}</div>` : ''}
        `;
    }
    
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // DOM elements
    const circle = document.querySelector('.circle');
    const timer = document.querySelector('.timer');
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type');
    function animateBreathingText(mainText, subText = '') {
        const textContainer = document.querySelector('.breathing-text-container');
        textContainer.innerHTML = `
            <div class="main-text fade-in">${mainText}</div>
            ${subText ? `<div class="sub-text fade-in">${subText}</div>` : ''}
        `;
    }
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
            sequence: ['Quick Breath', 'Retention', 'Recovery'],
            durations: [2, 0, 15],
            background: {
                light: '#E6F3FF',
                dark: '#1a2432'
            },
            totalBreaths: 30,
            sets: 3,
            isClickBased: true
        }
    };

    function startWimHofExercise() {
        let currentSet = 1;
        let breathCount = 0;
        let retentionTimer = 0;
        let timerInterval;

        // Clear existing timers and listeners
        if (timerInterval) clearInterval(timerInterval);
        circle.replaceWith(circle.cloneNode(true));
        circle = document.querySelector('.circle');

        function updateTimer(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function startBreathingPhase() {
            breathCount++;
            if (breathCount <= exercises['wim-hof'].totalBreaths) {
                animateBreathingText(
                    `Set ${currentSet} of ${exercises['wim-hof'].sets}`,
                    `Quick breath ${breathCount}/${exercises['wim-hof'].totalBreaths}`
                );
                
                circle.className = 'circle quick-breath';
                
                setTimeout(() => {
                    if (breathCount < exercises['wim-hof'].totalBreaths) {
                        startBreathingPhase();
                    } else {
                        startRetentionPhase();
                    }
                }, 2000);
            }
        }

        function startRetentionPhase() {
            circle.className = 'circle retention';
            animateBreathingText(
                'Exhale fully and hold',
                'Click when you need to breathe'
            );
            
            circle.style.cursor = 'pointer';
            retentionTimer = 0;
            
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                retentionTimer++;
                timer.textContent = updateTimer(retentionTimer);
            }, 1000);

            circle.onclick = () => {
                clearInterval(timerInterval);
                startRecoveryHold();
            };
        }

        function startRecoveryHold() {
            circle.onclick = null;
            circle.style.cursor = 'default';
            circle.className = 'circle recovery';
            
            animateBreathingText(
                'Deep breath in',
                'Hold for 15 seconds'
            );

            let recoveryTime = exercises['wim-hof'].durations[2];
            timer.textContent = recoveryTime;

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                recoveryTime--;
                timer.textContent = recoveryTime;

                if (recoveryTime < 0) {
                    clearInterval(timerInterval);
                    if (currentSet < exercises['wim-hof'].sets) {
                        currentSet++;
                        breathCount = 0;
                        timer.textContent = '';
                        setTimeout(startBreathingPhase, 1000);
                    } else {
                        completeExercise();
                    }
                }
            }, 1000);
        }

        timer.textContent = '';
        startBreathingPhase();
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