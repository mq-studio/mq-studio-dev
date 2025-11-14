import { Feed } from 'feed';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * RSS Feed Generation for Musings
 *
 * Generates an RSS 2.0 feed of recent musings for syndication.
 * Accessible at: /musings/feed.xml
 *
 * Features:
 * - Includes last 20 musings (configurable)
 * - Extracts frontmatter metadata (title, date, excerpt, category)
 * - Proper RSS 2.0 format with required fields
 * - Cached for performance (revalidated every hour)
 */

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouraquayle.ca';
const SITE_TITLE = 'Moura Quayle - Musings';
const SITE_DESCRIPTION = 'Thoughts on urbanism, creativity, and leadership by Moura Quayle';
const AUTHOR_NAME = 'Moura Quayle';
const AUTHOR_EMAIL = process.env.CONTACT_EMAIL || 'moura@mouraquayle.ca';
const FEED_LIMIT = 20; // Number of recent posts to include

interface MusingFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  category?: 'thinking' | 'feeling' | 'doing';
  slug: string;
  draft?: boolean;
}

interface MusingData extends MusingFrontmatter {
  content: string;
  url: string;
}

/**
 * Get all musings from the file system
 */
function getMusings(): MusingData[] {
  const musingsDirectory = path.join(process.cwd(), 'content/musings');

  const files: string[] = [];

  // Recursively get all .mdx files
  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }

  walkDir(musingsDirectory);

  // Parse all musings
  const musings: MusingData[] = files.map(filePath => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as MusingFrontmatter;

    return {
      ...frontmatter,
      content,
      url: `${SITE_URL}/musings/${frontmatter.slug}`,
    };
  });

  // Filter out drafts and sort by date (most recent first)
  return musings
    .filter(musing => !musing.draft && musing.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, FEED_LIMIT);
}

/**
 * Generate RSS feed XML
 */
export async function GET() {
  try {
    const feed = new Feed({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      id: `${SITE_URL}/musings`,
      link: `${SITE_URL}/musings`,
      language: 'en',
      favicon: `${SITE_URL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR_NAME}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_URL}/musings/feed.xml`,
        atom: `${SITE_URL}/musings/feed.xml`,
      },
      author: {
        name: AUTHOR_NAME,
        email: AUTHOR_EMAIL,
        link: SITE_URL,
      },
    });

    // Get recent musings
    const musings = getMusings();

    // Add each musing to the feed
    for (const musing of musings) {
      const description = musing.excerpt || musing.content.slice(0, 200) + '...';

      feed.addItem({
        title: musing.title,
        id: musing.url,
        link: musing.url,
        description,
        content: musing.content,
        author: [
          {
            name: AUTHOR_NAME,
            email: AUTHOR_EMAIL,
            link: SITE_URL,
          },
        ],
        date: new Date(musing.date),
        category: musing.category ? [{ name: musing.category }] : [],
      });
    }

    // Generate RSS XML
    const rssXml = feed.rss2();

    // Return with proper headers
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

// Cache the feed for 1 hour in production
export const revalidate = 3600;
