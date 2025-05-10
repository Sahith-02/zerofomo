import React from 'react';
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
      <div className="mission-content">
        <div className="mission-tag">OUR MISSION</div>
        <h1 className="mission-title">{title}</h1>
        {subtitle && <h2 className="mission-subtitle">{subtitle}</h2>}
        
        <div className="mission-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <a href={buttonLink || '#'} className="mission-button">{buttonText || 'LEARN ABOUT OUR SERVICES'}</a>
      </div>
      
      <div className="mission-image" style={imageStyle}>
        <img src={imageUrl} alt={imageAlt} style={imageStyle} />
      </div>
    </div>
  );
};

export default MissionStatement;