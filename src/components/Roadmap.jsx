import React from 'react';
import '../styles/Roadmap.css'; // Assuming you have a CSS file for styling

const Roadmap = () => {
  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <div className="roadmap-title">ROADMAP</div>
        <div className="roadmap-subtitle">
          <p>We don't follow fixed steps because every student is different.</p>
          <p>We design a unique roadmap that suits you, your goals, and where you are right now.</p>
        </div>
      </div>
      
      <div className="roadmap-content">
        <div className="roadmap-image">
          <img src="/assets/roadmap.jpg" alt="Two hands reaching toward each other" />
        </div>
        
        <div className="roadmap-steps">
          <div className="roadmap-step">
            <h3>01 Choose who you are</h3>
            <p>Start by selecting whether you are a Student or a Parent.</p>
          </div>
          
          <div className="roadmap-step">
            <h3>02 Pick what fits you best</h3>
            <p>Browse our services and choose exactly what you need, whether it is full A-to-Z guidance or help with a specific step.</p>
          </div>
          
          <div className="roadmap-step">
            <h3>03 Set your path</h3>
            <p>If you select full A-to-Z support, we stay by your side until you land in your dream college.</p>
            <p>If you choose a specific service, we complete it with full commitment and offer extra guidance if you need more help along the way.</p>
          </div>
          
          <div className="roadmap-step">
            <h3>04 Get real feedback</h3>
            <p>We show you your strengths, uncover the gaps, and map out your next moves — so you stay confident and never feel stuck.</p>
          </div>
          
          <div className="roadmap-step">
            <h3>05 Chase your dream with clarity</h3>
            <p>Whether you are heading abroad or staying in India, we are with you until you reach your version of success — every step of the way.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;