import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Customer } from '../types';
import { parseDate } from '../utils/dateUtils';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
  segments: string[];
  tiers: string[];
}

export default function CustomerForm({ onSubmit, segments, tiers }: CustomerFormProps) {
  const [name, setName] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [segment, setSegment] = useState('');
  const [tier, setTier] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newTier, setNewTier] = useState('');
  const [isAddingNewSegment, setIsAddingNewSegment] = useState(false);
  const [isAddingNewTier, setIsAddingNewTier] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      entryDate: parseDate(entryDate),
      exitDate: exitDate ? parseDate(exitDate) : null,
      segment: isAddingNewSegment ? newSegment : segment,
      tier: isAddingNewTier ? newTier : tier,
    });
    setName('');
    setEntryDate('');
    setExitDate('');
    setSegment('');
    setTier('');
    setNewSegment('');
    setNewTier('');
    setIsAddingNewSegment(false);
    setIsAddingNewTier(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Date
          </label>
          <input
            type="date"
            required
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exit Date
          </label>
          <input
            type="date"
            value={exitDate}
            min={entryDate}
            onChange={(e) => setExitDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Segment
          </label>
          {isAddingNewSegment ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value)}
                placeholder="New segment name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setIsAddingNewSegment(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select segment</option>
                {segments.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNewSegment(true)}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                New
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tier
          </label>
          {isAddingNewTier ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                placeholder="New tier name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setIsAddingNewTier(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select tier</option>
                {tiers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNewTier(true)}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                New
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Customer
      </button>
    </form>
  );
}