document.addEventListener('DOMContentLoaded', () => {

    let exerciseType = null;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        exerciseType = urlParams.get('type');

        if (exerciseType) {
            document.body.dataset.currentTechnique = exerciseType;
        } else {
            window.location.href = '/';
            return;
        }
    } catch (e) {
        window.location.href = '/';
        return;
    }

    const circle        = document.querySelector('.circle');
    const timer         = document.querySelector('.timer');
    const mainText      = document.querySelector('.main-text');
    const subText       = document.querySelector('.sub-text');
    const pauseBtn      = document.getElementById('pause-btn');
    const progressDots  = document.getElementById('progress-dots');
    const countdownOverlay  = document.getElementById('countdown-overlay');
    const countdownNumber   = document.getElementById('countdown-number');
    const completionOverlay = document.getElementById('completion-overlay');
    const audioMuteBtn      = document.getElementById('audio-mute-btn');

    // Pro audio — active only when user has a valid access code
    const isProUser = window.ProAccess && window.ProAccess.isActive();
    const audioGuide = isProUser ? new window.AudioGuide(exerciseType) : null;

    if (audioGuide && audioMuteBtn) {
        audioMuteBtn.style.display = 'flex';
        audioMuteBtn.addEventListener('click', () => {
            const muted = audioGuide.toggleMute();
            audioMuteBtn.textContent  = muted ? '🔇' : '🔊';
            audioMuteBtn.classList.toggle('muted', muted);
        });
    }

    if (!circle || !timer || !mainText || !subText) {
        console.error('Essential DOM elements not found.');
        return;
    }

    const exercises = {
        'box': {
            sequence: ['Inhale', 'Hold', 'Exhale', 'Hold'],
            durations: [4, 4, 4, 4],
            rounds: 5,
            background: { light: '#F5F7FA', dark: '#12121f' },
            arrow: { up: ['Inhale'], none: ['Hold'], down: ['Exhale'] }
        },
        '48': {
            sequence: ['Inhale', 'Exhale'],
            durations: [4, 8],
            rounds: 10,
            background: { light: '#F5F7FA', dark: '#12121f' },
            arrow: { up: ['Inhale'], down: ['Exhale'], none: [] }
        },
        'wim-hof': {
            sequence: ['Quick Breath', 'Retention', 'Recovery'],
            durations: [2, 0, 15],
            totalBreaths: 30,
            sets: 3,
            background: { light: '#FFF3E6', dark: '#32261a' },
            arrow: {}
        },
        'belly': {
            sequence: ['Belly Inhale', 'Exhale Slowly'],
            durations: [4, 6],
            rounds: 10,
            background: { light: '#e8f5e9', dark: '#1b3d1e' },
            arrow: { up: ['Belly Inhale'], down: ['Exhale Slowly'], none: [] }
        },
        'buteyko': {
            sequence: ['Gentle Inhale', 'Relaxed Exhale', 'Pause'],
            durations: [3, 4, 2],
            rounds: 10,
            background: { light: '#eceff1', dark: '#263238' },
            arrow: { up: ['Gentle Inhale'], down: ['Relaxed Exhale'], none: ['Pause'] }
        },
        'labour-slow': {
            sequence: ['Inhale slowly', 'Exhale gently'],
            durations: [5, 7],
            rounds: 8,
            background: { light: '#f8e1ec', dark: '#3d263a' },
            arrow: { up: ['Inhale slowly'], down: ['Exhale gently'], none: [] }
        }
    };

    const exercise = exercises[exerciseType];

    if (!exercise) {
        window.location.href = '/';
        return;
    }

    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    if (exercise.background && exercise.background[theme]) {
        document.body.style.backgroundColor = exercise.background[theme];
        if (countdownOverlay) countdownOverlay.style.backgroundColor = exercise.background[theme];
        if (completionOverlay) completionOverlay.style.backgroundColor = exercise.background[theme];
    }

    // --- Helpers ---

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

    // Sets the circle animation class and syncs animation-duration to the phase duration.
    // For hold/pause animations (infinite pulse), duration controls the cycle speed, not the
    // total hold time — so we use a fixed 2.5s cycle regardless of actual hold length.
    function setCircleAnimation(phase, phaseDuration) {
        const indicatorContainer = document.querySelector('.breathing-indicator');
        const upArrow   = indicatorContainer?.querySelector('.arrow-up');
        const downArrow = indicatorContainer?.querySelector('.arrow-down');

        if (upArrow)   upArrow.style.opacity = '0';
        if (downArrow) downArrow.style.opacity = '0';

        let animClass = 'hold';

        if (exercise.arrow.up   && exercise.arrow.up.includes(phase)) {
            if (upArrow) upArrow.style.opacity = '1';
            animClass = 'inhale';
        } else if (exercise.arrow.down && exercise.arrow.down.includes(phase)) {
            if (downArrow) downArrow.style.opacity = '1';
            animClass = 'exhale';
        }

        circle.className = `circle ${animClass}`;

        // Sync duration for inhale/exhale so the visual expansion matches the timer.
        // For hold (infinite pulse), keep a calm fixed cycle instead.
        if (animClass === 'inhale' || animClass === 'exhale') {
            circle.style.animationDuration = `${phaseDuration}s`;
        } else {
            circle.style.animationDuration = '2.5s';
        }
    }

    // --- Progress Dots ---

    function initProgressDots(total) {
        if (!progressDots) return;
        progressDots.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.className = 'progress-dot';
            progressDots.appendChild(dot);
        }
    }

    function updateProgressDots(completedCount) {
        if (!progressDots) return;
        progressDots.querySelectorAll('.progress-dot').forEach((dot, i) => {
            dot.classList.toggle('completed', i < completedCount);
        });
    }

    // --- Countdown ---

    function showCountdown(callback) {
        if (!countdownOverlay || !countdownNumber) {
            callback();
            return;
        }

        const steps = ['3', '2', '1'];
        let i = 0;

        countdownOverlay.style.display = 'flex';

        function showStep() {
            if (i >= steps.length) {
                // Fade out the overlay then start the exercise
                countdownOverlay.style.transition = 'opacity 0.4s ease';
                countdownOverlay.style.opacity = '0';
                setTimeout(() => {
                    countdownOverlay.style.display = 'none';
                    countdownOverlay.style.opacity = '';
                    countdownOverlay.style.transition = '';
                    callback();
                }, 400);
                return;
            }

            countdownNumber.textContent = steps[i];
            // Restart the pop animation for each number
            countdownNumber.style.animation = 'none';
            void countdownNumber.offsetWidth;
            countdownNumber.style.animation = '';

            i++;
            setTimeout(showStep, 900);
        }

        showStep();
    }

    // --- Completion (smooth, Approach A) ---

    function completeExercise() {
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (audioGuide) { audioGuide.playComplete(); audioGuide.destroy(); }
        timer.textContent = '';
        updateBreathingText('', '');

        // Graceful circle fade-out
        circle.style.animationDuration = '';
        circle.style.animationPlayState = '';
        circle.className = 'circle';
        void circle.offsetWidth;
        circle.classList.add('complete-fade');

        // Show completion overlay after the circle fades
        setTimeout(() => {
            if (completionOverlay) {
                completionOverlay.style.display = 'flex';
                void completionOverlay.offsetWidth;
                completionOverlay.classList.add('active');
            }
        }, 950);
    }

    // --- Wim Hof Exercise ---

    function startWimHofExercise() {
        let currentSet = 1;
        let breathCount = 0;
        let retentionStartTime = 0;
        let timerInterval = null;

        initProgressDots(exercise.sets);

        function startBreathingPhase() {
            breathCount++;
            if (breathCount <= exercise.totalBreaths) {
                updateBreathingText(
                    `Set ${currentSet} of ${exercise.sets}`,
                    `Quick breath ${breathCount}/${exercise.totalBreaths}`
                );
                circle.className = 'circle quick-breath';
                circle.style.animationDuration = '';
                if (audioGuide && breathCount === 1) audioGuide.playPhase('quick-breath');

                setTimeout(() => {
                    if (breathCount < exercise.totalBreaths) {
                        startBreathingPhase();
                    } else {
                        startRetentionPhase();
                    }
                }, exercise.durations[0] * 1000);
            }
        }

        function startRetentionPhase() {
            if (timerInterval) clearInterval(timerInterval);
            timer.textContent = '0';
            circle.className = 'circle retention';
            circle.style.animationDuration = '';
            circle.style.cursor = 'pointer';
            updateBreathingText(`Set ${currentSet} - Exhale & Hold`, 'Click circle when you inhale');
            if (audioGuide) audioGuide.playPhase('retention');
            retentionStartTime = Date.now();

            timerInterval = setInterval(() => {
                timer.textContent = Math.floor((Date.now() - retentionStartTime) / 1000);
            }, 1000);

            circle.onclick = () => {
                if (timerInterval) clearInterval(timerInterval);
                circle.onclick = null;
                circle.style.cursor = 'default';
                startRecoveryHold();
            };
        }

        function startRecoveryHold() {
            if (timerInterval) clearInterval(timerInterval);
            let recoveryTime = exercise.durations[2];
            circle.className = 'circle recovery';
            circle.style.animationDuration = `${recoveryTime}s`;
            updateBreathingText(`Set ${currentSet} - Recovery Hold`, 'Deep breath in & hold');
            if (audioGuide) audioGuide.playPhase('recovery');
            timer.textContent = recoveryTime;

            timerInterval = setInterval(() => {
                recoveryTime--;
                if (recoveryTime >= 0) timer.textContent = recoveryTime;

                if (recoveryTime < 0) {
                    clearInterval(timerInterval);
                    updateProgressDots(currentSet);
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

    // --- Regular Exercise (Box, 4-8, Belly, Buteyko, Labour-Slow) ---

    function startRegularExercise() {
        let currentRound = 1;
        let currentPhaseIndex = 0;
        let timeLeft = exercise.durations[0];
        let intervalId = null;
        let isPaused = false;

        initProgressDots(exercise.rounds);

        function startPhaseInterval() {
            if (intervalId) clearInterval(intervalId);

            intervalId = setInterval(() => {
                timeLeft--;
                if (timeLeft >= 0) timer.textContent = timeLeft;

                if (timeLeft < 0) {
                    clearInterval(intervalId);
                    currentPhaseIndex = (currentPhaseIndex + 1) % exercise.sequence.length;

                    if (currentPhaseIndex === 0) {
                        currentRound++;
                        updateProgressDots(currentRound - 1);
                        if (currentRound > exercise.rounds) {
                            completeExercise();
                            return;
                        }
                    }
                    runPhase();
                }
            }, 1000);
        }

        function runPhase() {
            const phaseName = exercise.sequence[currentPhaseIndex];
            timeLeft = exercise.durations[currentPhaseIndex];

            timer.textContent = timeLeft;
            updateBreathingText(phaseName, `Round ${currentRound}/${exercise.rounds}`);
            setCircleAnimation(phaseName, timeLeft);
            if (audioGuide) audioGuide.playPhase(phaseName);
            startPhaseInterval();
        }

        if (pauseBtn) {
            pauseBtn.style.display = 'inline-block';
            pauseBtn.addEventListener('click', () => {
                if (isPaused) {
                    isPaused = false;
                    pauseBtn.textContent = 'Pause';
                    circle.style.animationPlayState = 'running';
                    startPhaseInterval();
                } else {
                    isPaused = true;
                    pauseBtn.textContent = 'Resume';
                    if (intervalId) clearInterval(intervalId);
                    circle.style.animationPlayState = 'paused';
                }
            });
        }

        runPhase();
    }

    // --- Start ---

    showCountdown(() => {
        if (exerciseType === 'wim-hof') {
            startWimHofExercise();
        } else {
            startRegularExercise();
        }
    });

}); // End DOMContentLoaded
