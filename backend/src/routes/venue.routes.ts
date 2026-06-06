import { Router } from "express";
import { getAllVenues, getVendorVenues, createVenue, updateVenue, deleteVenue } from "../controllers/VenueController";

const router = Router();

// for hirer
router.get("/", getAllVenues);

// for vendor
router.get("/vendor/:vendorId", getVendorVenues);
router.post("/", createVenue);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

export default router;