import { Router } from "express";
import { createBooking, getBookingsByHirer, getBookingsByVenue, updateBooking, getVendorBookingStats, getAllBookings } from "../controllers/BookingController";

const router = Router();

router.post("/", createBooking);
router.get("/hirer/:hirerId", getBookingsByHirer);
router.get("/venue/:venueId", getBookingsByVenue);
router.get("/all", getAllBookings);
router.put("/:id", updateBooking);
router.get("/vendor-stats/:vendorId", getVendorBookingStats);

export default router;