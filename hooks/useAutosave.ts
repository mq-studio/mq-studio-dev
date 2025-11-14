'use client';

import { useState, useEffect, useCallback } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions {
  /**
   * Debounce delay in milliseconds before triggering autosave
   * @default 1000
   */
  delay?: number;

  /**
   * How long to show the "saved" status before returning to idle
   * @default 2000
   */
  savedDisplayDuration?: number;
}

interface UseAutosaveReturn {
  status: AutosaveStatus;
  lastSavedAt: Date | null;
  triggerSave: () => void;
  markSaved: () => void;
  markError: (error?: Error) => void;
  reset: () => void;
}

/**
 * Hook for managing autosave state and visual indicators
 * Works with TinaCMS's built-in autosave by providing visual feedback
 *
 * @example
 * const { status, lastSavedAt, triggerSave } = useAutosave();
 *
 * // Trigger on form changes
 * useEffect(() => {
 *   if (formHasChanges) {
 *     triggerSave();
 *   }
 * }, [formValues, triggerSave]);
 */
export function useAutosave(options: UseAutosaveOptions = {}): UseAutosaveReturn {
  const {
    delay = 1000,
    savedDisplayDuration = 2000
  } = options;

  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [statusTimer, setStatusTimer] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
      if (statusTimer) clearTimeout(statusTimer);
    };
  }, [saveTimer, statusTimer]);

  /**
   * Trigger the autosave process (debounced)
   */
  const triggerSave = useCallback(() => {
    // Clear existing save timer
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Set status to saving
    setStatus('saving');

    // Debounce the actual save
    const timer = setTimeout(() => {
      // In TinaCMS, the actual save happens automatically
      // This hook just provides the visual feedback
      setStatus('saved');
      setLastSavedAt(new Date());

      // Return to idle after display duration
      const statusT = setTimeout(() => {
        setStatus('idle');
      }, savedDisplayDuration);
      setStatusTimer(statusT);
    }, delay);

    setSaveTimer(timer);
  }, [delay, savedDisplayDuration, saveTimer]);

  /**
   * Manually mark as saved (for external save operations)
   */
  const markSaved = useCallback(() => {
    if (saveTimer) clearTimeout(saveTimer);
    if (statusTimer) clearTimeout(statusTimer);

    setStatus('saved');
    setLastSavedAt(new Date());

    const timer = setTimeout(() => {
      setStatus('idle');
    }, savedDisplayDuration);
    setStatusTimer(timer);
  }, [saveTimer, statusTimer, savedDisplayDuration]);

  /**
   * Mark as error state
   */
  const markError = useCallback((error?: Error) => {
    if (saveTimer) clearTimeout(saveTimer);
    if (statusTimer) clearTimeout(statusTimer);

    setStatus('error');

    if (error) {
      console.error('Autosave error:', error);
    }

    // Auto-clear error after 5 seconds
    const timer = setTimeout(() => {
      setStatus('idle');
    }, 5000);
    setStatusTimer(timer);
  }, [saveTimer, statusTimer]);

  /**
   * Reset to idle state
   */
  const reset = useCallback(() => {
    if (saveTimer) clearTimeout(saveTimer);
    if (statusTimer) clearTimeout(statusTimer);
    setStatus('idle');
  }, [saveTimer, statusTimer]);

  return {
    status,
    lastSavedAt,
    triggerSave,
    markSaved,
    markError,
    reset
  };
}
