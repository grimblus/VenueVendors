import { Router } from "express";
import { signUp, signIn } from "../controllers/AuthenticationController";
import { getProfile, updateProfile, updateUserRating, updateUserDocuments } from "../controllers/ProfileController";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/rating/:id", updateUserRating);
router.put("/documents/:id", updateUserDocuments); // ADD THIS

export default router;