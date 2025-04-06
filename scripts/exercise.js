document.addEventListener('DOMContentLoaded', () => {
    const circle = document.querySelector('.circle');
    const timer = document.querySelector('.timer');
    const breathingIndicator = document.querySelector('.breathing-indicator');
    const mainText = document.querySelector('.main-text');
    const subText = document.querySelector('.sub-text');
    
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type');

    const exercises = {
        'box': {
        sequence: ['Inhale', 'Hold', 'Exhale', 'Hold'],
        durations: [4, 4, 4, 4],
        rounds: 5,
        background: {
            light: '#F5F7FA',
            dark: '#121212'
        },
        arrow: {
            up: ['Inhale'],
            none: ['Hold'],
            down: ['Exhale']
        }
    },
    '48': {
        sequence: ['Inhale', 'Exhale'],
        durations: [4, 8],
        rounds: 6,
        background: {
            light: '#F5F7FA',
            dark: '#121212'
        },
        arrow: {
            up: ['Inhale'],
            down: ['Exhale']
        }
    },

        'wim-hof': {
            sequence: ['Quick Breath', 'Retention', 'Recovery'],
            durations: [2, 0, 15],
            totalBreaths: 30,
            sets: 3,
            background: {
                light: '#FFF3E6',
                dark: '#32261a'
            }
        }
    };

    const exercise = exercises[exerciseType];
    if (!exercise) {
        window.location.href = 'index.html';
        return;
    }

    // Set background color based on theme
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    document.body.style.backgroundColor = exercise.background[theme];

    function updateBreathingText(main, sub = '') {
        mainText.textContent = main;
        subText.textContent = sub;
        mainText.classList.remove('fade-in');
        subText.classList.remove('fade-in');
        void mainText.offsetWidth;
        void subText.offsetWidth;
        mainText.classList.add('fade-in');
        subText.classList.add('fade-in');
    }
    function updateBreathingIndicator(phase) {
        const arrows = document.querySelector('.breathing-indicator');
        const upArrow = arrows.querySelector('.arrow-up');
        const downArrow = arrows.querySelector('.arrow-down');
    
        upArrow.style.opacity = '0';
        downArrow.style.opacity = '0';
    
        if (exercise.arrow.up.includes(phase)) {
            upArrow.style.opacity = '1';
            circle.className = 'circle inhale';
        } else if (exercise.arrow.down.includes(phase)) {
            downArrow.style.opacity = '1';
            circle.className = 'circle exhale';
        } else {
            circle.className = 'circle hold';
        }
    }

    function startWimHofExercise() {
        let currentSet = 1;
        let breathCount = 0;
        let retentionTimer = 0;
        let timerInterval;

        function startBreathingPhase() {
            breathCount++;
            if (breathCount <= exercise.totalBreaths) {
                updateBreathingText(
                    `Set ${currentSet} of ${exercise.sets}`,
                    `Quick breath ${breathCount}/${exercise.totalBreaths}`
                );
                
                circle.className = 'circle quick-breath';
                
                setTimeout(() => {
                    if (breathCount < exercise.totalBreaths) {
                        startBreathingPhase();
                    } else {
                        startRetentionPhase();
                    }
                }, 2000);
            }
        }

        function startRetentionPhase() {
            circle.className = 'circle retention';
            updateBreathingText(
                'Exhale fully and hold',
                'Click when you need to breathe'
            );
            
            circle.style.cursor = 'pointer';
            retentionTimer = 0;
            
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                retentionTimer++;
                timer.textContent = Math.floor(retentionTimer);
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
            
            updateBreathingText(
                'Deep breath in',
                'Hold for 15 seconds'
            );

            let recoveryTime = exercise.durations[2];
            timer.textContent = recoveryTime;

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                recoveryTime--;
                timer.textContent = recoveryTime;

                if (recoveryTime < 0) {
                    clearInterval(timerInterval);
                    if (currentSet < exercise.sets) {
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

        timer.textContent = timeLeft;
        updateBreathingText(exercise.sequence[0]);
        updateBreathingIndicator(exercise.sequence[0]); // Add this line

        const intervalId = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;

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
                updateBreathingText(exercise.sequence[currentPhase]);
                updateBreathingIndicator(exercise.sequence[currentPhase]); // Add this line
        }
        }, 1000);
    }

    function completeExercise() {
        circle.className = 'circle';
        updateBreathingText('Exercise Complete!', 'Well done!');
        timer.textContent = '';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    // Start appropriate exercise
    if (exerciseType === 'wim-hof') {
        startWimHofExercise();
    } else {
        startRegularExercise();
    }
});