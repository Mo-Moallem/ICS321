import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../api/apiService';

export const AddPlayerForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState({
    kfupm_id: '',
    name: '',
    email: '',
    jersey_no: '',
    position_to_play: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const positions = [
    { position_id: 'GK', position_desc: 'Goalkeeper' },
    { position_id: 'DF', position_desc: 'Defender' },
    { position_id: 'MF', position_desc: 'Midfielder' },
    { position_id: 'FD', position_desc: 'Forward' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validation
    if (!form.kfupm_id || !form.name || !form.email || !form.jersey_no || !form.position_to_play) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.addPlayer({
        ...form,
        jersey_no: Number(form.jersey_no),
      });
      setSuccess('Player added successfully!');
      setForm({ kfupm_id: '', name: '', email: '', jersey_no: '', position_to_play: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const sqlError = err?.response?.data?.sqlError;
      if (err?.response?.status === 400) {
        setError('Missing or invalid fields.');
      } else if (err?.response?.status === 404) {
        setError('Playing position not found.' + (sqlError ? ` [${sqlError.code}] ${sqlError.message}` : ''));
      } else if (err?.response?.status === 409) {
        setError('Player already exists.' + (sqlError ? ` [${sqlError.code}] ${sqlError.message}` : ''));
      } else if (sqlError) {
        setError(`SQL Error [${sqlError.code}]: ${sqlError.message}`);
      } else {
        setError('Failed to add player.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Add New Player</h3>
      {error && <Alert variant="error" message={error} className="mb-4" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-4" onClose={() => setSuccess('')} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="kfupm_id"
            placeholder="KFUPM ID"
            value={form.kfupm_id}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="number"
            name="jersey_no"
            placeholder="Jersey Number"
            value={form.jersey_no}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <Select
            label="Playing Position"
            name="position_to_play"
            options={positions.map((p) => ({ value: p.position_id, label: p.position_desc }))}
            value={form.position_to_play}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Player
          </Button>
        </div>
      </form>
    </Card>
  );
}; 