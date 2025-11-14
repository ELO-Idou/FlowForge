import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    logout(state) {
      state.status = 'idle';
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
