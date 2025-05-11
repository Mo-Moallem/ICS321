import React, { useEffect, useState } from 'react';
import { Users, PlusCircle } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Table } from '../../../components/ui/Table';
import { AddTeamForm } from './AddTeamForm';
import { Select } from '../../../components/ui/Select';
import { SelectMatchCaptainForm } from '../Matches/SelectMatchCaptainForm';

export const TeamsAdmin: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Team to Tournament state
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [addTeamLoading, setAddTeamLoading] = useState(false);
  const [addTeamError, setAddTeamError] = useState('');
  const [addTeamSuccess, setAddTeamSuccess] = useState('');

  const [teamCaptains, setTeamCaptains] = useState<{ [teamId: string]: string }>({});

  useEffect(() => {
    fetchTeams();
    fetchTournaments();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await apiService.getTeams();
      setTeams(data);
      // Fetch captains for each team
      const captains: { [teamId: string]: string } = {};
      await Promise.all(
        data.map(async (team: any) => {
          try {
            const members = await apiService.getTeamMembers(team.team_id);
            captains[team.team_id] = members?.captain || 'Not assigned';
          } catch {
            captains[team.team_id] = 'Not assigned';
          }
        })
      );
      setTeamCaptains(captains);
    } catch (err) {
      setError('Failed to load teams. Please try again later.');
      console.error('Teams fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      const data = await apiService.getTournaments();
      setTournaments(data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleAddTeam = async (team: any) => {
    setError('');
    setSuccess('');
    
    try {
      await apiService.addTeam(team);
      setSuccess('Team was successfully added!');
      setShowAddForm(false);
      fetchTeams();
    } catch (err) {
      setError('Failed to add team. Please check your input and try again.');
      console.error('Team add error:', err);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teams Management</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          icon={<PlusCircle className="h-4 w-4" />}
        >
          {showAddForm ? 'Cancel' : 'Add Team'}
        </Button>
      </div>

      {/* Add Team to Tournament Form */}
      <Card className="mb-8">
        {addTeamError && <Alert variant="error" message={addTeamError} className="mb-4" onClose={() => setAddTeamError('')} />}
        {addTeamSuccess && <Alert variant="success" message={addTeamSuccess} className="mb-4" onClose={() => setAddTeamSuccess('')} />}
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
        <div className="mt-8">
          <SelectMatchCaptainForm />
        </div>
      </Card>

      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-6" onClose={() => setSuccess('')} />}

      {showAddForm && (
        <Card className="mb-8">
          <AddTeamForm onSubmit={handleAddTeam} onCancel={() => setShowAddForm(false)} />
        </Card>
      )}

      {/* Teams List */}
      <Card bordered>
        <Table
          headers={['ID', 'Team Name', 'Captain']}
          data={teams}
          isLoading={isLoading}
          noDataMessage="No teams found. Add your first team using the button above."
          renderRow={(team) => (
            <tr key={team.team_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{team.team_id}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{team.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teamCaptains[team.team_id] || 'Not assigned'}</div>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};