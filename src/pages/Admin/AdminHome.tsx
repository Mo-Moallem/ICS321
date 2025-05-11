import React, { useEffect, useState } from 'react';
import { Calendar, Users, UserCheck, Award, Mail } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Link } from 'react-router-dom';

export const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({
    tournaments: 0,
    teams: 0,
    players: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch tournament count
        const tournaments = await apiService.getTournaments();
        
        // Fetch team count
        const teams = await apiService.getTeams();
        
        // Get player count - as a rough approximation, we'll use the sum of all team players
        let playerCount = 0;
        try {
          const players = await apiService.getAllPlayers();
          playerCount = players.count || 0;
        } catch (err) {
          // If the players fetch fails, continue with 0
          console.error('Player count fetch error:', err);
        }
        
        setStats({
          tournaments: tournaments.length || 0,
          teams: teams.length || 0,
          players: playerCount,
        });
      } catch (err) {
        setError('Failed to load dashboard statistics. Please refresh the page to try again.');
        console.error('Dashboard stats fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    linkTo: string;
    linkText: string;
  }> = ({ title, value, icon, linkTo, linkText }) => (
    <Card className="h-full transition-transform duration-300 transform hover:scale-105 hover:shadow-lg" hoverable>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="p-2 bg-blue-100 rounded-md text-blue-800">
            {icon}
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-auto"></div>
        ) : (
          <div className="text-3xl font-bold text-gray-900 mb-auto">{value.toString()}</div>
        )}
        
        <Link to={linkTo} className="mt-4 text-blue-800 hover:text-blue-900 text-sm font-medium">
          {linkText}
        </Link>
      </div>
    </Card>
  );
  
  return (
    <div>
      <Card title="Dashboard Overview" bordered>
        {error && <Alert variant="error" message={error} className="mb-6" />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Tournaments"
            value={stats.tournaments}
            icon={<Calendar className="h-6 w-6" />}
            linkTo="/admin/tournaments"
            linkText="Manage Tournaments"
          />
          
          <StatCard
            title="Teams"
            value={stats.teams}
            icon={<Users className="h-6 w-6" />}
            linkTo="/admin/teams"
            linkText="Manage Teams"
          />
          
          <StatCard
            title="Players"
            value={stats.players}
            icon={<UserCheck className="h-6 w-6" />}
            linkTo="/admin/players"
            linkText="Manage Players"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Award className="h-12 w-12 text-blue-800 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/admin/tournaments?action=add">
                    <Button size="sm" fullWidth>
                      Add New Tournament
                    </Button>
                  </Link>
                  <Link to="/admin/teams?action=add">
                    <Button size="sm" variant="outline" fullWidth>
                      Add New Team
                    </Button>
                  </Link>
                  <Link to="/admin/players">
                    <Button size="sm" variant="outline" fullWidth>
                      Approve Players
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start">
              <Mail className="h-12 w-12 text-green-700 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Match Notifications</h3>
                <p className="text-gray-600 mb-4">
                  Send email reminders to team members about upcoming matches.
                </p>
                <Link to="/admin/notifications">
                  <Button variant="success" size="sm">
                    Manage Notifications
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};