'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

const navigationLinks: NavLink[] = [
  { label: 'Artworks', href: '/gallery/artworks' },
  { label: 'Publications', href: '/gallery/publications' },
  { label: 'Musings', href: '/musings' },
  { label: 'Press', href: '/press' },
  { label: 'Projects', href: '/projects' },
  { label: 'Search', href: '/search' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-3 font-montserrat font-semibold text-lg hover:opacity-80 transition-opacity"
              aria-label="MQ Studio Home"
            >
              <span className="w-6 h-6 bg-gradient-to-br from-[var(--moura-teal)] to-[var(--scholar-blue)] rounded-full" aria-hidden="true"></span>
              MQ STUDIO
            </Link>
            <div className="font-lora text-sm text-[var(--charcoal-wash)] mt-1">
              Feeling · Thinking · Doing
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block font-montserrat text-sm" aria-label="Main navigation">
            {navigationLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 && <span className="mx-2 text-[var(--muted-foreground)]" aria-hidden="true">·</span>}
                <Link 
                  href={link.href} 
                  className="hover:text-[var(--moura-teal)] transition-colors focus:underline"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden mt-4 pb-2 border-t border-gray-200 pt-4"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 font-montserrat text-base hover:text-[var(--moura-teal)] transition-colors focus:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
