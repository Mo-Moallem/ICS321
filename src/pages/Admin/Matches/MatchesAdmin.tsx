import React from 'react';
import { AddMatchForm } from './AddMatchForm';
import { AddMatchResultAdmin } from './AddMatchResultAdmin';

export const MatchesAdmin: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Matches Management</h2>
      <AddMatchForm />
      <AddMatchResultAdmin />
      {/* Future: Add matches list, edit/delete, etc. */}
    </div>
  );
}; 