import React, { useEffect, useState } from 'react';
import { Users, User, ChevronRight, Search } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true);
      setError('');
      
      try {
        const data = await apiService.getTeams();
        setTeams(data);
      } catch (err) {
        setError('Failed to load teams. Please try again later.');
        console.error('Teams fetch error:', err);
      } finally {
        setIsLoadingTeams(false);
      }
    };
    
    fetchTeams();
  }, []);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!selectedTeam) return;
      
      setIsLoadingMembers(true);
      setError('');
      
      try {
        const data = await apiService.getTeamMembers(selectedTeam);
        setTeamMembers(data);
      } catch (err) {
        setError('Failed to load team members. Please try again later.');
        console.error('Team members fetch error:', err);
      } finally {
        setIsLoadingMembers(false);
      }
    };
    
    fetchTeamMembers();
  }, [selectedTeam]);
  
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };
  
  const filteredTeams = teams.filter((team) => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSelectedTeamName = () => {
    const team = teams.find((t) => t.team_id === selectedTeam);
    return team ? team.name : '';
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams</h1>
        <p className="text-gray-600">
          Browse teams and view detailed information about team members.
        </p>
      </div>
      
      {error && <Alert variant="error" message={error} className="mb-6" />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <div className="mb-4">
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {isLoadingTeams ? (
                <div className="animate-pulse space-y-4 py-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <div
                    key={team.team_id}
                    className={`py-3 px-2 flex items-center justify-between cursor-pointer transition-colors duration-150
                      ${selectedTeam === team.team_id ? 'bg-blue-50 border-l-4 border-blue-800' : 'hover:bg-gray-50'}`}
                    onClick={() => handleTeamSelect(team.team_id)}
                  >
                    <div className="flex items-center">
                      <Users className={`h-5 w-5 mr-3 ${selectedTeam === team.team_id ? 'text-blue-800' : 'text-gray-500'}`} />
                      <span className={`${selectedTeam === team.team_id ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                        {team.name}
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${selectedTeam === team.team_id ? 'text-blue-800' : 'text-gray-400'}`} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4 text-center">No teams found.</p>
              )}
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            {selectedTeam ? (
              isLoadingMembers ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {getSelectedTeamName()}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Manager</h3>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-blue-800 mr-2" />
                        <span className="font-medium">
                          {teamMembers?.manager || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Coach</h3>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-blue-800 mr-2" />
                        <span className="font-medium">
                          {teamMembers?.coach || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Captain</h3>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-blue-800 mr-2" />
                        <span className="font-medium">
                          {teamMembers?.captain || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Players</h3>
                  
                  {teamMembers?.players && teamMembers.players.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {teamMembers.players.map((player: string, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-md p-3 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium mr-3">
                            {player.charAt(0)}
                          </div>
                          <span>{player}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No players found for this team.</p>
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Team Selected</h3>
                <p className="text-gray-500 mb-6">Select a team from the list to view details</p>
                {teams.length > 0 && (
                  <Button 
                    variant="primary"
                    onClick={() => handleTeamSelect(teams[0].team_id)}
                  >
                    View First Team
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};