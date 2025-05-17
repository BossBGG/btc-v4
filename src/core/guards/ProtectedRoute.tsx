// src/core/guards/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth.hook';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A route guard that ensures the user is authenticated
 * @param children - The content to render if authenticated
 * @returns The children if authenticated, otherwise redirects to login
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Return the children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;