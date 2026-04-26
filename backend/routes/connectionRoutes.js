import express from "express";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import { verifyToken } from "../config/auth.js";

const router = express.Router();

// Send connection request from student to alumni
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { alumniId } = req.body;
    const studentId = req.userId;

    if (!alumniId) {
      return res.status(400).json({ message: "Alumni ID is required" });
    }

    // Check if alumni exists
    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== "alumni") {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Check if connection request already exists
    const existingConnection = await Connection.findOne({
      student: studentId,
      alumni: alumniId
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    const connection = new Connection({
      student: studentId,
      alumni: alumniId,
      status: "pending"
    });

    await connection.save();
    res.status(201).json({ message: "Connection request sent successfully", connection });
  } catch (error) {
    res.status(500).json({ message: "Error sending connection request", error: error.message });
  }
});

// Get all connection requests for an alumni
router.get("/received", verifyToken, async (req, res) => {
  try {
    const alumniId = req.userId;

    const connections = await Connection.find({ alumni: alumniId, status: "pending" })
      .populate("student", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: "Error fetching connection requests", error: error.message });
  }
});

// Accept connection request
router.put("/accept/:connectionId", verifyToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const alumniId = req.userId;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (connection.alumni.toString() !== alumniId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    connection.status = "accepted";
    connection.updatedAt = new Date();
    await connection.save();

    res.json({ message: "Connection request accepted", connection });
  } catch (error) {
    res.status(500).json({ message: "Error accepting connection request", error: error.message });
  }
});

// Reject connection request
router.put("/reject/:connectionId", verifyToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const alumniId = req.userId;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (connection.alumni.toString() !== alumniId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    connection.status = "rejected";
    connection.updatedAt = new Date();
    await connection.save();

    res.json({ message: "Connection request rejected", connection });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting connection request", error: error.message });
  }
});

// Get all accepted connections for the authenticated user
router.get("/accepted", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const connections = await Connection.find({
      $or: [{ student: userId }, { alumni: userId }],
      status: "accepted",
    })
      .populate("student", "firstName lastName email role")
      .populate("alumni", "firstName lastName email role")
      .sort({ updatedAt: -1 });

    // Deduplicate connections by otherUserId - keep only the latest
    const uniqueConnections = {};
    const formattedConnections = connections
      .map((connection) => {
        const isStudent = connection.student._id.toString() === userId;
        const otherUser = isStudent ? connection.alumni : connection.student;
        
        // Additional validation: ensure correct role relationship
        const currentUser = isStudent ? connection.student : connection.alumni;
        const expectedOtherRole = isStudent ? "alumni" : "student";
        if (otherUser.role !== expectedOtherRole) {
          return null; // Skip invalid connections
        }
        
        return {
          _id: connection._id,
          status: connection.status,
          updatedAt: connection.updatedAt,
          otherUserId: otherUser._id.toString(),
          otherUser,
        };
      })
      .filter((connection) => connection !== null)
      .filter((connection) => {
        // Keep only the first (most recent) occurrence of each otherUser
        if (!uniqueConnections[connection.otherUserId]) {
          uniqueConnections[connection.otherUserId] = true;
          return true;
        }
        return false;
      })
      .map(({ otherUserId, ...rest }) => rest); // Remove the temporary otherUserId

    res.json({ connections: formattedConnections, count: formattedConnections.length });
  } catch (error) {
    res.status(500).json({ message: "Error fetching accepted connections", error: error.message });
  }
});

export default router;
