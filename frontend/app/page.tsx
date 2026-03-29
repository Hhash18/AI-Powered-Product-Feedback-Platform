'use client';

import { FeedbackForm } from '@/components/FeedbackForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FeedPulse</span>
          </div>
          <a
            href="/dashboard"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Dashboard
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Your Voice Matters
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Share your feedback and shape the future of our product
            </p>
          </div>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every piece of feedback is reviewed by our team and analyzed using AI to identify the most impactful improvements
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Share Your Feedback
                </h2>
                <p className="text-gray-600">
                  Tell us what you think. It takes just a minute.
                </p>
              </div>

              <FeedbackForm />
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Why Feedback Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why it matters</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">🎯</span>
                  <span className="text-gray-700">Your ideas help us build better features</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">⚡</span>
                  <span className="text-gray-700">AI analyzes patterns in feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">👥</span>
                  <span className="text-gray-700">Community-driven product roadmap</span>
                </li>
              </ul>
            </div>

            {/* Privacy Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-sm text-gray-700 mb-3">
                Your email is optional and will never be shared or used for marketing.
              </p>
              <p className="text-xs text-gray-600">
                All feedback is stored securely and handled with care.
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">12,400+</p>
              <p className="text-sm text-gray-700">Pieces of feedback analyzed</p>
              <a
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block"
              >
                View Dashboard →
              </a>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Happens With Your Feedback
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">You Submit</h4>
              <p className="text-sm text-gray-600">
                Share your feedback in seconds without signing up
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-gray-300 text-2xl">→</div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI Analyzes</h4>
              <p className="text-sm text-gray-600">
                Automatically categorized and prioritized using AI
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-gray-300 text-2xl">→</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">We Review</h4>
              <p className="text-sm text-gray-600">
                Our team prioritizes action items by impact
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Curious about other feedback? Check out our dashboard to see what the community is saying.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            View All Feedback →
          </a>
        </div>
      </div>
    </main>
  );
}
