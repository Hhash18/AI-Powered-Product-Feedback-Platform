'use client';

import { FeedbackForm } from '@/components/FeedbackForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FeedPulse</h1>
          <p className="text-xl text-gray-600">
            Share your feedback and help us build better products
          </p>
          <p className="text-gray-500 mt-2">
            Your feedback is analyzed by AI to prioritize the most impactful improvements
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Submit Your Feedback
            </h2>
            <p className="text-gray-600 mt-2">
              Help us understand what matters most to you
            </p>
          </div>

          <FeedbackForm />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>✓ Your feedback is automatically categorized using AI</li>
              <li>✓ Feedback is prioritized by potential impact</li>
              <li>✓ Our team reviews and acts on the highest-priority items</li>
              <li>✓ You can check our dashboard to see community feedback</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Want to see all feedback?{' '}
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Dashboard
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
