'use client';

import { useState, useEffect } from 'react';
import { feedbackAPI } from '@/lib/api';
import { IFeedback } from '@/types/feedback';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { FeedbackList } from '@/components/FeedbackList';
import { FeedbackFilters } from '@/components/FeedbackFilters';

interface AnalyticsData {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

interface UpdatedFeedbackItem extends IFeedback {
  _id: string;
}

export default function Dashboard() {
  const [feedback, setFeedback] = useState<UpdatedFeedbackItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState<'feedback' | 'analytics' | 'insights'>('feedback');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [feedbackData, analyticsData] = await Promise.all([
        feedbackAPI.getAll(filters),
        feedbackAPI.getAnalytics(),
      ]);

      setFeedback(feedbackData.feedback || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const data = await feedbackAPI.getInsights();
      setInsights(data.insights);
      setActiveTab('insights');
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleUpdate = async (
    id: string,
    status: string,
    priority: string,
    category: string
  ) => {
    try {
      await feedbackAPI.update(id, { status, priority, category });
      loadData();
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and analyze product feedback</p>
            </div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Submit
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'feedback'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Feedback ({feedback.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => {
              loadInsights();
            }}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'insights'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            AI Insights
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Feedback Tab */}
        {!isLoading && activeTab === 'feedback' && (
          <div className="space-y-6">
            <FeedbackFilters onFilterChange={setFilters} />
            <FeedbackList
              feedback={feedback}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* Analytics Tab */}
        {!isLoading && activeTab === 'analytics' && analytics && (
          <div>
            <AnalyticsDashboard data={analytics} />
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              AI-Generated Insights
            </h2>
            {insights ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{insights}</p>
              </div>
            ) : (
              <p className="text-gray-600">
                Load insights to see AI analysis of all feedback...
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
