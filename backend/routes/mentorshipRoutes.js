import express from "express";
import {
  sendMentorshipRequest,
  getMentorshipRequests,
  getMyMentorshipRequests,
  acceptMentorshipRequest,
  rejectMentorshipRequest
} from "../controllers/mentorshipController.js";
import { verifyToken } from "../config/auth.js";

const router = express.Router();

// Send mentorship request
router.post("/", verifyToken, sendMentorshipRequest);

// Get mentorship requests for mentor
router.get("/", verifyToken, getMentorshipRequests);

// Get my sent mentorship requests
router.get("/my-requests", verifyToken, getMyMentorshipRequests);

// Accept mentorship request
router.put("/:requestId/accept", verifyToken, acceptMentorshipRequest);

// Reject mentorship request
router.put("/:requestId/reject", verifyToken, rejectMentorshipRequest);

export default router;