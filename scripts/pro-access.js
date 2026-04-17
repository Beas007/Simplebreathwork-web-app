/**
 * Pro access code system — Simple Breathwork
 *
 * HOW TO UPDATE MONTHLY:
 * 1. At the start of each month, add the new code to VALID_CODES[0].
 * 2. Move the previous month's code to VALID_CODES[1] (grace period).
 * 3. Remove any older codes.
 * 4. Push the change to deploy.
 * 5. Send the new code to subscribers via ThriveCart broadcast email.
 *
 * Example format: 'sb-breathe-jun26'
 */

window.ProAccess = (function () {

    // ─── UPDATE THESE MONTHLY ──────────────────────────────────────────────
    const VALID_CODES = [
        'sb-breathe-may26',   // Current month
        'sb-breathe-apr26',   // Previous month (grace period)
    ];
    // ───────────────────────────────────────────────────────────────────────

    const STORAGE_KEY = 'sb_pro_access';

    function isActive() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;
        try {
            const { code } = JSON.parse(stored);
            return VALID_CODES.includes(code);
        } catch {
            return false;
        }
    }

    function unlock(rawCode) {
        const code = rawCode.trim().toLowerCase();
        if (VALID_CODES.includes(code)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, unlockedAt: Date.now() }));
            return true;
        }
        return false;
    }

    function revoke() {
        localStorage.removeItem(STORAGE_KEY);
    }

    return { isActive, unlock, revoke };

})();
