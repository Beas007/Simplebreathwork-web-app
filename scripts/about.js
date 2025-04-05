document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    let speechSynthesis = window.speechSynthesis;
    let speaking = false;

    playButton.addEventListener('click', () => {
        if (speaking) {
            speechSynthesis.cancel();
            speaking = false;
            playButton.textContent = '🔊 Listen to This Page';
            return;
        }

        const content = document.querySelector('.about-content').textContent;
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onend = () => {
            speaking = false;
            playButton.textContent = '🔊 Listen to This Page';
        };

        speaking = true;
        playButton.textContent = '🔇 Stop Audio';
        speechSynthesis.speak(utterance);
    });
});