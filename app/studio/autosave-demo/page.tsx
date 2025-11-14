'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAutosave } from '@/hooks/useAutosave';
import AutosaveIndicator, {
  FloatingAutosaveIndicator,
  InlineAutosaveStatus
} from '@/components/cms/AutosaveIndicator';

/**
 * Demo page showcasing the autosave system with visual indicators
 * This demonstrates the three different indicator styles and how they work
 */
export default function AutosaveDemoPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { status, lastSavedAt, triggerSave } = useAutosave({
    delay: 1000, // 1 second debounce
    savedDisplayDuration: 3000 // Show "saved" for 3 seconds
  });

  // Trigger autosave when content changes
  useEffect(() => {
    if (title || content) {
      triggerSave();
    }
  }, [title, content, triggerSave]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/studio/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Autosave System Demo
              </h1>
            </div>

            {/* Inline status in header */}
            <InlineAutosaveStatus status={status} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Explanation Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            How Autosave Works
          </h2>
          <p className="text-gray-700 mb-4">
            Start typing in the fields below. Your work is automatically saved as you type—no need to click any buttons. The autosave indicator will show you the save status in real-time.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#345D8A] font-bold">•</span>
              <span><strong>Saving...</strong> - Changes are being saved (with 1-second delay to avoid excessive saves)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span><strong>Saved</strong> - All your changes are safely stored</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 font-bold">•</span>
              <span><strong>No indicator</strong> - Idle, nothing to save</span>
            </li>
          </ul>
        </div>

        {/* Editor Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header with inline indicator */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Try It Out
              </h3>
              <AutosaveIndicator
                status={status}
                lastSavedAt={lastSavedAt}
                showTimestamp
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your musing a title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#345D8A] focus:border-transparent text-lg"
              />
            </div>

            {/* Content Field */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#345D8A] focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Indicator Styles Demo */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Indicator Styles
          </h3>

          <div className="space-y-6">
            {/* Standard Indicator */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Standard Indicator (with timestamp)
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <AutosaveIndicator
                  status={status}
                  lastSavedAt={lastSavedAt}
                  showTimestamp
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Best for: Form headers, toolbars
              </p>
            </div>

            {/* Inline Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Inline Status (compact)
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <InlineAutosaveStatus status={status} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Best for: Page headers, navigation bars
              </p>
            </div>

            {/* Floating Indicator Note */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Floating Indicator (fixed bottom-right)
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="text-sm text-gray-600">
                  Scroll down to see the floating indicator in action! It stays fixed at the bottom-right corner.
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Best for: Full-screen editors, minimal UI
              </p>
            </div>
          </div>
        </div>

        {/* Safety Reassurance */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>💾</span>
            Your Work is Safe
          </h3>
          <p className="text-gray-700">
            Every change you make is automatically saved after a 1-second pause in typing. We keep 30 days of backups, so you can always undo or restore previous versions. You can't accidentally lose your work.
          </p>
        </div>
      </div>

      {/* Floating Indicator */}
      <FloatingAutosaveIndicator status={status} lastSavedAt={lastSavedAt} />
    </div>
  );
}
