/**
 * Media Library Component
 * Interface for managing media files
 */

'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { User } from '@/lib/types/cms';

interface MediaLibraryProps {
  user: User;
}

export default function MediaLibrary({ user }: MediaLibraryProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">MQ Studio CMS</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/studio/login' })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <Link
              href="/studio/dashboard"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              href="/studio/content?type=musing"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Musings
            </Link>
            <Link
              href="/studio/content?type=artwork"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Artworks
            </Link>
            <Link
              href="/studio/content?type=publication"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Publications
            </Link>
            <Link
              href="/studio/content?type=project"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Projects
            </Link>
            <Link
              href="/studio/media"
              className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700"
            >
              Media Library
            </Link>
            <Link
              href="/studio/settings"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                + Upload Media
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Media library interface ready for implementation
                </p>
                <p className="text-sm text-gray-500">
                  This section will display uploaded images, audio files, and other media assets.
                </p>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                <h3 className="font-bold text-amber-900 mb-2">Features to Implement</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• File upload with progress tracking</li>
                  <li>• Image optimization and thumbnail generation</li>
                  <li>• Audio file management</li>
                  <li>• Media browser and picker</li>
                  <li>• Tag-based organization</li>
                  <li>• Bulk operations (delete, move, tag)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
