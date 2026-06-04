import { Router } from "express";
import { getAllVenues } from "../controllers/VenueController";

const router = Router();

router.get("/", getAllVenues);

export default router;