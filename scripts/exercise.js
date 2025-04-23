document.addEventListener('DOMContentLoaded', () => {

    let exerciseType = null; // Variable to hold the technique type

    // === Parse URL, Set Technique Attribute, and Get Exercise Type ONCE ===
    try {
        const urlParams = new URLSearchParams(window.location.search);
        exerciseType = urlParams.get('type'); // Get 'box', '48', 'wim-hof', etc.

        if (exerciseType) {
            // Apply the technique type as a data attribute to the body for CSS styling
            document.body.dataset.currentTechnique = exerciseType;
            console.log(`Set technique to: ${exerciseType}`); // For debugging
        } else {
            // If no type is found, redirect back to the index page immediately
            console.warn('Technique type not found in URL parameters. Redirecting.');
            window.location.href = 'index.html';
            return; // Stop script execution if type is missing
        }
    } catch (e) {
        // If there's an error processing URL, redirect back too
        console.error('Error processing URL parameters:', e);
        window.location.href = 'index.html';
        return; // Stop script execution on error
    }
    // === END URL PARSING AND TECHNIQUE SETTING ===

    // --- Get DOM Elements (Check for existence) ---
    const circle = document.querySelector('.circle');
    const timer = document.querySelector('.timer');
    // const breathingIndicator = document.querySelector('.breathing-indicator'); // Currently unused?
    const mainText = document.querySelector('.main-text');
    const subText = document.querySelector('.sub-text');

    // Basic check if essential elements are missing
    if (!circle || !timer || !mainText || !subText) {
        console.error('Essential DOM elements for exercise not found. Aborting.');
        return; // Stop if main elements aren't present
    }

    // --- Exercise Definitions ---
    const exercises = {
        'box': {
            sequence: ['Inhale', 'Hold', 'Exhale', 'Hold'],
            durations: [4, 4, 4, 4],
            rounds: 5, // Example rounds
            background: { light: '#F5F7FA', dark: '#12121f' },
            arrow: { up: ['Inhale'], none: ['Hold'], down: ['Exhale'] }
        },
        '48': {
            sequence: ['Inhale', 'Exhale'],
            durations: [4, 8],
            rounds: 10, // Example rounds
            background: { light: '#F5F7FA', dark: '#12121f' },
            arrow: { up: ['Inhale'], down: ['Exhale'], none: [] }
        },
        'wim-hof': {
            sequence: ['Quick Breath', 'Retention', 'Recovery'],
            durations: [2, 0, 15], // Duration for Quick Breath, Retention (handled differently), Recovery Hold
            totalBreaths: 30, // Breaths per set
            sets: 3, // Number of sets
            background: { light: '#FFF3E6', dark: '#32261a' }, // Example colors
            arrow: {} // Wim Hof doesn't use simple up/down in the same way
        },
        'belly': {
            sequence: ['Belly Inhale', 'Exhale Slowly'],
            durations: [4, 6],
            rounds: 10, // Example rounds
            background: { light: '#e8f5e9', dark: '#1b3d1e' },
            arrow: { up: ['Belly Inhale'], down: ['Exhale Slowly'], none: [] }
        },
        'buteyko': {
            sequence: ['Gentle Inhale', 'Relaxed Exhale', 'Pause'],
            durations: [3, 4, 2],
            rounds: 10, // Example rounds
            background: { light: '#eceff1', dark: '#263238' },
            arrow: { up: ['Gentle Inhale'], down: ['Relaxed Exhale'], none: ['Pause'] }
        }
    };

    // --- Get Current Exercise Data ---
    const exercise = exercises[exerciseType]; // Use exerciseType determined earlier

    // Safeguard check (should have been caught earlier, but good practice)
    if (!exercise) {
        console.error(`Exercise data for type "${exerciseType}" not found! Redirecting.`);
        window.location.href = 'index.html';
        return;
    }

    // --- Set Initial Background Color (Consider moving this to CSS variable if possible) ---
    // Note: You might prefer setting the background via CSS using the data-attribute too
    // Example CSS: body[data-current-technique="box"] { background-color: #someBlue; }
    // For now, keeping the JS background setting:
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    if (exercise.background && exercise.background[theme]) {
        document.body.style.backgroundColor = exercise.background[theme];
    } else {
        console.warn(`Background color not defined for technique ${exerciseType} and theme ${theme}`);
    }

    // --- Helper Functions ---
    function updateBreathingText(main, sub = '') {
        if (mainText && subText) {
            mainText.textContent = main;
            subText.textContent = sub;
            // Force reflow to restart animation
            mainText.classList.remove('fade-in');
            subText.classList.remove('fade-in');
            void mainText.offsetWidth; // Trigger reflow
            void subText.offsetWidth; // Trigger reflow
            mainText.classList.add('fade-in');
            subText.classList.add('fade-in');
        }
    }

    function updateBreathingIndicator(phase) {
        const indicatorContainer = document.querySelector('.breathing-indicator');
        if (!indicatorContainer || !exercise.arrow) return; // Exit if no indicator or arrow data

        const upArrow = indicatorContainer.querySelector('.arrow-up');
        const downArrow = indicatorContainer.querySelector('.arrow-down');

        if (!upArrow || !downArrow) return; // Exit if arrows not found

        // Default: hide both
        upArrow.style.opacity = '0';
        downArrow.style.opacity = '0';
        // Default animation state if needed (e.g., 'hold')
        let animationClass = 'hold'; // Assume hold/none if not up/down

        if (exercise.arrow.up && exercise.arrow.up.includes(phase)) {
            upArrow.style.opacity = '1';
            animationClass = 'inhale';
        } else if (exercise.arrow.down && exercise.arrow.down.includes(phase)) {
            downArrow.style.opacity = '1';
            animationClass = 'exhale';
        }
        // Apply animation class to circle
        if (circle) {
           circle.className = `circle ${animationClass}`; // Ensure base class + animation
        }
    }

    // --- Exercise Logic ---

    // Wim Hof Specific Logic
    function startWimHofExercise() {
        let currentSet = 1;
        let breathCount = 0;
        let retentionStartTime = 0;
        let timerInterval = null; // Initialize to null

        function startBreathingPhase() {
            breathCount++;
            if (breathCount <= exercise.totalBreaths) {
                updateBreathingText(
                    `Set ${currentSet} of ${exercise.sets}`,
                    `Quick breath ${breathCount}/${exercise.totalBreaths}`
                );
                if (circle) circle.className = 'circle quick-breath';

                // Timeout for the duration of one quick breath cycle
                setTimeout(() => {
                    if (breathCount < exercise.totalBreaths) {
                        startBreathingPhase(); // Next breath
                    } else {
                        startRetentionPhase(); // Move to retention after last breath
                    }
                }, exercise.durations[0] * 1000); // Use duration[0] for quick breath time
            }
        }

        function startRetentionPhase() {
            if (timerInterval) clearInterval(timerInterval); // Clear any previous interval
            timer.textContent = '0'; // Reset timer display
            if (circle) {
                circle.className = 'circle retention';
                circle.style.cursor = 'pointer'; // Make clickable
            }
            updateBreathingText(
                `Set ${currentSet} - Exhale & Hold`,
                'Click circle when you inhale'
            );
            retentionStartTime = Date.now(); // Record start time

            // Update timer display every second
            timerInterval = setInterval(() => {
                const elapsedSeconds = Math.floor((Date.now() - retentionStartTime) / 1000);
                timer.textContent = elapsedSeconds;
            }, 1000);

            // Listener to end retention
            if (circle) {
               circle.onclick = () => {
                    if (timerInterval) clearInterval(timerInterval); // Stop timer
                    circle.onclick = null; // Remove listener
                    circle.style.cursor = 'default';
                    console.log(`Retention Set ${currentSet}: ${timer.textContent}s`); // Log retention time
                    startRecoveryHold();
                };
            }
        }

        function startRecoveryHold() {
            if (timerInterval) clearInterval(timerInterval); // Clear retention timer interval
            let recoveryTime = exercise.durations[2]; // Get recovery hold duration
            if (circle) circle.className = 'circle recovery';
            updateBreathingText(
                `Set ${currentSet} - Recovery Hold`,
                'Deep breath in & hold'
            );
            timer.textContent = recoveryTime; // Show initial recovery time

            timerInterval = setInterval(() => {
                recoveryTime--;
                if (recoveryTime >= 0) {
                    timer.textContent = recoveryTime;
                }

                if (recoveryTime < 0) {
                    clearInterval(timerInterval);
                    if (currentSet < exercise.sets) {
                        // Prepare for next set
                        currentSet++;
                        breathCount = 0;
                        timer.textContent = '';
                        console.log("Starting next Wim Hof set...");
                        setTimeout(startBreathingPhase, 1000); // Delay before next set
                    } else {
                        completeExercise(); // All sets finished
                    }
                }
            }, 1000);
        }

        // Initial setup for Wim Hof
        timer.textContent = '';
        startBreathingPhase();
    }

    // Regular Exercise Logic (Box, 4-8, Belly, Buteyko)
    function startRegularExercise() {
        let currentRound = 1;
        let currentPhaseIndex = 0;
        let timeLeft = exercise.durations[currentPhaseIndex];
        let intervalId = null; // Initialize intervalId

        function runPhase() {
            const currentPhaseName = exercise.sequence[currentPhaseIndex];
            timeLeft = exercise.durations[currentPhaseIndex];

            // Initial display for the phase
            timer.textContent = timeLeft;
            updateBreathingText(currentPhaseName, `Round ${currentRound}/${exercise.rounds}`);
            updateBreathingIndicator(currentPhaseName); // Update animation/indicator

            // Clear previous interval if exists
            if (intervalId) clearInterval(intervalId);

            // Start new interval
            intervalId = setInterval(() => {
                timeLeft--;
                if (timeLeft >= 0) {
                    timer.textContent = timeLeft;
                }

                if (timeLeft < 0) {
                    clearInterval(intervalId); // Stop current phase timer

                    // Move to next phase
                    currentPhaseIndex = (currentPhaseIndex + 1) % exercise.sequence.length;

                    // Check if a new round starts
                    if (currentPhaseIndex === 0) {
                        currentRound++;
                        if (currentRound > exercise.rounds) {
                            completeExercise(); // End exercise if max rounds reached
                            return;
                        }
                    }
                    // Start the next phase
                    runPhase();
                }
            }, 1000);
        }

        // Start the first phase
        runPhase();
    }

    // Completion Logic
    function completeExercise() {
        if (circle) circle.className = 'circle'; // Reset circle class
        updateBreathingText('Exercise Complete!', 'Well done!');
        timer.textContent = ''; // Clear timer
        console.log("Exercise Complete. Redirecting...");
        // Redirect back to index after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000); // 3-second delay
    }

    // --- Start the Correct Exercise ---
    if (exerciseType === 'wim-hof') {
        startWimHofExercise();
    } else if (exercise && exercise.sequence && exercise.durations) {
        startRegularExercise();
    } else {
        // Fallback if something went wrong (should have been caught earlier)
        console.error('Cannot start exercise - invalid exercise data.');
        window.location.href = 'index.html';
    }

}); // End of DOMContentLoaded