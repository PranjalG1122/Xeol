import express from "express";
import {
  fetchUser,
  fetchUserFollowers,
  fetchUserFollows,
  followUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/:id", fetchUser);
router.get("/follow/:id", followUser);
router.get("/:username/followers", fetchUserFollowers);
router.get("/:username/follows", fetchUserFollows);

export default router;
