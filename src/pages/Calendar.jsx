import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { cleanupExpiredBookings } from "../config/bookingCleanupService";
import Header from "../components/Header";
import "../styles/Calendar.css";

const Calendar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get duration from navigation state or default to 45 minutes
  const duration = location.state?.duration || 45;
  const serviceType = location.state?.serviceType || "Individual Service";

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [blockedSlots, setBlockedSlots] = useState({});
  const [dayBlockStatus, setDayBlockStatus] = useState({}); // Track which days are blocked
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [blockType, setBlockType] = useState("slot"); // 'slot' or 'day'
  const [blockReason, setBlockReason] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [isEditingZoomLink, setIsEditingZoomLink] = useState(false);
  const [tempZoomLink, setTempZoomLink] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const adminDocRef = doc(db, "adminUsers", currentUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        setIsAdmin(adminDoc.exists());

        // Fetch Zoom link if admin
        if (adminDoc.exists()) {
          const zoomLinkDoc = await getDoc(
            doc(db, "adminSettings", "zoomLink")
          );
          if (zoomLinkDoc.exists()) {
            setZoomLink(zoomLinkDoc.data().link || "");
          }
        }
      }
    };
    checkAdminStatus();
  }, [currentUser]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Generate next 15 days
  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    setAvailableDates(dates);
  }, []);

  // Fetch day block status for all available dates
  useEffect(() => {
    if (availableDates.length > 0) {
      fetchDayBlockStatus();
    }
  }, [availableDates, duration]);

  // Fetch booked and blocked slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
      fetchBlockedSlots(selectedDate);
    }
  }, [selectedDate, duration]);

  const fetchDayBlockStatus = async () => {
    try {
      const dayStatus = {};

      // Check each date for blocks and bookings
      for (const date of availableDates) {
        const dateStr = date.toDateString();

        // Check if entire day is blocked
        const blockedQuery = query(
          collection(db, "blockedSlots"),
          where("date", "==", dateStr),
          where("type", "==", "day")
        );
        const blockedSnapshot = await getDocs(blockedQuery);

        if (!blockedSnapshot.empty) {
          dayStatus[dateStr] = {
            blocked: true,
            reason: "Day blocked by admin",
          };
          continue;
        }

        // Check if all slots are booked
        const bookedQuery = query(
          collection(db, "bookings"),
          where("date", "==", dateStr),
          where("duration", "==", duration),
          where("status", "==", "confirmed")
        );
        const bookedSnapshot = await getDocs(bookedQuery);

        // Get blocked slots for this date
        const slotBlockedQuery = query(
          collection(db, "blockedSlots"),
          where("date", "==", dateStr),
          where("type", "==", "slot")
        );
        const slotBlockedSnapshot = await getDocs(slotBlockedQuery);

        // Count total available slots (48 slots for 24 hours with 30-min intervals)
        const totalSlots = 48;
        const bookedCount = bookedSnapshot.size;
        const blockedCount = slotBlockedSnapshot.size;
        const unavailableSlots = bookedCount + blockedCount;

        if (unavailableSlots >= totalSlots) {
          dayStatus[dateStr] = {
            blocked: true,
            reason: "All slots unavailable",
          };
        } else {
          dayStatus[dateStr] = { blocked: false };
        }
      }

      setDayBlockStatus(dayStatus);
    } catch (error) {
      console.error("Error fetching day block status:", error);
    }
  };

  const fetchBookedSlots = async (date) => {
    try {
      setLoading(true);

      // First, clean up expired pending bookings
      await cleanupExpiredBookings();

      const dateStr = date.toDateString();

      // Query for booked slots on selected date with same duration
      const q = query(
        collection(db, "bookings"),
        where("date", "==", dateStr),
        where("duration", "==", duration),
        where("status", "==", "confirmed") // Only confirmed bookings block the slot
      );

      const querySnapshot = await getDocs(q);
      const booked = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        booked[data.time] = true;
      });

      setBookedSlots(booked);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedSlots = async (date) => {
    try {
      const dateStr = date.toDateString();
      const q = query(
        collection(db, "blockedSlots"),
        where("date", "==", dateStr)
      );

      const querySnapshot = await getDocs(q);
      const blocked = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "day") {
          // Block entire day
          for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
              blocked[time] = { reason: data.reason, type: "day" };
            }
          }
        } else {
          // Block specific time slot
          blocked[data.time] = { reason: data.reason, type: "slot" };
        }
      });

      setBlockedSlots(blocked);
    } catch (error) {
      console.error("Error fetching blocked slots:", error);
    }
  };

  // Generate time slots for 24 hours
  const generateTimeSlots = () => {
    const slots = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = formatTime(time);

        const isBlocked = blockedSlots[time];
        const isBooked = bookedSlots[time];

        slots.push({
          value: time,
          display: displayTime,
          disabled: isBooked || isBlocked,
          blocked: isBlocked,
          booked: isBooked,
        });
      }
    }

    return slots;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isDayBlocked = (date) => {
    const dateStr = date.toDateString();
    return dayBlockStatus[dateStr]?.blocked || false;
  };

  const getDayBlockReason = (date) => {
    const dateStr = date.toDateString();
    return dayBlockStatus[dateStr]?.reason || "";
  };

  const handleDateSelect = (date) => {
    // Don't allow selection of blocked days unless in admin mode
    if (!adminMode && isDayBlocked(date)) {
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (time) => {
    if (adminMode) {
      setSelectedTime(time);
    } else if (!blockedSlots[time] && !bookedSlots[time]) {
      setSelectedTime(time);
    }
  };

  const handleNext = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    try {
      setLoading(true);

      // Create a pending booking (will be confirmed after payment)
      const bookingData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || "User",
        date: selectedDate.toDateString(),
        time: selectedTime,
        duration: duration,
        serviceType: serviceType,
        status: "pending", // Will be updated to 'confirmed' after payment
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes expiry for pending bookings
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      // Navigate to user details page with booking info
      navigate("/booking-details", {
        state: {
          bookingId: docRef.id,
          date: selectedDate.toDateString(),
          time: selectedTime,
          duration: duration,
          serviceType: serviceType,
          displayTime: formatTime(selectedTime),
          displayDate: formatDate(selectedDate),
          zoomLink: zoomLink, // Pass the zoom link to booking details
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error creating booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async () => {
    if (!selectedDate || !blockReason) {
      alert("Please select date and provide a reason");
      return;
    }

    try {
      setLoading(true);

      const dateStr = selectedDate.toDateString();
      const blockData = {
        date: dateStr,
        reason: blockReason,
        blockedBy: currentUser.uid,
        blockedAt: serverTimestamp(),
      };

      if (blockType === "day") {
        // Block entire day
        blockData.type = "day";
        await setDoc(doc(db, "blockedSlots", `day-${dateStr}`), blockData);
      } else {
        // Block specific time slot
        if (!selectedTime) {
          alert("Please select a time slot to block");
          return;
        }
        blockData.type = "slot";
        blockData.time = selectedTime;
        await setDoc(
          doc(db, "blockedSlots", `slot-${dateStr}-${selectedTime}`),
          blockData
        );
      }

      // Refresh the slots and day status
      await fetchBlockedSlots(selectedDate);
      await fetchDayBlockStatus();
      setBlockReason("");
      alert("Slot blocked successfully");
    } catch (error) {
      console.error("Error blocking slot:", error);
      alert("Error blocking slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockSlot = async (time) => {
    if (!selectedDate || !time) return;

    try {
      setLoading(true);
      const dateStr = selectedDate.toDateString();

      // Check if it's a day block or slot block
      const isDayBlock = blockedSlots[time]?.type === "day";

      if (isDayBlock) {
        // Delete all blocks for this day
        const q = query(
          collection(db, "blockedSlots"),
          where("date", "==", dateStr),
          where("type", "==", "day")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        // Delete specific time slot block
        await deleteDoc(doc(db, "blockedSlots", `slot-${dateStr}-${time}`));
      }

      // Refresh the slots and day status
      await fetchBlockedSlots(selectedDate);
      await fetchDayBlockStatus();
      alert("Slot unblocked successfully");
    } catch (error) {
      console.error("Error unblocking slot:", error);
      alert("Error unblocking slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveZoomLink = async () => {
    try {
      setLoading(true);
      await setDoc(doc(db, "adminSettings", "zoomLink"), {
        link: tempZoomLink,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
      });
      setZoomLink(tempZoomLink);
      setIsEditingZoomLink(false);
      alert("Zoom link saved successfully");
    } catch (error) {
      console.error("Error saving Zoom link:", error);
      alert("Error saving Zoom link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditZoomLink = () => {
    setTempZoomLink(zoomLink);
    setIsEditingZoomLink(true);
  };

  const handleCancelEditZoomLink = () => {
    setIsEditingZoomLink(false);
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="cal-page">
      <Header />

      <div className="cal-container">
        <div className="cal-header">
          <h1>Book Your Appointment</h1>
          <div className="cal-booking-info">
            <span className="cal-service-type">{serviceType}</span>
            <span className="cal-duration">{duration} minutes</span>
          </div>

          {isAdmin && (
            <div className="cal-admin-controls">
              <button
                className={`cal-admin-toggle ${
                  adminMode ? "cal-admin-active" : ""
                }`}
                onClick={() => setAdminMode(!adminMode)}
              >
                {adminMode ? "Exit Admin Mode" : "Admin Mode"}
              </button>

              {adminMode && (
                <div className="cal-zoom-link-section">
                  <h3>Zoom Meeting Link</h3>
                  {isEditingZoomLink ? (
                    <div className="cal-zoom-link-edit">
                      <input
                        type="text"
                        value={tempZoomLink}
                        onChange={(e) => setTempZoomLink(e.target.value)}
                        placeholder="Enter Zoom meeting link"
                        className="cal-zoom-link-input"
                      />
                      <div className="cal-zoom-link-buttons">
                        <button
                          onClick={handleSaveZoomLink}
                          disabled={loading}
                          className="cal-zoom-link-save"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEditZoomLink}
                          className="cal-zoom-link-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="cal-zoom-link-display">
                      {zoomLink ? (
                        <>
                          <a
                            href={zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cal-zoom-link-text"
                          >
                            {zoomLink.length > 50
                              ? `${zoomLink.substring(0, 50)}...`
                              : zoomLink}
                          </a>
                          <button
                            onClick={handleEditZoomLink}
                            className="cal-zoom-link-edit-btn"
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEditZoomLink}
                          className="cal-zoom-link-add-btn"
                        >
                          + Add Zoom Link
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="cal-booking-steps">
          {/* Step 1: Date Selection */}
          <div className="cal-step-section">
            <h2 className="cal-step-title">Select Date</h2>
            <div className="cal-dates-grid">
              {availableDates.map((date, index) => {
                const isDateBlocked = isDayBlocked(date);
                const blockReason = getDayBlockReason(date);

                return (
                  <button
                    key={index}
                    className={`cal-date-card ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "cal-selected"
                        : ""
                    } ${isToday(date) ? "cal-today" : ""} ${
                      isDateBlocked ? "cal-day-blocked" : ""
                    }`}
                    onClick={() => handleDateSelect(date)}
                    disabled={!adminMode && isDateBlocked}
                    title={isDateBlocked ? blockReason : ""}
                  >
                    <div className="cal-date-day">{date.getDate()}</div>
                    <div className="cal-date-month">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div className="cal-date-weekday">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    {isToday(date) && (
                      <div className="cal-today-label">Today</div>
                    )}
                    {isDateBlocked && (
                      <div className="cal-blocked-label">
                        {blockReason.includes("admin") ? "Blocked" : "Full"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Time Selection */}
          {selectedDate && (
            <div className="cal-step-section">
              <h2 className="cal-step-title">
                {adminMode ? "Manage Slots for " : "Select Time for "}
                {formatDate(selectedDate)}
                {loading && (
                  <span className="cal-loading-text">
                    Loading available slots...
                  </span>
                )}
              </h2>

              {adminMode && (
                <div className="cal-admin-block-controls">
                  <div className="cal-block-type-selector">
                    <label>
                      <input
                        type="radio"
                        name="blockType"
                        value="slot"
                        checked={blockType === "slot"}
                        onChange={() => setBlockType("slot")}
                      />
                      Block Specific Slot
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="blockType"
                        value="day"
                        checked={blockType === "day"}
                        onChange={() => setBlockType("day")}
                      />
                      Block Entire Day
                    </label>
                  </div>

                  <div className="cal-block-reason-input">
                    <input
                      type="text"
                      placeholder="Reason for blocking"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                    />
                  </div>

                  <div className="cal-block-actions">
                    <button
                      className="cal-block-btn"
                      onClick={handleBlockSlot}
                      disabled={loading || !blockReason}
                    >
                      {loading ? "Processing..." : "Block Slot"}
                    </button>
                  </div>
                </div>
              )}

              <div className="cal-times-grid">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`cal-time-slot ${
                      selectedTime === slot.value ? "cal-selected" : ""
                    } ${slot.disabled ? "cal-disabled" : ""} ${
                      slot.blocked ? "cal-blocked" : ""
                    }`}
                    onClick={() => handleTimeSelect(slot.value)}
                    disabled={!adminMode && slot.disabled}
                  >
                    {slot.display}
                    {slot.booked && (
                      <span className="cal-booked-label">Booked</span>
                    )}
                    {slot.blocked && (
                      <span className="cal-blocked-label">
                        {slot.blocked.reason}
                        {adminMode && (
                          <button
                            className="cal-unblock-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnblockSlot(slot.value);
                            }}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          {!adminMode && selectedDate && selectedTime && (
            <div className="cal-next-section">
              <div className="cal-selection-summary">
                <h3>Your Selection:</h3>
                <p>
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(selectedTime)}
                </p>
                <p>
                  <strong>Duration:</strong> {duration} minutes
                </p>
                <p>
                  <strong>Service:</strong> {serviceType}
                </p>
              </div>

              <button
                className="cal-next-btn"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : "Next: Enter Details"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
