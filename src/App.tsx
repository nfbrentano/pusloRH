import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Respondent from './pages/Respondent';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/builder"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Builder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Builder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/responder/:id"
          element={
            <ProtectedRoute>
              <Respondent />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
