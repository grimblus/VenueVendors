import { Router } from "express";
import { createBooking, getBookingsByHirer } from "../controllers/BookingController";

const router = Router();

router.post("/", createBooking);
router.get("/:hirerId", getBookingsByHirer);

export default router;