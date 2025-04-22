import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <Header />
      
      <div className="profile-container_">
        <div className="profile-card">
          <h2>Your Profile</h2>
          
          <div className="profile-info">
            <div className="profile-avatar">
              {currentUser.displayName ? (
                currentUser.displayName.charAt(0).toUpperCase()
              ) : (
                'U'
              )}
            </div>
            
            <div className="profile-details">
              <p className="profile-name">
                {currentUser.displayName || 'User'}
              </p>
              <p className="profile-email">{currentUser.email}</p>
            </div>
          </div>
          
          <div className="profile-sections">
            <div className="profile-section">
              <h3>Account Information</h3>
              <div className="profile-data">
                <div className="data-item">
                  <span className="data-label">Email:</span>
                  <span className="data-value">{currentUser.email}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Member since:</span>
                  <span className="data-value">
                    {currentUser.metadata.creationTime ? 
                      new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                      'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;