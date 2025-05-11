import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Table } from '../../components/ui/Table';

export const MatchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('');
  const [isLoadingTournaments, setIsLoadingTournaments] = useState<boolean>(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoadingTournaments(true);
      setError('');
      
      try {
        const data = await apiService.getTournaments();
        setTournaments(data);
        
        // Check if there's a tournament ID in the URL
        const tournamentId = searchParams.get('tournamentId');
        if (tournamentId && data.some((t: any) => t.tr_id === tournamentId)) {
          setSelectedTournament(tournamentId);
        } else if (data.length > 0) {
          setSelectedTournament(data[0].tr_id);
        }
      } catch (err) {
        setError('Failed to load tournaments. Please try again later.');
        console.error('Tournaments fetch error:', err);
      } finally {
        setIsLoadingTournaments(false);
      }
    };
    
    fetchTournaments();
  }, [searchParams]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedTournament) return;
      
      setIsLoadingMatches(true);
      setError('');
      
      try {
        const data = await apiService.getMatchResults(selectedTournament);
        setMatches(data);
        // Set default sort to date ascending
        setSortConfig({ key: 'play_date', direction: 'asc' });
      } catch (err) {
        setError('Failed to load match results. Please try again later.');
        console.error('Match results fetch error:', err);
      } finally {
        setIsLoadingMatches(false);
      }
    };
    
    fetchMatches();
    // Update URL
    if (selectedTournament) {
      setSearchParams({ tournamentId: selectedTournament });
    }
  }, [selectedTournament, setSearchParams]);
  
  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournament(e.target.value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    );
  };
  
  const sortedMatches = React.useMemo(() => {
    if (!sortConfig) return matches;
    
    return [...matches].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [matches, sortConfig]);
  
  // Helper to normalize result
  const normalizeResult = (result: string) => {
    if (!result) return 'yet to be decided';
    const val = result.toString().toLowerCase();
    if (val === 'w' || val === 'win') return 'Win';
    if (val === 'l' || val === 'loss') return 'Loss';
    if (val === 'd' || val === 'draw') return 'Draw';
    return result;
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Results</h1>
        <p className="text-gray-600">
          Browse match results from all tournaments, sorted by date.
        </p>
      </div>
      
      {error && <Alert variant="error" message={error} className="mb-6" />}
      
      <Card className="mb-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-full md:w-1/3">
              <Select
                label="Select Tournament"
                options={tournaments.map((t) => ({ value: t.tr_id, label: t.tr_name }))}
                value={selectedTournament}
                onChange={handleTournamentChange}
                fullWidth
                disabled={isLoadingTournaments}
              />
            </div>
          </div>
        </div>
        
        <Table
          headers={['Date', 'Match #', 'Home Team', 'Away Team', 'Score', 'Result']}
          data={sortedMatches}
          isLoading={isLoadingMatches}
          noDataMessage="No match results available for this tournament."
          renderRow={(match, index) => (
            <tr key={`${match.match_no}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{match.play_date ? formatDate(match.play_date) : 'yet to be decided'}</div>
                    <div className="text-sm text-gray-500">{match.play_date ? formatTime(match.play_date) : ''}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {match.match_no || 'yet to be decided'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{match.home_team || 'yet to be decided'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{match.away_team || 'yet to be decided'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{match.goal_score || 'yet to be decided'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  normalizeResult(match.results) === 'Win' ? 'bg-green-100 text-green-800' : 
                  normalizeResult(match.results) === 'Loss' ? 'bg-red-100 text-red-800' : 
                  normalizeResult(match.results) === 'Draw' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {normalizeResult(match.results)}
                </span>
              </td>
            </tr>
          )}
        />
      </Card>
    </Layout>
  );
};