import React from 'react';
import { X, Calendar, Users, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SavedCohort } from '../../types/savedCohort';

interface CohortAnalysisModalProps {
  cohort: SavedCohort;
  isOpen: boolean;
  onClose: () => void;
}

export default function CohortAnalysisModal({ cohort, isOpen, onClose }: CohortAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cohort.name}
              </h2>
              {cohort.description && (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {cohort.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Date and Basic Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {new Date(cohort.dateCreated).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {cohort.stats.totalCustomers} customers
              </div>
            </div>

            {/* Filters Applied */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Applied Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Range</p>
                  <p className="mt-1">
                    {cohort.filters.dateRange.start || 'Start'} to {cohort.filters.dateRange.end || 'Present'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Segment</p>
                  <p className="mt-1">{cohort.filters.segment || 'All Segments'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tier</p>
                  <p className="mt-1">{cohort.filters.tier || 'All Tiers'}</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Average Lifetime
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  {cohort.stats.averageLifetimeMonths} months
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Churn Rate
                  </h4>
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-red-700 dark:text-red-300">
                  {cohort.stats.churnRate}%
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                    Retention Rate
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-green-700 dark:text-green-300">
                  {100 - cohort.stats.churnRate}%
                </p>
              </div>
            </div>

            {/* Retention Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Retention Progress
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-600 dark:bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${100 - cohort.stats.churnRate}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Active Customers: {cohort.stats.totalCustomers * (100 - cohort.stats.churnRate) / 100}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Total: {cohort.stats.totalCustomers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}