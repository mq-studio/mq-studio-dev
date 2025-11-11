'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <p className="font-lora text-lg text-[var(--charcoal-wash)] mb-2">
          Welcome to the studio of
        </p>
        <h1 className="font-montserrat text-5xl sm:text-6xl font-bold mb-3 text-[var(--ink-black)]">
          MOURA QUAYLE
        </h1>
        <p className="font-montserrat text-lg text-[var(--scholar-blue)] tracking-wide">
          Academia · Leadership · Design
        </p>
      </div>

      {/* Three-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Thinking Column */}
        <div className="group relative overflow-hidden rounded-lg h-[500px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--scholar-blue)] via-blue-400 to-cyan-300 opacity-20"></div>
          <div className="relative h-full">
            <Image
              src="/background_assets/optimized/variants/hero-image-2-web.webp"
              alt="Thinking - Academic Research"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-auto">
              <h2 className="font-montserrat text-3xl font-bold mb-2">Thinking</h2>
              <p className="font-lora text-sm mb-4 opacity-90">
                Academic papers, research, and intellectual explorations
              </p>
              <Link
                href="/gallery/publications"
                className="inline-block px-4 py-2 bg-[var(--scholar-blue)] text-white rounded-md hover:bg-opacity-90 transition-all text-sm font-montserrat"
              >
                Explore Publications →
              </Link>
            </div>
          </div>
        </div>

        {/* Feeling Column */}
        <div className="group relative overflow-hidden rounded-lg h-[500px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--vibrant-magenta)] via-pink-400 to-purple-300 opacity-20"></div>
          <div className="relative h-full">
            <Image
              src="/background_assets/optimized/variants/hero-image-1-web.webp"
              alt="Feeling - Watercolor Art"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-auto">
              <h2 className="font-montserrat text-3xl font-bold mb-2">Feeling</h2>
              <p className="font-lora text-sm mb-4 opacity-90">
                Watercolors, calligraphy, and visual expressions
              </p>
              <Link
                href="/gallery/artworks"
                className="inline-block px-4 py-2 bg-[var(--vibrant-magenta)] text-white rounded-md hover:bg-opacity-90 transition-all text-sm font-montserrat"
              >
                Explore Artworks →
              </Link>
            </div>
          </div>
        </div>

        {/* Doing Column */}
        <div className="group relative overflow-hidden rounded-lg h-[500px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--moura-teal)] via-teal-400 to-green-300 opacity-20"></div>
          <div className="relative h-full">
            <Image
              src="/background_assets/optimized/variants/hero-image-3-web.webp"
              alt="Doing - Leadership & Design"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-auto">
              <h2 className="font-montserrat text-3xl font-bold mb-2">Doing</h2>
              <p className="font-lora text-sm mb-4 opacity-90">
                Leadership initiatives and collaborative ventures
              </p>
              <Link
                href="/gallery/publications?category=landscape"
                className="inline-block px-4 py-2 bg-[var(--moura-teal)] text-white rounded-md hover:bg-opacity-90 transition-all text-sm font-montserrat"
              >
                Explore Projects →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <p className="font-lora text-base text-[var(--charcoal-wash)] leading-relaxed">
          Where governance meets watercolor, policy meets poetry, and decades of scholarship
          coexist with ongoing artistic exploration. This is a workspace in motion—a place
          where thinking, feeling, and doing converge.
        </p>
      </div>
    </section>
  );
}