
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {authAPI} from '../utils/auth'; 

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;