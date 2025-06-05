import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db, storage } from "../config/firebase.js";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";
import "../styles/Payment.css";

const Payment = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state;

  const [paymentData, setPaymentData] = useState({
    transactionId: "",
    paymentScreenshot: null,
    paymentCompleted: false,
  });

  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validatingTransaction, setValidatingTransaction] = useState(false);

  // UPI details
  const UPI_ID = "chandanachinni2000@ybl";
  const AMOUNT = "99"; // You can make this dynamic based on service
  const QR_CODE_URL = "/assets/QR.jpg"; // Replace with your actual QR code image URL

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only JPG, JPEG, or PNG files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setPaymentData((prev) => ({
        ...prev,
        paymentScreenshot: file,
      }));
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  // Check if transaction ID already exists in database
  const checkTransactionIdExists = async (transactionId) => {
    try {
      setValidatingTransaction(true);

      // Query all collections that might contain transaction IDs
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

  // Upload screenshot to Firebase Storage
  const uploadScreenshot = async (file, userId, transactionId) => {
    try {
      const timestamp = new Date().getTime();
      const fileName = `payment_screenshot_${transactionId}_${timestamp}`;
      const storageRef = ref(
        storage,
        `users/${userId}/payment-screenshots/${fileName}`
      );

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        fileName: fileName,
        uploadPath: `users/${userId}/payment-screenshots/${fileName}`,
      };
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      throw new Error("Failed to upload screenshot. Please try again.");
    }
  };

  const validatePayment = () => {
    if (!paymentData.transactionId.trim()) {
      alert("Transaction ID is required");
      return false;
    }

    if (!paymentData.paymentScreenshot) {
      alert("Payment screenshot is required");
      return false;
    }

    if (paymentData.transactionId.length < 8) {
      alert("Please enter a valid transaction ID (minimum 8 characters)");
      return false;
    }

    // Additional validation for transaction ID format (optional)
    const transactionIdPattern = /^[A-Za-z0-9]+$/;
    if (!transactionIdPattern.test(paymentData.transactionId)) {
      alert("Transaction ID should contain only letters and numbers");
      return false;
    }

    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!validatePayment()) {
      return;
    }

    try {
      setLoading(true);

      // Step 1: Check if transaction ID already exists
      const transactionExists = await checkTransactionIdExists(
        paymentData.transactionId
      );
      if (transactionExists) {
        alert(
          "This transaction ID has already been used. Please check your transaction ID or contact support if you believe this is an error."
        );
        return;
      }

      // Step 2: Upload screenshot to Firebase Storage
      const screenshotData = await uploadScreenshot(
        paymentData.paymentScreenshot,
        currentUser.uid,
        paymentData.transactionId
      );

      // Step 3: Create payment record in user's subcollection
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
        screenshot: {
          url: screenshotData.url,
          fileName: screenshotData.fileName,
          uploadPath: screenshotData.uploadPath,
        },
        userDetails: {
          userId: currentUser.uid,
          email: currentUser.email,
          fullName: bookingData.userDetails.fullName,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const paymentDocRef = await addDoc(userPaymentsRef, paymentRecord);

      // Step 4: Also create a record in the main payments collection for easy querying
      const mainPaymentsRef = collection(db, "payments");
      await addDoc(mainPaymentsRef, {
        ...paymentRecord,
        paymentDocId: paymentDocRef.id,
        userPaymentPath: `users/${currentUser.uid}/payments/${paymentDocRef.id}`,
      });

      // Step 5: Update booking with payment information
      const bookingRef = doc(db, "bookings", bookingData.bookingId);
      await updateDoc(bookingRef, {
        paymentStatus: "completed",
        transactionId: paymentData.transactionId,
        paymentDate: serverTimestamp(),
        paymentScreenshotURL: screenshotData.url,
        paymentScreenshotUploaded: true,
        bookingConfirmed: true,
        paymentDocId: paymentDocRef.id,
        updatedAt: serverTimestamp(),
      });

      // Step 6: Generate receipt data
      const receipt = {
        receiptId: `RCP-${Date.now()}`,
        bookingId: bookingData.bookingId,
        transactionId: paymentData.transactionId,
        amount: AMOUNT,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        customerName: bookingData.userDetails.fullName,
        customerEmail: bookingData.userDetails.emailId,
        serviceType: bookingData.serviceType,
        appointmentDate: bookingData.displayDate,
        appointmentTime: bookingData.displayTime,
        duration: bookingData.duration,
        paymentDocId: paymentDocRef.id,
      };

      setReceiptData(receipt);
      setShowReceipt(true);
      setPaymentData((prev) => ({ ...prev, paymentCompleted: true }));

      // Success message
      console.log("Payment processed successfully:", {
        paymentDocId: paymentDocRef.id,
        transactionId: paymentData.transactionId,
        screenshotURL: screenshotData.url,
      });
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

Payment Details:
Amount: ₹${receiptData.amount}
Payment Date: ${receiptData.paymentDate}
Payment Time: ${receiptData.paymentTime}
Status: PAID

Thank you for choosing ZeroFOMO!
Contact us: support@zerofomo.com

Note: Your payment screenshot has been securely stored for verification purposes.
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
                <div className="receipt-row">
                  <span>Payment Record ID:</span>
                  <span>{receiptData.paymentDocId}</span>
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
              </div>

              <div className="receipt-section">
                <div className="security-info">
                  <p>
                    <strong>🔒 Security:</strong> Your payment screenshot has
                    been securely stored for verification purposes.
                  </p>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Header />

      <div className="payment-container">
        {/* Payment Disclaimer */}
        <div className="payment-disclaimer">
          <h2>Payment Disclaimer</h2>
          <div className="disclaimer-content">
            <p>
              Please double-check the UPI ID and amount before making the
              payment. After payment, upload the screenshot as proof.
            </p>

            <div className="important-note">
              <h3>✅ IMPORTANT: We are not responsible for:</h3>
              <ul>
                <li>Payments made to the wrong UPI ID</li>
                <li>Incorrect or fake screenshots</li>
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

        {/* Terms and Conditions Checkbox */}
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

        {/* Conditional Rendering - Show only if terms are accepted */}
        {termsAccepted && (
          <>
            {/* Booking Summary */}
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

            {/* Payment Methods */}
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

            {/* Payment Verification Form */}
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

                <div className="form-group">
                  <label htmlFor="paymentScreenshot">
                    Payment Screenshot <span className="required">*</span>
                  </label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="paymentScreenshot"
                      name="paymentScreenshot"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      required
                      disabled={loading}
                    />
                    <div className="file-upload-info">
                      {paymentData.paymentScreenshot ? (
                        <span className="file-selected">
                          ✅ {paymentData.paymentScreenshot.name}
                        </span>
                      ) : (
                        <span className="file-placeholder">
                          Click to upload payment screenshot
                        </span>
                      )}
                    </div>
                  </div>
                  <small>
                    Upload screenshot of your payment (JPG, PNG only, max 5MB).
                    Screenshot will be securely stored in your account.
                  </small>
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

            {/* Security Note */}
            <div className="security-note">
              <h3>🔒 Security & Storage Information</h3>
              <p>
                Your payment information is secure. We store the transaction ID
                and payment screenshot in your personal account section for
                verification purposes. We never store your banking details or
                UPI PIN.
              </p>
              <p>
                <strong>Duplicate Prevention:</strong> Each transaction ID can
                only be used once to prevent duplicate payments and ensure
                payment integrity.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
