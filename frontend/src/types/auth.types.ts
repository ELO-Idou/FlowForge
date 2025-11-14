export interface User {
  id: string;
  email: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  company: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export const selectAuthState = (state: { auth: AuthState }) => state.auth;
