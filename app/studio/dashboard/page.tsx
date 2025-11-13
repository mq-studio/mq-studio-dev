'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: 'Musings',
      description: 'Manage blog posts and reflections',
      href: '/studio/content?type=musings',
      color: 'bg-blue-500',
      count: '76+',
    },
    {
      title: 'Artworks',
      description: 'Manage watercolor and visual art',
      href: '/studio/content?type=artworks',
      color: 'bg-purple-500',
      count: '107',
    },
    {
      title: 'Publications',
      description: 'Manage academic papers and articles',
      href: '/studio/content?type=publications',
      color: 'bg-green-500',
      count: '14',
    },
    {
      title: 'Projects',
      description: 'Manage professional projects',
      href: '/studio/content?type=projects',
      color: 'bg-orange-500',
      count: '5+',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">MQ Studio Dashboard</h1>
            <button
              onClick={() => router.push('/studio/login')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to MQ Studio CMS
          </h2>
          <p className="text-gray-600">
            Manage your content, media, and website settings from one central location.
          </p>
        </div>

        {/* Content Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${card.color} rounded-lg mb-4 opacity-10`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">{card.count}</span>
                  <span className="text-sm text-blue-600">Manage →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/studio/content/new?type=musings"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <span className="text-sm font-medium text-gray-900">
                + New Musing
              </span>
            </Link>
            <Link
              href="/studio/media"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <span className="text-sm font-medium text-gray-900">
                Upload Media
              </span>
            </Link>
            <Link
              href="/studio/settings"
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors text-center"
            >
              <span className="text-sm font-medium text-gray-900">
                Site Settings
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-sm text-gray-500">
            Activity tracking will be available once authentication is fully configured.
          </p>
        </div>
      </main>
    </div>
  );
}