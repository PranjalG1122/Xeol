import express from "express";
import { fetchUser, followUser } from "../controllers/user";

const router = express.Router();

router.get("/:id", fetchUser);
router.post("/follow", followUser);

export default router;
