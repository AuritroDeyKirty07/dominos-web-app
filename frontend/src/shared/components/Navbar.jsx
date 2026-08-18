import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js'
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { isAuthenticated, role } = useAuthStore()
  const isLoggedIn = isAuthenticated

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="brand-text">Dominos</span>
        </Link>
      </div>
      
      <div className="navbar-right">
        {role !== 'cook' && role !== 'delivery' && <Link to="/store" className="nav-link">Store</Link>}
        {isLoggedIn && role === 'customer' && <Link to="/cart" className="nav-link">Cart</Link>}
        {role === 'cook' && <Link to="/kitchen" className="nav-link">Dashboard</Link>}
        {role === 'delivery' && <Link to="/delivery" className="nav-link">Dashboard</Link>}
        {!isLoggedIn && (
        <button 
          className={`nav-btn ${currentPath === '/register' ? 'active' : ''}`}
          onClick={() => navigate('/register')}
        >
          Register
        </button>
        )}
        
        {!isLoggedIn && (
        <button 
          className={`nav-btn ${currentPath === '/login' ? 'active' : ''}`}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        )}
        
        {isLoggedIn && (
        <div className="profile-icon" title="My Profile" onClick={() => navigate('/profile')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        )}
      </div>
      
    </nav>
  );
}
