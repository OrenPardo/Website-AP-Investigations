// ── Mobile menu (full-screen overlay) ────────────────────────────
(function () {
    const toggle = document.getElementById('menu-toggle');
    const close = document.getElementById('menu-close');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        menu.classList.contains('hidden') ? openMenu() : closeMenu();
    });

    if (close) close.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
})();

// ── Reveal on scroll ─────────────────────────────────────────────
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Contact form ─────────────────────────────────────────────────
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    function showError(id, msg) {
        const el = document.getElementById(id + '-error');
        if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    }

    function clearErrors() {
        form.querySelectorAll('[id$="-error"]').forEach(el => { el.textContent = ''; el.classList.add('hidden'); });
        status.classList.add('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let err = false;
        if (!name) { showError('name', 'נא למלא שם'); err = true; }
        if (!phone) { showError('phone', 'נא למלא טלפון'); err = true; }
        else if (!/^[\d\s\-+().]+$/.test(phone)) { showError('phone', 'מספר טלפון לא תקין'); err = true; }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'כתובת אימייל לא תקינה'); err = true; }
        if (err) return;

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
                status.className = 'text-sm text-green-700';
                form.reset();
            } else {
                status.textContent = json.error || 'שגיאה בשליחה. נסו שוב.';
                status.className = 'text-sm text-red-600';
            }
        } catch {
            status.classList.remove('hidden');
            status.textContent = 'שגיאת רשת. נסו שוב.';
            status.className = 'text-sm text-red-600';
        } finally {
            btn.disabled = false;
            btn.textContent = 'שליחת פנייה';
        }
    });
})();
