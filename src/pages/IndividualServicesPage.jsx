import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IndividualServicesPage.css";
import Header from "../components/Header";

const IndividualServicesPage = () => {
  const navigate = useNavigate();

  const handleBookCall = (serviceType) => {
    // Navigate to calendar with 45-minute duration for individual services
    navigate("/calendar", {
      state: {
        duration: 45,
        serviceType: serviceType,
      },
    });
  };

  return (
    <div>
      <Header />
      <div className="services-container">
        <div className="services-grid">
          {/* Resume Section */}
          <div className="service-card">
            <h2 className="service-title">Resume</h2>

            <div className="service-content">
              <div className="service-option">
                <span className="option-label">Guidance Call:</span>
                <p className="option-description">
                  Build a strong resume from scratch
                </p>
              </div>

              <div className="option-divider">or</div>

              <div className="service-option">
                <span className="option-label">Review Call:</span>
                <p className="option-description">
                  Get expert feedback on your existing resume
                </p>
              </div>
            </div>

            <button
              className="book-call-btn"
              onClick={() => handleBookCall("Resume Service")}
            >
              Book a Call
            </button>
          </div>

          {/* LOR Section */}
          <div className="service-card">
            <h2 className="service-title">LOR</h2>

            <div className="service-content">
              <div className="service-option">
                <span className="option-label">Strategy Call:</span>
                <p className="option-description">
                  Know who to ask, what to say, and how to frame it
                </p>
              </div>

              <div className="option-divider">or</div>

              <div className="service-option">
                <span className="option-label">Draft Review Call:</span>
                <p className="option-description">
                  Review and refine your recommender draft/pointers
                </p>
              </div>
            </div>

            <button
              className="book-call-btn"
              onClick={() => handleBookCall("LOR Service")}
            >
              Book a Call
            </button>
          </div>

          {/* Essays / SOP Section */}
          <div className="service-card">
            <h2 className="service-title">Essays / SOP</h2>

            <div className="service-content">
              <div className="service-option">
                <span className="option-label">Guidance Call:</span>
                <p className="option-description">
                  Learn how to structure and write a compelling story
                </p>
              </div>

              <div className="option-divider">or</div>

              <div className="service-option">
                <span className="option-label">Review Call:</span>
                <p className="option-description">
                  Get feedback on your draft to polish and improve
                </p>
              </div>
            </div>

            <button
              className="book-call-btn"
              onClick={() => handleBookCall("Essays / SOP Service")}
            >
              Book a Call
            </button>
          </div>

          {/* Interview Section */}
          <div className="service-card">
            <h2 className="service-title">Interview</h2>

            <div className="service-content">
              <div className="service-option">
                <span className="option-label">Strategy Call:</span>
                <p className="option-description">
                  Understand formats, common questions & how to prepare
                </p>
              </div>

              <div className="option-divider">or</div>

              <div className="service-option">
                <span className="option-label">Mock Interview Call:</span>
                <p className="option-description">
                  Practice live with feedback & improvement tips
                </p>
              </div>
            </div>

            <button
              className="book-call-btn"
              onClick={() => handleBookCall("Interview Service")}
            >
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualServicesPage;
