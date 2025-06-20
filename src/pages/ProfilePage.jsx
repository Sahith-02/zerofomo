import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js";
import Header from "../components/Header";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", currentUser.uid));

      const querySnapshot = await getDocs(q);
      const bookingsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          ...data,
        });
      });

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (dateString, timeString) => {
    try {
      let parsedDate;

      if (dateString.includes(",")) {
        parsedDate = new Date(dateString + " " + new Date().getFullYear());
      } else if (dateString.includes("2025")) {
        parsedDate = new Date(dateString);
      } else {
        parsedDate = new Date(dateString);
      }

      if (timeString) {
        const [time, period] = timeString.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);

        if (period && period.toUpperCase() === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (period && period.toUpperCase() === "AM" && hour24 === 12) {
          hour24 = 0;
        }

        parsedDate.setHours(hour24, parseInt(minutes) || 0, 0, 0);
      }

      return parsedDate;
    } catch (error) {
      console.error("Date parsing error:", error, dateString, timeString);
      return new Date();
    }
  };

  const getBookingStatus = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const bookingDateTime = parseDate(appointmentDate, appointmentTime);

    if (bookingDateTime > now) {
      return "upcoming";
    } else {
      const timeDiff = now - bookingDateTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff <= 1) {
        return "ongoing";
      } else {
        return "completed";
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "up-status-upcoming";
      case "ongoing":
        return "up-status-ongoing";
      case "completed":
        return "up-status-completed";
      default:
        return "up-status-upcoming";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Scheduled";
      case "ongoing":
        return "Live";
      case "completed":
        return "Done";
      default:
        return "Unknown";
    }
  };

  const filterBookings = (status) => {
    return bookings.filter((booking) => {
      const bookingStatus = getBookingStatus(
        booking.appointmentDate || booking.date,
        booking.appointmentTime
      );
      return bookingStatus === status;
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = parseDate(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Time not specified";

      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }

      const date = new Date(`2000-01-01 ${timeString}`);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return timeString || "Time not specified";
    }
  };

  const BookingCard = ({ booking }) => {
    const status = getBookingStatus(
      booking.appointmentDate || booking.date,
      booking.appointmentTime
    );

    return (
      <div className="up-booking-card">
        <div className="up-booking-header">
          <div className="up-booking-type">
            <h4>Discovery Call</h4>
            <span className={`up-status-badge ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          <div className="up-booking-amount">
            ₹{booking.amount || booking.price || "0"}
          </div>
        </div>

        <div className="up-booking-details">
          <div className="up-detail-row">
            <span className="up-detail-label">Date</span>
            <span className="up-detail-value">
              {formatDate(booking.appointmentDate || booking.date)}
            </span>
          </div>
          <div className="up-detail-row">
            <span className="up-detail-label">Time</span>
            <span className="up-detail-value">
              {formatTime(booking.appointmentTime)}
            </span>
          </div>
          <div className="up-detail-row">
            <span className="up-detail-label">Duration</span>
            <span className="up-detail-value">
              {booking.duration || "30"}min
            </span>
          </div>
          <div className="up-detail-row up-full-width">
            <span className="up-detail-label">Payment ID</span>
            <span className="up-detail-value up-booking-id">
              {booking.paymentId || booking.bookingId || booking.id}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ tabKey, label, count, isActive, onClick }) => (
    <button
      className={`up-tab-button ${isActive ? "up-active" : ""}`}
      onClick={() => onClick(tabKey)}
    >
      {label} <span style={{ opacity: 0.7 }}>({count})</span>
    </button>
  );

  const EmptyState = ({ type }) => {
    const getEmptyStateContent = () => {
      switch (type) {
        case "upcoming":
          return {
            icon: "📅",
            title: "No upcoming bookings",
            description: "Your next appointments will appear here.",
          };
        case "ongoing":
          return {
            icon: "🔴",
            title: "No active sessions",
            description: "Live meetings will be shown here.",
          };
        case "completed":
          return {
            icon: "✅",
            title: "No completed bookings",
            description: "Your booking history will appear here.",
          };
        default:
          return {
            icon: "📋",
            title: "No bookings found",
            description: "Start by booking your first appointment.",
          };
      }
    };

    const content = getEmptyStateContent();

    return (
      <div className="up-empty-state">
        <div className="up-empty-icon">{content.icon}</div>
        <h4>{content.title}</h4>
        <p>{content.description}</p>
      </div>
    );
  };

  return (
    <div className="up-profile-page">
      <Header />

      <div className="up-profile-container">
        <div className="up-profile-card">
          <div className="up-profile-header">
            <h2>Your Profile</h2>

            <div className="up-profile-info">
              <div className="up-profile-avatar">
                {currentUser.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser.email.charAt(0).toUpperCase()}
              </div>

              <div className="up-profile-details">
                <p className="up-profile-name">
                  {currentUser.displayName || "User"}
                </p>
                <p className="up-profile-email">{currentUser.email}</p>
                <p className="up-member-since">
                  Member since{" "}
                  {currentUser.metadata.creationTime
                    ? new Date(
                        currentUser.metadata.creationTime
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="up-bookings-section">
            <div className="up-bookings-header">
              <h3>Your Bookings</h3>
              <div className="up-booking-stats">
                <div className="up-stat">
                  <span className="up-stat-number">
                    {filterBookings("upcoming").length}
                  </span>
                  <span className="up-stat-label">Upcoming</span>
                </div>
                <div className="up-stat">
                  <span className="up-stat-number">
                    {filterBookings("completed").length}
                  </span>
                  <span className="up-stat-label">Completed</span>
                </div>
                <div className="up-stat">
                  <span className="up-stat-number">{bookings.length}</span>
                  <span className="up-stat-label">Total</span>
                </div>
              </div>
            </div>

            <div className="up-booking-tabs">
              <TabButton
                tabKey="upcoming"
                label="Upcoming"
                count={filterBookings("upcoming").length}
                isActive={activeTab === "upcoming"}
                onClick={setActiveTab}
              />
              <TabButton
                tabKey="ongoing"
                label="Live"
                count={filterBookings("ongoing").length}
                isActive={activeTab === "ongoing"}
                onClick={setActiveTab}
              />
              <TabButton
                tabKey="completed"
                label="Past"
                count={filterBookings("completed").length}
                isActive={activeTab === "completed"}
                onClick={setActiveTab}
              />
            </div>

            <div className="up-bookings-content">
              {loading ? (
                <div className="up-loading-state">
                  <div className="up-loading-spinner"></div>
                  <p>Loading your bookings...</p>
                </div>
              ) : (
                <div className="up-bookings-grid">
                  {filterBookings(activeTab).length > 0 ? (
                    filterBookings(activeTab).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <EmptyState type={activeTab} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
