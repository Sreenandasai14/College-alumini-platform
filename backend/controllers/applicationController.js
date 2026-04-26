import Application from "../models/Application.js";
import Connection from "../models/Connection.js";
import User from "../models/User.js";

export const applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const studentId = req.userId;

    // Check if already applied
    const existingApplication = await Application.findOne({
      opportunity: opportunityId,
      student: studentId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this opportunity" });
    }

    const application = new Application({
      opportunity: opportunityId,
      student: studentId,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsForAlumni = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const applications = await Application.find()
      .populate({
        path: "opportunity",
        match: { postedBy: alumniId },
        select: "title type company description postedBy",
      })
      .populate("student", "firstName lastName email role")
      .lean();

    const filteredApplications = applications.filter((app) => app.opportunity);

    const counts = {
      totalRequests: filteredApplications.length,
      acceptedConnections: filteredApplications.filter((app) => app.status === "accepted").length,
      pendingRequests: filteredApplications.filter((app) => app.status === "pending").length,
    };

    res.json({ applications: filteredApplications, counts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const alumniId = req.userId;

    const application = await Application.findById(applicationId)
      .populate("opportunity", "postedBy")
      .populate("student");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.opportunity.postedBy.toString() !== alumniId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = "accepted";
    await application.save();

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { student: application.student._id, alumni: alumniId },
        { student: alumniId, alumni: application.student._id }
      ]
    });

    if (existingConnection) {
      // Update existing connection to accepted
      existingConnection.status = "accepted";
      existingConnection.updatedAt = new Date();
      await existingConnection.save();
    } else {
      // Create new connection record only if it doesn't exist
      const connection = new Connection({
        student: application.student._id,
        alumni: alumniId,
        status: "accepted",
      });
      await connection.save();
    }

    res.json({ message: "Application accepted", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const alumniId = req.userId;

    const application = await Application.findById(applicationId)
      .populate("opportunity", "postedBy");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.opportunity.postedBy.toString() !== alumniId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = "rejected";
    await application.save();

    res.json({ message: "Application rejected", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({ student: studentId })
      .populate("opportunity", "title type company postedBy")
      .populate("opportunity.postedBy", "firstName lastName")
      .lean();

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.userId;

    const application = await Application.findById(applicationId)
      .populate("opportunity", "postedBy")
      .populate("student", "_id");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const isStudent = application.student._id.toString() === userId;
    const isAlumni = application.opportunity.postedBy.toString() === userId;

    if (!isStudent && !isAlumni) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (application.status === "accepted") {
      await Connection.findOneAndDelete({
        student: application.student._id,
        alumni: application.opportunity.postedBy,
        status: "accepted",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
