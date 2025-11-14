'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type ContentType = 'musings' | 'artworks' | 'publications' | 'projects';

interface ContentItem {
  slug: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ContentManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>(
    (searchParams.get('type') as ContentType) || 'musings'
  );
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // For now, show sample data
    // In production, this would fetch from the API
    setContent([
      {
        slug: 'sample-1',
        title: 'Sample Content 1',
        description: 'This is sample content for demonstration',
        status: 'published',
        createdAt: new Date().toISOString(),
      },
      {
        slug: 'sample-2',
        title: 'Sample Content 2',
        description: 'Another sample item',
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [contentType]);

  const filteredContent = content.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your {contentType}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/studio/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </Link>
              <Link
                href={`/studio/content/new?type=${contentType}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + New {contentType.slice(0, -1)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => {
                  setContentType(e.target.value as ContentType);
                  router.push(`/studio/content?type=${e.target.value}`);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="musings">Musings</option>
                <option value="artworks">Artworks</option>
                <option value="publications">Publications</option>
                <option value="projects">Projects</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredContent.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No content found</p>
              <Link
                href={`/studio/content/new?type=${contentType}`}
                className="text-blue-600 hover:text-blue-700"
              >
                Create your first {contentType.slice(0, -1)}
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr key={item.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/${contentType}/${item.slug}`}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/studio/content/${item.slug}/edit?type=${contentType}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}