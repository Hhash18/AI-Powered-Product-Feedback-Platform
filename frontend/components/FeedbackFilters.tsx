'use client';

interface FiltersProps {
  onFilterChange: (filters: {
    status?: string;
    category?: string;
    priority?: string;
    sort?: string;
  }) => void;
}

export function FeedbackFilters({ onFilterChange }: FiltersProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value || undefined });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value || undefined });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ priority: e.target.value || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sort: e.target.value || 'newest' });
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <h3 className="font-semibold text-lg">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            onChange={handleStatusChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Improvement">Improvement</option>
            <option value="Documentation">Documentation</option>
            <option value="Performance">Performance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            onChange={handlePriorityChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            onChange={handleSortChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            defaultValue="newest"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
