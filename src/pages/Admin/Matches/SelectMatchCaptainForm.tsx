import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../api/apiService';

export const SelectMatchCaptainForm: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [isPlayersLoading, setIsPlayersLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getTournaments();
      setTournaments(data);
    } catch (err) {
      setError('Failed to load tournaments.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async (tr_id: string) => {
    setIsTeamsLoading(true);
    setTeams([]);
    setSelectedTeam('');
    setPlayers([]);
    setSelectedPlayer('');
    try {
      const data = await apiService.getTournamentTeams(tr_id);
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams for the selected tournament.');
    } finally {
      setIsTeamsLoading(false);
    }
  };

  const fetchPlayers = async (team_id: string, tr_id: string) => {
    setIsPlayersLoading(true);
    setPlayers([]);
    setSelectedPlayer('');
    try {
      const playersData = await apiService.getTournamentTeamPlayers(team_id, tr_id);
      setPlayers(playersData.players || playersData);
    } catch (err) {
      setError('Failed to load players for the selected team.');
    } finally {
      setIsPlayersLoading(false);
    }
  };

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournament(e.target.value);
    if (e.target.value) {
      fetchTeams(e.target.value);
    } else {
      setTeams([]);
      setSelectedTeam('');
      setPlayers([]);
      setSelectedPlayer('');
    }
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
    if (e.target.value && selectedTournament) {
      fetchPlayers(e.target.value, selectedTournament);
    } else {
      setPlayers([]);
      setSelectedPlayer('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedTournament || !selectedTeam || !selectedPlayer) {
      setError('Please select a tournament, team, and player.');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.selectCaptain({
        tr_id: selectedTournament,
        team_id: selectedTeam,
        player_id: selectedPlayer
      });
      setSuccess('Captain set successfully!');
      setSelectedPlayer('');
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Tournament, team, or player not found.');
      } else {
        setError('Failed to select captain.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Select Team Captain</h3>
      {error && <Alert variant="error" message={error} className="mb-4" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-4" onClose={() => setSuccess('')} />}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
        <Select
          label="Tournament"
          options={tournaments.map((t: any) => ({ value: t.tr_id, label: t.tr_name }))}
          value={selectedTournament}
          onChange={handleTournamentChange}
          fullWidth
          required
        />
        <Select
          label="Team"
          options={teams.map((t: any) => ({ value: t.team_id, label: t.team_name || t.name }))}
          value={selectedTeam}
          onChange={handleTeamChange}
          fullWidth
          required
          disabled={!selectedTournament || isTeamsLoading}
        />
        <Select
          label="Captain (Player)"
          options={players.map((p: any) => ({ value: p.player_id, label: p.name }))}
          value={selectedPlayer}
          onChange={e => setSelectedPlayer(e.target.value)}
          fullWidth
          required
          disabled={!selectedTeam || isPlayersLoading}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !selectedTournament || !selectedTeam || !selectedPlayer}
        >
          Set Captain
        </Button>
      </form>
    </Card>
  );
}; 