import express from "express";
import {
  createNewPost,
  fetchPost,
  likePost,
  replyPost,
} from "../controllers/post";
const router = express.Router();

router.post("/newpost", createNewPost);
router.post("/reply", replyPost);
router.post("/like", likePost);
router.get("/:id", fetchPost);

export default router;
