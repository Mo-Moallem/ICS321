import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../api/apiService';

export const AddMatchForm: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [matchNo, setMatchNo] = useState('');
  const [playDate, setPlayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
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
    setTeam1('');
    setTeam2('');
    try {
      const data = await apiService.getTournamentTeams(tr_id);
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams for the selected tournament.');
    } finally {
      setIsTeamsLoading(false);
    }
  };

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournament(e.target.value);
    if (e.target.value) {
      fetchTeams(e.target.value);
    } else {
      setTeams([]);
      setTeam1('');
      setTeam2('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedTournament || !team1 || !team2 || !matchNo || !playDate) {
      setError('Please fill in all fields.');
      return;
    }
    if (team1 === team2) {
      setError('Team 1 and Team 2 must be different.');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.addMatch({
        match_no: matchNo,
        team_id1: team1,
        team_id2: team2,
        tr_id: selectedTournament,
        play_date: playDate
      });
      setSuccess(`Match ${matchNo} scheduled successfully!`);
      setMatchNo('');
      setPlayDate('');
      setTeam1('');
      setTeam2('');
    } catch (err: any) {
      if (err?.response?.status === 400 || err?.response?.status === 404 || err?.response?.status === 409) {
        setError(err.response.data?.message || err.message);
      } else {
        setError('Failed to schedule match due to a server error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Add Match</h3>
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
          label="Team 1"
          options={teams.map((t: any) => ({ value: t.team_id, label: t.team_name || t.name }))}
          value={team1}
          onChange={e => setTeam1(e.target.value)}
          fullWidth
          required
          disabled={!selectedTournament || isTeamsLoading}
        />
        <Select
          label="Team 2"
          options={teams.map((t: any) => ({ value: t.team_id, label: t.team_name || t.name }))}
          value={team2}
          onChange={e => setTeam2(e.target.value)}
          fullWidth
          required
          disabled={!selectedTournament || isTeamsLoading}
        />
        <input
          type="number"
          min="1"
          className="border rounded px-3 py-2 w-full"
          placeholder="Match No."
          value={matchNo}
          onChange={e => setMatchNo(e.target.value)}
          required
        />
        <input
          type="date"
          className="border rounded px-3 py-2 w-full"
          placeholder="Play Date"
          value={playDate}
          onChange={e => setPlayDate(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || isTeamsLoading || !selectedTournament || !team1 || !team2 || !matchNo || !playDate || team1 === team2}
        >
          Add Match
        </Button>
      </form>
    </Card>
  );
}; 