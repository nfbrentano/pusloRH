import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './config';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Builder from '../pages/Builder';
import Respondent from '../pages/Respondent';
import Employees from '../pages/Employees';
import AddEmployee from '../pages/AddEmployee';
import DepartmentHub from '../pages/DepartmentHub';
import Profile from '../pages/Profile';

import type { UserRole } from '../types';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  isPrivate: boolean;
  allowedRoles?: UserRole[];
}

const routes: RouteConfig[] = [
  // Public Routes
  { path: ROUTES.LOGIN, element: <Login />, isPrivate: false },

  // Private Routes (All Roles)
  { path: ROUTES.DASHBOARD, element: <Dashboard />, isPrivate: true },
  { path: ROUTES.RESPONDENT, element: <Respondent />, isPrivate: true },
  { path: ROUTES.PROFILE, element: <Profile />, isPrivate: true },

  // Private Routes (Admin and HR)
  {
    path: ROUTES.BUILDER_NEW,
    element: <Builder />,
    isPrivate: true,
    allowedRoles: ['ADMIN', 'HR'],
  },
  {
    path: ROUTES.BUILDER_EDIT,
    element: <Builder />,
    isPrivate: true,
    allowedRoles: ['ADMIN', 'HR'],
  },
  {
    path: ROUTES.EMPLOYEES,
    element: <Employees />,
    isPrivate: true,
    allowedRoles: ['ADMIN', 'HR'], // HR should see the list too
  },
  {
    path: ROUTES.EMPLOYEES_NEW,
    element: <AddEmployee />,
    isPrivate: true,
    allowedRoles: ['ADMIN'], // Only Admin can create new users
  },
  {
    path: ROUTES.DEPARTMENTS,
    element: <DepartmentHub />,
    isPrivate: true,
    allowedRoles: ['ADMIN'], // Only Admin can manage departments
  },
];

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.isPrivate ? (
              <ProtectedRoute allowedRoles={route.allowedRoles}>{route.element}</ProtectedRoute>
            ) : (
              route.element
            )
          }
        />
      ))}

      {/* Redirects */}
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes;
