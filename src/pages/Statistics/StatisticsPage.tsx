import React, { useEffect, useState } from 'react';
import { Medal, AlertCircle } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Table } from '../../components/ui/Table';

export const StatisticsPage: React.FC = () => {
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [redCardedPlayers, setRedCardedPlayers] = useState<any[]>([]);
  const [groupedRedCards, setGroupedRedCards] = useState<{ [key: string]: any[] }>({});
  const [isLoadingScorers, setIsLoadingScorers] = useState<boolean>(true);
  const [isLoadingRedCards, setIsLoadingRedCards] = useState<boolean>(true);
  const [errorScorers, setErrorScorers] = useState<string>('');
  const [errorRedCards, setErrorRedCards] = useState<string>('');
  
  useEffect(() => {
    const fetchTopScorers = async () => {
      setIsLoadingScorers(true);
      setErrorScorers('');
      
      try {
        const data = await apiService.getTopScorers();
        setTopScorers(data);
      } catch (err) {
        setErrorScorers('Failed to load top scorers. Please try again later.');
        console.error('Top scorers fetch error:', err);
      } finally {
        setIsLoadingScorers(false);
      }
    };
    
    const fetchRedCardedPlayers = async () => {
      setIsLoadingRedCards(true);
      setErrorRedCards('');
      
      try {
        const data = await apiService.getRedCardedPlayers();
        setRedCardedPlayers(data);
        
        // Group by team_name
        const grouped = data.reduce((acc: { [key: string]: any[] }, player: any) => {
          if (!acc[player.team_name]) {
            acc[player.team_name] = [];
          }
          acc[player.team_name].push(player);
          return acc;
        }, {});
        
        setGroupedRedCards(grouped);
      } catch (err) {
        setErrorRedCards('Failed to load red carded players. Please try again later.');
        console.error('Red carded players fetch error:', err);
      } finally {
        setIsLoadingRedCards(false);
      }
    };
    
    fetchTopScorers();
    fetchRedCardedPlayers();
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">
          View player statistics including top scorers and disciplinary information.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Medal className="h-5 w-5 text-blue-800 mr-2" />
            Top Scorers
          </h2>
          
          {errorScorers && <Alert variant="error" message={errorScorers} className="mb-4" />}
          
          <Card>
            <Table
              headers={['Rank', 'Player', 'Goals']}
              data={topScorers}
              isLoading={isLoadingScorers}
              noDataMessage="No top scorer data available."
              renderRow={(scorer, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-blue-800'}
                      `}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{scorer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {scorer.total_goals}
                    </span>
                  </td>
                </tr>
              )}
            />
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            Red Carded Players
          </h2>
          
          {errorRedCards && <Alert variant="error" message={errorRedCards} className="mb-4" />}
          
          <Card>
            {isLoadingRedCards ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item}>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : Object.keys(groupedRedCards).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedRedCards).map(([teamName, players]) => (
                  <div key={teamName}>
                    <h3 className="text-md font-semibold text-gray-800 mb-2 pb-1 border-b">
                      {teamName}
                    </h3>
                    <ul className="divide-y divide-gray-100">
                      {players.map((player) => (
                        <li key={player.kfupm_id} className="py-2 flex justify-between">
                          <span className="text-gray-800">{player.player_name}</span>
                          <span className="text-sm text-gray-500">ID: {player.kfupm_id}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No red carded players found.</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};