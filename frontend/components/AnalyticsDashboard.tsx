'use client';

interface AnalyticsData {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Total Feedback */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <p className="text-sm opacity-90">Total Feedback</p>
        <p className="text-4xl font-bold">{data.total}</p>
      </div>

      {/* Status Distribution */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-lg mb-4">By Status</h3>
        <div className="space-y-2">
          {Object.entries(data.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-gray-600">{status}</span>
              <div className="flex items-center gap-2">
                <div className="w-40 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(count / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-lg mb-4">By Category</h3>
        <div className="space-y-2">
          {Object.entries(data.byCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-600">{category}</span>
              <div className="flex items-center gap-2">
                <div className="w-40 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(count / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-lg mb-4">By Priority</h3>
        <div className="space-y-2">
          {Object.entries(data.byPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <span className="text-gray-600">{priority}</span>
              <div className="flex items-center gap-2">
                <div className="w-40 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'Critical'
                        ? 'bg-red-500'
                        : priority === 'High'
                          ? 'bg-orange-500'
                          : priority === 'Medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                    }`}
                    style={{
                      width: `${(count / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
