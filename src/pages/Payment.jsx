import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../config/firebase.js";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import Header from "../components/Header";
import "../styles/Payment.css";

const Payment = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state;

  // EmailJS Configuration
  const EMAILJS_PUBLIC_KEY = "qaNlaQEQClf-lGyio";
  const EMAILJS_SERVICE_ID = "service_m99nm9f";
  const USER_TEMPLATE_ID = "template_scj3psn";
  const FROM_EMAIL = "it@zerofomo.org";

  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [emailSendingError, setEmailSendingError] = useState(null);
  const [emailJSInitialized, setEmailJSInitialized] = useState(false);
  const [zoomLink, setZoomLink] = useState("");

  // Initialize EmailJS
  useEffect(() => {
    const initializeEmailJS = async () => {
      try {
        await emailjs.init(EMAILJS_PUBLIC_KEY);
        setEmailJSInitialized(true);
      } catch (error) {
        console.error("EmailJS initialization failed:", error);
        setEmailSendingError("Email service initialization failed");
        setEmailJSInitialized(false);
      }
    };

    initializeEmailJS();
  }, []);

  // Fetch Zoom link from Firebase
  useEffect(() => {
    const fetchZoomLink = async () => {
      try {
        const zoomLinkDocRef = doc(db, "adminSettings", "zoomLink");
        const zoomLinkDoc = await getDoc(zoomLinkDocRef);

        if (zoomLinkDoc.exists()) {
          const data = zoomLinkDoc.data();
          setZoomLink(data.link || "");
        } else {
          setZoomLink("https://zoom.us/j/meeting-link-not-configured");
        }
      } catch (error) {
        console.error("Error fetching Zoom link:", error);
        setZoomLink("https://zoom.us/j/meeting-link-error");
      }
    };
    fetchZoomLink();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!bookingData) {
      navigate("/");
      return;
    }
  }, [currentUser, bookingData, navigate]);

  const generateMeetingDetails = () => {
    return {
      meetingNote: "Please join 5 minutes before the scheduled time",
      meetingProvider: "Zoom",
      bookingReference: bookingData.bookingId,
      zoomLink: zoomLink,
    };
  };

  const sendBookingEmail = async () => {
    if (!emailJSInitialized) {
      throw new Error("EmailJS service is not properly initialized");
    }

    const userEmail = currentUser?.email;
    if (!userEmail || !userEmail.includes("@")) {
      throw new Error("Invalid user email address");
    }

    const meetingDetails = generateMeetingDetails();
    const userDetails = bookingData.userDetails || {};

    // User Email Parameters
    const userEmailParams = {
      email: userEmail,
      to_email: userEmail,
      user_name: userDetails.fullName || "Customer",
      full_name: userDetails.fullName || "",
      preferred_communication: userDetails.preferredCommunication || "Email",
      service_type: bookingData.serviceType || "Consultation",
      appointment_date: bookingData.displayDate || "N/A",
      appointment_time: bookingData.displayTime || "N/A",
      duration: bookingData.duration || "N/A",
      zoom_link: meetingDetails.zoomLink || "N/A",
      meeting_note: meetingDetails.meetingNote || "N/A",
      from_name: "ZeroFOMO Team",
      reply_to: FROM_EMAIL,
      interested_course: userDetails.interestedCourse || "Not specified",
      preferred_study_destination:
        userDetails.preferredStudyDestination || "Not specified",
      interested_countries: userDetails.interestedCountries || "Not specified",
      planning_to_apply: userDetails.planningToApply || "Not specified",
      competitive_exam: userDetails.competitiveExam || "Not specified",
      test_scores: userDetails.testScores || "Not specified",
      purpose_of_call: userDetails.purposeOfCall || "Not specified",
      application_stage: userDetails.applicationStage || "Not specified",
      specific_questions: userDetails.specificQuestions || "None",
      specific_requirements: userDetails.specificRequirements || "None",
    };

    try {
      const userResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        USER_TEMPLATE_ID,
        userEmailParams
      );

      return {
        success: true,
        userResult,
      };
    } catch (error) {
      console.error("Email sending error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  };

  const handleConfirmBooking = async () => {
    setEmailSendingError(null);

    try {
      setLoading(true);

      const meetingDetails = generateMeetingDetails();

      // Update booking
      const bookingRef = doc(db, "bookings", bookingData.bookingId);
      await updateDoc(bookingRef, {
        bookingConfirmed: true,
        meetingDetails: meetingDetails,
        updatedAt: serverTimestamp(),
      });

      // Send email
      try {
        const emailResult = await sendBookingEmail();
        await updateDoc(bookingRef, {
          emailStatus: "sent",
          emailSentAt: serverTimestamp(),
          emailDetails: {
            userEmail: currentUser.email,
            sentAt: new Date().toISOString(),
          },
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
        setEmailSendingError(emailError.message);
        await updateDoc(bookingRef, {
          emailStatus: "failed",
          emailError: emailError.message,
          emailFailedAt: serverTimestamp(),
        });
      }

      // Generate confirmation data
      setConfirmationData({
        confirmationId: `CNF-${Date.now()}`,
        bookingId: bookingData.bookingId,
        confirmationDate: new Date().toLocaleDateString(),
        confirmationTime: new Date().toLocaleTimeString(),
        customerName: bookingData.userDetails.fullName,
        customerEmail: currentUser.email,
        serviceType: bookingData.serviceType,
        appointmentDate: bookingData.displayDate,
        appointmentTime: bookingData.displayTime,
        duration: bookingData.duration,
        meetingNote: meetingDetails.meetingNote,
        zoomLink: meetingDetails.zoomLink,
        emailSent: !emailSendingError,
        emailError: emailSendingError,
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error("Booking confirmation error:", error);
      alert(error.message || "Error confirming booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while EmailJS initializes
  if (!emailJSInitialized && !emailSendingError) {
    return (
      <div className="payment-page">
        <Header />
        <div className="payment-container">
          <div className="loading-container">
            <h2>Initializing Email Service...</h2>
            <p>
              Please wait while we set up the email service for confirmations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !bookingData) {
    return null;
  }

  if (showConfirmation && confirmationData) {
    return (
      <div className="payment-page">
        <Header />
        <div className="payment-container">
          <div className="receipt-container">
            <div className="receipt-header">
              <h1>Booking Confirmed!</h1>
              <div className="success-icon">✅</div>
            </div>

            {emailSendingError && (
              <div className="email-error-notice">
                <h3>⚠️ Email Notification Issue</h3>
                <p>
                  Your booking was confirmed successfully, but we couldn't send
                  the confirmation email:
                </p>
                <p>
                  <strong>{emailSendingError}</strong>
                </p>
                <p>
                  Please contact support at{" "}
                  <strong>support@zerofomo.com</strong> with your booking ID:{" "}
                  <strong>{confirmationData.bookingId}</strong>
                </p>
              </div>
            )}

            <div className="receipt-content">
              <h2>Booking Confirmation</h2>

              <div className="receipt-section">
                <h3>Customer Information</h3>
                <div className="receipt-row">
                  <span>Name:</span>
                  <span>{confirmationData.customerName}</span>
                </div>
                <div className="receipt-row">
                  <span>Email:</span>
                  <span>{confirmationData.customerEmail}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Service Details</h3>
                <div className="receipt-row">
                  <span>Service:</span>
                  <span>{confirmationData.serviceType}</span>
                </div>
                <div className="receipt-row">
                  <span>Date:</span>
                  <span>{confirmationData.appointmentDate}</span>
                </div>
                <div className="receipt-row">
                  <span>Time:</span>
                  <span>{confirmationData.appointmentTime}</span>
                </div>
                <div className="receipt-row">
                  <span>Duration:</span>
                  <span>{confirmationData.duration} minutes</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Meeting Information</h3>
                <div className="receipt-row">
                  <span>Zoom Link:</span>
                  <span>{confirmationData.zoomLink}</span>
                </div>
                <div className="receipt-row">
                  <span>Note:</span>
                  <span>{confirmationData.meetingNote}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Status</h3>
                <div className="receipt-row">
                  <span>Booking Status:</span>
                  <span className="status-paid">CONFIRMED</span>
                </div>
                <div className="receipt-row">
                  <span>Email Status:</span>
                  <span
                    className={
                      confirmationData.emailSent
                        ? "status-sent"
                        : "status-failed"
                    }
                  >
                    {confirmationData.emailSent ? "SENT" : "FAILED"}
                  </span>
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="continue-btn" onClick={() => navigate("/")}>
                Continue to Dashboard
              </button>
            </div>

            <div className="important-notice">
              <h3>📧 Important Notice</h3>
              {confirmationData.emailSent ? (
                <p>
                  You will receive a confirmation email with the Zoom meeting
                  link. Please check your email regularly and join the meeting 5
                  minutes before your scheduled time.
                </p>
              ) : (
                <p>
                  Due to an email service issue, you may not receive the
                  confirmation email automatically. Please contact support at{" "}
                  <strong>support@zerofomo.com</strong> with your booking ID to
                  receive your meeting details manually.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Header />

      <div className="payment-container">
        {emailSendingError && (
          <div className="email-service-warning">
            <h3>⚠️ Email Service Notice</h3>
            <p>
              There's currently an issue with our email service:{" "}
              {emailSendingError}
            </p>
            <p>
              Your booking will still be processed successfully, but you may
              need to contact support for meeting details.
            </p>
          </div>
        )}

        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Service:</span>
              <span className="value">{bookingData.serviceType}</span>
            </div>
            <div className="summary-item">
              <span className="label">Date:</span>
              <span className="value">{bookingData.displayDate}</span>
            </div>
            <div className="summary-item">
              <span className="label">Time:</span>
              <span className="value">{bookingData.displayTime}</span>
            </div>
            <div className="summary-item">
              <span className="label">Duration:</span>
              <span className="value">{bookingData.duration} minutes</span>
            </div>
          </div>
        </div>

        <div className="payment-verification">
          <h2>Confirm Your Booking</h2>
          <p>
            Please review your booking details above and click "Confirm Booking"
            to proceed. You will receive a confirmation email with meeting
            details.
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="button"
              className="submit-payment-btn"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? "Confirming Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        <div className="meeting-notice">
          <h3>📹 Meeting Information</h3>
          <p>
            After confirming your booking, you will receive a confirmation email
            with the Zoom meeting link. Please join the meeting 5 minutes before
            your scheduled time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
