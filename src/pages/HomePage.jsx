import React from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { MdOutlineDoubleArrow } from "react-icons/md";
import Header from '../components/Header';

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
    </div>
  );
};

export default HomePage;