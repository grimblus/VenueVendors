import { Router } from "express";
import { getAllVenues, getVendorVenues } from "../controllers/VenueController";

const router = Router();

router.get("/", getAllVenues);
router.get("/vendor/:vendorId", getVendorVenues);

export default router;