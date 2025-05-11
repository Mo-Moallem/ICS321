import React, { useEffect, useState } from 'react';
import { Table } from '../../../components/ui/Table';
import { Alert } from '../../../components/ui/Alert';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../api/apiService';

interface TournamentTeam {
  team_id: string;
  team_name: string;
  team_group: string;
  match_played: number;
  won: number;
  draw: number;
  lost: number;
  goal_for: number;
  goal_against: number;
  goal_diff: number;
  points: number;
  group_position: number;
}

interface TournamentTeamsTableProps {
  tr_id: string;
  isAdmin?: boolean;
}

export const TournamentTeamsTable: React.FC<TournamentTeamsTableProps> = ({ tr_id, isAdmin = false }) => {
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [sortField, setSortField] = useState<keyof TournamentTeam>('points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTeams();
  }, [tr_id]);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getTournamentTeams(tr_id);
      setTeams(data);
    } catch (err) {
      setError('Failed to load tournament teams. Please try again later.');
      console.error('Tournament teams fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortIndicator = (field: keyof TournamentTeam) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const handleHeaderClick = (field: keyof TournamentTeam) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedAndFilteredTeams = () => {
    let filtered = [...teams];
    
    // Filter by group if selected
    if (selectedGroup) {
      filtered = filtered.filter(team => team.team_group === selectedGroup);
    }
    
    // Sort teams
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
    
    return filtered;
  };

  const groups = Array.from(new Set(teams.map(team => team.team_group))).sort();

  return (
    <div>
      {error && (
        <Alert
          variant="error"
          message={error}
          className="mb-4"
          onClose={() => setError('')}
        />
      )}

      <div className="mb-4">
        <Select
          label="Filter by Group"
          options={[
            { value: '', label: 'All Groups' },
            ...groups.map(group => ({ value: group, label: `Group ${group}` }))
          ]}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('group_position')}
              >
                Pos{getSortIndicator('group_position')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('team_name')}
              >
                Team{getSortIndicator('team_name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('team_group')}
              >
                Group{getSortIndicator('team_group')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('match_played')}
              >
                MP{getSortIndicator('match_played')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('won')}
              >
                W{getSortIndicator('won')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('draw')}
              >
                D{getSortIndicator('draw')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('lost')}
              >
                L{getSortIndicator('lost')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('goal_for')}
              >
                GF{getSortIndicator('goal_for')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('goal_against')}
              >
                GA{getSortIndicator('goal_against')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('goal_diff')}
              >
                GD{getSortIndicator('goal_diff')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => handleHeaderClick('points')}
              >
                Pts{getSortIndicator('points')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={`loading-${index}`} className="animate-pulse">
                  {Array.from({ length: 11 }).map((_, cellIndex) => (
                    <td key={`loading-cell-${cellIndex}`} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : getSortedAndFilteredTeams().length > 0 ? (
              getSortedAndFilteredTeams().map((team) => (
                <tr key={team.team_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.group_position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.team_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.team_group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.match_played}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.won}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.draw}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.lost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.goal_for}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.goal_against}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.goal_diff}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No teams found for this tournament.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 