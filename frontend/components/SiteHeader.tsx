'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(auth.isAuthenticated());
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-gray-900">FeedPulse</span>
        </a>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <a
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Admin Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
