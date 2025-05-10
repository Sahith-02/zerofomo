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
    <header className="zf-site-header">
      <div className="zf-header-content">
        <div className="zf-left-section">
          <Link to="/" className="zf-logo-link">
            <img src="/assets/logo.jpg" alt="ZF logo" className="zf-logo-image" />
          </Link>
          <Link to="/" className="zf-brand-title">
            <h1 className='zf-brand-text'>ℤero𝔽OMO.</h1>
          </Link>
        </div>

        <button 
          className="zf-mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>

        <div className={`zf-right-section ${showMobileMenu ? 'zf-mobile-menu-active' : ''}`}>
          <nav className="zf-nav-links">
            <Link to="/about" className="zf-nav-link">About Us</Link>
            <Link to="/services" className="zf-nav-link">Services</Link>
            <Link to="/webinars" className="zf-nav-link">Webinars</Link>
            <Link to="/contact" className="zf-nav-link">Contact Us</Link>
          </nav>

          <div className="zf-profile-section" ref={dropdownRef}>
            <div 
              className="zf-profile-icon" 
              onClick={() => currentUser ? setShowDropdown(!showDropdown) : navigate('/login')}
            >
              <img src="/assets/user.png" alt="Profile" className="zf-profile-image" />
            </div>
            
            {showDropdown && currentUser && (
              <div className="zf-dropdown-menu">
                <div className="zf-user-info">
                  <p>{currentUser.displayName || currentUser.email}</p>
                </div>
                <Link to="/profile" className="zf-dropdown-item" onClick={() => setShowDropdown(false)}>
                  Profile
                </Link>
                <button className="zf-dropdown-item zf-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;