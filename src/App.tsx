import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import { LoginPage } from './pages/Login/LoginPage';
import { HomePage } from './pages/Home/HomePage';
import { MatchResultsPage } from './pages/MatchResults/MatchResultsPage';
import { StatisticsPage } from './pages/Statistics/StatisticsPage';
import { TeamsPage } from './pages/Teams/TeamsPage';
import { GuestPage } from './pages/Guest/GuestPage';
import { GuestTournaments } from './pages/Guest/GuestTournaments';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminHome } from './pages/Admin/AdminHome';
import { TournamentsAdmin } from './pages/Admin/Tournaments/TournamentsAdmin';
import { TeamsAdmin } from './pages/Admin/Teams/TeamsAdmin';
import { PlayersAdmin } from './pages/Admin/Players/PlayersAdmin';
import { NotificationsAdmin } from './pages/Admin/Notifications/NotificationsAdmin';
import { MatchesAdmin } from './pages/Admin/Matches/MatchesAdmin';

// Protected Route Components
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/match-results" element={<MatchResultsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/guest/tournaments" element={<GuestTournaments />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminHome />} />
            <Route path="tournaments" element={<TournamentsAdmin />} />
            <Route path="matches" element={<MatchesAdmin />} />
            <Route path="teams" element={<TeamsAdmin />} />
            <Route path="players" element={<PlayersAdmin />} />
            <Route path="notifications" element={<NotificationsAdmin />} />
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;