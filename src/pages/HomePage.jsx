import React, { useState } from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { MdOutlineDoubleArrow } from "react-icons/md";
import Header from '../components/Header';
import Student_Home from '../components/Student_Home';
import Parent_Home from '../components/Parent_Home';
import Students_Placed from '../components/Students_Placed';
import MissionStatement from '../components/MissionStatement';
import Carousel from './Carousel';

const StudentMission = () => {
  return (
    <MissionStatement
      title="To eliminate your FOMO and fuel your future."
      paragraphs={[
        "Whether you're a topper with a plan or still figuring it out, we are here for you",
        "No noise, no pressure, just real guidance from choosing the right path to cracking admissions, so move forward with confidence.",
        "Whatever your starting point, let's build what's next your way because we believe everyone is capable of becoming someone they are proud of."
      ]}
      imageUrl="../assets/student_mission.jpg"
      imageAlt="Excited student with laptop and headphones"
      buttonText="LEARN ABOUT OUR SERVICES"
      buttonLink="/student"
      imageHeight="400px" // Smaller height for this mission statement
      imageWidth="450px"  // Custom width for this mission statement
    />
  );
};

// Example 2: Parent-focused mission (from second image)
const ParentMission = () => {
  return (
    <MissionStatement
      title="To make sure parents never feel left out of their child's journey."
      paragraphs={[
        "Sometimes, you may not have the knowledge or exposure to the path your child wants to take and that's okay.",
        "Sometimes, you know their strengths and want to ensure they're on the right track.",
        "And sometimes, you're simply worried because they don't seem to have any direction at all.",
        "Whatever the situation, you're not alone.",
        "We're here to help you stay informed, involved, and confident so you can support your child with clarity and heart."
      ]}
      imageUrl="../assets/parent_mission.jpg"
      imageAlt="Parent and child smiling together"
      buttonText="LEARN ABOUT OUR SERVICES"
      buttonLink="/parent"
      imageHeight="450px" // Taller height for this mission statement
      imageWidth="700px"  // Wider width for this mission statement
    />
  );
};

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
      <StudentMission />
      
      {/* Other content */}
      <div style={{ height: '50px' }}></div>
      
      <ParentMission />
      <Carousel/>
    </div>

  );
};

export default HomePage;