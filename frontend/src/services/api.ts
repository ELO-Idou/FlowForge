import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 300000, // 5 minutes for AI workflow generation
});
