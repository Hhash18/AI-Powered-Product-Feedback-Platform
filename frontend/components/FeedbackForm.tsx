'use client';

import { useState } from 'react';
import { feedbackAPI } from '@/lib/api';

interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
}

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Improvement',
    userName: '',
    userEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await feedbackAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        userEmail: formData.userEmail.trim() || undefined,
        userType: 'User',
      });

      setMessage({
        type: 'success',
        text: '✓ Thank you! Your feedback has been submitted and will be reviewed by our team.',
      });

      setFormData({
        title: '',
        description: '',
        category: 'Improvement',
        userName: '',
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

  const isFormValid =
    formData.title.trim().length > 0 &&
    formData.description.trim().length >= 20 &&
    formData.category;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          What's your feedback about? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Login button is hard to find"
          maxLength={200}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none placeholder:text-gray-500 ${
            errors.title
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
        />
        <div className="flex justify-between items-start mt-1">
          <p className="text-xs text-red-500 font-medium">
            {errors.title ? errors.title : ' '}
          </p>
          <p className="text-xs text-gray-500">{formData.title.length}/200</p>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Tell us more <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue, feature request, or improvement... (minimum 20 characters)"
          rows={5}
          maxLength={5000}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none placeholder:text-gray-500 ${
            errors.description
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
        />
        <div className="flex justify-between items-start mt-1">
          <p className="text-xs text-red-500 font-medium">
            {errors.description ? errors.description : ' '}
          </p>
          <p className={`text-xs ${formData.description.trim().length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {formData.description.length}/5000
          </p>
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
            errors.category
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
        >
          <option value="">Select a category</option>
          <option value="Bug">🐛 Bug</option>
          <option value="Feature Request">✨ Feature Request</option>
          <option value="Improvement">⬆️ Improvement</option>
          <option value="Other">📌 Other</option>
        </select>
        <p className="text-xs text-red-500 font-medium mt-1">
          {errors.category ? errors.category : ' '}
        </p>
      </div>

      {/* Name Field (Optional) */}
      <div>
        <label htmlFor="userName" className="block text-sm font-semibold text-gray-900 mb-2">
          Name <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Your name"
          maxLength={100}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-500"
        />
      </div>

      {/* Email Field (Optional) */}
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
        disabled={isLoading || !isFormValid}
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

      {/* Required Fields Note */}
      <p className="text-xs text-gray-500 text-center">
        <span className="text-red-500">*</span> Required fields
      </p>
    </form>
  );
}
