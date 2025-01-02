import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Customer } from '../types';
import { parseCSVData } from '../utils/csvParser';
import { DateFormat, DATE_FORMATS } from '../utils/dateFormats';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (customers: Omit<Customer, 'id'>[]) => void;
}

export default function BulkUploadModal({ isOpen, onClose, onUpload }: BulkUploadModalProps) {
  const [preview, setPreview] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [invalidRows, setInvalidRows] = useState<Array<{
    line: number;
    content: string;
    reason: string;
  }> | null>(null);
  const [dateFormat, setDateFormat] = useState<DateFormat>('DD/MM/YYYY');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setInvalidRows(null);
    
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, envie um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => line.split(',').map(cell => cell.trim()));
      setPreview(lines);
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo');
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (preview.length === 0) {
      setError('Por favor, selecione um arquivo CSV primeiro');
      return;
    }

    const csvText = preview.map(row => row.join(',')).join('\n');
    const result = parseCSVData(csvText, dateFormat);

    if (!result.success) {
      setError(result.error || 'Falha ao processar dados do CSV');
      setInvalidRows(result.invalidRows || null);
      return;
    }

    if (result.data) {
      onUpload(result.data);
      onClose();
    }
  };

  const resetForm = () => {
    setPreview([]);
    setError(null);
    setInvalidRows(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upload em Massa de Clientes</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">{error}</p>
                  {invalidRows && invalidRows.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 font-medium">Linhas inválidas:</p>
                      <div className="mt-1 max-h-40 overflow-y-auto">
                        {invalidRows.map((row, index) => (
                          <div key={index} className="text-sm text-red-600 mt-1">
                            <span className="font-medium">Linha {row.line}:</span> {row.reason}
                            <div className="text-xs text-red-500 mt-0.5">Conteúdo: {row.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Data no CSV
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as DateFormat)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {Object.entries(DATE_FORMATS).map(([format, label]) => (
                <option key={format} value={format}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Clique para fazer upload do arquivo CSV</p>
              <p className="text-sm text-gray-500 mt-1">
                O arquivo deve conter colunas para nome e data de entrada
              </p>
            </button>
          </div>

          {preview.length > 0 && (
            <div className="max-h-64 overflow-auto mb-4 border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {preview[0].map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {preview.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Importar Clientes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}