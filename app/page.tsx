import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import RecentContent from '@/components/content/RecentContent';
import AboutSection from '@/components/about/AboutSection';
import { contentService } from '@/lib/content/content-service';

// Lazy-load SearchBar component to reduce initial bundle
const SearchBar = dynamic(() => import('@/components/search/SearchBar'), {
  loading: () => <SearchBarSkeleton />,
  ssr: false, // SearchBar has client-side interactions, load after hydration
});

// Server-side data fetching with ISR
async function getRecentContent() {
  try {
    const content = await contentService.getRecentContent(6);
    return content;
  } catch (error) {
    console.error('Error fetching recent content:', error);
    return [];
  }
}

export const revalidate = 3600; // ISR: Revalidate every hour (3600 seconds)

export default async function Home() {
  const recentContent = await getRecentContent();
  return (
    <>
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <Link href="/" className="flex items-center gap-3 font-montserrat font-semibold text-lg">
                <span className="w-6 h-6 bg-gradient-to-br from-[var(--moura-teal)] to-[var(--scholar-blue)] rounded-full"></span>
                MQ STUDIO
              </Link>
              <div className="font-lora text-sm text-[var(--charcoal-wash)] mt-1">
                Feeling · Thinking · Doing
              </div>
            </div>
            <nav className="font-montserrat text-sm">
              <Link href="/gallery/artworks" className="hover:text-[var(--moura-teal)] transition-colors">Artworks</Link>
              <span className="mx-2">·</span>
              <Link href="/gallery/publications" className="hover:text-[var(--moura-teal)] transition-colors">Publications</Link>
              <span className="mx-2">·</span>
              <Link href="/musings" className="hover:text-[var(--moura-teal)] transition-colors">Musings</Link>
              <span className="mx-2">·</span>
              <Link href="/press" className="hover:text-[var(--moura-teal)] transition-colors">Press</Link>
              <span className="mx-2">·</span>
              <Link href="/projects" className="hover:text-[var(--moura-teal)] transition-colors">Projects</Link>
              <span className="mx-2">·</span>
              <Link href="/search" className="hover:text-[var(--moura-teal)] transition-colors">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section - Client Component for Interactivity */}
        <HeroSection />

        {/* About Section - Introduction to Moura */}
        <AboutSection />

        {/* Search Bar */}
        <section className="py-8 border-t border-b border-[var(--border)]">
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search publications, artworks, musings..." />
          </div>
        </section>

        {/* Recent Additions */}
        <section className="py-16">
          <h2 className="font-montserrat text-2xl font-semibold text-center mb-12 text-[var(--ink-black)]">
            Recent Additions to the Studio
          </h2>
          <Suspense fallback={<RecentContentSkeleton />}>
            <RecentContent content={recentContent} />
          </Suspense>
        </section>

        {/* Marginalia Section */}
        <aside className="py-8 border-t border-[var(--border)]">
          <div className="max-w-4xl mx-auto px-8 border-l-4 border-[var(--vibrant-magenta)]">
            <p className="font-lora italic text-[var(--charcoal-wash)]">
              &ldquo;The studio is not just a place but a practice—where the academic and the artistic
              refuse to be separated, where thinking and feeling inform doing.&rdquo;
            </p>
            <p className="font-montserrat text-sm text-[var(--muted-foreground)] mt-2">
              — David Fushtey, Partner in Dialogue
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}

// Loading skeleton for SearchBar
function SearchBarSkeleton() {
  return (
    <div className="relative">
      <div className="w-full pl-12 pr-4 py-4 rounded-lg border border-[var(--border)] bg-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// Loading skeleton for RecentContent
function RecentContentSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-6 border border-[var(--border)] animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-20 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
