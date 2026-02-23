const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

// HTML-escape helper to prevent XSS in email templates
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Security headers ─────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'"],
            baseUri: ["'self'"]
        }
    },
    strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Permissions-Policy: block unused browser APIs
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
    );
    next();
});

// ── General rate limiter (DoS protection) ────────────────────────
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests'
});
app.use(generalLimiter);

// Compression
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '16kb' }));

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    index: false,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// ── SEO metadata per route ───────────────────────────────────────
const routeMeta = {
    '/': {
        title: 'אלון פרדו — חקירות פרטיות מקצועיות',
        desc: 'אלון פרדו — משרד חקירות פרטיות מקצועי. חקירות ביטוח, מעקבים, איתור מידע ובדיקות רקע עבור חברות ביטוח, רשויות מקומיות וגופים עסקיים.',
    },
    '/services': {
        title: 'שירותים | אלון פרדו — חקירות פרטיות',
        desc: 'שירותי חקירה מקצועיים: חקירות ביטוח, מעקבים, בדיקות רקע, איתור נכסים, חקירות תאגידיות ועוד.',
    },
    '/about': {
        title: 'אודות | אלון פרדו — חקירות פרטיות',
        desc: 'אלון פרדו — ניסיון רב שנים בתחום החקירות הפרטיות. מקצועיות, דיסקרטיות ותוצאות.',
    },
    '/contact': {
        title: 'צור קשר | אלון פרדו — חקירות פרטיות',
        desc: 'צרו קשר לפנייה חסויה. אלון פרדו — חקירות פרטיות מקצועיות.',
    },
};

// ── Cache HTML templates in memory at startup ────────────────────
const templates = {};
const htmlDir = path.join(__dirname, 'public');
['index.html', 'services.html', 'about.html', 'contact.html'].forEach(file => {
    templates[file] = fs.readFileSync(path.join(htmlDir, file), 'utf-8');
});

// ── JSON-LD structured data ──────────────────────────────────────
const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'אלון פרדו — חקירות פרטיות',
    'description': 'משרד חקירות פרטיות מקצועי. חקירות ביטוח, מעקבים, איתור מידע ובדיקות רקע.',
    'url': '/',
    'provider': {
        '@type': 'Person',
        'name': 'אלון פרדו',
        'jobTitle': 'חוקר פרטי'
    },
    'areaServed': { '@type': 'Country', 'name': 'Israel' },
    'availableLanguage': ['Hebrew'],
    'serviceType': ['Private Investigation', 'Insurance Investigation', 'Surveillance', 'Background Check']
});

// Helper: inject SEO metadata into HTML template
function servePage(templateFile, route, res) {
    res.set('Cache-Control', 'no-cache');
    const meta = routeMeta[route];

    let html = templates[templateFile]
        .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
        .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta.desc}">`);

    // Inject JSON-LD on homepage
    if (route === '/') {
        html = html.replace('</head>', `    <script type="application/ld+json">${jsonLd}</script>\n</head>`);
    }

    res.type('html').send(html);
}

// ── Page routes ──────────────────────────────────────────────────
app.get('/', (req, res) => servePage('index.html', '/', res));
app.get('/services', (req, res) => servePage('services.html', '/services', res));
app.get('/about', (req, res) => servePage('about.html', '/about', res));
app.get('/contact', (req, res) => servePage('contact.html', '/contact', res));

// ── Email transporter ────────────────────────────────────────────
const transporter = process.env.SMTP_PASS
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null;

// Rate limit for contact endpoint: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'יותר מדי בקשות, נסו שוב מאוחר יותר' }
});

// ── Contact form endpoint ────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, phone, email, message } = req.body || {};

    // Required fields
    const required = { name, phone };
    const missing = Object.entries(required)
        .filter(([, v]) => v == null || String(v).trim() === '')
        .map(([k]) => k);
    if (missing.length) {
        return res.status(400).json({ ok: false, error: 'שדות חובה חסרים', fields: missing });
    }

    // Input length validation
    const limits = { name: 200, phone: 30, email: 254, message: 5000 };
    for (const [field, max] of Object.entries(limits)) {
        if (req.body[field] && String(req.body[field]).length > max) {
            return res.status(400).json({ ok: false, error: `${field} חורג מאורך מקסימלי של ${max}` });
        }
    }

    // Phone format validation
    if (!/^[\d\s\-+().]+$/.test(phone)) {
        return res.status(400).json({ ok: false, error: 'פורמט טלפון לא תקין' });
    }

    // Email format validation (optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ ok: false, error: 'פורמט אימייל לא תקין' });
    }

    if (!transporter) {
        console.warn('SMTP_PASS not configured – email skipped');
        return res.status(503).json({ ok: false, error: 'שליחת מייל לא מוגדרת' });
    }

    const safeName = esc(name.trim());
    const safePhone = esc(phone.trim());
    const safeEmail = email ? esc(email.trim()) : '';
    const safeMessage = esc((message ?? '').trim()).replace(/\n/g, '<br>');

    const subject = `פנייה חדשה מהאתר: ${safeName}`;

    const html = `
        <div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1a2e44">פנייה חדשה — אלון פרדו חקירות</h2>
            <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;width:30%">שם</td><td style="padding:8px;border-bottom:1px solid #eee">${safeName}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">טלפון</td><td style="padding:8px;border-bottom:1px solid #eee">${safePhone}</td></tr>
                ${safeEmail ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">אימייל</td><td style="padding:8px;border-bottom:1px solid #eee">${safeEmail}</td></tr>` : ''}
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">הודעה</td><td style="padding:8px;border-bottom:1px solid #eee">${safeMessage}</td></tr>
            </table>
        </div>`;

    try {
        await transporter.sendMail({
            from: `"אלון פרדו — אתר" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject,
            html
        });
        res.json({ ok: true });
    } catch (err) {
        console.error('Email send error:', err.message);
        res.status(500).json({ ok: false, error: 'שליחת ההודעה נכשלה' });
    }
});

// ── Start server ─────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Keep-alive tuning for reverse proxies
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
