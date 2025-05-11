import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Trophy className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Tournament Manager</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/match-results"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/match-results') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              Match Results
            </Link>
            <Link
              to="/statistics"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/statistics') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              Statistics
            </Link>
            <Link
              to="/teams"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/teams') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              Teams
            </Link>
            <Link
              to="/guest/tournaments"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/guest/tournaments') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              Tournament Table
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/admin') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-blue-100 hover:bg-blue-800"
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
              >
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/login') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/match-results"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/match-results') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Match Results
            </Link>
            <Link
              to="/statistics"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/statistics') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Statistics
            </Link>
            <Link
              to="/teams"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/teams') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              to="/guest/tournaments"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/guest/tournaments') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tournament Table
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname.startsWith('/admin') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/login') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};