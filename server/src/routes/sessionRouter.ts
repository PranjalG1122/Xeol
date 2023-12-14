import express from "express";
import { checkSession } from "../controllers/session";
const router = express.Router();

router.get("/", checkSession);

export default router;
