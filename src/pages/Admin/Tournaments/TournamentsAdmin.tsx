import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, PlusCircle, Trash2, AlertTriangle, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Table } from '../../../components/ui/Table';
import { AddTournamentForm } from './AddTournamentForm';
import { Select } from '../../../components/ui/Select';
import { TournamentTeamsTable } from './TournamentTeamsTable';

interface Tournament {
  tr_id: string;
  tr_name: string;
  start_date: string;
  end_date: string;
}

export const TournamentsAdmin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [addTeamLoading, setAddTeamLoading] = useState(false);
  const [addTeamError, setAddTeamError] = useState('');
  const [addTeamSuccess, setAddTeamSuccess] = useState('');
  const [selectedTournamentForTeams, setSelectedTournamentForTeams] = useState<string>('');
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if the URL has an action parameter to show the add form
    const action = searchParams.get('action');
    if (action === 'add') {
      setShowAddForm(true);
      // Clear the parameter so refreshing doesn't reshow the form
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  
  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);
  
  const fetchTournaments = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await apiService.getTournaments();
      setTournaments(data);
    } catch (err) {
      setError('Failed to load tournaments. Please try again later.');
      console.error('Tournaments fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTeams = async () => {
    try {
      const data = await apiService.getTeams();
      setTeams(data);
    } catch (err) {
      // Optionally handle error
    }
  };
  
  const handleDeleteTournament = async (tr_id: string) => {
    if (confirmDelete !== tr_id) {
      setConfirmDelete(tr_id);
      return;
    }
    
    setIsDeleting(true);
    setError('');
    setSuccess('');
    setDeletingId(tr_id);
    
    try {
      await apiService.deleteTournament(tr_id);
      setSuccess(`Tournament ${tr_id} was successfully deleted.`);
      
      // Update the list
      setTournaments(tournaments.filter(t => t.tr_id !== tr_id));
    } catch (err) {
      setError(`Failed to delete tournament ${tr_id}. Please try again.`);
      console.error('Tournament delete error:', err);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };
  
  const handleAddTournament = async (tournament: any) => {
    setError('');
    setSuccess('');
    
    try {
      await apiService.addTournament(tournament);
      setSuccess('Tournament was successfully added!');
      setShowAddForm(false);
      
      // Refresh the list
      fetchTournaments();
    } catch (err) {
      setError('Failed to add tournament. Please check your input and try again.');
      console.error('Tournament add error:', err);
    }
  };
  
  const handleAddTeamToTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddTeamError('');
    setAddTeamSuccess('');
    setAddTeamLoading(true);
    try {
      await apiService.addTeamToTournament({ tr_id: selectedTournamentId, team_id: selectedTeamId });
      setAddTeamSuccess('Team successfully added to the tournament.');
      setSelectedTournamentId('');
      setSelectedTeamId('');
    } catch (err: any) {
      setAddTeamError(err.message || 'Failed to add team to tournament.');
    } finally {
      setAddTeamLoading(false);
    }
  };
  
  const toggleTournamentExpansion = (tr_id: string) => {
    setExpandedTournament(expandedTournament === tr_id ? null : tr_id);
  };
  
  const getTournamentStatus = (tournament: Tournament) => {
    const now = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);

    if (now < startDate) {
      return {
        status: 'upcoming',
        label: 'Upcoming',
        color: 'bg-blue-100 text-blue-800'
      };
    } else if (now > endDate) {
      return {
        status: 'completed',
        label: 'Completed',
        color: 'bg-gray-100 text-gray-800'
      };
    } else {
      return {
        status: 'ongoing',
        label: 'Ongoing',
        color: 'bg-green-100 text-green-800'
      };
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tournaments Management</h2>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          icon={<PlusCircle className="h-4 w-4" />}
        >
          {showAddForm ? 'Cancel' : 'Add Tournament'}
        </Button>
      </div>
      
      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-6" onClose={() => setSuccess('')} />}
      
      {showAddForm && (
        <Card className="mb-8">
          <AddTournamentForm onSubmit={handleAddTournament} onCancel={() => setShowAddForm(false)} />
        </Card>
      )}
      
      {addTeamError && <Alert variant="error" message={addTeamError} className="mb-4" onClose={() => setAddTeamError('')} />}
      {addTeamSuccess && <Alert variant="success" message={addTeamSuccess} className="mb-4" onClose={() => setAddTeamSuccess('')} />}
      <Card className="mb-8">
        <form onSubmit={handleAddTeamToTournament} className="flex flex-col md:flex-row md:items-end gap-4">
          <Select
            label="Tournament"
            options={tournaments.map((t: any) => ({ value: t.tr_id, label: t.tr_name }))}
            value={selectedTournamentId}
            onChange={e => setSelectedTournamentId(e.target.value)}
            fullWidth
            required
          />
          <Select
            label="Team"
            options={teams.map((t: any) => ({ value: t.team_id, label: t.team_name || t.name }))}
            value={selectedTeamId}
            onChange={e => setSelectedTeamId(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={addTeamLoading}
            disabled={!selectedTournamentId || !selectedTeamId || addTeamLoading}
          >
            Add Team to Tournament
          </Button>
        </form>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        {tournaments.map((tournament) => {
          const status = getTournamentStatus(tournament);
          return (
            <Card key={tournament.tr_id} className="overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleTournamentExpansion(tournament.tr_id)}
              >
                <div className="flex items-center space-x-4">
                  <Trophy className={`h-8 w-8 ${status.color.split(' ')[1]}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tournament.tr_name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={expandedTournament === tournament.tr_id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                />
              </div>
              
              {expandedTournament === tournament.tr_id && (
                <div className="border-t border-gray-200">
                  <TournamentTeamsTable tr_id={tournament.tr_id} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      <Card bordered>
        <Table
          headers={['ID', 'Tournament Name', 'Status', 'Actions']}
          data={tournaments}
          isLoading={isLoading}
          noDataMessage="No tournaments found. Add your first tournament using the button above."
          renderRow={(tournament) => {
            const status = getTournamentStatus(tournament);
            return (
              <tr key={tournament.tr_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{tournament.tr_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tournament.tr_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTournamentExpansion(tournament.tr_id)}
                  >
                    View Rankings
                  </Button>
                </td>
              </tr>
            );
          }}
        />
      </Card>
    </div>
  );
};