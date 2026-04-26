import express from "express";
import { sendMessage, getConversation, getAllMessages } from "../controllers/messageController.js";
import { verifyToken } from "../config/auth.js";

const router = express.Router();

// Send a message
router.post("/send", verifyToken, sendMessage);

// Get conversation between two users
router.get("/conversation/:otherId", verifyToken, getConversation);

// Get all messages for the authenticated user (conversations list)
router.get("/", verifyToken, getAllMessages);

export default router;