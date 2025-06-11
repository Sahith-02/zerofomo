import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServicePackageModal.css";

const ServicePackageModal = ({ isOpen, onClose, packageType }) => {
  const navigate = useNavigate();
  const [additionalSchools, setAdditionalSchools] = useState(0);

  if (!isOpen) return null;

  const handleIndividualServicesClick = () => {
    onClose();
    navigate("/individual-services");
  };

  // Define content for each package type
  const packageContent = {
    confident: {
      title: "Confident & Clear Package",
      services: [
        "Finalize Your College/School List",
        "Build a Strong Resume",
        "Craft Powerful SOPs or Essays",
        "Perfect Your LOR",
        "Nail the Interview",
      ],
    },
    exploring: {
      title: "Exploring Options Package",
      services: [
        "Clarity Call",
        "Finalize Your College/School List",
        "Build a Strong Resume",
        "Craft Powerful SOPs or Essays",
        "Perfect Your LOR",
        "Nail the Interview",
      ],
    },
    lost: {
      title: "Feeling Lost Package",
      services: [
        "Brainstorming Call",
        "Clarity Call",
        "Finalize Your College/School List",
        "Build a Strong Resume",
        "Craft Powerful SOPs or Essays",
        "Perfect Your LOR",
        "Nail the Interview",
      ],
    },
  };

  const currentPackage =
    packageContent[packageType] || packageContent.confident;

  const handleDiscoveryCall = () => {
    onClose();
    navigate("/calendar", {
      state: {
        duration: 30,
        serviceType: "Discovery Call",
        price: 99,
      },
    });
  };

  const handleCompletePackage = () => {
    const basePrice = 9999;
    const additionalPrice = additionalSchools * 4999;
    const totalPrice = basePrice + additionalPrice;

    onClose();
    navigate("/calendar", {
      state: {
        duration: 45,
        serviceType: `${currentPackage.title} - Initial Consultation`,
        price: totalPrice,
        additionalSchools: additionalSchools,
      },
    });
  };

  const incrementSchools = () => {
    setAdditionalSchools((prev) => prev + 1);
  };

  const decrementSchools = () => {
    setAdditionalSchools((prev) => Math.max(0, prev - 1));
  };

  const calculateTotal = () => {
    return 9999 + additionalSchools * 4999;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          <div className="modal-left">
            {/* Discovery Call Section */}
            <div className="step-section">
              <h2 className="step-title">STEP 1: Discovery Call</h2>
              <p className="step-description">
                Join us for a relaxed, no-pressure chat to see how we can
                support you. We'll understand your goals, assess the fit, and
                help you gain clarity and confidence about your next steps.
              </p>

              {/* Compact Discovery Call Card */}
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
                    <span>30 mins</span>
                  </div>
                  <button
                    className="compact-price-btn"
                    onClick={handleDiscoveryCall}
                  >
                    ₹99
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

            {/* Complete Package Section */}
            <div className="step-section">
              <h2 className="step-title">STEP 2: Full Package</h2>
              <h3 className="package-title">{currentPackage.title}</h3>
              <ul className="services-list">
                {currentPackage.services.map((service, index) => (
                  <li key={index} className="service-item">
                    {service}
                  </li>
                ))}
              </ul>

              {/* Compact Pricing Section */}
              <div className="compact-pricing-container">
                {/* Price Summary Row */}
                <div className="price-summary-row">
                  <div className="price-breakdown">
                    <span className="base-price">
                      ₹9,999 <small>first school</small>
                    </span>
                    {additionalSchools > 0 && (
                      <span className="additional-price">
                        + ₹{(additionalSchools * 4999).toLocaleString()}{" "}
                        <small>({additionalSchools} more)</small>
                      </span>
                    )}
                  </div>
                  <div className="total-display">
                    ₹{calculateTotal().toLocaleString()}
                  </div>
                </div>

                {/* Controls Row */}
                <div className="controls-row">
                  <div className="schools-counter">
                    <span className="counter-label">Additional Schools:</span>
                    <div className="counter-buttons">
                      <button
                        onClick={decrementSchools}
                        className="counter-btn"
                        disabled={additionalSchools === 0}
                      >
                        -
                      </button>
                      <span className="counter-display">
                        {additionalSchools}
                      </span>
                      <button
                        onClick={incrementSchools}
                        className="counter-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="book-package-btn"
                    onClick={handleCompletePackage}
                  >
                    Book Package
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

              {/* Compact Warning Message */}
              <div className="compact-warning">
                <svg
                  className="warning-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>
                  Complete package should be booked after discovery call only.
                </span>
              </div>
            </div>
          </div>

          <div className="modal-right">
            <div className="right-content">
              <h3 className="right-title">Don't need the full package?</h3>
              <p className="right-subtitle">We've got you covered.</p>
              <p className="right-description">
                Get personalized, high-quality support for specific parts of the
                process.
              </p>
              <button
                className="more-info-btn"
                onClick={handleIndividualServicesClick}
              >
                Click here to know more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePackageModal;
