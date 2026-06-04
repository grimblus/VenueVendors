import { Router } from "express";
import { getAllVenues, getVendorVenues } from "../controllers/VenueController";

const router = Router();

//for hirer
router.get("/", getAllVenues);
//for vendor
router.get("/vendor/:vendorId", getVendorVenues);

export default router;