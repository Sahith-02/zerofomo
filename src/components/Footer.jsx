import React from "react";
import "../styles/Footer.css"; // Path to your CSS file
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <img
            src="/assets/logo.jpg"
            alt="Zero Fomo Logo"
            className="footer-logo"
          />
          <p className="footer-logo-text">ZERO FOMO</p>
        </div>

        {/* Menu Section */}
        <div className="footer-menu-section">
          <h2 className="footer-heading">Menu</h2>
          <ul className="footer-menu-list">
            <li className="footer-menu-item">
              <Link to="/student" className="footer-link">
                <span>Student</span>
              </Link>
            </li>
            <li className="footer-menu-item">
              <Link to="/parent" className="footer-link">
                <span>Parent</span>
              </Link>
            </li>
            <li className="footer-menu-item">
              <a href="#" className="footer-link">
                Webinars
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="footer-contact-section">
          <h2 className="footer-heading">Contact Us</h2>
          <div className="footer-contact-item">
            <div className="footer-icon email-icon"></div>
            <a href="mailto:info@zerofomo.com" className="footer-link">
              Email
            </a>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="footer-follow-section">
          <h2 className="footer-heading">Follow Us</h2>
          <div className="footer-social-item">
            <div className="footer-icon linkedin-icon"></div>
            <a href="#" className="footer-link">
              LinkedIn
            </a>
          </div>
          <div className="footer-social-item">
            <div className="footer-icon instagram-icon"></div>
            <a href="#" className="footer-link">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
