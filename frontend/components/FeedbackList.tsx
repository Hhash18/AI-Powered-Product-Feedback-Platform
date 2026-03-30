'use client';

import { IFeedback } from '@/types/feedback';

interface FeedbackListProps {
  feedback: IFeedback[];
  onUpdate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function FeedbackList({
  feedback,
  onUpdate,
  onDelete,
}: FeedbackListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'Positive':
        return { emoji: '😊', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
      case 'Negative':
        return { emoji: '😞', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
      case 'Neutral':
      default:
        return { emoji: '😐', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div
          key={item._id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>
                {item.sentiment && (
                  <div className={`text-2xl p-1 rounded ${getSentimentBadge(item.sentiment).bg} border ${getSentimentBadge(item.sentiment).border}`}>
                    {getSentimentBadge(item.sentiment).emoji}
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-1">{item.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority || 'Medium')}`}>
                  {item.priority || 'Medium'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {item.category || 'Uncategorized'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status || 'New')}`}>
                  {item.status || 'New'}
                </span>
                {item.priorityScore && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Score: {item.priorityScore}/10
                  </span>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {item.summary && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  <strong>AI Summary:</strong> {item.summary}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500 space-y-1">
                {item.userName && <p>From: <strong>{item.userName}</strong></p>}
                {item.userEmail && <p>Email: {item.userEmail}</p>}
                <p>
                  Submitted {new Date(item.createdAt).toLocaleDateString()}{' '}
                  at {new Date(item.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            {(onUpdate || onDelete) && (
              <div className="ml-4 flex gap-2">
                {onUpdate && (
                  <button
                    onClick={() => onUpdate(item._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
