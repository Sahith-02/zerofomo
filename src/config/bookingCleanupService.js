// bookingCleanupService.js
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  or,
  getDoc,
} from "firebase/firestore";

/**
 * Clean up expired pending bookings
 * This function removes bookings that are in 'pending' or 'details_complete' status and have expired
 */
export const cleanupExpiredBookings = async () => {
  try {
    const now = new Date();

    // Query for expired bookings that are either pending or details_complete
    const q = query(
      collection(db, "bookings"),
      or(
        where("status", "==", "pending"),
        where("status", "==", "details_complete")
      ),
      where("expiresAt", "<=", now)
    );

    const querySnapshot = await getDocs(q);

    // Delete expired bookings
    const deletePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      deletePromises.push(deleteDoc(doc(db, "bookings", docSnapshot.id)));
    });

    await Promise.all(deletePromises);

    console.log(`Cleaned up ${deletePromises.length} expired bookings`);

    return deletePromises.length;
  } catch (error) {
    console.error("Error cleaning up expired bookings:", error);
    throw error;
  }
};

/**
 * Confirm a booking after successful payment
 * @param {string} bookingId - The ID of the booking to confirm
 */
export const confirmBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, {
      status: "confirmed",
      confirmedAt: new Date(),
      expiresAt: null, // Remove expiry as it's now confirmed
      updatedAt: new Date(),
    });

    console.log(`Booking ${bookingId} confirmed successfully`);
  } catch (error) {
    console.error("Error confirming booking:", error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - The ID of the booking to cancel
 * @param {string} reason - Reason for cancellation
 */
export const cancelBooking = async (bookingId, reason = "User cancelled") => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason,
      updatedAt: new Date(),
    });

    console.log(`Booking ${bookingId} cancelled successfully`);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

/**
 * Update booking details and mark as details complete
 * @param {string} bookingId - The ID of the booking to update
 * @param {object} details - The booking details to update
 */
export const updateBookingDetails = async (bookingId, details) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, {
      ...details,
      status: "details_complete",
      detailsCompleted: true,
      updatedAt: new Date(),
    });

    console.log(`Booking ${bookingId} details updated successfully`);
  } catch (error) {
    console.error("Error updating booking details:", error);
    throw error;
  }
};

/**
 * Get booking by ID
 * @param {string} bookingId - The ID of the booking to retrieve
 */
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
      return { id: bookingSnap.id, ...bookingSnap.data() };
    } else {
      throw new Error("Booking not found");
    }
  } catch (error) {
    console.error("Error getting booking:", error);
    throw error;
  }
};
