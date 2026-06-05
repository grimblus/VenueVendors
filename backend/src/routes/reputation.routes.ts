import { Router } from "express";
import { getReputationByHirer } from "../controllers/ReputationController";

const router = Router();

router.get("/:hirerId", getReputationByHirer);

export default router;