import express from "express";
import { enterEmail, verifyEmail } from "../controllers/auth";
const router = express.Router();

router.post("/", enterEmail);
router.get("/:id", verifyEmail);

export default router;
