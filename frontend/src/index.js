import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './loginpage';
import HomePage from './homepage';
import RegisterPage from './register';
import Dashboard from './dashboard';
import CertificatePage from './cert';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cert" element={<CertificatePage />} />

      </Routes>
    </Router>
  </React.StrictMode>
);