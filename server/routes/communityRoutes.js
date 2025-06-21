import express from 'express';
import { createCommunity, getCommunity, updateCommunity, deleteCommunity , isMember, joinCommunity, leaveCommunity} from '../controllers/communityController.js';
import upload from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/", auth, upload.community.single("avatar"), createCommunity);
router.get("/:communityName", getCommunity);
router.put("/:communityName", auth, upload.community.single("avatar"), updateCommunity);
router.delete("/:communityName", auth, deleteCommunity);
router.post("/join", auth, joinCommunity);
router.post("/leave", auth, leaveCommunity);
router.get("/member/:communityId", auth, isMember);

export default router;