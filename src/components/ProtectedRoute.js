import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;