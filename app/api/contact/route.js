import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// HTML-escape helper to prevent XSS in email templates
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Simple in-memory rate limiter
const rateMap = new Map();
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_MAX) return true;
  return false;
}

// Locale-aware error messages
const messages = {
  he: {
    rateLimited: 'יותר מדי בקשות, נסו שוב מאוחר יותר',
    invalidRequest: 'בקשה לא תקינה',
    missingFields: 'שדות חובה חסרים',
    fieldTooLong: 'חורג מאורך מקסימלי',
    invalidPhone: 'פורמט טלפון לא תקין',
    invalidEmail: 'פורמט אימייל לא תקין',
    smtpNotConfigured: 'שליחת מייל לא מוגדרת',
    sendFailed: 'שליחת ההודעה נכשלה',
  },
  en: {
    rateLimited: 'Too many requests, please try again later',
    invalidRequest: 'Invalid request',
    missingFields: 'Required fields are missing',
    fieldTooLong: 'Exceeds maximum length',
    invalidPhone: 'Invalid phone format',
    invalidEmail: 'Invalid email format',
    smtpNotConfigured: 'Email sending is not configured',
    sendFailed: 'Failed to send message',
  },
};

function getMessages(request) {
  const lang = request.headers.get('accept-language') || 'he';
  return messages[lang] || messages.he;
}

// Create transporter lazily
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function POST(request) {
  const msg = getMessages(request);

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: msg.rateLimited },
      { status: 429 }
    );
  }

  // Content-Type validation
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return NextResponse.json(
      { ok: false, error: msg.invalidRequest },
      { status: 415 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: msg.invalidRequest }, { status: 400 });
  }

  const { name, phone, email, message } = body || {};

  // Required fields
  const required = { name, phone };
  const missing = Object.entries(required)
    .filter(([, v]) => v == null || String(v).trim() === '')
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ ok: false, error: msg.missingFields, fields: missing }, { status: 400 });
  }

  // Input length validation
  const limits = { name: 200, phone: 30, email: 254, message: 5000 };
  for (const [field, max] of Object.entries(limits)) {
    if (body[field] && String(body[field]).length > max) {
      return NextResponse.json(
        { ok: false, error: msg.fieldTooLong },
        { status: 400 }
      );
    }
  }

  // Phone format validation
  if (!/^[\d\s\-+().]+$/.test(phone)) {
    return NextResponse.json({ ok: false, error: msg.invalidPhone }, { status: 400 });
  }

  // Email format validation (optional)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ ok: false, error: msg.invalidEmail }, { status: 400 });
  }

  const mailer = getTransporter();
  if (!mailer) {
    console.warn('SMTP_PASS not configured – email skipped, logging submission instead');
    console.log('Contact form submission:', { name, phone, email, message });
    return NextResponse.json({ ok: true });
  }

  const safeName = esc(name.trim());
  const safePhone = esc(phone.trim());
  const safeEmail = email ? esc(email.trim()) : '';
  const safeMessage = esc((message ?? '').trim()).replace(/\n/g, '<br>');

  const subject = `פנייה חדשה מהאתר: ${safeName}`;

  const html = `
    <div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a2e44">פנייה חדשה — וריטס חקירות</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;width:30%">שם</td><td style="padding:8px;border-bottom:1px solid #eee">${safeName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">טלפון</td><td style="padding:8px;border-bottom:1px solid #eee">${safePhone}</td></tr>
        ${safeEmail ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">אימייל</td><td style="padding:8px;border-bottom:1px solid #eee">${safeEmail}</td></tr>` : ''}
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">הודעה</td><td style="padding:8px;border-bottom:1px solid #eee">${safeMessage}</td></tr>
      </table>
    </div>`;

  try {
    await mailer.sendMail({
      from: `"וריטס חקירות — אתר" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err.message);
    return NextResponse.json({ ok: false, error: msg.sendFailed }, { status: 500 });
  }
}
