import './styles/global.css';
import './styles/animations.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { WorkspacePage } from './pages/WorkspacePage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<WorkspacePage />} />
    </Routes>
  </BrowserRouter>
);
