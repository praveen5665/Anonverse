import express from 'express';

import {createPost, getPosts, getPost,  deletePost} from '../controllers/postController.js'; 
import upload from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/", auth, upload.post.single("image"), createPost);
router.get("/", getPosts);
router.get("/:postId", getPost);
router.delete("/:postId", auth, deletePost);
// router.put("/:postId", auth, upload.single("image"), updatePost);

export default router;
