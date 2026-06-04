import { Router } from "express";
import { createBooking, getBookingsByHirer, getBookingsByVenue, updateBooking } from "../controllers/BookingController";

const router = Router();

router.post("/", createBooking);
router.get("/hirer/:hirerId", getBookingsByHirer);
router.get("/venue/:venueId", getBookingsByVenue);
router.put("/:id", updateBooking);

export default router;