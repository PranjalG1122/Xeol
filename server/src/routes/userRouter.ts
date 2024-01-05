import express from "express";
import {
  fetchUser,
  fetchUserFollowers,
  followUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/:id", fetchUser);
router.get("/follow/:id", followUser);
router.get("/:username/followers", fetchUserFollowers);

export default router;
