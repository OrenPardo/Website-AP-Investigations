// ── Mobile menu toggle ───────────────────────────────────────────
(function () {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        toggle.setAttribute('aria-expanded', String(!open));
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// ── Scroll-triggered fade-in animations ──────────────────────────
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
})();

// ── Contact form submission ──────────────────────────────────────
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    function showError(fieldId, msg) {
        const el = document.getElementById(fieldId + '-error');
        if (el) {
            el.textContent = msg;
            el.classList.remove('hidden');
        }
    }

    function clearErrors() {
        form.querySelectorAll('[id$="-error"]').forEach(el => {
            el.textContent = '';
            el.classList.add('hidden');
        });
        status.classList.add('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Client-side validation
        let hasError = false;
        if (!name) { showError('name', 'נא למלא שם'); hasError = true; }
        if (!phone) { showError('phone', 'נא למלא טלפון'); hasError = true; }
        else if (!/^[\d\s\-+().]+$/.test(phone)) { showError('phone', 'מספר טלפון לא תקין'); hasError = true; }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'כתובת אימייל לא תקינה'); hasError = true; }
        if (hasError) return;

        // Submit
        btn.disabled = true;
        btn.textContent = 'שולח...';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, message }),
            });
            const json = await res.json();
            status.classList.remove('hidden');

            if (json.ok) {
                status.textContent = 'הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם.';
                status.className = 'text-center text-sm text-green-600';
                form.reset();
            } else {
                status.textContent = json.error || 'שגיאה בשליחה. נסו שוב.';
                status.className = 'text-center text-sm text-red-600';
            }
        } catch {
            status.classList.remove('hidden');
            status.textContent = 'שגיאת רשת. נסו שוב.';
            status.className = 'text-center text-sm text-red-600';
        } finally {
            btn.disabled = false;
            btn.textContent = 'שליחת פנייה';
        }
    });
})();
