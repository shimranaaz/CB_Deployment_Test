import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { logout } from '../app/features/authSlice';
import toast from 'react-hot-toast';

interface User {
  name: string;
  email?: string;
  id?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface RootState {
  auth: AuthState;
}

const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const logoutUser = (): void => {
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('selectedTemplate');
  localStorage.removeItem('selectedTemplateName');
  
  // Dispatch Redux logout action
  dispatch(logout());
  
  // Show success message
  toast.success('Logged out successfully!');
  
  // Navigate to login with replace to prevent back navigation
  navigate('/login', { replace: true });
};


  return (
    <div style={{ backgroundColor: "#2c2a63" }} className="shadow">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2 text-white transition-all">
        
        {/* LOGO */}
     <Link to="/">
            <img
              src="/Logo.png"
              alt="Career Logo"
              className="object-cover"
              style={{ height: "60px", width: "230px", marginTop: "1px" }}
            />
          </Link>

        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>

          {/* TRANSPARENT LOGOUT BUTTON */}
          <button
            onClick={logoutUser}
            className="border border-white px-6 py-1.5 rounded-full active:scale-95 transition-all text-white hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
