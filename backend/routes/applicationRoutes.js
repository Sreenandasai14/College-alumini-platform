import express from "express";
import {
  applyForOpportunity,
  getApplicationsForAlumni,
  acceptApplication,
  rejectApplication,
  getApplicationsForStudent,
  deleteApplication,
} from "../controllers/applicationController.js";
import { verifyToken } from "../config/auth.js";

const router = express.Router();

// Student applies for an opportunity
router.post("/apply", verifyToken, applyForOpportunity);

// Get all applications for an alumni's posted opportunities
router.get("/received/:alumniId", verifyToken, getApplicationsForAlumni);

// Get all applications for a student
router.get("/student/:studentId", verifyToken, getApplicationsForStudent);

// Alumni accepts an application
router.put("/accept/:applicationId", verifyToken, acceptApplication);

// Alumni rejects an application
router.put("/reject/:applicationId", verifyToken, rejectApplication);

// Delete an application (student withdraw or alumni remove)
router.delete("/:applicationId", verifyToken, deleteApplication);

export default router;