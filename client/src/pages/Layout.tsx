import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Login from './Login';
import api from '../configs/api';

interface User {
  name: string;
  email?: string;
  id?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
}

interface RootState {
  auth: AuthState;
}

const Layout: React.FC = () => {
  const { user, loading, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user || !token) {
        setCheckingRole(false);
        return;
      }

      try {
        const { data } = await api.get('/users/data');
        
        // If user is admin and trying to access /app routes (not /admin)
      // ✅ FIX: Allow admin/sales to access /app/builder for editing user resumes
// Only redirect admin away from /app dashboard, not from builder
if (data.user.role === 'admin' && location.pathname === '/app') {
  navigate('/admin/dashboard', { replace: true });
}
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user, token, location.pathname, navigate]);

  if (loading || checkingRole) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;