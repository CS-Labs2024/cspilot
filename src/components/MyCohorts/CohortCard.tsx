import React from 'react';
import { Calendar, Users, Clock, TrendingDown, Trash2 } from 'lucide-react';
import { SavedCohort } from '../../types/savedCohort';

interface CohortCardProps {
  cohort: SavedCohort;
  onDelete: (id: string) => void;
  onClick: (cohort: SavedCohort) => void;
}

export default function CohortCard({ cohort, onDelete, onClick }: CohortCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(cohort)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {cohort.name}
          </h3>
          {cohort.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {cohort.description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cohort.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete analysis"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(cohort.dateCreated).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Users className="w-4 h-4 mr-2" />
          {cohort.stats.totalCustomers} customers
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Lifetime</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {cohort.stats.averageLifetimeMonths} months
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <div className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Churn Rate</p>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {cohort.stats.churnRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}