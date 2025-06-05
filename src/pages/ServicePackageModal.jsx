import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServicePackageModal.css";

const ServicePackageModal = ({ isOpen, onClose, packageType }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleIndividualServicesClick = () => {
    onClose(); // Close the modal first
    navigate("/individual-services"); // Navigate to the full page
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
    // Navigate to calendar with 30-minute duration for discovery call
    onClose(); // Close modal first
    navigate("/calendar", {
      state: {
        duration: 30,
        serviceType: "Discovery Call",
      },
    });
  };

  const handleCompletePackage = () => {
    // Navigate to calendar with 45-minute duration for complete package consultation
    onClose(); // Close modal first
    navigate("/calendar", {
      state: {
        duration: 45,
        serviceType: `${currentPackage.title} - Initial Consultation`,
      },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          <div className="modal-left">
            <div className="step-section">
              <h2 className="step-title">STEP 1: Discovery Call</h2>
              <p className="step-description">
                Join us for a relaxed, no-pressure chat to see how we can
                support you. We'll understand your goals, assess the fit, and
                help you gain clarity and confidence about your next steps.
              </p>
              <button className="discovery-btn" onClick={handleDiscoveryCall}>
                Book a Discovery Call
              </button>
            </div>

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
              <button className="package-btn" onClick={handleCompletePackage}>
                Book Complete Package
              </button>
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
