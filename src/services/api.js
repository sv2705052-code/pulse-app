import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:8005/api');

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Users
export const getSwipeUsers = () => api.get('/users/swipe');
export const getMatches = () => api.get('/users/matches');
export const updateProfile = (data) => api.put('/users/profile', data);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

// Matches
export const likeUser = (targetUserId) => api.post('/matches/like', { targetUserId });
export const passUser = (targetUserId) => api.post('/matches/pass', { targetUserId });
export const unlikeUser = (targetUserId) => api.post('/matches/unlike', { targetUserId });

// Messages
export const sendMessage = (recipientUserId, content) =>
  api.post('/messages/send', { recipientUserId, content });
export const getConversation = (otherUserId) => api.get(`/messages/${otherUserId}`);
export const getAllConversations = () => api.get('/messages/conversations');
export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);

// AI
export const getAiAnalysis = (matchId) => api.get(`/ai/analyze/${matchId}`);

export default api;
