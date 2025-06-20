import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import Header from "../components/Header";
import "../styles/BookingDetails.css";

const BookingDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bookingInfo = location.state;
  const isParent = bookingInfo?.isParent || false;

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailId: "",
    ...(isParent
      ? {
          childEducation: "",
          interestedCourse: "",
          preferredStudyDestination: "",
          interestedCountries: "",
          purposeOfCall: "",
        }
      : {
          interestedCourse: "",
          preferredStudyDestination: "",
          interestedCountries: "",
          planningToApply: "",
          competitiveExam: "",
          testScores: "",
          purposeOfCall: "",
          applicationStage: "",
          specificQuestions: "",
          alternateEmail: "",
          specificRequirements: "",
          preferredCommunication: "email",
        }),
  });

  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const paymentSectionRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!bookingInfo) {
      navigate("/");
      return;
    }

    const fetchBookingData = async () => {
      try {
        const bookingRef = doc(db, "bookings", bookingInfo.bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const data = bookingSnap.data();
          setBookingData(data);

          if (data.userId !== currentUser.uid) {
            alert("You don't have permission to edit this booking.");
            navigate("/");
            return;
          }

          if (data.detailsCompleted) {
            setFormData({
              fullName: data.fullName || "",
              phoneNumber: data.phoneNumber || "",
              emailId: data.emailId || currentUser.email || "",
              ...(isParent
                ? {
                    childEducation: data.childEducation || "",
                    interestedCourse: data.interestedCourse || "",
                    preferredStudyDestination:
                      data.preferredStudyDestination || "",
                    interestedCountries: data.interestedCountries || "",
                    purposeOfCall: data.purposeOfCall || "",
                  }
                : {
                    interestedCourse: data.interestedCourse || "",
                    preferredStudyDestination:
                      data.preferredStudyDestination || "",
                    interestedCountries: data.interestedCountries || "",
                    planningToApply: data.planningToApply || "",
                    competitiveExam: data.competitiveExam || "",
                    testScores: data.testScores || "",
                    purposeOfCall: data.purposeOfCall || "",
                    applicationStage: data.applicationStage || "",
                    specificQuestions: data.specificQuestions || "",
                    alternateEmail: data.alternateEmail || "",
                    specificRequirements: data.specificRequirements || "",
                    preferredCommunication:
                      data.preferredCommunication || "email",
                  }),
            });
          } else if (currentUser.email) {
            setFormData((prev) => ({
              ...prev,
              emailId: currentUser.email,
            }));
          }
        } else {
          alert("Booking not found. It may have expired.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        alert("Error loading booking data.");
      }
    };

    fetchBookingData();
  }, [currentUser, bookingInfo, navigate, isParent]);

  useEffect(() => {
    if (showPayment && bookingInfo?.price) {
      // Load Razorpay script dynamically
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      };

      const initializePayment = async () => {
        const isRazorpayLoaded = await loadRazorpay();

        if (!isRazorpayLoaded) {
          alert(
            "Razorpay SDK failed to load. Please check your internet connection."
          );
          return;
        }

        // Create Razorpay payment options with dynamic pricing
        const options = {
          key: "rzp_live_p9Qf75BkcPhYdh", // Your Razorpay key
          amount: bookingInfo.price * 100, // Convert to paise (Razorpay expects amount in paise)
          currency: "INR",
          name: "ZeroFOMO",
          description: `${bookingInfo.serviceType} - ${bookingInfo.displayDate} at ${bookingInfo.displayTime}`,
          image: "/assets/logo.png", // Optional: Add your logo
          capture: true,
          handler: function (response) {
            // Handle successful payment
            console.log("Payment successful:", response);
            alert(
              `Payment successful! Payment ID: ${response.razorpay_payment_id}`
            );

            // Update booking status in Firebase
            updateBookingPaymentStatus(response.razorpay_payment_id);
          },
          prefill: {
            name: formData.fullName,
            email: formData.emailId,
            contact: formData.phoneNumber,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              console.log("Payment modal closed");
            },
          },
        };

        // Create Razorpay checkout instance
        const rzp = new window.Razorpay(options);

        // Add payment button
        const paymentContainer = document.getElementById("razorpay-form");
        if (paymentContainer) {
          paymentContainer.innerHTML = `
            <button 
              type="button" 
              class="razorpay-payment-button"
              id="pay-button"
            >
              Pay ₹${bookingInfo.price.toLocaleString()}
            </button>
          `;

          // Add click event listener to the payment button
          const payButton = document.getElementById("pay-button");
          if (payButton) {
            payButton.addEventListener("click", () => {
              rzp.open();
            });
          }
        }
      };

      initializePayment();
    }
  }, [showPayment, bookingInfo, formData]);

  // Function to update booking payment status
  // In the updateBookingPaymentStatus function in BookingDetails.js
  const updateBookingPaymentStatus = async (paymentId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingInfo.bookingId);

      // Update booking to confirmed status
      await updateDoc(bookingRef, {
        paymentCompleted: true,
        paymentId: paymentId,
        paymentDate: new Date(),
        status: "confirmed",
      });

      // Remove temporary reservation
      if (bookingInfo.tempReservationId) {
        try {
          await deleteDoc(
            doc(db, "tempReservations", bookingInfo.tempReservationId)
          );
        } catch (error) {
          console.error("Error removing temporary reservation:", error);
        }
      }

      // Redirect to payment page with booking details
      navigate("/payment", {
        state: {
          bookingId: bookingInfo.bookingId,
          paymentId: paymentId,
          price: bookingInfo.price,
          serviceType: bookingInfo.serviceType,
          displayDate: bookingInfo.displayDate,
          displayTime: bookingInfo.displayTime,
          duration: bookingInfo.duration,
          userDetails: formData, // Pass all the form data as userDetails
        },
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert(
        "Payment successful but there was an error updating the booking status. Please contact support."
      );
    }
  };
  useEffect(() => {
    const handleBeforeUnload = () => {
      // This will be handled by the automatic cleanup service
      // but we can add immediate cleanup here if needed
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleCancelBooking = async () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? Your time slot will be released."
      )
    ) {
      try {
        setLoading(true);

        // Delete the booking
        const bookingRef = doc(db, "bookings", bookingInfo.bookingId);
        await deleteDoc(bookingRef);

        // Delete the temporary reservation
        if (bookingInfo.tempReservationId) {
          await deleteDoc(
            doc(db, "tempReservations", bookingInfo.tempReservationId)
          );
        }

        alert("Booking cancelled successfully.");
        navigate("/");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Error cancelling booking. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = isParent
      ? [
          "fullName",
          "phoneNumber",
          "emailId",
          "childEducation",
          "interestedCourse",
          "preferredStudyDestination",
          "purposeOfCall",
        ]
      : [
          "fullName",
          "phoneNumber",
          "emailId",
          "interestedCourse",
          "preferredStudyDestination",
          "planningToApply",
          "competitiveExam",
          "purposeOfCall",
          "applicationStage",
        ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        alert(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Save booking details
      const bookingRef = doc(db, "bookings", bookingInfo.bookingId);
      const updateData = {
        ...formData,
        detailsCompleted: true,
        isParent: isParent,
        updatedAt: new Date(),
        // Store the price in the booking document
        price: bookingInfo.price,
        serviceType: bookingInfo.serviceType,
        appointmentDate: bookingInfo.displayDate,
        appointmentTime: bookingInfo.displayTime,
        duration: bookingInfo.duration,
      };
      await updateDoc(bookingRef, updateData);

      // Show payment section
      setShowPayment(true);

      // Scroll after the component updates and renders the payment section
      setTimeout(() => {
        if (paymentSectionRef.current) {
          paymentSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error saving details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !bookingInfo) {
    return null;
  }

  return (
    <div className="booking-details-page">
      <Header />

      <div className="booking-details-container">
        <div className="booking-summary">
          <h1>Complete Your Booking</h1>

          <div className="appointment-summary">
            <h2>Appointment Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Service:</span>
                <span className="value">{bookingInfo.serviceType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">{bookingInfo.displayDate}</span>
              </div>
              <div className="summary-item">
                <span className="label">Time:</span>
                <span className="value">{bookingInfo.displayTime}</span>
              </div>
              <div className="summary-item">
                <span className="label">Duration:</span>
                <span className="value">{bookingInfo.duration} minutes</span>
              </div>
              <div className="summary-item">
                <span className="label">Price:</span>
                <span className="value">
                  ₹{bookingInfo.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-form-container">
          <h2>{isParent ? "Parent Information" : "Student Information"}</h2>

          <form onSubmit={handleSubmit} className="details-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="section-title">1. Personal Information</h3>

              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailId">Email ID *</label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {isParent && (
                <div className="form-group">
                  <label htmlFor="childEducation">
                    Child's Current Education/Job *
                  </label>
                  <input
                    type="text"
                    id="childEducation"
                    name="childEducation"
                    value={formData.childEducation}
                    onChange={handleInputChange}
                    placeholder="Enter child's current education or job"
                    required
                  />
                </div>
              )}
            </div>

            {/* Course & Destination Section */}
            <div className="form-section">
              <h3 className="section-title">
                {isParent
                  ? "2. Child's Academic Interests"
                  : "2. Academic & Course Interests"}
              </h3>

              <div className="form-group">
                <label htmlFor="interestedCourse">
                  {isParent
                    ? "Child's Interested Course(s) *"
                    : "Interested Course(s) *"}
                </label>
                <input
                  type="text"
                  id="interestedCourse"
                  name="interestedCourse"
                  value={formData.interestedCourse}
                  onChange={handleInputChange}
                  placeholder={
                    isParent
                      ? "Enter the course(s) your child is interested in"
                      : "Enter the course(s) you're interested in"
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredStudyDestination">
                  Preferred Study Destination *
                </label>
                <select
                  id="preferredStudyDestination"
                  name="preferredStudyDestination"
                  value={formData.preferredStudyDestination}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your preference</option>
                  <option value="India">India</option>
                  <option value="Abroad">Abroad</option>
                  <option value="Considering Both">Considering Both</option>
                  <option value="Not Sure Yet">Not Sure Yet</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interestedCountries">
                  If Abroad: Interested Country/Countries (Optional)
                </label>
                <input
                  type="text"
                  id="interestedCountries"
                  name="interestedCountries"
                  value={formData.interestedCountries}
                  onChange={handleInputChange}
                  placeholder="Enter countries you're interested in"
                />
              </div>

              {!isParent && (
                <div className="form-group">
                  <label htmlFor="planningToApply">
                    When are you planning to apply? *
                  </label>
                  <select
                    id="planningToApply"
                    name="planningToApply"
                    value={formData.planningToApply}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Fall 2026 or later">
                      Fall 2026 or later
                    </option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
              )}
            </div>

            {/* Test Information Section (only for students) */}
            {!isParent && (
              <div className="form-section">
                <h3 className="section-title">3. Test Information</h3>

                <div className="form-group">
                  <label htmlFor="competitiveExam">
                    Have you taken or are planning to take any competitive exam?
                    *
                  </label>
                  <select
                    id="competitiveExam"
                    name="competitiveExam"
                    value={formData.competitiveExam}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Yes, already taken">
                      Yes, already taken
                    </option>
                    <option value="Yes, planning to take">
                      Yes, planning to take
                    </option>
                    <option value="No">No</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="testScores">
                    Test Scores (if available) (Optional)
                  </label>
                  <textarea
                    id="testScores"
                    name="testScores"
                    value={formData.testScores}
                    onChange={handleInputChange}
                    placeholder="Enter your test scores if available (e.g., IELTS: 7.5, GRE: 320)"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Purpose of Call Section */}
            <div className="form-section">
              <h3 className="section-title">
                {isParent ? "3. Purpose of the Call" : "4. Purpose of the Call"}
              </h3>

              <div className="form-group">
                <label htmlFor="purposeOfCall">
                  {isParent
                    ? "What are you looking for through this call? *"
                    : "What are you looking for through this call? *"}
                </label>
                <textarea
                  id="purposeOfCall"
                  name="purposeOfCall"
                  value={formData.purposeOfCall}
                  onChange={handleInputChange}
                  placeholder={
                    isParent
                      ? "Describe what you want to achieve from this consultation"
                      : "Describe what you want to achieve from this consultation"
                  }
                  rows="3"
                  required
                />
              </div>

              {!isParent && (
                <>
                  <div className="form-group">
                    <label htmlFor="applicationStage">
                      Current Stage in Application Process *
                    </label>
                    <select
                      id="applicationStage"
                      name="applicationStage"
                      value={formData.applicationStage}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your current stage</option>
                      <option value="Just exploring options">
                        Just exploring options
                      </option>
                      <option value="Shortlisted programs">
                        Shortlisted programs
                      </option>
                      <option value="Started applications">
                        Started applications
                      </option>
                      <option value="Already applied">Already applied</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specificQuestions">
                      Any specific questions or concerns you'd like to discuss?
                      (Optional)
                    </label>
                    <textarea
                      id="specificQuestions"
                      name="specificQuestions"
                      value={formData.specificQuestions}
                      onChange={handleInputChange}
                      placeholder="Enter any specific questions or concerns"
                      rows="3"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Additional Information Section (only for students) */}
            {!isParent && (
              <div className="form-section">
                <h3 className="section-title">5. Additional Information</h3>

                <div className="form-group">
                  <label htmlFor="alternateEmail">
                    Alternate Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="alternateEmail"
                    name="alternateEmail"
                    value={formData.alternateEmail}
                    onChange={handleInputChange}
                    placeholder="Enter alternate email if different from primary email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferredCommunication">
                    Preferred Communication Method
                  </label>
                  <select
                    id="preferredCommunication"
                    name="preferredCommunication"
                    value={formData.preferredCommunication}
                    onChange={handleInputChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Both Email and Phone</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="specificRequirements">
                    Additional Requirements or Notes (Optional)
                  </label>
                  <textarea
                    id="specificRequirements"
                    name="specificRequirements"
                    value={formData.specificRequirements}
                    onChange={handleInputChange}
                    placeholder="Any additional requirements or things you'd like us to know..."
                    rows="4"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelBooking}
                disabled={loading}
              >
                Cancel Booking
              </button>
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/calendar")}
              >
                Back to Calendar
              </button>

              <button
                type="submit"
                className="proceed-btn"
                disabled={
                  loading ||
                  !bookingData ||
                  bookingData.userId !== currentUser.uid
                }
              >
                {loading ? "Processing..." : "Complete Booking & Pay"}
              </button>
            </div>
          </form>

          {showPayment && (
            <div
              id="payment-section"
              className="payment-section"
              ref={paymentSectionRef}
            >
              <h3>Complete Your Payment</h3>
              <div className="payment-info">
                <p>
                  <strong>Amount to Pay:</strong> ₹
                  {bookingInfo.price.toLocaleString()}
                </p>
                <p>
                  <strong>Service:</strong> {bookingInfo.serviceType}
                </p>
                <p>
                  <strong>Date & Time:</strong> {bookingInfo.displayDate} at{" "}
                  {bookingInfo.displayTime}
                </p>
              </div>
              <div className="payment-container">
                <form id="razorpay-form"></form>
              </div>
              <p className="secure-text">Secured by Razorpay</p>
            </div>
          )}
        </div>

        <div className="booking-note">
          <div className="note-content">
            <h3>Important Note</h3>
            <p>
              Your time slot is temporarily reserved for 30 minutes. Please
              complete the payment process to confirm your booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
