import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


// GET all alumni users
router.get("/alumni", async (req, res) => {
  try {

    const alumni = await User.find({ role: "alumni" }).select("-password");

    res.json(alumni);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;