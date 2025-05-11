import React, { useEffect, useState } from 'react';
import { Users, Trophy } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Select } from '../../components/ui/Select';

interface Team {
  team_id: string;
  team_name: string;
}

interface Tournament {
  tr_id: string;
  tr_name: string;
}

interface TeamTournamentStats {
  tr_id: string;
  team_id: string;
  points: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  group?: string;
}

export const TeamTournamentPerformance: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<TeamTournamentStats[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [teamsData, tournamentsData] = await Promise.all([
        apiService.getTeams(),
        apiService.getTournaments()
      ]);
      setTeams(teamsData);
      setTournaments(tournamentsData);
      // Fetch stats for all tournaments
      const allStats: TeamTournamentStats[] = [];
      for (const tournament of tournamentsData) {
        try {
          const tStats = await apiService.getTeamsInTournament(tournament.tr_id);
          for (const s of tStats) {
            allStats.push({ ...s, tr_id: tournament.tr_id });
          }
        } catch (e) {
          // Ignore errors for individual tournaments
        }
      }
      setStats(allStats);
    } catch (err) {
      setError('Failed to load teams or tournaments.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTournaments = selectedTournament === 'all' ? tournaments : tournaments.filter(t => t.tr_id === selectedTournament);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teams & Tournament Performance</h2>
        <Select
          label="Filter by Tournament"
          options={[{ value: 'all', label: 'All Tournaments' }, ...tournaments.map(t => ({ value: t.tr_id, label: t.tr_name }))]}
          value={selectedTournament}
          onChange={e => setSelectedTournament(e.target.value)}
          fullWidth
        />
      </div>
      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {teams.map(team => {
            // For each team, get their stats in the selected tournaments
            const teamStats = stats.filter(s => s.team_id === team.team_id && filteredTournaments.some(t => t.tr_id === s.tr_id));
            if (teamStats.length === 0) return null;
            return (
              <Card key={team.team_id} className="p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <Users className="h-6 w-6 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">{team.team_name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamStats.map(stat => {
                    const tournament = tournaments.find(t => t.tr_id === stat.tr_id);
                    return (
                      <Card key={stat.tr_id} className="p-4 bg-gray-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium text-gray-800">{tournament?.tr_name}</span>
                          {stat.group && <span className="ml-2 text-xs text-gray-500">Group {stat.group}</span>}
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">{stat.points}</div>
                            <div className="text-xs text-gray-500">Points</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{stat.wins}-{stat.draws}-{stat.losses}</div>
                            <div className="text-xs text-gray-500">W-D-L</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{stat.goals_for}-{stat.goals_against}</div>
                            <div className="text-xs text-gray-500">GF-GA</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(stat.points / (stat.matches_played * 3)) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{stat.matches_played} matches played</span>
                            <span>{Math.round((stat.points / (stat.matches_played * 3)) * 100)}% points potential</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}; 