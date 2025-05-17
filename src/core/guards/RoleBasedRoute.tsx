// src/core/guards/RoleBasedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth.hook';
import { UserRole } from '../../stores/auth.store';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * A route guard that checks if the user has the required role
 * @param children - The content to render if authorized
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns The children if authorized, otherwise redirects to appropriate page
 */
const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  
  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If user has a role and it's allowed, show the content
  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // Otherwise redirect based on role
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (userRole === 'staff') {
    return <Navigate to="/staff-dashboard" replace />;
  } else {
    // Regular student or unknown role
    return <Navigate to="/" replace />;
  }
};

export default RoleBasedRoute;
