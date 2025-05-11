import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Users,
  Calendar,
  Bell,
  Mail,
  ListChecks
} from 'lucide-react';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-blue-800 text-white'
        : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    return null; // Redirect happens in the useEffect
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage tournaments, teams, and player assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <nav className="space-y-2">
              <AdminNavItem
                to="/admin"
                icon={<Layers className="h-5 w-5" />}
                label="Dashboard"
                isActive={isActive('/admin')}
              />
              <AdminNavItem
                to="/admin/tournaments"
                icon={<Calendar className="h-5 w-5" />}
                label="Tournaments"
                isActive={isActive('/admin/tournaments')}
              />
              <AdminNavItem
                to="/admin/matches"
                icon={<ListChecks className="h-5 w-5" />}
                label="Matches"
                isActive={isActive('/admin/matches')}
              />
              <AdminNavItem
                to="/admin/teams"
                icon={<Users className="h-5 w-5" />}
                label="Teams"
                isActive={isActive('/admin/teams')}
              />
              <AdminNavItem
                to="/admin/players"
                icon={<PlusCircle className="h-5 w-5" />}
                label="Player Approvals"
                isActive={isActive('/admin/players')}
              />
              <AdminNavItem
                to="/admin/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Match Notifications"
                isActive={isActive('/admin/notifications')}
              />
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};