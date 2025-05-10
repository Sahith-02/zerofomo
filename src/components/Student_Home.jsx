import React from 'react';
import '../styles/Student_Home.css';

const Student_Home = () => {
  return (
    <div className="student_home_container">
      <div className="student_home_relative_container">
        {/* Image wrapper - only shown on desktop/laptop */}
        <div className="student_home_image_wrapper">
          <div className="student_home_left_image">
            <img 
              src="/assets/student_table_1.jpg" 
              alt="Left side image" 
              className="student_home_img"
            />
          </div>
          <div className="student_home_right_image">
            <img 
              src="/assets/student_table_2.jpg" 
              alt="Right side image" 
              className="student_home_img"
            />
          </div>
        </div>
        
        {/* Table overlay - shown on all devices */}
        <div className="comparison_table_overlay">
          <table className="comparison_table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>ZeroFOMO</th>
                <th>Online Ed Companies</th>
                <th>Consultancies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature">Confident / Unsure / just feeling the FOMO</td>
                <td className="positive">✅ Guides All</td>
                <td className="neutral">⚠️ Limited support if unsure</td>
                <td className="negative">❌ No space to explore or figure things out</td>
              </tr>
              <tr>
                <td className="feature">Real Mentors (Students/Alumni)</td>
                <td className="positive">✅ Walked the path</td>
                <td className="neutral">⚠️ Part-time, extra income motive</td>
                <td className="negative">❌ Salespeople, not mentors</td>
              </tr>
              <tr>
                <td className="feature">Personalized Guidance (Not Just Scores)</td>
                <td className="positive">✅ All profiles welcome</td>
                <td className="neutral">⚠️ Importance given only to high scorers</td>
                <td className="negative">❌ Fit doesn't matter, commission-driven</td>
              </tr>
              <tr>
                <td className="feature">No College Tie-Ups</td>
                <td className="positive">✅ Independent & honest</td>
                <td className="neutral">⚠️ Prioritizes fixed list to ease their process</td>
                <td className="negative">❌ Fully tied-up with colleges</td>
              </tr>
              <tr>
                <td className="feature">Consolidated opinions and experiences</td>
                <td className="positive">✅ High Consolidation for Exposure and Clarity</td>
                <td className="neutral">⚠️ Too many opinions, conflicting advice or narrow view</td>
                <td className="negative">❌ No concept of real mentors</td>
              </tr>
              <tr>
                <td className="feature">Affordable & all kinds of services</td>
                <td className="positive">✅ Affordable & many kinds of service methods</td>
                <td className="negative">❌ Expensive, only full packages (no customization)</td>
                <td className="neutral">⚠️ Cheap but lacks depth</td>
              </tr>
              <tr>
                <td className="feature">Indian & International Support</td>
                <td className="positive">✅ All pathways supported</td>
                <td className="neutral">⚠️ Mostly abroad-focused</td>
                <td className="negative">❌ Negligible Indian support</td>
              </tr>
              <tr>
                <td className="feature">Emotional & Psychological Support</td>
                <td className="positive">✅ Mentors love it</td>
                <td className="negative">❌ Robotic, surface-level advice</td>
                <td className="negative">❌ No focus on emotion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Student_Home;