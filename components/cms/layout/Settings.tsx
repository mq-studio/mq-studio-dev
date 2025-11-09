/**
 * Settings Component
 * Interface for managing CMS settings
 */

'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { User } from '@/lib/types/cms';

interface SettingsProps {
  user: User;
}

export default function Settings({ user }: SettingsProps) {
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
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Media Library
            </Link>
            <Link
              href="/studio/settings"
              className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="MQ Studio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      defaultValue="Content Management System"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" disabled />
                    <span className="ml-2 text-gray-700">Enable Comments</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" defaultChecked disabled />
                    <span className="ml-2 text-gray-700">Enable Analytics</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" disabled />
                    <span className="ml-2 text-gray-700">Auto-publish on Schedule</span>
                  </label>
                </div>
              </div>

              {/* User Management */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users</h3>
                <p className="text-gray-600 mb-4">
                  Manage CMS user accounts and permissions
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  + Add User
                </button>
              </div>

              {/* Backup & Export */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Backup & Export</h3>
                <p className="text-gray-600 mb-4">
                  Export your content or create backups
                </p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Export All Content
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Create Backup
                  </button>
                </div>
              </div>

              {/* Development Notes */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-900 mb-2">Development Status</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Settings management endpoints ready for implementation</li>
                  <li>• User authentication framework in place</li>
                  <li>• Backup/export functionality to be implemented</li>
                  <li>• API integration pending</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
