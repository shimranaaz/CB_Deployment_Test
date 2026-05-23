import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; 
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
 const { token, loading, user } = useSelector((state: any) => state.auth);
  const [isDirectAccess, setIsDirectAccess] = useState(false);

  useEffect(() => {
    // Check if user ever had a token in this session
    const hadSession = sessionStorage.getItem('hadAuthSession');
    
    if (!token && !hadSession) {
      // Never had a session = direct URL access
      setIsDirectAccess(true);
    }
    
    if (token) {
      // Mark that this session has/had authentication
      sessionStorage.setItem('hadAuthSession', 'true');
    }
  }, [token]);

if (loading || (token && !user)) return null;

  if (!token) {
    if (isDirectAccess) {
      // Direct URL access in incognito/new tab
      return <Navigate to="/NotFound" replace />;
    } else {
      // Logged out or session expired
      return <Navigate to="/login" replace />;
    }
  }

  // Role check — only runs if allowedRoles is passed
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    if (user.role === 'sales') return <Navigate to="/sales/ats-checker" replace />;
    if (user.role === 'user') return <Navigate to="/app" replace />;
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;