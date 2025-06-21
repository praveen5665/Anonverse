import express from "express";

import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  getFilteredPosts,
} from "../controllers/postController.js";
import upload from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";
import handleVote from "../controllers/voteController.js";

const router = express.Router();

router.get("/filter", getFilteredPosts); 
router.post("/", auth, upload.post.single("image"), createPost);
router.get("/", getPosts);
router.get("/:postId", getPost);
router.delete("/:postId", auth, deletePost);
router.post("/:postId/vote", auth, handleVote);

export default router;
