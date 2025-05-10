import React from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { MdOutlineDoubleArrow } from "react-icons/md";
import Header from '../components/Header';
import Student_Home from '../components/Student_Home';
import Parent_Home from '../components/Parent_Home';
import Students_Placed from '../components/Students_Placed';


const HomePage = () => {
  return (
    <div className="home-container">
      <Header />
      
      <div className="hero-section">
        <div className="hero-background">
          <img src="/assets/banner.jpg" alt="Student studying" className="hero-image" />
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
                {/* <MdOutlineDoubleArrow className="arrow-icon" size={30}/> */}
              </Link>
              <Link to="/parent" className="cta-button">
                <span>👪 I am a Parent</span>
                {/* <MdOutlineDoubleArrow className="arrow-icon" size={30} /> */}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* No Perfect Profile Section */}
      <div className="profile-section">
        <div className="profile-container">
          <div className="profile-image-container">
            <img src="/assets/no_profile.jpg" alt="Students with different profiles" className="no_profile-image" height="100px" />
          </div>
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-title-box">
                <h2 className="profile-title">🎓 No Perfect Profile? No Problem.</h2>
              </div>
            </div>
            <p className="profile-description">
              High or low GPA. Cracked GMAT, GRE, or CAT or still figuring it out.
              Financially ready or looking for support. All-rounder or still finding
              your spark. We've helped hundreds create their success stories.
              <br />
              <span className="profile-description-bottom">Now it's your turn to start yours.</span>
            
            </p>
            
            <div className="profile-difference">
              <h3 className="difference-title">The ZeroFOMO Difference</h3>
              
              <div className="profile-links">
                <Link to="/student" className="profile-link">Student</Link>
                <Link to="/parent" className="profile-link">Parent</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Student_Home/>
      <Parent_Home/>
      <Students_Placed/>
    </div>
  );
};

export default HomePage;