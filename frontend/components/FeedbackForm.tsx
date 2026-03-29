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
        text: 'Thank you! Your feedback has been submitted successfully.',
      });

      setFormData({
        title: '',
        description: '',
        userEmail: '',
      });
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
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Feedback Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Brief summary of your feedback"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Provide details about your feedback"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
          Email (Optional)
        </label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="your@email.com"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
