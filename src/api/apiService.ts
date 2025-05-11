import { API_BASE_URL, endpoints } from './config';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  const data = isJson ? await response.json() : await response.text();
  
  if (!response.ok) {
    const error = isJson && data.error ? data.error : data || response.statusText;
    throw new Error(error);
  }
  
  return data as T;
};

export const apiService = {
  // Auth
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
  
  logout: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.logout}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
  
  // Tournaments
  getTournaments: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.tournaments}`);
    return handleResponse(response);
  },
  
  getTournamentTeams: async (tr_id: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.tournamentTeams}/${tr_id}`);
    return handleResponse(response);
  },
  
  addTournament: async (tournament: {
    tr_id: string;
    tr_name: string;
    start_date: string;
    end_date: string;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.addTournament}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournament),
    });
    return handleResponse(response);
  },
  
  deleteTournament: async (tr_id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.deleteTournament}/${tr_id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
  
  // Teams
  getTeams: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.teams}`);
    return handleResponse(response);
  },
  
  addTeam: async (team: { team_id: string; team_name: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.addTeam}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    return handleResponse(response);
  },
  
  getTeamsInTournament: async (tr_id: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.teamsInTournament}/${tr_id}`);
    return handleResponse(response);
  },
  
  getTeamsNotInTournament: async (tr_id: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.teamsNotInTournament}/${tr_id}`);
    return handleResponse(response);
  },
  
  getTeamMembers: async (teamId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.teamMembers}/${teamId}`);
    return handleResponse(response);
  },
  
  // Players
  getAllPlayers: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.players}`);
    return handleResponse(response);
  },
  
  getTeamPlayers: async (teamId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.players}/${teamId}`);
    return handleResponse(response);
  },
  
  getTournamentTeamPlayers: async (teamId: string, tr_id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.players}/${teamId}/${tr_id}`);
    return handleResponse(response);
  },
  
  getPlayersNotInTeam: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.playersNotInTeam}`);
    return handleResponse(response);
  },
  
  approvePlayer: async (data: { player_id: string; team_id: string; tr_id: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.approve}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  selectCaptain: async (data: { tr_id: string; team_id: string; player_id: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.selectCaptain}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  // Match Results
  getMatchResults: async (tournamentId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.matchResults}/${tournamentId}`);
    return handleResponse(response);
  },
  
  addMatchResult: async (matchResult: any): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.addResult}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchResult),
    });
    return handleResponse(response);
  },
  
  // Statistics
  getTopScorers: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.topScorer}`);
    return handleResponse(response);
  },
  
  getRedCardedPlayers: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.redCardedPlayers}`);
    return handleResponse(response);
  },
  
  // Notifications
  sendEmailReminders: async (days: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.sendEmail}/${days}`);
    return handleResponse(response);
  },
  
  addTeamToTournament: async (data: { tr_id: string; team_id: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.addTeamToTournament}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  addMatch: async (match: { match_no: string; team_id1: string; team_id2: string; tr_id: string; play_date: string }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/add-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const err: any = new Error(error.message || 'Failed to add match');
      (err.response = { status: response.status, data: error });
      throw err;
    }
    return response.json();
  },
  
  getUpcomingMatchesForTeam: async (tr_id: string, team_id: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/upcoming-matches-for-team/${tr_id}/${team_id}`);
    return handleResponse(response);
  },
  
  getMatchesNoResults: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/matches-no-results`);
    return handleResponse(response);
  },
  
  getVenues: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/venues`);
    return handleResponse(response);
  },
  
  getPlayingPositions: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.playingPositions}`);
    return handleResponse(response);
  },
  
  addPlayer: async (player: { kfupm_id: string; name: string; email: string; jersey_no: number; position_to_play: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}${endpoints.addPlayer}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const err: any = new Error(error.message || 'Failed to add player');
      (err.response = { status: response.status, data: error });
      throw err;
    }
    return response.json();
  },
};