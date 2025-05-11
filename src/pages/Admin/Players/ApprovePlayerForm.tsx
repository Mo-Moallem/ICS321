import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { apiService } from '../../../api/apiService';

interface ApprovalData {
  player_id: string;
  team_id: string;
  tr_id: string;
}

interface ApprovePlayerFormProps {
  player: any;
  tournaments: any[];
  onSubmit: (data: ApprovalData) => void;
  onCancel: () => void;
}

export const ApprovePlayerForm: React.FC<ApprovePlayerFormProps> = ({ 
  player, 
  tournaments, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<ApprovalData>({
    player_id: '',
    team_id: '',
    tr_id: '',
  });
  
  const [errors, setErrors] = useState<Partial<ApprovalData>>({});
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState('');
  
  useEffect(() => {
    if (player) {
      setFormData(prev => ({
        ...prev,
        player_id: player.player_id || '',
      }));
    }
  }, [player]);

  useEffect(() => {
    // Reset team selection when tournament changes
    setFormData(prev => ({ ...prev, team_id: '' }));
    setTeams([]);
    
    if (formData.tr_id) {
      fetchTeamsInTournament(formData.tr_id);
    }
  }, [formData.tr_id]);
  
  const fetchTeamsInTournament = async (tr_id: string) => {
    setIsLoadingTeams(true);
    setTeamsError('');
    try {
      const data = await apiService.getTeamsInTournament(tr_id);
      setTeams(data);
    } catch (err) {
      setTeamsError('Failed to load teams for this tournament. Please try again.');
      console.error('Teams fetch error:', err);
    } finally {
      setIsLoadingTeams(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof ApprovalData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<ApprovalData> = {};
    
    if (!formData.player_id.trim()) {
      newErrors.player_id = 'Player ID is required';
    }
    
    if (!formData.team_id) {
      newErrors.team_id = 'Team is required';
    }
    
    if (!formData.tr_id) {
      newErrors.tr_id = 'Tournament is required';
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
      <div className="flex items-center mb-6">
        <UserCheck className="h-8 w-8 text-blue-800 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">Approve Player for Team</h3>
      </div>
      
      {player && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">Selected Player</h4>
          <p><span className="font-medium">Name:</span> {player.player_name}</p>
          <p><span className="font-medium">ID:</span> {player.player_id}</p>
          <p><span className="font-medium">Position:</span> {player.position_to_play}</p>
        </div>
      )}
      
      {teamsError && (
        <Alert
          variant="error"
          message={teamsError}
          className="mb-4"
          onClose={() => setTeamsError('')}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Player ID"
          name="player_id"
          value={formData.player_id}
          onChange={handleChange}
          disabled={!!player}
          error={errors.player_id}
          fullWidth
        />
        
        <Select
          label="Tournament"
          name="tr_id"
          options={[
            { value: '', label: 'Select a tournament' },
            ...tournaments.map((tournament) => ({ 
              value: tournament.tr_id, 
              label: tournament.tr_name 
            }))
          ]}
          value={formData.tr_id}
          onChange={handleChange}
          error={errors.tr_id}
          fullWidth
        />
        
        <Select
          label="Team"
          name="team_id"
          options={[
            { value: '', label: isLoadingTeams ? 'Loading teams...' : (formData.tr_id ? 'Select a team' : 'Select a tournament first') },
            ...teams.map((team) => ({ 
              value: team.team_id, 
              label: team.team_name 
            }))
          ]}
          value={formData.team_id}
          onChange={handleChange}
          error={errors.team_id}
          disabled={!formData.tr_id || isLoadingTeams}
          fullWidth
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!formData.tr_id || !formData.team_id || isLoadingTeams}
          isLoading={isLoadingTeams}
        >
          Approve Player
        </Button>
      </div>
    </form>
  );
};