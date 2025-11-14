import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../features/auth/authAPI';
import { loginFailure, loginStart, loginSuccess, logout } from '../features/auth/authSlice';
import { selectAuthState } from '../types/auth.types';
import type { AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector(selectAuthState);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const result = await login({ email, password });
      dispatch(loginSuccess(result));
    } catch (error) {
      dispatch(loginFailure((error as Error).message));
    }
  }, [dispatch]);

  const handleRegister = useCallback(async (email: string, password: string, company: string) => {
    try {
      dispatch(loginStart());
      const result = await register({ email, password, company });
      dispatch(loginSuccess(result));
    } catch (error) {
      dispatch(loginFailure((error as Error).message));
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { ...state, login: handleLogin, register: handleRegister, logout: handleLogout };
};
