import express from 'express';
import { createCommunity, getCommunity, updateCommunity, deleteCommunity } from '../controllers/communityController.js';
import upload from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/", auth, upload.single("avatar"), createCommunity);
router.get("/:communityName", getCommunity);
router.put("/:communityName", authenticateUser, upload.single("avatar"), updateCommunity);
router.delete("/:communityName", authenticateUser, deleteCommunity);


export default router;