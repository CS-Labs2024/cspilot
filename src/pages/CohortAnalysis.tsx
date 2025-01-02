import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Upload, LogOut } from 'lucide-react'; // Importando o ícone de logout
import { Customer, FilterState } from '../types';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext'; // Importando o contexto de autenticação
import CustomerForm from '../components/CustomerForm';
import CustomerTable from '../components/CustomerTable';
import CohortMatrix from '../components/CohortMatrix';
import CustomerStats from '../components/CustomerStats';
import ChurnAnalysis from '../components/ChurnAnalysis';
import BulkUploadModal from '../components/BulkUploadModal';
import TierKPIsModal from '../components/TierKPIsModal';
import SegmentKPIsModal from '../components/SegmentKPIsModal';
import Filters from '../components/Filters';
import LTVGraph from '../components/LTVGraph';
import HelpButton from '../components/HelpButton';
import ThemeToggle from '../components/ThemeToggle';
import MyCohorts from '../components/MyCohorts/MyCohorts';
import { calculateCohortMatrix } from '../utils/cohortAnalysis';
import { calculateCustomerLifetimeStats } from '../utils/customerStats';
import { calculateChurnStats } from '../utils/churnAnalysis';
import { analyzeTierMetrics } from '../utils/tierAnalysis';

export default function CohortAnalysis() {
  const { earlyChurnMonths } = useConfig();
  const { signOut } = useAuth(); // Função de logout
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isTierKPIsOpen, setIsTierKPIsOpen] = useState(false);
  const [isSegmentKPIsOpen, setIsSegmentKPIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: '',
    },
    segment: '',
    tier: '',
  });

  const segments = useMemo(() => {
    const uniqueSegments = new Set(
      customers
        .map((customer) => customer.segment)
        .filter((segment): segment is string => !!segment)
    );
    return Array.from(uniqueSegments).sort();
  }, [customers]);

  const tiers = useMemo(() => {
    const uniqueTiers = new Set(
      customers
        .map((customer) => customer.tier)
        .filter((tier): tier is string => !!tier)
    );
    return Array.from(uniqueTiers).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const customerDate = new Date(customer.entryDate);
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : null;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : null;

      if (startDate && customerDate < startDate) return false;
      if (endDate && customerDate > endDate) return false;
      if (filters.segment && customer.segment !== filters.segment) return false;
      if (filters.tier && customer.tier !== filters.tier) return false;

      return true;
    });
  }, [customers, filters]);

  const handleAddCustomer = (newCustomer: Omit<Customer, 'id'>) => {
    setCustomers([...customers, { ...newCustomer, id: uuidv4() }]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(
      customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleBulkUpload = (newCustomers: Omit<Customer, 'id'>[]) => {
    const customersWithIds = newCustomers.map((customer) => ({
      ...customer,
      id: uuidv4(),
    }));
    setCustomers([...customers, ...customersWithIds]);
  };

  const cohortData = useMemo(
    () => calculateCohortMatrix(filteredCustomers),
    [filteredCustomers]
  );
  const lifetimeStats = useMemo(
    () => calculateCustomerLifetimeStats(filteredCustomers),
    [filteredCustomers]
  );
  const churnStats = useMemo(
    () => calculateChurnStats(filteredCustomers, earlyChurnMonths),
    [filteredCustomers, earlyChurnMonths]
  );
  const tierAnalysis = useMemo(
    () => analyzeTierMetrics(filteredCustomers),
    [filteredCustomers]
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cohort Analysis
          </h1>
          <div className="flex items-center space-x-4">
            <HelpButton />
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {filteredCustomers.length} Customers
              </span>
            </div>
            <button
              onClick={() => setIsTierKPIsOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Tier Analysis
            </button>
            <button
              onClick={() => setIsBulkUploadOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Upload className="w-5 h-5 mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>

        <Filters
          filters={filters}
          onFilterChange={setFilters}
          segments={segments}
          tiers={tiers}
        />

        <CustomerStats stats={lifetimeStats} />
        <ChurnAnalysis
          stats={churnStats}
          onOpenSegmentAnalysis={() => setIsSegmentKPIsOpen(true)}
        />
        <CustomerForm
          onSubmit={handleAddCustomer}
          segments={segments}
          tiers={tiers}
        />

        {filteredCustomers.length > 0 && (
          <>
            <CustomerTable
              customers={filteredCustomers}
              onDelete={handleDeleteCustomer}
              onUpdate={handleUpdateCustomer}
              segments={segments}
              tiers={tiers}
            />
            <CohortMatrix data={cohortData} />
            <LTVGraph customers={filteredCustomers} />
            <MyCohorts currentFilters={filters} customers={filteredCustomers} />
          </>
        )}

        {filteredCustomers.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {customers.length === 0
                ? 'Add your first customer to start cohort analysis'
                : 'No customers match the selected filters'}
            </p>
          </div>
        )}

        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
          onUpload={handleBulkUpload}
        />

        <TierKPIsModal
          isOpen={isTierKPIsOpen}
          onClose={() => setIsTierKPIsOpen(false)}
          tiers={tierAnalysis.tiers}
          totalCustomers={tierAnalysis.totalCustomers}
        />

        <SegmentKPIsModal
          isOpen={isSegmentKPIsOpen}
          onClose={() => setIsSegmentKPIsOpen(false)}
          stats={churnStats}
        />
      </div>
    </div>
  );
}
