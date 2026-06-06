import { Router } from "express";
import { getAllVenues, getVendorVenues, createVenue, updateVenue, deleteVenue, blockTimeslot, unblockTimeslot } from "../controllers/VenueController";

const router = Router();

// for hirer
router.get("/", getAllVenues);

// for vendor
router.get("/vendor/:vendorId", getVendorVenues);
router.post("/", createVenue);
router.put("/block", blockTimeslot);
router.put("/unblock", unblockTimeslot);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

export default router;