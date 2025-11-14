'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import SearchBar from '@/components/search/SearchBar';
import { SearchResult, Content } from '@/lib/types/content';
import { searchQuerySchema, formatValidationError } from '@/lib/validation/schemas';

// Separate component that uses useSearchParams
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawQuery = searchParams.get('q') || '';
  const rawCategory = searchParams.get('category');

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate search parameters
  const validationResult = searchQuerySchema.safeParse({
    q: rawQuery || undefined,
    category: rawCategory || undefined,
  });

  const query = validationResult.success ? (validationResult.data.q || '') : '';
  const category = validationResult.success ? validationResult.data.category : undefined;

  useEffect(() => {
    if (!validationResult.success) {
      setValidationError(formatValidationError(validationResult.error));
      setLoading(false);
      return;
    }

    setValidationError(null);

    if (query) {
      fetchResults(query);
    } else {
      setLoading(false);
    }
  }, [query, validationResult.success]);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/content?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const type = result.content.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getContentLink = (item: Content): string => {
    switch (item.type) {
      case 'publication':
        return `/publications/${item.slug}`;
      case 'artwork':
        return `/artworks/${item.slug}`;
      case 'musing':
        return `/musings/${item.slug}`;
      case 'project':
        return `/projects/${item.slug}`;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  };

  const getContentColor = (category: string) => {
    switch (category) {
      case 'feeling':
        return 'var(--vibrant-magenta)';
      case 'thinking':
        return 'var(--scholar-blue)';
      case 'doing':
        return 'var(--moura-teal)';
      default:
        return 'var(--muted-foreground)';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Safe component for rendering highlighted text without dangerouslySetInnerHTML
  const HighlightedText: React.FC<{ text: string; highlight?: string; className?: string }> = ({
    text,
    highlight,
    className
  }) => {
    const content = highlight || text;

    // If no highlight markup, return plain text
    if (!content.includes('<mark>')) {
      return <span className={className}>{content}</span>;
    }

    // Sanitize and parse the highlighted text
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['mark'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });

    // Split by mark tags and render safely
    const parts = sanitized.split(/(<mark>.*?<\/mark>)/g);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
            const highlighted = part.replace(/<\/?mark>/g, '');
            return <mark key={index}>{highlighted}</mark>;
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="mb-2 sm:mb-0">
              <div className="flex items-center gap-3 font-montserrat font-semibold text-lg">
                <span className="w-6 h-6 bg-gradient-to-br from-[var(--moura-teal)] to-[var(--scholar-blue)] rounded-full"></span>
                MQ STUDIO
              </div>
              <div className="font-lora text-sm text-[var(--charcoal-wash)] mt-1">
                Feeling · Thinking · Doing
              </div>
            </Link>
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
              <Link href="/search" className="text-[var(--moura-teal)]">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="font-montserrat text-3xl font-bold mb-6 text-[var(--ink-black)]">
            Search MQ Studio
          </h1>
          <SearchBar autoFocus={!query} />
        </div>

        {/* Search Results */}
        {query && (
          <div className="mb-6">
            <p className="font-lora text-lg text-[var(--charcoal-wash)]">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;
                  <span className="font-semibold text-[var(--ink-black)]">{query}</span>&rdquo;
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="bg-white rounded-lg p-6 border border-[var(--border)]">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Validation Error State */}
        {validationError && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="font-montserrat text-xl font-semibold mb-2 text-red-800">
                Invalid Search Parameters
              </h2>
              <p className="text-red-700 mb-4">
                {validationError}
              </p>
              <Link
                href="/search"
                className="inline-block bg-[var(--moura-teal)] text-white px-6 py-2 rounded-md font-montserrat font-medium hover:brightness-110 transition-all"
              >
                Start New Search
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !validationError && (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)] mb-4">
              Unable to load search results. Please try again.
            </p>
            <button
              onClick={() => query && fetchResults(query)}
              className="bg-[var(--moura-teal)] text-white px-6 py-2 rounded-md font-montserrat font-medium hover:brightness-110 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-16 h-16 text-[var(--muted-foreground)] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="font-montserrat text-xl font-semibold mb-2 text-[var(--ink-black)]">
              No results found
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try different keywords.
            </p>
            <Link
              href="/"
              className="inline-block bg-[var(--moura-teal)] text-white px-6 py-2 rounded-md font-montserrat font-medium hover:brightness-110 transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Grouped Results */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <section key={type}>
                <h2
                  className="font-montserrat text-2xl font-semibold mb-6 text-[var(--ink-black)] flex items-center gap-3"
                >
                  {getTypeLabel(type)}
                  <span className="text-sm font-normal text-[var(--muted-foreground)]">
                    ({typeResults.length})
                  </span>
                </h2>

                <div className="space-y-4">
                  {typeResults.map((result) => (
                    <Link
                      key={result.content.id}
                      href={getContentLink(result.content)}
                      className="block group"
                    >
                      <article className="bg-white rounded-lg p-6 border border-[var(--border)] hover:shadow-md transition-all hover:border-[var(--moura-teal)]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Type Badge */}
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="text-xs font-montserrat font-semibold"
                                style={{ color: getContentColor(result.content.category) }}
                              >
                                {type.toUpperCase()}
                              </span>
                              {result.content.featured && (
                                <span className="text-xs bg-[var(--moura-teal)] text-white px-2 py-0.5 rounded">
                                  FEATURED
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="font-montserrat text-lg font-semibold mb-2 text-[var(--ink-black)] group-hover:text-[var(--moura-teal)] transition-colors">
                              <HighlightedText
                                text={result.content.title}
                                highlight={result.highlights?.title}
                              />
                            </h3>

                            {/* Description/Excerpt */}
                            <div className="font-lora text-sm text-[var(--charcoal-wash)] mb-3 line-clamp-2">
                              <HighlightedText
                                text={result.content.description ||
                                  ('abstract' in result.content ? result.content.abstract :
                                   'excerpt' in result.content ? result.content.excerpt :
                                   'artistStatement' in result.content ? result.content.artistStatement :
                                   'Brief description coming soon...')}
                                highlight={result.highlights?.description || result.highlights?.content}
                              />
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                              <span>{formatDate(result.content.date)}</span>
                              {result.content.tags.length > 0 && (
                                <>
                                  <span>·</span>
                                  <div className="flex gap-2">
                                    {result.content.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs bg-[var(--studio-cream)] px-2 py-1 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {result.content.tags.length > 3 && (
                                      <span className="text-xs">
                                        +{result.content.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <svg
                            className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-[var(--moura-teal)] transition-colors flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Empty State (no query) */}
        {!query && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-16 h-16 text-[var(--muted-foreground)] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="font-montserrat text-xl font-semibold mb-2 text-[var(--ink-black)]">
              Start your search
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Enter keywords to search across publications, artworks, musings, and projects.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-lora text-sm text-[var(--muted-foreground)]">
            © 2025 Moura Quayle. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

// Main component with Suspense wrapper
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--moura-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
