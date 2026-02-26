'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function Navbar({ locale, dict }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const navLinks = [
    { href: `/${locale}/services`, label: dict.services },
    { href: `/${locale}/about`, label: dict.about },
    { href: `/${locale}/contact`, label: dict.contact },
  ];

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') closeMenu();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Focus trap
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 mix-blend-difference" aria-label={dict.ariaNav}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-8 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-white text-lg tracking-tight">
            <span className="font-700">{dict.logoBold}</span>{' '}
            <span className="font-200">{dict.logoLight}</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-300 text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'text-white' : 'hover:text-white transition-colors'}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher locale={locale} />
          </div>
          <button
            ref={hamburgerRef}
            className="md:hidden text-white"
            aria-label={dict.ariaMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.ariaMenu}
        className={`fixed inset-0 z-[60] bg-ink ${menuOpen ? 'flex' : 'hidden'} flex-col items-center justify-center gap-8 text-xl font-300 text-surface`}
      >
        <button
          className="absolute top-8 ltr:right-8 rtl:left-8 text-surface"
          aria-label={dict.ariaClose}
          onClick={closeMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Link href={`/${locale}`} onClick={closeMenu} className="hover:opacity-60 transition-opacity">{dict.home}</Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="hover:opacity-60 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
        <LanguageSwitcher locale={locale} />
      </div>
    </>
  );
}
