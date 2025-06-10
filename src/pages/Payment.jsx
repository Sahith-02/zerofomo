import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../config/firebase.js";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import Header from "../components/Header";
import "../styles/Payment.css";

const Payment = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state;

  // EmailJS Configuration - Make sure these match your EmailJS dashboard
  const EMAILJS_PUBLIC_KEY = "qaNlaQEQClf-lGyio";
  const EMAILJS_SERVICE_ID = "service_m99nm9f";
  const USER_TEMPLATE_ID = "template_scj3psn";
  const ADMIN_TEMPLATE_ID = "template_40fi83r";
  const FROM_EMAIL = "it@zerofomo.org";
  const ADMIN_EMAIL = "harichandana.chinni@zerofomo.org";

  const UPI_ID = "chandanachinni2000@ybl";
  const AMOUNT = "99";
  const QR_CODE_URL = "/assets/QR.jpg";

  const [paymentData, setPaymentData] = useState({
    transactionId: "",
    paymentCompleted: false,
  });

  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validatingTransaction, setValidatingTransaction] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState(null);
  const [emailJSInitialized, setEmailJSInitialized] = useState(false);
  const [zoomLink, setZoomLink] = useState("");

  // Initialize EmailJS
  useEffect(() => {
    const initializeEmailJS = async () => {
      try {
        // Initialize EmailJS with your public key
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log("EmailJS initialized successfully");
        setEmailJSInitialized(true);
      } catch (error) {
        console.error("Failed to initialize EmailJS:", error);
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
          console.log("Full document data:", data); // Log entire document
          setZoomLink(data.link || "");
          console.log("Zoom link fetched:", data.link);
        } else {
          console.warn("Zoom link document not found");
          setZoomLink("https://zoom.us/j/meeting-link-not-configured");
        }
      } catch (error) {
        console.error("Detailed error fetching zoom link:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enhanced date parsing function
  const parseDate = (dateInput) => {
    if (!dateInput) return null;

    if (dateInput instanceof Date) {
      return dateInput;
    }

    if (typeof dateInput === "string") {
      const parsedDate = new Date(dateInput);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }

      const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const ddmmMatch = dateInput.match(ddmmyyyyRegex);
      if (ddmmMatch) {
        const [, day, month, year] = ddmmMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      const yyyymmddRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
      const yyyymmMatch = dateInput.match(yyyymmddRegex);
      if (yyyymmMatch) {
        const [, year, month, day] = yyyymmMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }

    return null;
  };

  const isValidDate = (dateInput) => {
    const parsedDate = parseDate(dateInput);
    return parsedDate !== null && !isNaN(parsedDate.getTime());
  };

  const isValidTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return false;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const generateMeetingDetails = (bookingData) => {
    return {
      meetingNote:
        "Meeting link will be provided via email before the appointment",
      meetingProvider: "Zoom (Link to be shared)",
      bookingReference: bookingData.bookingId,
      zoomLink: zoomLink,
    };
  };

  // Updated email sending function without meeting ID and password
  const sendBookingEmails = async (bookingData, meetingDetails) => {
    console.log("Attempting to send emails...");

    if (!emailJSInitialized) {
      throw new Error("EmailJS service is not properly initialized");
    }

    // Validate email addresses
    const userEmail = currentUser?.email;
    if (!userEmail || !userEmail.includes("@")) {
      throw new Error("Invalid user email address");
    }

    if (!ADMIN_EMAIL || !ADMIN_EMAIL.includes("@")) {
      throw new Error("Invalid admin email address");
    }

    // SIMPLIFIED email parameters that match standard EmailJS template structure
    const userEmailParams = {
      // Primary recipient (this should match your template's "To Email" field)
      email: userEmail,
      to_email: userEmail, // Backup parameter name

      // Basic template variables (keep these simple and match your template exactly)
      user_name: bookingData.userDetails?.fullName || "Customer",
      service_type: bookingData.serviceType || "N/A",
      appointment_date: bookingData.displayDate || "N/A",
      appointment_time: bookingData.displayTime || "N/A",
      duration: bookingData.duration || "N/A",
      transaction_id: paymentData.transactionId || "N/A",
      booking_reference: meetingDetails.bookingReference || "N/A",
      amount: AMOUNT,
      zoom_link: meetingDetails.zoomLink || "N/A",
      meeting_note: meetingDetails.meetingNote || "N/A",

      // EmailJS standard fields
      from_name: "ZeroFOMO Team",
      reply_to: FROM_EMAIL,
    };

    const adminEmailParams = {
      // Primary recipient (this should match your template's "To Email" field)
      email: ADMIN_EMAIL,
      to_email: ADMIN_EMAIL, // Backup parameter name

      // Basic template variables
      user_name: bookingData.userDetails?.fullName || "Customer",
      user_email: userEmail,
      service_type: bookingData.serviceType || "N/A",
      appointment_date: bookingData.displayDate || "N/A",
      appointment_time: bookingData.displayTime || "N/A",
      duration: bookingData.duration || "N/A",
      transaction_id: paymentData.transactionId || "N/A",
      booking_reference: meetingDetails.bookingReference || "N/A",
      amount: AMOUNT,
      zoom_link: meetingDetails.zoomLink || "N/A",

      // EmailJS standard fields
      from_name: "ZeroFOMO System",
      reply_to: FROM_EMAIL,
    };

    console.log("Email params prepared:", {
      userParams: userEmailParams,
      adminParams: adminEmailParams,
    });

    try {
      const emailResults = [];

      // Send email to user with proper error handling
      console.log("Sending email to user...");
      try {
        const userEmailResult = await emailjs.send(
          EMAILJS_SERVICE_ID,
          USER_TEMPLATE_ID,
          userEmailParams
        );
        console.log("User email sent successfully:", userEmailResult);
        emailResults.push({
          type: "user",
          success: true,
          result: userEmailResult,
        });
      } catch (userEmailError) {
        console.error("User email failed:", userEmailError);
        emailResults.push({
          type: "user",
          success: false,
          error: userEmailError,
        });
      }

      // Add delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Send email to admin with proper error handling
      console.log("Sending email to admin...");
      try {
        const adminEmailResult = await emailjs.send(
          EMAILJS_SERVICE_ID,
          ADMIN_TEMPLATE_ID,
          adminEmailParams
        );
        console.log("Admin email sent successfully:", adminEmailResult);
        emailResults.push({
          type: "admin",
          success: true,
          result: adminEmailResult,
        });
      } catch (adminEmailError) {
        console.error("Admin email failed:", adminEmailError);
        emailResults.push({
          type: "admin",
          success: false,
          error: adminEmailError,
        });
      }

      // Check if at least one email was sent successfully
      const successfulEmails = emailResults.filter((result) => result.success);

      if (successfulEmails.length > 0) {
        console.log(
          `Successfully sent ${successfulEmails.length} out of ${emailResults.length} emails`
        );
        return {
          success: true,
          results: emailResults,
          partialSuccess: successfulEmails.length < emailResults.length,
        };
      } else {
        throw new Error("All email sending attempts failed");
      }
    } catch (error) {
      console.error("Email sending error:", error);

      // Enhanced error handling
      let errorMessage = "Failed to send confirmation emails";

      if (error.status === 400) {
        errorMessage = "Invalid email configuration. Please contact support.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = "Email service authentication failed.";
      } else if (error.status === 404) {
        errorMessage =
          "Email service or template not found. Please contact support.";
      } else if (error.status === 422) {
        errorMessage =
          "Email address configuration error. Please check template settings.";
      } else if (error.text?.includes("Account not found")) {
        errorMessage =
          "Email service account not found. Please contact support.";
      } else if (error.text?.includes("Template")) {
        errorMessage = "Email template configuration error.";
      } else if (error.text?.includes("recipients address is empty")) {
        errorMessage =
          "Email template configuration error - recipient field is empty.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const checkTransactionIdExists = async (transactionId) => {
    try {
      setValidatingTransaction(true);
      const paymentsQuery = query(
        collection(db, "payments"),
        where("transactionId", "==", transactionId)
      );
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("transactionId", "==", transactionId)
      );

      const [paymentsSnapshot, bookingsSnapshot] = await Promise.all([
        getDocs(paymentsQuery),
        getDocs(bookingsQuery),
      ]);

      return !paymentsSnapshot.empty || !bookingsSnapshot.empty;
    } catch (error) {
      console.error("Error checking transaction ID:", error);
      throw new Error("Failed to validate transaction ID. Please try again.");
    } finally {
      setValidatingTransaction(false);
    }
  };

  const validatePayment = () => {
    if (!paymentData.transactionId.trim()) {
      alert("Transaction ID is required");
      return false;
    }

    if (paymentData.transactionId.length < 8) {
      alert("Please enter a valid transaction ID (minimum 8 characters)");
      return false;
    }

    const transactionIdPattern = /^[A-Za-z0-9]+$/;
    if (!transactionIdPattern.test(paymentData.transactionId)) {
      alert("Transaction ID should contain only letters and numbers");
      return false;
    }

    return true;
  };

  const validateBookingData = () => {
    if (!bookingData) {
      alert(
        "Booking data is missing. Please go back and create a new booking."
      );
      return false;
    }

    console.log("Booking Data Debug:", {
      date: bookingData.date,
      time: bookingData.time,
      displayDate: bookingData.displayDate,
      displayTime: bookingData.displayTime,
      fullBookingData: bookingData,
    });

    if (!bookingData.date || !bookingData.time) {
      alert(`Booking date and time are required. 
      Date received: ${bookingData.date}
      Time received: ${bookingData.time}
      Please go back and select a valid date and time.`);
      return false;
    }

    if (!isValidDate(bookingData.date)) {
      alert(`Invalid booking date format. 
      Date received: "${bookingData.date}"
      Please go back and select a valid date.`);
      return false;
    }

    if (!isValidTime(bookingData.time)) {
      alert(`Invalid booking time format. 
      Time received: "${bookingData.time}"
      Expected format: HH:MM (24-hour format)
      Please go back and select a valid time.`);
      return false;
    }

    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setEmailSendingError(null);

    if (!validatePayment()) {
      return;
    }

    if (!validateBookingData()) {
      return;
    }

    try {
      setLoading(true);

      // Check if transaction ID already exists
      const transactionExists = await checkTransactionIdExists(
        paymentData.transactionId
      );
      if (transactionExists) {
        alert(
          "This transaction ID has already been used. Please check your transaction ID or contact support if you believe this is an error."
        );
        return;
      }

      const meetingDetails = generateMeetingDetails(bookingData);

      // Create payment record
      const userPaymentsRef = collection(
        db,
        `users/${currentUser.uid}/payments`
      );
      const paymentRecord = {
        transactionId: paymentData.transactionId,
        amount: parseFloat(AMOUNT),
        paymentDate: serverTimestamp(),
        paymentStatus: "completed",
        bookingId: bookingData.bookingId,
        serviceType: bookingData.serviceType,
        appointmentDate: bookingData.displayDate,
        appointmentTime: bookingData.displayTime,
        duration: bookingData.duration,
        userDetails: {
          userId: currentUser.uid,
          email: currentUser.email,
          fullName: bookingData.userDetails.fullName,
        },
        meetingDetails: meetingDetails,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const paymentDocRef = await addDoc(userPaymentsRef, paymentRecord);

      // Add to main payments collection
      const mainPaymentsRef = collection(db, "payments");
      await addDoc(mainPaymentsRef, {
        ...paymentRecord,
        paymentDocId: paymentDocRef.id,
        userPaymentPath: `users/${currentUser.uid}/payments/${paymentDocRef.id}`,
      });

      // Update booking
      const bookingRef = doc(db, "bookings", bookingData.bookingId);
      await updateDoc(bookingRef, {
        paymentStatus: "completed",
        transactionId: paymentData.transactionId,
        paymentDate: serverTimestamp(),
        bookingConfirmed: true,
        paymentDocId: paymentDocRef.id,
        meetingDetails: meetingDetails,
        updatedAt: serverTimestamp(),
      });

      // Try to send emails with better error handling
      let emailResult = null;
      let emailSuccess = false;

      try {
        if (emailJSInitialized) {
          emailResult = await sendBookingEmails(bookingData, meetingDetails);
          emailSuccess = true;
          console.log("Emails sent successfully:", emailResult);

          // Update booking with email success info
          await updateDoc(bookingRef, {
            emailStatus: "sent",
            emailSentAt: serverTimestamp(),
            emailResults: emailResult.results || [],
            partialEmailSuccess: emailResult.partialSuccess || false,
          });
        } else {
          throw new Error("EmailJS service not initialized");
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        setEmailSendingError(emailError.message);

        // Update booking with email failure info
        await updateDoc(bookingRef, {
          emailStatus: "failed",
          emailError: emailError.message,
          emailFailedAt: serverTimestamp(),
        });
      }

      // Generate receipt
      const receipt = {
        receiptId: `RCP-${Date.now()}`,
        bookingId: bookingData.bookingId,
        transactionId: paymentData.transactionId,
        amount: AMOUNT,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        customerName: bookingData.userDetails.fullName,
        customerEmail: currentUser.email,
        serviceType: bookingData.serviceType,
        appointmentDate: bookingData.displayDate,
        appointmentTime: bookingData.displayTime,
        duration: bookingData.duration,
        paymentDocId: paymentDocRef.id,
        meetingNote: meetingDetails.meetingNote,
        zoomLink: meetingDetails.zoomLink,
        emailSent: emailSuccess,
        emailError: emailSendingError,
      };

      setReceiptData(receipt);
      setShowReceipt(true);
      setPaymentData((prev) => ({ ...prev, paymentCompleted: true }));
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(error.message || "Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    const receiptContent = `
ZEROFOMO PAYMENT RECEIPT
========================

Receipt ID: ${receiptData.receiptId}
Booking ID: ${receiptData.bookingId}
Transaction ID: ${receiptData.transactionId}
Payment Doc ID: ${receiptData.paymentDocId}

Customer Details:
Name: ${receiptData.customerName}
Email: ${receiptData.customerEmail}

Service Details:
Service: ${receiptData.serviceType}
Date: ${receiptData.appointmentDate}
Time: ${receiptData.appointmentTime}
Duration: ${receiptData.duration} minutes

Meeting Details:
Zoom Link: ${receiptData.zoomLink}
Note: ${receiptData.meetingNote}

Payment Details:
Amount: ₹${receiptData.amount}
Payment Date: ${receiptData.paymentDate}
Payment Time: ${receiptData.paymentTime}
Status: PAID

Email Status: ${receiptData.emailSent ? "SENT" : "FAILED"}
${receiptData.emailError ? `Email Error: ${receiptData.emailError}` : ""}

Thank you for choosing ZeroFOMO!
Contact us: support@zerofomo.com
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ZeroFOMO_Receipt_${receiptData.receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (showReceipt && receiptData) {
    return (
      <div className="payment-page">
        <Header />
        <div className="payment-container">
          <div className="receipt-container">
            <div className="receipt-header">
              <h1>Payment Successful!</h1>
              <div className="success-icon">✅</div>
            </div>

            {emailSendingError && (
              <div className="email-error-notice">
                <h3>⚠️ Email Notification Issue</h3>
                <p>
                  Your payment was successful, but we couldn't send the
                  confirmation email:
                </p>
                <p>
                  <strong>{emailSendingError}</strong>
                </p>
                <p>
                  Please contact support at{" "}
                  <strong>support@zerofomo.com</strong> with your booking ID:{" "}
                  <strong>{receiptData.bookingId}</strong>
                </p>
              </div>
            )}

            <div className="receipt-content">
              <h2>Payment Receipt</h2>

              <div className="receipt-section">
                <h3>Receipt Details</h3>
                <div className="receipt-row">
                  <span>Receipt ID:</span>
                  <span>{receiptData.receiptId}</span>
                </div>
                <div className="receipt-row">
                  <span>Booking ID:</span>
                  <span>{receiptData.bookingId}</span>
                </div>
                <div className="receipt-row">
                  <span>Transaction ID:</span>
                  <span>{receiptData.transactionId}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Customer Information</h3>
                <div className="receipt-row">
                  <span>Name:</span>
                  <span>{receiptData.customerName}</span>
                </div>
                <div className="receipt-row">
                  <span>Email:</span>
                  <span>{receiptData.customerEmail}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Service Details</h3>
                <div className="receipt-row">
                  <span>Service:</span>
                  <span>{receiptData.serviceType}</span>
                </div>
                <div className="receipt-row">
                  <span>Date:</span>
                  <span>{receiptData.appointmentDate}</span>
                </div>
                <div className="receipt-row">
                  <span>Time:</span>
                  <span>{receiptData.appointmentTime}</span>
                </div>
                <div className="receipt-row">
                  <span>Duration:</span>
                  <span>{receiptData.duration} minutes</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Meeting Information</h3>
                <div className="receipt-row">
                  <span>Zoom Link:</span>
                  <span>{receiptData.zoomLink}</span>
                </div>
                <div className="receipt-row">
                  <span>Note:</span>
                  <span>{receiptData.meetingNote}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h3>Payment Information</h3>
                <div className="receipt-row">
                  <span>Amount:</span>
                  <span className="amount">₹{receiptData.amount}</span>
                </div>
                <div className="receipt-row">
                  <span>Payment Date:</span>
                  <span>{receiptData.paymentDate}</span>
                </div>
                <div className="receipt-row">
                  <span>Payment Time:</span>
                  <span>{receiptData.paymentTime}</span>
                </div>
                <div className="receipt-row">
                  <span>Status:</span>
                  <span className="status-paid">PAID</span>
                </div>
                <div className="receipt-row">
                  <span>Email Status:</span>
                  <span
                    className={
                      receiptData.emailSent ? "status-sent" : "status-failed"
                    }
                  >
                    {receiptData.emailSent ? "SENT" : "FAILED"}
                  </span>
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="download-btn" onClick={downloadReceipt}>
                Download Receipt
              </button>
              <button className="continue-btn" onClick={() => navigate("/")}>
                Continue to Dashboard
              </button>
            </div>

            <div className="important-notice">
              <h3>📧 Important Notice</h3>
              {receiptData.emailSent ? (
                <p>
                  You will receive a confirmation email with the Zoom meeting
                  link shortly before your appointment. Please check your email
                  regularly.
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

        <div className="payment-disclaimer">
          <h2>Payment Disclaimer</h2>
          <div className="disclaimer-content">
            <p>
              Please double-check the UPI ID and amount before making the
              payment.
            </p>

            <div className="important-note">
              <h3>✅ IMPORTANT: We are not responsible for:</h3>
              <ul>
                <li>Payments made to the wrong UPI ID</li>
                <li>
                  Duplicate transactions (same transaction ID used multiple
                  times)
                </li>
                <li>Errors, delays, or failed transactions from your end</li>
              </ul>
            </div>

            <div className="warning-note">
              <p>
                ❌ No calls or messages will be entertained regarding such
                issues.
              </p>
              <p>
                🚫 In such cases, the service you booked will not be provided.
              </p>
              <p>
                🔄 Each transaction ID can only be used once to prevent
                duplicate payments.
              </p>
            </div>
          </div>
        </div>

        <div className="terms-acceptance">
          <div className="terms-checkbox-container">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={handleTermsChange}
              className="terms-checkbox"
            />
            <label htmlFor="termsAccepted" className="terms-label">
              <span className="checkbox-custom"></span>I accept all the terms
              and conditions mentioned above and understand that ZeroFOMO is not
              responsible for payment errors from our end. I also understand
              that each transaction ID can only be used once.
            </label>
          </div>
        </div>

        {termsAccepted && (
          <>
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
                <div className="summary-item total">
                  <span className="label">Total Amount:</span>
                  <span className="value">₹{AMOUNT}</span>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h2>Payment Method</h2>

              <div className="upi-payment">
                <div className="qr-section">
                  <h3>Scan QR Code</h3>
                  <div className="qr-code-container">
                    <img
                      src={QR_CODE_URL}
                      alt="UPI QR Code"
                      className="qr-code"
                    />
                    <p className="qr-instruction">Scan with any UPI app</p>
                  </div>
                </div>

                <div className="upi-details">
                  <h3>Or Pay Using UPI ID</h3>
                  <div className="upi-info">
                    <div className="upi-id">
                      <label>UPI ID:</label>
                      <div className="upi-value">
                        <span>{UPI_ID}</span>
                        <button
                          className="copy-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(UPI_ID);
                            alert("UPI ID copied to clipboard!");
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="amount-info">
                      <label>Amount:</label>
                      <span className="amount">₹{AMOUNT}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-verification">
              <h2>Payment Verification</h2>
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="transactionId">
                    Transaction ID <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    value={paymentData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter your transaction ID"
                    required
                    disabled={validatingTransaction || loading}
                  />
                  <small>
                    Enter the transaction ID from your payment app (minimum 8
                    characters). Each transaction ID can only be used once.
                  </small>
                  {validatingTransaction && (
                    <div className="validation-message">
                      🔍 Checking if transaction ID is already used...
                    </div>
                  )}
                </div>

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
                    type="submit"
                    className="submit-payment-btn"
                    disabled={loading || validatingTransaction}
                  >
                    {loading
                      ? "Processing Payment..."
                      : validatingTransaction
                      ? "Validating..."
                      : "Submit Payment"}
                  </button>
                </div>
              </form>
            </div>

            <div className="security-note">
              <h3>🔒 Security Information</h3>
              <p>
                Your payment information is secure. We store the transaction ID
                in your personal account section for verification purposes.
              </p>
              <p>
                <strong>Duplicate Prevention:</strong> Each transaction ID can
                only be used once to prevent duplicate payments and ensure
                payment integrity.
              </p>
            </div>

            <div className="meeting-notice">
              <h3>📹 Meeting Information</h3>
              <p>
                After successful payment, you will receive a confirmation email.
                The Zoom meeting link will be provided via email closer to your
                appointment time.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
