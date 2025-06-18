// Update your bookingCleanupService.js file with this enhanced version

import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

export const cleanupExpiredBookings = async () => {
  try {
    const now = new Date();
    const batch = writeBatch(db);
    let deleteCount = 0;

    // Clean up expired pending bookings
    const expiredBookingsQuery = query(
      collection(db, "bookings"),
      where("status", "==", "pending"),
      where("expiresAt", "<=", now)
    );

    const expiredBookingsSnapshot = await getDocs(expiredBookingsQuery);

    expiredBookingsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      deleteCount++;
    });

    // Clean up expired temporary reservations
    const expiredReservationsQuery = query(
      collection(db, "tempReservations"),
      where("expiresAt", "<=", Timestamp.fromDate(now))
    );

    const expiredReservationsSnapshot = await getDocs(expiredReservationsQuery);

    expiredReservationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      deleteCount++;
    });

    // Execute batch delete
    if (deleteCount > 0) {
      await batch.commit();
      console.log(
        `Cleaned up ${deleteCount} expired bookings and reservations`
      );
    }

    return deleteCount;
  } catch (error) {
    console.error("Error cleaning up expired bookings:", error);
    return 0;
  }
};

// Function to specifically clean up reservations for a user
export const cleanupUserReservations = async (userId) => {
  try {
    const userReservationsQuery = query(
      collection(db, "tempReservations"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(userReservationsQuery);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    if (!snapshot.empty) {
      await batch.commit();
      console.log(
        `Cleaned up ${snapshot.size} reservations for user ${userId}`
      );
    }

    return snapshot.size;
  } catch (error) {
    console.error("Error cleaning up user reservations:", error);
    return 0;
  }
};

// Function to check if a slot is available (considering both bookings and reservations)
export const isSlotAvailable = async (
  date,
  time,
  duration,
  currentUserId = null
) => {
  try {
    const dateStr = typeof date === "string" ? date : date.toDateString();

    // Check confirmed bookings
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("date", "==", dateStr),
      where("time", "==", time),
      where("duration", "==", duration),
      where("status", "==", "confirmed")
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    if (!bookingsSnapshot.empty) {
      return false; // Slot is booked
    }

    // Check temporary reservations
    const reservationsQuery = query(
      collection(db, "tempReservations"),
      where("date", "==", dateStr),
      where("time", "==", time),
      where("duration", "==", duration)
    );

    const reservationsSnapshot = await getDocs(reservationsQuery);

    for (const doc of reservationsSnapshot.docs) {
      const data = doc.data();
      const expiresAt = data.expiresAt?.toDate();

      // If reservation is still valid
      if (expiresAt && expiresAt > new Date()) {
        // If it's not the current user's reservation, slot is not available
        if (data.userId !== currentUserId) {
          return false;
        }
      }
    }

    return true; // Slot is available
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false; // Assume not available on error
  }
};

// Auto cleanup service that runs periodically
export const startAutoCleanup = () => {
  // Run cleanup every 5 minutes
  const interval = setInterval(async () => {
    await cleanupExpiredBookings();
  }, 5 * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(interval);
};

// Initialize auto cleanup when the app starts
let cleanupInterval = null;

export const initializeCleanupService = () => {
  if (!cleanupInterval) {
    // Run initial cleanup
    cleanupExpiredBookings();

    // Start periodic cleanup
    cleanupInterval = startAutoCleanup();

    console.log("Booking cleanup service initialized");
  }
};

export const stopCleanupService = () => {
  if (cleanupInterval) {
    cleanupInterval();
    cleanupInterval = null;
    console.log("Booking cleanup service stopped");
  }
};
