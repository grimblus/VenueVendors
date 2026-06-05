import { Router } from "express";
import { getPreferredVenues, addPreferredVenue } from "../controllers/PreferredVenueController";

const router = Router();

router.get("/:hirerId", getPreferredVenues);
router.post("/", addPreferredVenue);

export default router;