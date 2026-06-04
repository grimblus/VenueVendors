import { Router } from "express";
import { createBooking, getBookingsByHirer, getBookingsByVenue } from "../controllers/BookingController";

const router = Router();

router.post("/", createBooking);
router.get("/hirer/:hirerId", getBookingsByHirer);
router.get("/venue/:venueId", getBookingsByVenue);

export default router;