import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface Tournament {
  tr_id: string;
  tr_name: string;
  start_date: string;
  end_date: string;
}

interface AddTournamentFormProps {
  onSubmit: (tournament: Tournament) => void;
  onCancel: () => void;
}

export const AddTournamentForm: React.FC<AddTournamentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Tournament>({
    tr_id: '',
    tr_name: '',
    start_date: '',
    end_date: '',
  });
  
  const [errors, setErrors] = useState<Partial<Tournament>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof Tournament]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Tournament> = {};
    
    if (!formData.tr_id.trim()) {
      newErrors.tr_id = 'Tournament ID is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.tr_id)) {
      newErrors.tr_id = 'Tournament ID should only contain letters, numbers, hyphens, and underscores';
    }
    
    if (!formData.tr_name.trim()) {
      newErrors.tr_name = 'Tournament name is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.start_date)) {
      newErrors.start_date = 'Start date must be in YYYY-MM-DD format';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.end_date)) {
      newErrors.end_date = 'End date must be in YYYY-MM-DD format';
    }
    
    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Tournament</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tournament ID"
          name="tr_id"
          placeholder="E.g., T001 or SUMMER-2025"
          value={formData.tr_id}
          onChange={handleChange}
          error={errors.tr_id}
          fullWidth
        />
        
        <Input
          label="Tournament Name"
          name="tr_name"
          placeholder="E.g., Summer Football Tournament 2025"
          value={formData.tr_name}
          onChange={handleChange}
          error={errors.tr_name}
          fullWidth
        />
        
        <Input
          label="Start Date"
          name="start_date"
          type="date"
          placeholder="YYYY-MM-DD"
          value={formData.start_date}
          onChange={handleChange}
          error={errors.start_date}
          fullWidth
        />
        
        <Input
          label="End Date"
          name="end_date"
          type="date"
          placeholder="YYYY-MM-DD"
          value={formData.end_date}
          onChange={handleChange}
          error={errors.end_date}
          fullWidth
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Tournament
        </Button>
      </div>
    </form>
  );
};