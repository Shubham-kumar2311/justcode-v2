import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Code2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex-between" style={{ height: '64px' }}>
        <Link to="/" className="flex-center" style={{ gap: '0.5rem' }}>
          <Code2 size={28} color="var(--accent-primary)" />
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            JUST-CODE
          </span>
        </Link>

        <div className="flex-center" style={{ gap: '1.5rem' }}>
          <Link to="/problems" style={{ fontWeight: 500 }}>Problems</Link>
          
          {user ? (
            <div className="flex-center" style={{ gap: '1rem' }}>
              <Link to="/profile" className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <User size={18} />
                <span>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex-center" style={{ gap: '1rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
