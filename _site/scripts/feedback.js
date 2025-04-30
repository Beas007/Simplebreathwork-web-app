document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const feedback = Object.fromEntries(formData.entries());
        
        try {
            // Here you would typically send to a backend server
            console.log('Feedback received:', feedback);
            
            // Show success message
            alert('Thank you for your feedback! We appreciate your input.');
            feedbackForm.reset();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Sorry, there was an error submitting your feedback. Please try again.');
        }
    });
});