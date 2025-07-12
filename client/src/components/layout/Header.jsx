import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import { buttonVariants } from '../../utils/theme';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-primary-DEFAULT" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-dark-dark">Task Manager</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-4">
            {user ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    className="text-dark-DEFAULT hover:text-primary-DEFAULT transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-dark-DEFAULT hover:text-primary-DEFAULT transition"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className={`px-3 py-1 ${buttonVariants.neutral} rounded-md`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className="text-dark-DEFAULT hover:text-primary-DEFAULT transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className={`px-3 py-1 ${buttonVariants.primary} rounded-md`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;