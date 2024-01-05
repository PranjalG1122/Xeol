import express from "express";
import { updateOnboarding, verifyUsername } from "../controllers/onboarding.controller";
const router = express.Router();
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

router.post("/username", verifyUsername);
router.post("/update", upload.single("avatar"), updateOnboarding);

export default router;
