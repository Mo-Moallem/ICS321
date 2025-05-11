import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, Medal } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Layout } from '../../components/Layout/Layout';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const [tournamentsData, topScorersData] = await Promise.all([
          apiService.getTournaments(),
          apiService.getTopScorers(),
        ]);
        
        setTournaments(tournamentsData);
        setTopScorers(topScorersData.slice(0, 5)); // Just get top 5
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Home data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);
  
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tournament Management System</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View tournament information, match results, teams, and player statistics.
        </p>
      </div>
      
      {error && <Alert variant="error" message={error} className="mb-6" />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link to="/match-results" className="block">
          <Card className="h-full transition-transform duration-300 transform hover:scale-105 hover:shadow-lg" hoverable>
            <div className="flex flex-col items-center text-center p-4">
              <Calendar className="h-16 w-16 text-blue-800 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Match Results</h2>
              <p className="text-gray-600">
                Browse match results by tournament, sorted by date.
              </p>
            </div>
          </Card>
        </Link>
        
        <Link to="/statistics" className="block">
          <Card className="h-full transition-transform duration-300 transform hover:scale-105 hover:shadow-lg" hoverable>
            <div className="flex flex-col items-center text-center p-4">
              <Medal className="h-16 w-16 text-blue-800 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Statistics</h2>
              <p className="text-gray-600">
                View top scorers and disciplinary information like red carded players.
              </p>
            </div>
          </Card>
        </Link>
        
        <Link to="/teams" className="block">
          <Card className="h-full transition-transform duration-300 transform hover:scale-105 hover:shadow-lg" hoverable>
            <div className="flex flex-col items-center text-center p-4">
              <Users className="h-16 w-16 text-blue-800 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Teams</h2>
              <p className="text-gray-600">
                Explore team information, including members, manager, and coach details.
              </p>
            </div>
          </Card>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Current Tournaments" bordered>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : tournaments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tournaments.map((tournament) => (
                <li key={tournament.tr_id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-blue-800 mr-3" />
                    <span>{tournament.tr_name}</span>
                  </div>
                  <Link 
                    to={`/match-results?tournamentId=${tournament.tr_id}`}
                    className="text-blue-800 hover:text-blue-900 text-sm font-medium"
                  >
                    View Matches
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tournaments available.</p>
          )}
        </Card>
        
        <Card title="Top Scorers" bordered>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : topScorers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topScorers.map((scorer, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span>{scorer.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {scorer.total_goals} {scorer.total_goals === 1 ? 'goal' : 'goals'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No scorer data available.</p>
          )}
          
          <div className="mt-4 text-right">
            <Link 
              to="/statistics"
              className="text-blue-800 hover:text-blue-900 text-sm font-medium"
            >
              View All Statistics
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};