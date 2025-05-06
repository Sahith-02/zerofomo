import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="left-section">
          <Link to="/" className="logo-link">
            <img src="/assets/logo.jpg" alt="ZF logo" className="logo-image" />
          </Link>
          <Link to="/" className="brand-title">
            <h1 className='brand-text'>ℤero𝔽OMO.</h1>
          </Link>
        </div>

        <div className={`right-section ${showMobileMenu ? 'mobile-menu-active' : ''}`}>
          <nav className="nav-links">
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/webinars" className="nav-link">Webinars</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </nav>

          <div className="profile-section" ref={dropdownRef}>
            <div 
              className="profile-icon" 
              onClick={() => currentUser ? setShowDropdown(!showDropdown) : navigate('/login')}
            >
              <img src="/assets/user.png" alt="Profile" className="profile-image" />
            </div>
            
            {showDropdown && currentUser && (
              <div className="dropdown-menu">
                <div className="user-info">
                  <p>{currentUser.displayName || currentUser.email}</p>
                </div>
                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  Profile
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;