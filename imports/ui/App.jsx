import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage.jsx';
import Navbar from './Navbar.jsx';
import { Profile } from './Profile.jsx';
import { AIPicks } from './AIPicks.jsx';
import './App.css';

export const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" exact element={<HomePage /> } />
      <Route path="/profile" element={<Profile /> } />
      <Route path="/ai-picks" element={<AIPicks /> } />
    </Routes>
  </BrowserRouter>
)