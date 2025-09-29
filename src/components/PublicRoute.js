import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If user is authenticated, redirect to welcome page
  if (currentUser) {
    return <Navigate to="/welcome" replace />;
  }

  // If user is not authenticated, render the public component (login/register)
  return children;
};

export default PublicRoute;