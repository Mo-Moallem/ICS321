export const API_BASE_URL = 'https://7bbgozqyyaiolr65kesfo4pjny0koaym.lambda-url.eu-north-1.on.aws';

export const endpoints = {
  // Auth endpoints
  login: '/login',
  logout: '/logout',
  
  // Tournament endpoints
  tournaments: '/tournaments',
  addTournament: '/add-tournament',
  deleteTournament: '/delete-tournament', // /:tr_id
  tournamentTeams: '/tournament-teams', // /:tr_id
  
  // Team endpoints
  teams: '/teams',
  addTeam: '/add-team',
  teamsInTournament: '/teams-in-tournament', // /:tr_id
  teamsNotInTournament: '/teams-not-in-tournament', // /:tr_id
  teamMembers: '/team-members', // /:teamId
  addTeamToTournament: '/add-team-to-tournament',
  
  // Player endpoints
  players: '/players', // or /:teamId or /:team_id/:tr_id
  playersNotInTeam: '/players-not-in-team',
  approve: '/approve',
  selectCaptain: '/select-captain',
  playingPositions: '/playing-positions',
  addPlayer: '/add-player',
  
  // Match endpoints
  matchResults: '/match-results', // /:tournamentId
  addResult: '/add-result',
  
  // Statistics endpoints
  topScorer: '/t-scorer',
  redCardedPlayers: '/red-carded-players',
  
  // Notification endpoints
  sendEmail: '/send-email-nodemailer', // /:time
};