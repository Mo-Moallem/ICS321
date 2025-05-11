import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface Team {
  team_id: string;
  team_name: string;
}

interface AddTeamFormProps {
  onSubmit: (team: Team) => void;
  onCancel: () => void;
}

export const AddTeamForm: React.FC<AddTeamFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Team>({
    team_id: '',
    team_name: '',
  });
  
  const [errors, setErrors] = useState<Partial<Team>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof Team]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Team> = {};
    
    if (!formData.team_id.trim()) {
      newErrors.team_id = 'Team ID is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.team_id)) {
      newErrors.team_id = 'Team ID should only contain letters, numbers, hyphens, and underscores';
    }
    
    if (!formData.team_name.trim()) {
      newErrors.team_name = 'Team name is required';
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
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Team</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Team ID"
          name="team_id"
          placeholder="E.g., TM001 or EAGLES"
          value={formData.team_id}
          onChange={handleChange}
          error={errors.team_id}
          fullWidth
        />
        
        <Input
          label="Team Name"
          name="team_name"
          placeholder="E.g., Blue Eagles"
          value={formData.team_name}
          onChange={handleChange}
          error={errors.team_name}
          fullWidth
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Team
        </Button>
      </div>
    </form>
  );
};