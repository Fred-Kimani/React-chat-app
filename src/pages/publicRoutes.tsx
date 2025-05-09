// components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { JSX } from 'react';


const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/mychats" /> : children;
};

export default PublicRoute;
