'use client';

import { useState } from 'react';

const initialState = { name: '', phone: '', email: '', message: '' };

function CheckIcon() {
  return (
    <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32" cy="32" r="30"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-[circleIn_0.4s_ease-out_forwards]"
        strokeDasharray="188.5"
        strokeDashoffset="188.5"
      />
      <path
        d="M20 33l8 8 16-16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[checkIn_0.3s_ease-out_0.35s_forwards]"
        strokeDasharray="40"
        strokeDashoffset="40"
      />
    </svg>
  );
}

export default function ContactForm({ dict, locale }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = dict.validationNameRequired;
    if (!form.phone.trim()) errs.phone = dict.validationPhoneRequired;
    else if (!/^[\d\s\-+().]+$/.test(form.phone.trim())) errs.phone = dict.validationPhoneInvalid;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = dict.validationEmailInvalid;
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus({ ok: true, message: dict.successMessage });
        setForm(initialState);
      } else {
        setStatus({ ok: false, message: json.error || dict.errorGeneric });
      }
    } catch {
      setStatus({ ok: false, message: dict.errorNetwork });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  }

  function handleReset() {
    setStatus(null);
  }

  const inputClass = 'w-full bg-transparent border-b border-border-subtle px-0 py-4 text-ink font-300 focus:outline-none focus:border-ink transition-colors placeholder:text-ink-light';

  if (status?.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-ink">
          <CheckIcon />
        </div>
        <p className="text-lg font-300 text-ink mt-6 text-center">{status.message}</p>
        <button
          onClick={handleReset}
          className="mt-8 text-sm font-300 text-ink-muted hover:text-ink transition-colors underline underline-offset-4"
        >
          {dict.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-500 mb-3">{dict.nameLabel}</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          placeholder={dict.namePlaceholder}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <span id="name-error" className="text-red-600 text-xs mt-2 block" role="alert">{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-500 mb-3">{dict.phoneLabel}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          autoComplete="tel"
          dir="ltr"
          value={form.phone}
          onChange={handleChange}
          className={`${inputClass} text-left`}
          placeholder={dict.phonePlaceholder}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && <span id="phone-error" className="text-red-600 text-xs mt-2 block" role="alert">{errors.phone}</span>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-500 mb-3">{dict.emailLabel}</label>
        <input
          type="text"
          id="email"
          name="email"
          autoComplete="email"
          dir="ltr"
          value={form.email}
          onChange={handleChange}
          className={`${inputClass} text-left`}
          placeholder={dict.emailPlaceholder}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <span id="email-error" className="text-red-600 text-xs mt-2 block" role="alert">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-500 mb-3">{dict.messageLabel}</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder={dict.messagePlaceholder}
        />
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-surface font-500 text-sm px-12 py-4 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {submitting ? dict.submitting : dict.submit}
        </button>
      </div>
      {status && !status.ok && (
        <p className="text-sm text-red-600" role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}
