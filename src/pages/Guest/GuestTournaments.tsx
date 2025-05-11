import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { TournamentTeamsTable } from '../Admin/Tournaments/TournamentTeamsTable';
import { apiService } from '../../api/apiService';
import { Layout } from '../../components/Layout/Layout';

export const GuestTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await apiService.getTournaments();
        setTournaments(data);
        if (data.length > 0) {
          setSelectedTournamentId(data[0].tr_id);
        }
      } catch (err) {
        setError('Failed to load tournaments.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tournament Teams & Rankings</h2>
        {error && <Alert variant="error" message={error} className="mb-6" />}
        <Card className="mb-8">
          <Select
            label="Select Tournament"
            options={tournaments.map((t: any) => ({ value: t.tr_id, label: t.tr_name }))}
            value={selectedTournamentId}
            onChange={e => setSelectedTournamentId(e.target.value)}
            fullWidth
            disabled={isLoading}
          />
        </Card>
        {selectedTournamentId && (
          <TournamentTeamsTable tr_id={selectedTournamentId} isAdmin={false} />
        )}
      </div>
    </Layout>
  );
}; 