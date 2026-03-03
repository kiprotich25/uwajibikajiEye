import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Reports
export const submitReport = (data) => API.post('/reports', data);
export const getAllReports = () => API.get('/reports');
export const getReportsByCandidate = (name) =>
    API.get(`/reports/candidate/${encodeURIComponent(name)}`);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard');

// Candidates
export const getAllCandidates = () => API.get('/candidates');
export const getCandidateProfile = (name) =>
    API.get(`/candidates/${encodeURIComponent(name)}`);

export default API;
