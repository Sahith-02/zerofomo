import React, { useState } from "react";
import "../styles/ContactUs.css";
import Header from "../components/Header"; // Adjust the import path as necessary

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div>
        <Header/>
    <div className="contact-us-container">
      {/* Hero Section */}
      <div className="contact-hero-section">
        <div className="contact-hero-content">
          <h1 className="contact-main-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-main-content">
        <div className="contact-content-wrapper">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-header">
              <h2 className="contact-form-title">Send us a Message</h2>
              <p className="contact-form-description">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-input-group">
                <label htmlFor="name" className="contact-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="contact-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="contact-input-group">
                <label htmlFor="email" className="contact-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="contact-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="contact-input-group">
                <label htmlFor="subject" className="contact-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="contact-input"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="contact-input-group">
                <label htmlFor="message" className="contact-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="contact-textarea"
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="contact-info-header">
              <h2 className="contact-info-title">Contact Information</h2>
              <p className="contact-info-description">
                Connect with us through any of these channels.
              </p>
            </div>

            <div className="contact-methods-list">
              {/* Email */}
              <div className="contact-method-item">
                <div className="contact-method-icon contact-email-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="contact-method-content">
                  <h3 className="contact-method-title">Email</h3>
                  <a
                    href="mailto:harichandana.chinni@zerofomo.org"
                    className="contact-method-link"
                  >
                   harichandana.chinni@zerofomo.org
                  </a>
                  <p className="contact-method-desc">
                    Send us an email anytime
                  </p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="contact-method-item">
                <div className="contact-method-icon contact-linkedin-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="2"
                      y="9"
                      width="4"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="4"
                      cy="4"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="contact-method-content">
                  <h3 className="contact-method-title">LinkedIn</h3>
                  <a
                    href="https://www.linkedin.com/company/zerofomo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-method-link"
                  >
                    Zero Fomo Company
                  </a>
                  <p className="contact-method-desc">
                    Connect with us professionally
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <div className="contact-method-item">
                <div className="contact-method-icon contact-instagram-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="17.5"
                      y1="6.5"
                      x2="17.51"
                      y2="6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="contact-method-content">
                  <h3 className="contact-method-title">Instagram</h3>
                  <a
                    href="https://www.instagram.com/zerofomo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-method-link"
                  >
                    @zerofomo
                  </a>
                  <p className="contact-method-desc">Follow us for updates</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="contact-cta-section">
              <h3 className="contact-cta-title">Ready to Get Started?</h3>
              <p className="contact-cta-description">
                Join thousands of students and parents who trust Zero Fomo for
                their educational journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactUs;
