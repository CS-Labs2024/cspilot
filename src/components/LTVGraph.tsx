import React from 'react';
import { BarChart, Calendar } from 'lucide-react';
import { Customer } from '../types';
import { calculateMonthsBetween } from '../utils/dateUtils';

interface LTVGraphProps {
  customers: Customer[];
}

export default function LTVGraph({ customers }: LTVGraphProps) {
  const calculateLTVData = () => {
    const monthlyData: { [key: string]: { count: number; months: number; active: number } } = {};
    const now = new Date();
    
    customers.forEach(customer => {
      const entryDate = new Date(customer.entryDate);
      const monthYear = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      const months = customer.exitDate 
        ? calculateMonthsBetween(entryDate, new Date(customer.exitDate))
        : calculateMonthsBetween(entryDate, now);

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, months: 0, active: 0 };
      }
      
      monthlyData[monthYear].count++;
      monthlyData[monthYear].months += months;
      if (!customer.exitDate) {
        monthlyData[monthYear].active++;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        avgMonths: Math.round(data.months / data.count),
        totalCustomers: data.count,
        activeCustomers: data.active,
        retentionRate: Math.round((data.active / data.count) * 100)
      }));
  };

  const data = calculateLTVData();
  const maxValue = Math.max(...data.map(d => d.avgMonths));
  const chartHeight = 200;

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold">Average Customer Lifetime by Cohort</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Monthly cohorts</span>
        </div>
      </div>

      <div className="relative h-[200px]">
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="w-10 text-right pr-2">
              {Math.round((maxValue * (4 - i)) / 4)}m
            </span>
          ))}
        </div>

        <div className="ml-12 h-full flex items-end space-x-2">
          {data.map(({ period, avgMonths, totalCustomers, activeCustomers, retentionRate }) => {
            const height = (avgMonths / maxValue) * chartHeight;
            return (
              <div
                key={period}
                className="group flex flex-col items-center flex-1 min-w-[30px] max-w-[40px] relative"
              >
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  <div className="font-medium">{period}</div>
                  <div>Average: {avgMonths} months</div>
                  <div>Total: {totalCustomers} customers</div>
                  <div>Active: {activeCustomers} customers</div>
                  <div>Retention: {retentionRate}%</div>
                </div>
                <div
                  className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-colors cursor-pointer"
                  style={{ height: `${height}px` }}
                />
                <div className="mt-2 text-xs text-gray-500 -rotate-45 origin-top-left whitespace-nowrap transform translate-y-4">
                  {period}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.length > 0 && (
          <>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Latest Cohort Size</div>
              <div className="text-xl font-semibold text-blue-700">
                {data[data.length - 1].totalCustomers} customers
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Latest Active Rate</div>
              <div className="text-xl font-semibold text-green-700">
                {data[data.length - 1].retentionRate}%
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Average Lifetime</div>
              <div className="text-xl font-semibold text-purple-700">
                {Math.round(data.reduce((sum, d) => sum + d.avgMonths, 0) / data.length)} months
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Total Cohorts</div>
              <div className="text-xl font-semibold text-orange-700">
                {data.length}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}