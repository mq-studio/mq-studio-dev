'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { AutosaveStatus } from '@/hooks/useAutosave';

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  lastSavedAt?: Date | null;
  className?: string;
  showTimestamp?: boolean;
}

/**
 * Visual indicator for autosave status
 * Provides calming reassurance that work is being saved automatically
 *
 * States:
 * - idle: Quiet state, no indicator shown
 * - saving: Animated spinner with "Saving..." text
 * - saved: Green checkmark with "Saved" text
 * - error: Red alert icon with "Save failed" text
 *
 * @example
 * const { status, lastSavedAt } = useAutosave();
 * return <AutosaveIndicator status={status} lastSavedAt={lastSavedAt} />;
 */
export default function AutosaveIndicator({
  status,
  lastSavedAt,
  className = '',
  showTimestamp = true
}: AutosaveIndicatorProps) {
  const [relativeTime, setRelativeTime] = useState<string>('');

  // Update relative time every minute
  useEffect(() => {
    if (!lastSavedAt || !showTimestamp) return;

    const updateRelativeTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastSavedAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        setRelativeTime('just now');
      } else if (diffMins === 1) {
        setRelativeTime('1 minute ago');
      } else if (diffMins < 60) {
        setRelativeTime(`${diffMins} minutes ago`);
      } else {
        const hours = Math.floor(diffMins / 60);
        setRelativeTime(hours === 1 ? '1 hour ago' : `${hours} hours ago`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSavedAt, showTimestamp]);

  // Don't render anything in idle state
  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${className}`}
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 text-[#345D8A] animate-spin" aria-hidden="true" />
          <span className="text-gray-600">Saving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <div className="flex items-center gap-1.5 text-green-600">
            <Check className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">Saved</span>
          </div>
          {showTimestamp && relativeTime && (
            <span className="text-gray-500 text-xs">{relativeTime}</span>
          )}
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span className="text-red-600 font-medium">Save failed</span>
          <button
            className="text-xs text-red-600 underline hover:text-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Compact floating autosave indicator for fixed positioning
 * Perfect for editors where you want a persistent, non-intrusive indicator
 */
export function FloatingAutosaveIndicator({
  status,
  lastSavedAt,
  className = ''
}: Omit<AutosaveIndicatorProps, 'showTimestamp'>) {
  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50 transition-all duration-300 ${className}`}
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 text-[#345D8A] animate-spin" aria-hidden="true" />
          <span className="text-sm text-gray-700">Saving</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
          <span className="text-sm text-green-700 font-medium">Saved</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span className="text-sm text-red-600 font-medium">Failed</span>
        </>
      )}
    </div>
  );
}

/**
 * Inline autosave status for form headers
 * Compact design that fits well in toolbars and headers
 */
export function InlineAutosaveStatus({
  status,
  className = ''
}: Pick<AutosaveIndicatorProps, 'status' | 'className'>) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <Cloud className={`w-3.5 h-3.5 ${
        status === 'saved' ? 'text-green-500' :
        status === 'saving' ? 'text-blue-500' :
        status === 'error' ? 'text-red-500' :
        'text-gray-400'
      }`} aria-hidden="true" />

      {status === 'saving' && (
        <span className="text-gray-600 animate-pulse">Saving</span>
      )}

      {status === 'saved' && (
        <span className="text-green-600 font-medium">All changes saved</span>
      )}

      {status === 'error' && (
        <span className="text-red-600">Not saved</span>
      )}

      {status === 'idle' && (
        <span className="text-gray-500">Autosave enabled</span>
      )}
    </div>
  );
}
