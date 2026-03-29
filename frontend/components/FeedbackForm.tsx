'use client';

import { useState } from 'react';
import { feedbackAPI } from '@/lib/api';

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await feedbackAPI.create({
        ...formData,
        userType: 'User',
      });

      setMessage({
        type: 'success',
        text: '✓ Thank you! Your feedback has been submitted and will be reviewed by our team.',
      });

      setFormData({
        title: '',
        description: '',
        userEmail: '',
      });

      // Hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.error ||
          'Failed to submit feedback. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          What's your feedback about?
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Login button is hard to find"
          maxLength={200}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Tell us more
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the issue, feature request, or improvement..."
          rows={5}
          maxLength={5000}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none placeholder:text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000</p>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="userEmail" className="block text-sm font-semibold text-gray-900 mb-2">
          Email <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          We'll use this only if we need to follow up about your feedback.
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border transition-all ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Submitting...
          </span>
        ) : (
          'Submit Feedback'
        )}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-600 text-center">
        Your feedback is secure and private. We never share your email with third parties.
      </p>
    </form>
  );
}
