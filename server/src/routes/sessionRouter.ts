import express from "express";
import { checkSession, getUserDetails } from "../controllers/session.controller";
const router = express.Router();

router.get("/", checkSession);
router.get("/details", getUserDetails);
// router.post("/update", updateUserDetails)

export default router;
