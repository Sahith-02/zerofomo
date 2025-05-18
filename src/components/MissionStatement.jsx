import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MissionStatement.css';

const MissionStatement = ({ 
  title, 
  subtitle, 
  paragraphs, 
  imageUrl, 
  imageAlt, 
  buttonText, 
  buttonLink,
  imageHeight, // Prop for custom image height
  imageWidth   // New prop for custom image width
}) => {
  // Create custom style object based on provided dimensions
  const imageStyle = {
    ...(imageHeight ? { maxHeight: imageHeight } : {}),
    ...(imageWidth ? { maxWidth: imageWidth } : {})
  };
  
  return (
    <div className="mission-container">
      {/* Desktop View - Keeps existing layout */}
      <div className="desktop-view">
        <div className="mission-content">
          <div className="mission-tag">OUR MISSION</div>
          <h1 className="mission-title">{title}</h1>
          {subtitle && <h2 className="mission-subtitle">{subtitle}</h2>}
          
          <div className="mission-text">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <Link to={buttonLink || '#'} className="mission-button">{buttonText || 'LEARN ABOUT OUR SERVICES'}</Link>
        </div>
        
        <div className="mission-image" style={imageStyle}>
          <img src={imageUrl} alt={imageAlt} style={imageStyle} />
        </div>
      </div>

      {/* Mobile View - Title, Image, Content */}
      <div className="mobile-view">
        <div className="mobile-header">
          <div className="mission-tag">OUR MISSION</div>
          <h1 className="mission-title">{title}</h1>
          {subtitle && <h2 className="mission-subtitle">{subtitle}</h2>}
        </div>
        
        <div className="mission-image" style={imageStyle}>
          <img src={imageUrl} alt={imageAlt} style={imageStyle} />
        </div>
        
        <div className="mobile-content">
          <div className="mission-text">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <Link to={buttonLink || '#'} className="mission-button">{buttonText || 'LEARN ABOUT OUR SERVICES'}</Link>
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;