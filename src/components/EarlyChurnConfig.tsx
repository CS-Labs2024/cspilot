import React from 'react';
import { Settings } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function EarlyChurnConfig() {
  const { earlyChurnMonths, setEarlyChurnMonths } = useConfig();

  return (
    <div className="flex items-center space-x-2">
      <Settings className="w-5 h-5 text-gray-500" />
      <label className="text-sm text-gray-600">
        Período Early Churn (meses):
      </label>
      <input
        type="number"
        min="1"
        max="12"
        value={earlyChurnMonths}
        onChange={(e) => setEarlyChurnMonths(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}