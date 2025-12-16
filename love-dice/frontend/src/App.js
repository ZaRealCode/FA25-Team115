import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import ProposeDate from '@/pages/ProposeDate';
import ActiveDates from '@/pages/ActiveDates';
import PlaceBets from '@/pages/PlaceBets';
import RollDice from '@/pages/RollDice';
import DateRecap from '@/pages/DateRecap';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/propose" element={user ? <ProposeDate /> : <Navigate to="/" />} />
          <Route path="/active" element={user ? <ActiveDates /> : <Navigate to="/" />} />
          <Route path="/bets" element={user ? <PlaceBets /> : <Navigate to="/" />} />
          <Route path="/roll" element={user ? <RollDice /> : <Navigate to="/" />} />
          <Route path="/recap" element={user ? <DateRecap /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthContext.Provider>
  );
}

export default App;