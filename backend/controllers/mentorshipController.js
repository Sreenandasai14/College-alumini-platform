import MentorshipRequest from "../models/MentorshipRequest.js";
import User from "../models/User.js";

// Send mentorship request
export const sendMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const studentId = req.userId;

    if (!mentorId || !message) {
      return res.status(400).json({ message: "Mentor ID and message are required" });
    }

    // Check if mentor exists and is alumni
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "alumni") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if request already exists
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Mentorship request already exists" });
    }

    const request = new MentorshipRequest({
      student: studentId,
      mentor: mentorId,
      message
    });

    await request.save();

    // Populate the request with user details
    await request.populate("student", "firstName lastName email");
    await request.populate("mentor", "firstName lastName email");

    res.status(201).json({ message: "Mentorship request sent successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error sending mentorship request", error: error.message });
  }
};

// Get all mentorship requests for a mentor
export const getMentorshipRequests = async (req, res) => {
  try {
    const mentorId = req.userId;

    const requests = await MentorshipRequest.find({ mentor: mentorId, status: "pending" })
      .populate("student", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentorship requests", error: error.message });
  }
};

// Get mentorship requests sent by the current user
export const getMyMentorshipRequests = async (req, res) => {
  try {
    const studentId = req.userId;

    const requests = await MentorshipRequest.find({ student: studentId })
      .populate("mentor", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching my mentorship requests", error: error.message });
  }
};

// Accept mentorship request
export const acceptMentorshipRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const mentorId = req.userId;

    const request = await MentorshipRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Mentorship request not found" });
    }

    if (request.mentor.toString() !== mentorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";
    request.updatedAt = new Date();
    await request.save();

    // Create a connection between student and mentor
    const Connection = (await import("../models/Connection.js")).default;
    const existingConnection = await Connection.findOne({
      student: request.student,
      alumni: request.mentor
    });

    if (!existingConnection) {
      const connection = new Connection({
        student: request.student,
        alumni: request.mentor,
        status: "accepted"
      });
      await connection.save();
    }

    res.json({ message: "Mentorship request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting mentorship request", error: error.message });
  }
};

// Reject mentorship request
export const rejectMentorshipRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const mentorId = req.userId;

    const request = await MentorshipRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Mentorship request not found" });
    }

    if (request.mentor.toString() !== mentorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "rejected";
    request.updatedAt = new Date();
    await request.save();

    res.json({ message: "Mentorship request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting mentorship request", error: error.message });
  }
};