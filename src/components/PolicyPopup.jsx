import React, { useState } from "react";

const PolicyPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState("");

  const openPolicy = (policyType) => {
    setActivePolicy(policyType);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setActivePolicy("");
  };

  const policyContent = {
    terms: {
      title: "Terms & Conditions",
      content: (
        <div>
          <p>
            <strong>Welcome to ZeroFOMO!!!</strong>
          </p>
          <p>
            <strong>Effective Date:</strong> 05-06-2025
          </p>
          <p>
            <strong>Website Covered:</strong> www.zerofomo.org
          </p>

          <h3>1. THE AGREEMENT</h3>
          <p>
            These Terms & Conditions ("Terms") govern your access and use of the
            ZeroFOMO website and services offered by ZeroFOMO ("ZeroFOMO," "we,"
            "our," or "us"), together with our Privacy Policy and Refund Policy.
            By using www.zerofomo.org ("Website"), including its content,
            services, and associated tools, you agree to be bound by these
            Terms.
          </p>

          <h3>2. DEFINITIONS</h3>
          <ul>
            <li>
              <strong>"Owner," "we," "us," or "our"</strong> refers to ZeroFOMO,
              its team, and affiliates.
            </li>
            <li>
              <strong>"User," "you," or "your"</strong> refers to anyone using
              or accessing the website.
            </li>
            <li>
              <strong>"Parties"</strong> refers to both the User and ZeroFOMO
              collectively.
            </li>
          </ul>

          <h3>3. ELIGIBILITY</h3>
          <p>
            You must be at least 18 years old or have the consent of a parent or
            guardian to use our services. By using the site, you confirm that
            you meet this requirement.
          </p>

          <h3>4. ABOUT THE PLATFORM</h3>
          <p>
            ZeroFOMO is an educational consulting platform that helps students
            navigate career paths, educational options in India and abroad, and
            personal development. Our services may include:
          </p>
          <ul>
            <li>One-on-one consulting sessions</li>
            <li>Study abroad preparation</li>
            <li>Profile evaluations</li>
            <li>Workshops and webinars</li>
            <li>Career discovery tools</li>
          </ul>

          <h3>5. ACCOUNT REGISTRATION</h3>
          <p>
            To access certain features, you may need to create an account. You
            are responsible for maintaining the confidentiality of your account
            information and for all activities under your account.
          </p>

          <h3>6. USER CONDUCT</h3>
          <p>By using ZeroFOMO, you agree not to:</p>
          <ul>
            <li>Use the website for any unlawful purpose</li>
            <li>Harass or defame other users</li>
            <li>Upload or transmit malicious code</li>
            <li>Copy or misuse content or tools from the platform</li>
            <li>Impersonate another user or submit false information</li>
          </ul>

          <h3>7. INTELLECTUAL PROPERTY</h3>
          <p>
            All content, trademarks, software, and services on the ZeroFOMO
            website are owned by or licensed to us. You may not reuse or
            distribute our materials without express written consent.
          </p>

          <h3>8. LIMITATION OF LIABILITY</h3>
          <p>
            ZeroFOMO shall not be liable for any indirect or consequential loss,
            service disruptions beyond our control, or incorrect advice due to
            incorrect user-provided data. Maximum liability under any
            circumstance shall be limited to the amount paid by you for the
            relevant service.
          </p>

          <h3>9. CONTACT</h3>
          <p>
            <strong>Email:</strong> support@zerofomo.com
          </p>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div>
          <p>
            <strong>Effective Date:</strong> 05-06-2025
          </p>
          <p>
            <strong>Website:</strong> www.zerofomo.org
          </p>

          <h3>1. INFORMATION WE COLLECT</h3>
          <h4>a) Information You Provide Voluntarily:</h4>
          <ul>
            <li>
              Full name, email address, phone number, academic background, work
              experience
            </li>
            <li>Documents like resumes or SOPs</li>
            <li>
              Details you share during consultation sessions or form submissions
            </li>
            <li>
              Preferences related to educational institutions, countries, or
              career goals
            </li>
          </ul>

          <h4>b) Information Collected Automatically:</h4>
          <ul>
            <li>IP address, browser type, device information</li>
            <li>
              Pages visited, time spent, referring/exit pages, and other
              analytics
            </li>
            <li>Cookies and session identifiers</li>
          </ul>

          <h3>2. HOW WE USE YOUR INFORMATION</h3>
          <p>We collect and use your data to:</p>
          <ul>
            <li>Provide and personalize our educational consulting services</li>
            <li>
              Communicate with you, including updates, session reminders, and
              promotional emails
            </li>
            <li>Improve website performance and user experience</li>
            <li>Analyze usage trends and user behavior (in anonymized form)</li>
            <li>Enable secure payment and session tracking</li>
          </ul>

          <h3>3. DATA SHARING & THIRD PARTIES</h3>
          <p>
            We do <strong>not</strong> sell your personal data. We may share
            limited data with:
          </p>
          <ul>
            <li>
              Trusted third-party partners (hosting, analytics, email providers)
            </li>
            <li>Payment processors like Razorpay, Instamojo, or Stripe</li>
            <li>Partners you explicitly consent to</li>
            <li>Legal authorities if required by law</li>
          </ul>

          <h3>4. YOUR CHOICES AND RIGHTS</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal data</li>
            <li>Withdraw your consent at any time</li>
            <li>Object to certain types of data processing</li>
            <li>Request data portability</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>

          <h3>5. DATA RETENTION</h3>
          <p>We retain your data:</p>
          <ul>
            <li>As long as you use our services or maintain an account</li>
            <li>
              Up to 4 years after your last interaction (for inactive users)
            </li>
            <li>
              As necessary to comply with legal obligations or resolve disputes
            </li>
          </ul>

          <h3>6. CONTACT US</h3>
          <p>
            <strong>Email:</strong> support@zerofomo.com
          </p>
        </div>
      ),
    },
    refund: {
      title: "Refund Policy",
      content: (
        <div>
          <p>
            <strong>Effective Date:</strong> 05-06-2025
          </p>
          <p>
            <strong>Website:</strong> www.zerofomo.org
          </p>

          <p>
            At <strong>ZeroFOMO</strong>, we are committed to delivering
            high-quality educational guidance, mentorship, and digital services
            to students with utmost care and integrity. As a policy,{" "}
            <strong>we do not offer refunds</strong> for any of our services
            once a purchase has been completed — unless a refund is warranted
            due to technical or payment-related issues.
          </p>

          <h3>GENERAL REFUND POLICY</h3>
          <p>
            We do <strong>not</strong> offer refunds under the following
            circumstances:
          </p>
          <ul>
            <li>Change of mind after purchase</li>
            <li>Change in academic or personal plans</li>
            <li>Non-usage of the purchased service or resource</li>
            <li>
              Dissatisfaction after service delivery (after sessions, reviews,
              or consultations are provided)
            </li>
            <li>
              Delay in accessing services due to missed appointments, incomplete
              forms, or lack of response from your side
            </li>
          </ul>

          <h3>REFUND ELIGIBILITY (EXCEPTIONS)</h3>
          <p>
            Refunds will be considered{" "}
            <strong>only under the following technical exceptions</strong>:
          </p>

          <h4>1. Duplicate or Accidental Payments:</h4>
          <p>
            If your account is charged more than once for the same service or
            transaction, please notify us immediately.
          </p>

          <h4>2. Failure in Service Access Due to Technical Errors:</h4>
          <p>
            If you are unable to access a paid digital resource or book a
            session due to a verified system error or technical malfunction on
            our side, and we are unable to resolve it within a reasonable time
            (typically 3-5 business days), a refund may be granted.
          </p>

          <h3>HOW TO REQUEST A REFUND</h3>
          <p>
            To initiate a refund request under the above conditions, please
            contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@zerofomo.com
          </p>

          <p>
            <strong>Include:</strong>
          </p>
          <ul>
            <li>Your full name</li>
            <li>Date and time of payment</li>
            <li>Service purchased</li>
            <li>Reason for the refund request</li>
            <li>Any screenshots or supporting documents</li>
          </ul>

          <p>
            Our team will assess your request within{" "}
            <strong>5 business days</strong>. If approved, the refund will be
            processed within <strong>7-10 business days</strong> to your
            original payment method.
          </p>

          <h3>FINAL NOTES</h3>
          <p>
            By purchasing any service on <strong>www.zerofomo.org</strong>, you
            acknowledge and agree to this Refund Policy. This policy is designed
            to protect the integrity of our services and ensure we can continue
            providing focused and personalized support to all students.
          </p>
        </div>
      ),
    },
  };

  return (
    <>
      <div className="policy-popup-footer">
        <div className="policy-content">
          <span className="copyright">
            Copyright © 2025 ZeroFOMO. All rights reserved.
          </span>
          <div className="policy-links">
            <button onClick={() => openPolicy("terms")} className="policy-link">
              Terms & Conditions
            </button>
            <button
              onClick={() => openPolicy("privacy")}
              className="policy-link"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openPolicy("refund")}
              className="policy-link"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="policy-modal-overlay" onClick={closePopup}>
          <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <h2 className="policy-modal-title">
                {policyContent[activePolicy]?.title}
              </h2>
              <button className="policy-close-btn" onClick={closePopup}>
                ×
              </button>
            </div>
            <div className="policy-modal-content">
              {policyContent[activePolicy]?.content}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .policy-popup-footer {
          font-family: "Arial", sans-serif;
          padding: 15px 0;
          background-color: #000;
          border-top: 1px solid #333;
          width: 100%;
          position: relative;
        }

        .policy-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          flex-wrap: wrap;
        }

        .copyright {
          color: #fff;
          font-size: 14px;
          margin: 5px 0;
        }

        .policy-links {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .policy-link {
          color: #fff;
          background: none;
          border: none;
          font-size: 14px;
          white-space: nowrap;
          margin: 5px 0;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .policy-link:hover {
          color: #ff4444;
          text-decoration: underline;
        }

        .policy-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .policy-modal {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 2px solid #ff4444;
          border-radius: 15px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(255, 68, 68, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .policy-modal-header {
          background: linear-gradient(90deg, #ff4444 0%, #cc3333 100%);
          color: #fff;
          padding: 20px 25px;
          border-radius: 13px 13px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #333;
        }

        .policy-modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .policy-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          line-height: 1;
        }

        .policy-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .policy-modal-content {
          padding: 25px;
          overflow-y: auto;
          color: #fff;
          line-height: 1.6;
          background: #1a1a1a;
          border-radius: 0 0 13px 13px;
        }

        .policy-modal-content h3 {
          color: #ff4444;
          margin: 25px 0 15px 0;
          font-size: 18px;
          font-weight: bold;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
        }

        .policy-modal-content h4 {
          color: #ff6666;
          margin: 20px 0 10px 0;
          font-size: 16px;
          font-weight: bold;
        }

        .policy-modal-content p {
          margin: 15px 0;
          color: #e0e0e0;
        }

        .policy-modal-content ul {
          margin: 15px 0;
          padding-left: 25px;
        }

        .policy-modal-content li {
          margin: 8px 0;
          color: #d0d0d0;
        }

        .policy-modal-content strong {
          color: #ff4444;
          font-weight: bold;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .policy-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .policy-links {
            justify-content: center;
            margin-top: 10px;
          }

          .policy-modal {
            margin: 10px;
            max-height: 90vh;
            border-radius: 10px;
          }

          .policy-modal-header {
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
          }

          .policy-modal-title {
            font-size: 20px;
          }

          .policy-modal-content {
            padding: 20px;
            border-radius: 0 0 8px 8px;
          }

          .policy-modal-content h3 {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .policy-links {
            flex-direction: column;
            gap: 5px;
            align-items: center;
          }

          .policy-modal-overlay {
            padding: 10px;
          }

          .policy-modal {
            margin: 5px;
          }

          .policy-modal-header {
            padding: 12px 15px;
          }

          .policy-modal-title {
            font-size: 18px;
          }

          .policy-modal-content {
            padding: 15px;
          }

          .policy-close-btn {
            width: 30px;
            height: 30px;
            font-size: 20px;
          }
        }

        /* Custom scrollbar */
        .policy-modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .policy-modal-content::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 4px;
        }

        .policy-modal-content::-webkit-scrollbar-thumb {
          background: #ff4444;
          border-radius: 4px;
        }

        .policy-modal-content::-webkit-scrollbar-thumb:hover {
          background: #ff6666;
        }
      `}</style>
    </>
  );
};

export default PolicyPopup;
