"use client";

import { useEffect, useState } from "react";

interface FiltersState {
    status?: string;
    category?: string;
    priority?: string;
    sort?: string;
}

interface FiltersProps {
    onFilterChange: (filters: FiltersState) => void;
}

export function FeedbackFilters({ onFilterChange }: FiltersProps) {
    const [filters, setFilters] = useState<FiltersState>({
        sort: "newest",
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, status: e.target.value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, category: e.target.value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, priority: e.target.value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, sort: e.target.value || "newest" };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = { sort: "newest" };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Filters & Sort</h3>
                <button onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Reset Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                        value={filters.status || ""}
                        onChange={handleStatusChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                        value={filters.category || ""}
                        onChange={handleCategoryChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                        <option value="">All Categories</option>
                        <option value="Bug">🐛 Bug</option>
                        <option value="Feature Request">✨ Feature Request</option>
                        <option value="Improvement">⬆️ Improvement</option>
                        <option value="Other">📌 Other</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                        value={filters.priority || ""}
                        onChange={handlePriorityChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                        <option value="">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                        value={filters.sort || "newest"}
                        onChange={handleSortChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
