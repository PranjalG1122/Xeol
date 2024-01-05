import express from "express";
import {
  createNewPost,
  fetchPost,
  getPosts,
  likePost,
} from "../controllers/post.controller";
const router = express.Router();

router.post("/newpost", createNewPost);
router.post("/like", likePost);
router.get("/:id", fetchPost);
router.post("/getposts", getPosts);

export default router;
