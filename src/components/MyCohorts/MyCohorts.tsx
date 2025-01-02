import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { SavedCohort } from '../../types/savedCohort';
import { FilterState, Customer } from '../../types';
import { calculateCohortStats } from '../../utils/cohortStats';
import CohortCard from './CohortCard';
import SaveCohortModal from './SaveCohortModal';
import CohortAnalysisModal from './CohortAnalysisModal';

interface MyCohortsProps {
  currentFilters: FilterState;
  customers: Customer[];
}

export default function MyCohorts({ currentFilters, customers }: MyCohortsProps) {
  const [savedCohorts, setSavedCohorts] = useState<SavedCohort[]>(() => {
    const saved = localStorage.getItem('savedCohorts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<SavedCohort | null>(null);

  const handleSave = (name: string, description?: string) => {
    const stats = calculateCohortStats(customers);
    
    const newCohort: SavedCohort = {
      id: crypto.randomUUID(),
      name,
      description,
      dateCreated: new Date(),
      filters: currentFilters,
      stats: {
        totalCustomers: stats.totalCustomers,
        averageLifetimeMonths: stats.averageLifetimeMonths,
        churnRate: stats.churnRate,
        activeCustomers: stats.activeCustomers,
        churnedCustomers: stats.churnedCustomers
      }
    };

    const updatedCohorts = [...savedCohorts, newCohort];
    setSavedCohorts(updatedCohorts);
    localStorage.setItem('savedCohorts', JSON.stringify(updatedCohorts));
  };

  const handleDelete = (id: string) => {
    const updatedCohorts = savedCohorts.filter(cohort => cohort.id !== id);
    setSavedCohorts(updatedCohorts);
    localStorage.setItem('savedCohorts', JSON.stringify(updatedCohorts));
  };

  const handleCohortClick = (cohort: SavedCohort) => {
    setSelectedCohort(cohort);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Saved Analyses
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Current Analysis
        </button>
      </div>

      {savedCohorts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any saved analyses yet.
            <br />
            Save your first analysis to track changes over time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCohorts.map((cohort) => (
            <CohortCard
              key={cohort.id}
              cohort={cohort}
              onDelete={handleDelete}
              onClick={handleCohortClick}
            />
          ))}
        </div>
      )}

      <SaveCohortModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentFilters={currentFilters}
      />

      {selectedCohort && (
        <CohortAnalysisModal
          cohort={selectedCohort}
          isOpen={!!selectedCohort}
          onClose={() => setSelectedCohort(null)}
        />
      )}
    </div>
  );
}