import React from 'react';
import { TournamentRankings } from './TournamentRankings';
import { GuestTournaments } from './GuestTournaments';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';

export const GuestPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        <TournamentRankings />
        <GuestTournaments />
        <div className="mt-8">
          <Link to="/guest/tournaments" className="text-blue-700 underline text-lg">
            View Tournament Teams & Rankings Table
          </Link>
        </div>
      </div>
    </Layout>
  );
}; 