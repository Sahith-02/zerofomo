import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IndividualServicesPage.css";
import Header from "../components/Header";

const IndividualServicesPage = () => {
  const navigate = useNavigate();

  const handleBookCall = (serviceType, price) => {
    navigate("/calendar", {
      state: {
        duration: 45,
        serviceType: serviceType,
        price: price,
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

            {/* Compact Service Card */}
            <div className="compact-service-card">
              <div className="compact-service-header">
                <div className="service-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>45 mins</span>
                </div>
                <button
                  className="compact-price-btn"
                  onClick={() => handleBookCall("Resume Service", 500)}
                >
                  ₹500
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
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

            {/* Compact Service Card */}
            <div className="compact-service-card">
              <div className="compact-service-header">
                <div className="service-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>45 mins</span>
                </div>
                <button
                  className="compact-price-btn"
                  onClick={() => handleBookCall("LOR Service", 500)}
                >
                  ₹500
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
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

            {/* Compact Service Card */}
            <div className="compact-service-card">
              <div className="compact-service-header">
                <div className="service-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>45 mins</span>
                </div>
                <button
                  className="compact-price-btn"
                  onClick={() => handleBookCall("Essays / SOP Service", 500)}
                >
                  ₹500
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
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

            {/* Compact Service Card */}
            <div className="compact-service-card">
              <div className="compact-service-header">
                <div className="service-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>45 mins</span>
                </div>
                <button
                  className="compact-price-btn"
                  onClick={() => handleBookCall("Interview Service", 500)}
                >
                  ₹500
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualServicesPage;
