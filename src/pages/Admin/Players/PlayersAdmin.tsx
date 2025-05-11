import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Table } from '../../../components/ui/Table';
import { ApprovePlayerForm } from './ApprovePlayerForm';
import { AddPlayerForm } from './AddPlayerForm';

export const PlayersAdmin: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const [playersData, tournamentsData, teamsData] = await Promise.all([
        apiService.getPlayersNotInTeam(),
        apiService.getTournaments(),
        apiService.getTeams(),
      ]);
      
      setPlayers(playersData);
      setTournaments(tournamentsData);
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveClick = (player: any) => {
    setSelectedPlayer(player);
    setShowApproveForm(true);
  };
  
  const handleApprovePlayer = async (data: any) => {
    setError('');
    setSuccess('');
    
    try {
      await apiService.approvePlayer(data);
      setSuccess(`Player ${data.player_id} was successfully approved for team ${data.team_id} in tournament ${data.tr_id}!`);
      setShowApproveForm(false);
      setSelectedPlayer(null);
      
      // Refresh the list to remove the approved player
      fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to approve player: ${errorMessage}`);
      console.error('Player approval error:', err);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Player Approvals</h2>
        <Button
          variant={showAddPlayerForm ? 'outline' : 'primary'}
          onClick={() => setShowAddPlayerForm((prev) => !prev)}
        >
          {showAddPlayerForm ? 'Cancel' : 'Add Player'}
        </Button>
      </div>
      
      {showAddPlayerForm && (
        <AddPlayerForm
          onSuccess={() => {
            setShowAddPlayerForm(false);
            fetchData();
          }}
        />
      )}
      
      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-6" onClose={() => setSuccess('')} />}
      
      {showApproveForm && (
        <Card className="mb-8">
          <ApprovePlayerForm 
            player={selectedPlayer}
            tournaments={tournaments}
            onSubmit={handleApprovePlayer} 
            onCancel={() => {
              setShowApproveForm(false);
              setSelectedPlayer(null);
            }} 
          />
        </Card>
      )}
      
      <Card bordered>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Players Available for Team Assignment</h3>
        
        <Table
          headers={['ID', 'Player Name', 'Email', 'Position', 'Actions']}
          data={players}
          isLoading={isLoading}
          noDataMessage="No players available for assignment."
          renderRow={(player) => (
            <tr key={player.player_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{player.player_id}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{player.player_name}</div>
                <div className="text-sm text-gray-500">Jersey #{player.jersey_no}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{player.player_email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {player.position_to_play}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle className="h-4 w-4" />}
                  onClick={() => handleApproveClick(player)}
                >
                  Approve
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};