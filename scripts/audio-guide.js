/**
 * AudioGuide — plays phase-specific voice guidance MP3s during exercises.
 *
 * AUDIO FILE STRUCTURE
 * Place files in /audio/{exercise-type}/{phase-slug}.mp3
 *
 * Required files per exercise:
 *
 *  box/
 *    inhale.mp3          "Breathe in... 1, 2, 3, 4"
 *    hold.mp3            "Hold... 1, 2, 3, 4"
 *    exhale.mp3          "Breathe out... 1, 2, 3, 4"
 *
 *  48/
 *    inhale.mp3          "Breathe in... 1, 2, 3, 4"
 *    exhale.mp3          "Breathe out slowly... 1 through 8"
 *
 *  wim-hof/
 *    quick-breath.mp3    "30 deep breaths — breathe in fully, let go"
 *    retention.mp3       "Exhale and hold. Click when you need to inhale."
 *    recovery.mp3        "Deep recovery breath — inhale fully and hold"
 *
 *  belly/
 *    belly-inhale.mp3    "Breathe into your belly... feel it rise"
 *    exhale-slowly.mp3   "Slowly exhale... let everything go"
 *
 *  buteyko/
 *    gentle-inhale.mp3   "Gentle inhale through the nose"
 *    relaxed-exhale.mp3  "Slow, relaxed exhale"
 *    pause.mp3           "Pause and rest"
 *
 *  labour-slow/
 *    inhale-slowly.mp3   "Breathe in slowly and deeply"
 *    exhale-gently.mp3   "Exhale gently... release any tension"
 *
 *  complete.mp3          "Session complete. Well done."
 *
 * All files are optional — the player fails silently if a file is missing.
 */

window.AudioGuide = (function () {

    const MUTE_KEY = 'sb_audio_muted';

    function slugify(text) {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    class AudioGuide {
        constructor(exerciseType) {
            this.exerciseType  = exerciseType;
            this.isMuted       = localStorage.getItem(MUTE_KEY) === 'true';
            this.currentAudio  = null;
        }

        playPhase(phaseName) {
            if (this.isMuted) return;

            const slug = slugify(phaseName);
            const src  = `/audio/${this.exerciseType}/${slug}.mp3`;

            this._stop();

            const audio = new Audio(src);
            audio.volume = 0.9;
            audio.play().catch(() => {}); // Fail silently if file doesn't exist
            this.currentAudio = audio;
        }

        playComplete() {
            if (this.isMuted) return;
            this._stop();
            const audio = new Audio('/audio/complete.mp3');
            audio.volume = 0.9;
            audio.play().catch(() => {});
            this.currentAudio = audio;
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            localStorage.setItem(MUTE_KEY, this.isMuted);
            if (this.isMuted) this._stop();
            return this.isMuted;
        }

        _stop() {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio = null;
            }
        }

        destroy() {
            this._stop();
        }
    }

    return AudioGuide;

})();
