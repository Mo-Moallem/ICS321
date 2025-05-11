import React, { useEffect, useState } from 'react';
import { Trophy, Medal, TrendingUp, Users, Calendar } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Select } from '../../components/ui/Select';

interface TournamentTeam {
  team_id: string;
  team_name: string;
  points: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  group?: string;
}

interface Tournament {
  tr_id: string;
  tr_name: string;
  start_date: string;
  end_date: string;
  teams?: TournamentTeam[];
}

export const TournamentRankings: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTournamentTeams(selectedTournament.tr_id);
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getTournaments();
      setTournaments(data);
      if (data.length > 0) {
        setSelectedTournament(data[0]);
      }
    } catch (err) {
      setError('Failed to load tournaments. Please try again later.');
      console.error('Tournaments fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournamentTeams = async (tr_id: string) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getTeamsInTournament(tr_id);
      // Sort teams by points (descending)
      const sortedTeams = data.sort((a: TournamentTeam, b: TournamentTeam) => b.points - a.points);
      setTeams(sortedTeams);
    } catch (err) {
      setError('Failed to load tournament teams. Please try again later.');
      console.error('Tournament teams fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupOptions = () => {
    const groups = new Set(teams.map(team => team.group).filter((group): group is string => !!group));
    return [
      { value: 'all', label: 'All Groups' },
      ...Array.from(groups).map(group => ({ value: group, label: `Group ${group}` }))
    ];
  };

  const filteredTeams = selectedGroup === 'all' 
    ? teams 
    : teams.filter(team => team.group === selectedGroup);

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

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  if (isLoading && !selectedTournament) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tournament Rankings</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select
            label="Select Tournament"
            options={tournaments.map(t => ({ value: t.tr_id, label: t.tr_name }))}
            value={selectedTournament?.tr_id || ''}
            onChange={e => {
              const tournament = tournaments.find(t => t.tr_id === e.target.value);
              setSelectedTournament(tournament || null);
            }}
            fullWidth
          />
          {teams.some(team => team.group) && (
            <Select
              label="Group"
              options={getGroupOptions()}
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              fullWidth
            />
          )}
        </div>
      </div>

      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}

      {selectedTournament && (
        <>
          <Card className="mb-8">
            <div className="flex items-center space-x-4 p-4">
              <Trophy className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTournament.tr_name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTournamentStatus(selectedTournament).color}`}>
                    {getTournamentStatus(selectedTournament).label}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {teams.length} Teams
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {filteredTeams.map((team, index) => (
              <Card key={team.team_id} className="hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">
                        {getMedalIcon(index)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{team.team_name}</h4>
                        {team.group && (
                          <span className="text-sm text-gray-500">Group {team.group}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{team.points}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {team.wins}-{team.draws}-{team.losses}
                        </div>
                        <div className="text-xs text-gray-500">W-D-L</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {team.goals_for}-{team.goals_against}
                        </div>
                        <div className="text-xs text-gray-500">GF-GA</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(team.points / (team.matches_played * 3)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{team.matches_played} matches played</span>
                      <span>{Math.round((team.points / (team.matches_played * 3)) * 100)}% points potential</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}; 