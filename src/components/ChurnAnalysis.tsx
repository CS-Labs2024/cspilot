import React from 'react';
import { AlertCircle, Users } from 'lucide-react';
import { ChurnStats } from '../types/churn';
import { useConfig } from '../contexts/ConfigContext';
import EarlyChurnConfig from './EarlyChurnConfig';

interface ChurnAnalysisProps {
  stats: ChurnStats;
  onOpenSegmentAnalysis: () => void;
}

export default function ChurnAnalysis({ stats, onOpenSegmentAnalysis }: ChurnAnalysisProps) {
  const { earlyChurnMonths } = useConfig();

  return (
    <div className="mt-8 space-y-6">
      {/* Early Churn Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Early Churn Analysis (Primeiros {earlyChurnMonths} Meses)
          </h3>
          <EarlyChurnConfig />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">{stats.earlyChurn.count}</div>
            <div className="text-sm text-red-600">Clientes em Early Churn</div>
          </div>
          <div className="flex-1 bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">{stats.earlyChurn.percentage}%</div>
            <div className="text-sm text-red-600">Taxa de Early Churn</div>
          </div>
        </div>
      </div>

      {/* Segment Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Visão Geral por Segmento
          </h3>
          <button
            onClick={onOpenSegmentAnalysis}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ver Análise Detalhada
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.segmentChurn)
            .slice(0, 3)
            .map(([segment, data]) => (
              <div key={segment} className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">{segment}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-blue-600 font-semibold">{data.total}</div>
                    <div className="text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-red-600 font-semibold">{data.percentage}%</div>
                    <div className="text-gray-500">Churn</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}