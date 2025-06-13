// StudentPage.jsx
import React, { useState } from "react";
import "../styles/Categories.css";
import Header from "../components/Header";
import ServicePackageModal from "./ServicePackageModal";
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const navigate = useNavigate();

  const journeyOptions = [
    {
      title: "Confident & Clear",
      image: "/assets/S1.jpg",
      description:
        "You've got your direction - whether it's India or abroad, undergrad or MBA, core or management. We help you fine-tune your resume, essays, and LORs to stand out and succeed.",
      buttonText: "Book a Session",
      packageType: "confident",
    },
    {
      title: "Exploring Options",
      image: "/assets/S2.jpg",
      description:
        "You have options in mind - be it local or global, engineering or business, early or mid-career. We help you choose the right path and prepare a compelling profile for your goals.",
      buttonText: "Book a Session",
      packageType: "exploring",
    },
    {
      title: "Feeling Lost",
      image: "/assets/S3.jpg",
      description:
        "You're unsure where to begin - and that's okay. We'll guide you through brainstorming paths, discovering opportunities, and building your roadmap.",
      buttonText: "Book a Session",
      packageType: "lost",
    },
  ];

  const handleBookSession = (packageType) => {
    setSelectedPackage(packageType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPackage("");
  };

  const handleDirectBooking = (price) => {
    navigate("/calendar", {
      state: {
        isParent: false,
        price: price,
        serviceType: "Student Consultation",
        duration: 45,
      },
    });
  };

  return (
    <div className="student-page-container">
      <Header />
      <div
        className="student-background"
        style={{
          backgroundImage: "url('/assets/student_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.2)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1,
        }}
      ></div>

      <div
        className="student-content"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "40px 25px",
          minHeight: "100vh",
        }}
      >
        <h1 className="student-journey-heading">
          Where are you in your journey?
        </h1>

        <div className="student-journey-options-container">
          {journeyOptions.map((option, index) => (
            <div className="student-journey-option" key={index}>
              <div className="student-journey-image-container">
                <img
                  src={option.image}
                  alt={option.title}
                  className="student-journey-image"
                />
              </div>
              <h2 className="student-journey-title">{option.title}</h2>
              <p className="student-journey-description">
                {option.description}
              </p>
              <button
                className="student-journey-button"
                onClick={() => handleBookSession(option.packageType)}
              >
                <span className="button-text">{option.buttonText}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <ServicePackageModal
        isOpen={modalOpen}
        onClose={closeModal}
        packageType={selectedPackage}
        onBookNow={handleDirectBooking}
      />
    </div>
  );
};

export default StudentPage;
