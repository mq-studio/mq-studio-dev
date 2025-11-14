'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = 'welcome' | 'quickWin' | 'dashboard';

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [draftTitle, setDraftTitle] = useState('');

  const steps: Step[] = ['welcome', 'quickWin', 'dashboard'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('quickWin');
    } else if (currentStep === 'quickWin') {
      setCurrentStep('dashboard');
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-[#345D8A] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#345D8A] bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to your creative studio, Moura
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                This is a safe space for your thoughts, art, and scholarly work. You can't break anything here—everything is saved, versioned, and easily undone.
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">💾</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-saves everything</h3>
                    <p className="text-sm text-gray-600">Your work is constantly saved as you type</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Simple and elegant</h3>
                    <p className="text-sm text-gray-600">Focus on content, not complicated tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Undo anything</h3>
                    <p className="text-sm text-gray-600">We keep 30 days of backups, just in case</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'quickWin' && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Let's create your first draft
                </h2>
                <p className="text-gray-600">
                  Just add a title to get started. Everything else is optional.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label htmlFor="draft-title" className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <input
                    id="draft-title"
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="A title that captures your thoughts..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#345D8A] focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>

                {draftTitle && (
                  <div className="flex items-center gap-2 text-sm text-green-600 animate-fade-in">
                    <span className="animate-pulse">✓</span>
                    <span>Saving automatically...</span>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">Pro tip</p>
                  <p>Your drafts are private until you choose to publish. Take your time.</p>
                </div>
              </div>

              {draftTitle && (
                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <span className="text-2xl">🎉</span>
                    <span className="font-medium">Your first musing is safely saved!</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'dashboard' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🏠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your studio is ready
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Here's what you can do from your dashboard:
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Recent & Drafts</h3>
                  <p className="text-sm text-gray-600">
                    Pick up where you left off with your latest work
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Templates</h3>
                  <p className="text-sm text-gray-600">
                    Start with pre-formatted templates for common content
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Search Everything</h3>
                  <p className="text-sm text-gray-600">
                    Find any content instantly across all your work
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">💬</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Help Anytime</h3>
                  <p className="text-sm text-gray-600">
                    Look for the <span className="text-[#345D8A]">?</span> icon for contextual help
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-6 max-w-lg mx-auto">
                <p className="text-gray-800 italic">
                  "The studio is not just a place but a practice—where the academic and the artistic refuse to be separated."
                </p>
                <p className="text-sm text-gray-600 mt-2">— Your creative space awaits</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-[#345D8A] text-white rounded-lg font-medium hover:bg-[#2a4a6e] transition-colors shadow-sm"
          >
            {currentStep === 'dashboard' ? 'Start Creating' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
