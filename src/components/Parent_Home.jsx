import React from 'react';
import '../styles/Parent_Home.css';

const Parent_Home = () => {
  return (
    <div className="parent_home_container">
      <div className="parent_home_relative_container">
        {/* Image wrapper - only shown on desktop/laptop */}
        <div className="parent_home_image_wrapper">
          <div className="parent_home_left_image">
            <img 
              src="/assets/211.jpg" 
              alt="Left side image" 
              className="parent_home_img"
            />
          </div>
          <div className="parent_home_right_image">
            <img 
              src="/assets/222.jpg" 
              alt="Right side image" 
              className="parent_home_img"
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
                <th>Others</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='feature'>Parent Involvement</td>
                <td className="positive">✅ Empowers parents in every step</td>
                <td className="negative">❌ Often leaves parents confused or excluded</td>
              </tr>
              <tr>
                <td className='feature'>Parent Empowerment & Validation</td>
                <td className="positive">✅ Helps parents confident to earn validation and trust from their child</td>
                <td className="negative">❌ Lacks support for parents to feel secure or respected in the process</td>
              </tr>
              <tr>
                <td className='feature'>Emotional Support</td>
                <td className="positive">✅ Offers real empathy & reassurance</td>
                <td className="negative">❌ Robotic or dismissive</td>
              </tr>
              <tr>
                <td className='feature'>Practical Insights</td>
                <td className="positive">✅ Real parent stories, not just theory</td>
                <td className="negative">❌ No personalized or real-life examples</td>
              </tr>
              <tr>
                <td className='feature'>Future-Focused Guidance</td>
                <td className="positive">✅ Career thinking, values, clarity</td>
                <td className="negative">❌ Focuses only on college forms</td>
              </tr>
              <tr>
                <td className='feature'>Worried About Child's Direction?</td>
                <td className="positive">✅ Safe space for open discussions to express concerns and explore direction with guidance</td>
                <td className="negative">❌ No space to reflect or process; jumps straight to courses or scores</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Parent_Home;