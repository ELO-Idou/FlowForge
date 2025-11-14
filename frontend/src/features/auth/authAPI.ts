import { apiClient } from '../../services/api';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../types/auth.types';

export const login = async (payload: LoginRequest) => {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const register = async (payload: RegisterRequest) => {
  const response = await apiClient.post<LoginResponse>('/auth/register', payload);
  return response.data;
};
