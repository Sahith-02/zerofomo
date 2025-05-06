import React from 'react';
import '../styles/Categories.css';
import Header from '../components/Header';

const ParentPage = () => {
  const journeyOptions = [
    {
      title: "Evaluate Their Choices",
      image: "/assets/P1.jpg",
      description: "Talk through your child's interests, the direction they're considering, and understand the pros, cons, and long-term fit with complete clarity.",
      buttonText: "Book a Session"
    },
    {
      title: "Gain Knowledge, Discover Possibilities",
      image: "/assets/P2.jpg",
      description: "Get up-to-date knowledge about trending fields, new-age courses, college options (in India & abroad), and what today's world demands - all simplified for you.",
      buttonText: "Book a Session"
    },
    {
      title: "Share concerns & Find Direction",
      image: "/assets/P3.jpg",
      description: "No judgment, no pressure. Just a supportive space to share your concerns, ask your questions, and gain clarity on how to best guide your child's future",
      buttonText: "Book a Session"
    }
  ];

  return (
    <div className="student-page-container">
      <Header />
      {/* Background div instead of img for more control */}
      <div 
        className="student-background"
        style={{
          backgroundImage: "url('/assets/parent_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.2)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1
        }}
      ></div>
      
      <div className="student-content" style={{
        position: "relative", 
        zIndex: 2, 
        padding: "40px 25px",
        minHeight: "100vh"
      }}>
        <h1 className="student-journey-heading">Looking for What Truly Fits Your Child?</h1>
        
        <div className="student-journey-options-container">
          {journeyOptions.map((option, index) => (
            <div className="student-journey-option" key={index}>
              <div className="student-journey-image-container">
                <img src={option.image} alt={option.title} className="student-journey-image" />
              </div>
              <h2 className="student-journey-title">{option.title}</h2>
              <p className="student-journey-description">{option.description}</p>
              <button className="student-journey-button">
                <span className="button-text">{option.buttonText}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentPage;