import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../api/apiService';

export const AddMatchResultAdmin: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [matchesData, teamsData] = await Promise.all([
        apiService.getMatchesNoResults(),
        apiService.getTeams(),
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
    setForm({
      match_no: match.match_no,
      team1_id: match.team_id1,
      team2_id: match.team_id2,
      results: '',
      decided_by: '',
      stop1_sec: '',
      stop2_sec: '',
      team1_score: '',
      team2_score: '',
      penalty_score: '',
    });
    setError('');
    setSuccess('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Required fields for /add-result (venue_id and player_of_match removed)
    const requiredFields = [
      'match_no', 'team1_id', 'team2_id', 'team1_score', 'team2_score', 'results', 'decided_by', 'stop1_sec', 'stop2_sec'
    ];
    for (const field of requiredFields) {
      if (
        form[field] === undefined ||
        form[field] === null ||
        (typeof form[field] === 'string' && form[field].trim() === '')
      ) {
        setError(`Please fill in the required field: ${field}`);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const payload = { ...form };
      if (!form.penalty_score) delete payload.penalty_score;
      // Normalize results field
      if (payload.results) {
        const val = payload.results.toString().toLowerCase();
        if (val === 'w' || val === 'win') payload.results = 'W';
        else if (val === 'l' || val === 'loss') payload.results = 'L';
        else if (val === 'd' || val === 'draw') payload.results = 'D';
      }
      await apiService.addMatchResult(payload);
      setSuccess('Result saved!');
      setMatches((prev) => prev.filter((m) => m.match_no !== form.match_no));
      setSelectedMatch(null);
      setForm({});
    } catch (err: any) {
      // Try to extract SQL error details if present
      const sqlError = err?.response?.data?.sqlError;
      if (err?.response?.status === 400) {
        setError('Missing or invalid fields.');
      } else if (err?.response?.status === 404) {
        setError('Match or Team ID not found.' + (sqlError ? ` [${sqlError.code}] ${sqlError.message}` : ''));
      } else if (err?.response?.status === 409) {
        setError('Result already exists for this match.' + (sqlError ? ` [${sqlError.code}] ${sqlError.message}` : ''));
      } else if (sqlError) {
        setError(`SQL Error [${sqlError.code}]: ${sqlError.message}`);
      } else {
        setError('Failed to save result.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTeamName = (team_id: any) => {
    const team = teams.find((t: any) => String(t.team_id) === String(team_id));
    return team ? team.team_name || team.name : team_id;
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Enter Match Results</h3>
      {error && <Alert variant="error" message={error} className="mb-4" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-4" onClose={() => setSuccess('')} />}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : selectedMatch ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 font-medium">Match #{selectedMatch.match_no} on {selectedMatch.play_date}</div>
              <div className="mb-2">{getTeamName(selectedMatch.team_id1)} vs {getTeamName(selectedMatch.team_id2)}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="team1_score"
              placeholder={`Score for ${getTeamName(selectedMatch.team_id1)}`}
              value={form.team1_score}
              onChange={handleFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              name="team2_score"
              placeholder={`Score for ${getTeamName(selectedMatch.team_id2)}`}
              value={form.team2_score}
              onChange={handleFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <Select
              label="Result (for Team 1)"
              name="results"
              options={[
                { value: '', label: 'Select result' },
                { value: 'W', label: 'Win' },
                { value: 'L', label: 'Loss' },
                { value: 'D', label: 'Draw' },
              ]}
              value={form.results}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <Select
              label="Decided By"
              name="decided_by"
              options={[
                { value: '', label: 'Select' },
                { value: 'N', label: 'Normal Play' },
                { value: 'P', label: 'Penalty Shootout' },
              ]}
              value={form.decided_by}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <input
              type="number"
              name="stop1_sec"
              placeholder="Stop 1 (sec)"
              value={form.stop1_sec}
              onChange={handleFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              name="stop2_sec"
              placeholder="Stop 2 (sec)"
              value={form.stop2_sec}
              onChange={handleFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            {form.decided_by === 'P' && (
              <input
                type="number"
                name="penalty_score"
                placeholder="Penalty Score"
                value={form.penalty_score}
                onChange={handleFormChange}
                className="border rounded px-3 py-2 w-full"
              />
            )}
          </div>
          <div className="flex space-x-4">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Result
            </Button>
            <Button type="button" variant="outline" onClick={() => setSelectedMatch(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          {matches.length === 0 ? (
            <div className="text-gray-500">All matches have results entered.</div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.match_no} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">Match #{match.match_no} on {match.play_date}</div>
                    <div>{getTeamName(match.team_id1)} vs {getTeamName(match.team_id2)}</div>
                  </div>
                  <Button className="mt-4 md:mt-0" onClick={() => handleSelectMatch(match)}>
                    Enter Result
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 