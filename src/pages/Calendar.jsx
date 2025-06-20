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
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { cleanupExpiredBookings } from "../config/bookingCleanupService";
import Header from "../components/Header";
import "../styles/Calendar.css";

const Calendar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get state from navigation including price and additional schools
  const {
    duration = 45,
    serviceType = "Individual Service",
    price = 0,
    additionalSchools = 0,
  } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [blockedSlots, setBlockedSlots] = useState({});
  const [dayBlockStatus, setDayBlockStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [blockType, setBlockType] = useState("slot");
  const [blockReason, setBlockReason] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [isEditingZoomLink, setIsEditingZoomLink] = useState(false);
  const [tempZoomLink, setTempZoomLink] = useState("");
  const [tempReservedSlots, setTempReservedSlots] = useState({});

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const adminDocRef = doc(db, "adminUsers", currentUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        setIsAdmin(adminDoc.exists());

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

    // Start from tomorrow (current date + 1)
    for (let i = 1; i <= 15; i++) {
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
  }, [availableDates]);

  // Fetch booked and blocked slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
      fetchBlockedSlots(selectedDate);
    }
  }, [selectedDate]);

  // Reset selected slots when date changes
  useEffect(() => {
    setSelectedSlots([]);
  }, [selectedDate]);

  const fetchDayBlockStatus = async () => {
    try {
      const dayStatus = {};

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

        // Check if all slots are booked (checking ALL durations)
        const bookedQuery = query(
          collection(db, "bookings"),
          where("date", "==", dateStr),
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

        // Get temp reservations for this date
        const tempQuery = query(
          collection(db, "tempReservations"),
          where("date", "==", dateStr)
        );
        const tempSnapshot = await getDocs(tempQuery);

        // Count valid temp reservations
        let validTempReservations = 0;
        tempSnapshot.forEach((doc) => {
          const data = doc.data();
          const expiresAt = data.expiresAt?.toDate();
          if (expiresAt && expiresAt > new Date()) {
            validTempReservations++;
          }
        });

        const totalSlots = 34;
        const bookedCount = bookedSnapshot.size;
        const blockedCount = slotBlockedSnapshot.size;
        const unavailableSlots =
          bookedCount + blockedCount + validTempReservations;

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
      await cleanupExpiredBookings();
      await cleanupExpiredReservations();

      const dateStr = date.toDateString();

      // Fetch confirmed bookings for ALL durations (not just current duration)
      const confirmedQuery = query(
        collection(db, "bookings"),
        where("date", "==", dateStr),
        where("status", "==", "confirmed")
      );

      // Fetch temporary reservations for ALL durations
      const tempQuery = query(
        collection(db, "tempReservations"),
        where("date", "==", dateStr)
      );

      const [confirmedSnapshot, tempSnapshot] = await Promise.all([
        getDocs(confirmedQuery),
        getDocs(tempQuery),
      ]);

      const booked = {};
      const tempReserved = {};

      // Process confirmed bookings - mark ALL time slots as booked regardless of duration
      confirmedSnapshot.forEach((doc) => {
        const data = doc.data();
        booked[data.time] = {
          duration: data.duration,
          serviceType: data.serviceType,
          isCurrentDuration: data.duration === duration,
        };
      });

      // Process temporary reservations - mark ALL time slots as temp reserved
      tempSnapshot.forEach((doc) => {
        const data = doc.data();
        const expiresAt = data.expiresAt?.toDate();

        if (expiresAt && expiresAt > new Date()) {
          // Still valid reservation
          tempReserved[data.time] = {
            userId: data.userId,
            expiresAt: expiresAt,
            isOwn: data.userId === currentUser?.uid,
            duration: data.duration,
            isCurrentDuration: data.duration === duration,
          };
        }
      });

      setBookedSlots(booked);
      setTempReservedSlots(tempReserved);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredReservations = async () => {
    try {
      const now = new Date();
      const expiredQuery = query(
        collection(db, "tempReservations"),
        where("expiresAt", "<=", Timestamp.fromDate(now))
      );

      const expiredSnapshot = await getDocs(expiredQuery);
      const batch = writeBatch(db);

      expiredSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      if (!expiredSnapshot.empty) {
        await batch.commit();
        console.log(`Cleaned up ${expiredSnapshot.size} expired reservations`);
      }
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
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
          for (let hour = 7; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
              blocked[time] = { reason: data.reason, type: "day" };
            }
          }
        } else {
          blocked[data.time] = { reason: data.reason, type: "slot" };
        }
      });

      setBlockedSlots(blocked);
    } catch (error) {
      console.error("Error fetching blocked slots:", error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];

    for (let hour = 7; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = formatTime(time);

        const isBlocked = blockedSlots[time];
        const isBooked = bookedSlots[time];
        const tempReservation = tempReservedSlots[time];
        const isSelected = selectedSlots.includes(time);

        // Determine slot status and availability
        let disabled = false;
        let slotClass = "";
        let labelText = "";

        if (isBooked) {
          slotClass = "cal-disabled";
          // Show more detailed info if it's a different duration
          if (isBooked.isCurrentDuration) {
            labelText = "Booked";
          } else {
            labelText = `Booked (${isBooked.duration}min)`;
          }
          disabled = true;
        } else if (isBlocked) {
          slotClass = "cal-blocked";
          labelText = isBlocked.type === "day" ? "Blocked" : "Blocked";
          disabled = true;
        } else if (tempReservation && !tempReservation.isOwn) {
          slotClass = "cal-temp-reserved";
          if (tempReservation.isCurrentDuration) {
            labelText = "Temporarily Blocked";
          } else {
            labelText = `Temporarily Blocked (${tempReservation.duration}min)`;
          }
          disabled = true;
        } else if (tempReservation && tempReservation.isOwn) {
          slotClass = "cal-own-reservation";
          labelText = "Your Reservation";
          disabled = false;
        }

        slots.push({
          value: time,
          display: displayTime,
          disabled: disabled,
          blocked: isBlocked,
          booked: isBooked,
          tempReserved: tempReservation,
          selected: isSelected,
          slotClass: slotClass,
          labelText: labelText,
        });
      }
    }

    return slots;
  };

  const createTempReservation = async (date, time) => {
    try {
      const dateStr = date.toDateString();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      const reservationData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        date: dateStr,
        time: time,
        duration: duration,
        expiresAt: Timestamp.fromDate(expiresAt),
        createdAt: serverTimestamp(),
      };

      // Use a unique document ID to prevent conflicts
      const docId = `${currentUser.uid}-${dateStr}-${time}`;
      await setDoc(doc(db, "tempReservations", docId), reservationData);

      return docId;
    } catch (error) {
      console.error("Error creating temporary reservation:", error);
      throw error;
    }
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
    if (!adminMode && isDayBlocked(date)) {
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    if (adminMode && blockType === "slot") {
      setSelectedSlots((prev) => {
        if (prev.includes(time)) {
          return prev.filter((t) => t !== time);
        } else {
          return [...prev, time];
        }
      });
    } else if (adminMode) {
      setSelectedTime(time);
    } else if (
      !blockedSlots[time] &&
      !bookedSlots[time] &&
      (!tempReservedSlots[time] || tempReservedSlots[time].isOwn)
    ) {
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

      // Check if slot is still available
      await fetchBookedSlots(selectedDate);

      if (
        bookedSlots[selectedTime] ||
        (tempReservedSlots[selectedTime] &&
          !tempReservedSlots[selectedTime].isOwn)
      ) {
        alert(
          "Sorry, this slot is no longer available. Please select another time."
        );
        return;
      }

      // Create temporary reservation
      const reservationId = await createTempReservation(
        selectedDate,
        selectedTime
      );

      const bookingData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || "User",
        date: selectedDate.toDateString(),
        time: selectedTime,
        duration: duration,
        serviceType: serviceType,
        price: price,
        additionalSchools: additionalSchools,
        status: "pending",
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        tempReservationId: reservationId, // Link to temp reservation
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      navigate("/booking-details", {
        state: {
          bookingId: docRef.id,
          date: selectedDate.toDateString(),
          time: selectedTime,
          duration: duration,
          serviceType: serviceType,
          price: price,
          additionalSchools: additionalSchools,
          displayTime: formatTime(selectedTime),
          displayDate: formatDate(selectedDate),
          zoomLink: zoomLink,
          isParent: location.state?.isParent || false,
          tempReservationId: reservationId, // Pass reservation ID
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

      if (blockType === "day") {
        const blockData = {
          date: dateStr,
          reason: blockReason,
          type: "day",
          blockedBy: currentUser.uid,
          blockedAt: serverTimestamp(),
        };

        await setDoc(doc(db, "blockedSlots", `day-${dateStr}`), blockData);
      } else {
        const slotsToBlock =
          selectedSlots.length > 0 ? selectedSlots : [selectedTime];

        if (slotsToBlock.length === 0) {
          alert("Please select at least one time slot to block");
          return;
        }

        const batch = writeBatch(db);

        slotsToBlock.forEach((time) => {
          const blockData = {
            date: dateStr,
            reason: blockReason,
            type: "slot",
            time: time,
            blockedBy: currentUser.uid,
            blockedAt: serverTimestamp(),
          };

          const docRef = doc(db, "blockedSlots", `slot-${dateStr}-${time}`);
          batch.set(docRef, blockData);
        });

        await batch.commit();
      }

      await fetchBlockedSlots(selectedDate);
      await fetchDayBlockStatus();
      setBlockReason("");
      setSelectedSlots([]);
      alert("Slot(s) blocked successfully");
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
      const isDayBlock = blockedSlots[time]?.type === "day";

      if (isDayBlock) {
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
        await deleteDoc(doc(db, "blockedSlots", `slot-${dateStr}-${time}`));
      }

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
    return null;
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
            {price > 0 && (
              <span className="cal-duration">₹{price.toLocaleString()}</span>
            )}
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
                      <div className="cal-blocked-label">Blocked</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

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

                  {blockType === "slot" && selectedSlots.length > 0 && (
                    <div className="cal-selected-slots-info">
                      Selected slots: {selectedSlots.length}
                    </div>
                  )}

                  <div className="cal-block-actions">
                    <button
                      className="cal-block-btn"
                      onClick={handleBlockSlot}
                      disabled={
                        loading ||
                        !blockReason ||
                        (blockType === "slot" &&
                          selectedSlots.length === 0 &&
                          !selectedTime)
                      }
                    >
                      {loading ? "Processing..." : "Block Slot(s)"}
                    </button>
                  </div>
                </div>
              )}
              <div className="cal-times-grid">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`cal-time-slot ${
                      selectedTime === slot.value || slot.selected
                        ? "cal-selected"
                        : ""
                    } ${slot.slotClass}`}
                    onClick={() => handleTimeSelect(slot.value)}
                    disabled={!adminMode && slot.disabled}
                    title={
                      slot.tempReserved && !slot.tempReserved.isOwn
                        ? `Reserved until ${slot.tempReserved.expiresAt?.toLocaleTimeString()}`
                        : slot.labelText
                    }
                  >
                    <div className="cal-time-display">{slot.display}</div>

                    {/* Simple labels like first image */}
                    {slot.booked && (
                      <div className="cal-booked-label">{slot.labelText}</div>
                    )}

                    {slot.blocked && (
                      <div className="cal-blocked-slot-label">Blocked</div>
                    )}

                    {slot.tempReserved && !slot.tempReserved.isOwn && (
                      <div className="cal-temp-reserved-label">
                        {slot.labelText}
                      </div>
                    )}

                    {slot.tempReserved && slot.tempReserved.isOwn && (
                      <div className="cal-own-reservation-label">Yours</div>
                    )}

                    {/* Admin unblock button for blocked slots */}
                    {adminMode && slot.blocked && (
                      <button
                        className="cal-unblock-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnblockSlot(slot.value);
                        }}
                        title="Unblock this slot"
                      >
                        ×
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                {price > 0 && (
                  <p>
                    <strong>Price:</strong> ₹{price.toLocaleString()}
                  </p>
                )}
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
