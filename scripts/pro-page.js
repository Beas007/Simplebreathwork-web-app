document.addEventListener('DOMContentLoaded', () => {
    const banner        = document.getElementById('pro-active-banner');
    const deactivateBtn = document.getElementById('pro-deactivate');
    const unlockSection = document.getElementById('pro-unlock-section');
    const codeInput     = document.getElementById('unlock-code-input');
    const submitBtn     = document.getElementById('unlock-submit-btn');
    const message       = document.getElementById('unlock-message');
    const ctaBtn        = document.getElementById('pro-cta-btn');

    function refreshUI() {
        const active = window.ProAccess && window.ProAccess.isActive();
        if (banner)        banner.style.display        = active ? 'flex' : 'none';
        if (unlockSection) unlockSection.style.display = active ? 'none' : 'block';
        if (ctaBtn)        ctaBtn.style.display        = active ? 'none' : 'inline-block';
    }

    refreshUI();

    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => {
            if (window.ProAccess) window.ProAccess.revoke();
            refreshUI();
        });
    }

    function attemptUnlock() {
        if (!codeInput || !message) return;
        const success = window.ProAccess && window.ProAccess.unlock(codeInput.value);
        if (success) {
            message.textContent = '✓ Access granted. You can now use any exercise with voice guidance.';
            message.className   = 'unlock-message success';
            refreshUI();
        } else {
            message.textContent = 'That code was not recognised. Check your welcome email and try again.';
            message.className   = 'unlock-message error';
        }
    }

    if (submitBtn) submitBtn.addEventListener('click', attemptUnlock);

    if (codeInput) {
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });
    }
});
