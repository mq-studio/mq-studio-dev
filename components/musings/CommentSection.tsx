'use client';

import { useEffect, useRef } from 'react';

interface CommentSectionProps {
  slug: string;
  title: string;
}

export default function CommentSection({ slug, title }: CommentSectionProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commentsRef.current) return;

    // Clear any existing Giscus instance
    commentsRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';

    // Get repository details from environment or use defaults
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || 'mq-studio/mq-studio-dev';
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Musings';
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';

    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    commentsRef.current.appendChild(script);
  }, [slug]);

  return (
    <section className="mt-12 pt-12 border-t border-[var(--border)]">
      <h2 className="font-montserrat text-2xl font-semibold text-[var(--ink-black)] mb-6">
        Comments
      </h2>
      <div className="bg-white rounded-lg border border-[var(--border)] p-6">
        <div ref={commentsRef} />
      </div>
    </section>
  );
}
