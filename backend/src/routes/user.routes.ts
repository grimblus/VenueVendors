import { Router } from "express";
import { signUp, signIn } from "../controllers/AuthenticationController";
import { getProfile, updateProfile } from "../controllers/ProfileController";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile/:email", getProfile);
router.put("/profile/:email", updateProfile);

export default router;