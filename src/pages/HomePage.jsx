import React, { useState } from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { MdOutlineDoubleArrow } from "react-icons/md";
import Header from '../components/Header';
import Student_Home from '../components/Student_Home';
import Parent_Home from '../components/Parent_Home';
import Students_Placed from '../components/Students_placed';

const HomePage = () => {
  // State to track which tab is active (default: 'student')
  const [activeTab, setActiveTab] = useState('student');

  // Handler to switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="home-container">
      <Header />
      
      <div className="hero-section">
        <div className="hero-background">
          {/* Desktop banner image */}
          <img src="/assets/banner.jpg" alt="Student studying" className="hero-image desktop-banner" />
          {/* Mobile banner image */}
          <img src="/assets/banner_mobile_view.jpg" alt="Student studying" className="hero-image mobile-banner" />
        </div>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Way Forward</h1>
            <p className="hero-tagline">
              Helping Students & Parents Make Confident Decisions —
              <br />
              <span className="strikethrough">Fear of Missing Out</span>
              <span className="highlight">Facts Over Misleading Opinions</span>
            </p>
            
            <div className="cta-buttons">
              <Link to="/student" className="cta-button">
                <span>👨‍🎓 I am a Student</span>
              </Link>
              <Link to="/parent" className="cta-button">
                <span>👪 I am a Parent</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* No Perfect Profile Section */}
      <div className="profile-section">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-title-box">
            <h2 className="profile-title">🎓 No Perfect Profile?<br className="mobile-only" /> No Problem.</h2>
            </div>
          </div>
          
          <div className="profile-content-wrapper">
            <div className="profile-image-container">
              <img src="/assets/no_profile.jpg" alt="Students with different profiles" className="no_profile-image" />
            </div>
            <div className="profile-content">
              <p className="profile-description">
                High or low GPA. Cracked GMAT, GRE, or CAT or still figuring it out.
                Financially ready or looking for support. All-rounder or still finding
                your spark. We've helped hundreds create their success stories.
                <br />
                <span className="profile-description-bottom">Now it's your turn to start yours.</span>
              </p>
            </div>
          </div>
          
          <div className="profile-difference">
            <div className="difference-title-box">
              <h2 className="difference-title">The ZeroFOMO Difference</h2>
            </div>
            
            <div className="profile-links">
              <button 
                className={`profile-link ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => handleTabChange('student')}
              >
                Student
              </button>
              <button 
                className={`profile-link ${activeTab === 'parent' ? 'active' : ''}`}
                onClick={() => handleTabChange('parent')}
              >
                Parent
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content section with transition effects */}
      <div className="tab-content-container">
        <div className={`tab-content ${activeTab === 'student' ? 'active' : ''}`}>
          {activeTab === 'student' && <Student_Home />}
        </div>
        <div className={`tab-content ${activeTab === 'parent' ? 'active' : ''}`}>
          {activeTab === 'parent' && <Parent_Home />}
        </div>
      </div>
      
      <Students_Placed />
    </div>
  );
};

export default HomePage;