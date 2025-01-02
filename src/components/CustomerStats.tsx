import React from 'react';
import { CustomerLifetimeStats } from '../types';
import { Clock, Users } from 'lucide-react';

interface CustomerStatsProps {
  stats: CustomerLifetimeStats;
}

export default function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Lifetime (Days)</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.averageLifetimeDays}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Lifetime (Months)</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.averageLifetimeMonths}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Churned Customers</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}