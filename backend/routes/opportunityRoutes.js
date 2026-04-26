import express from "express";
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunitiesByPoster,
  getOpportunityById,
  deleteOpportunity,
} from "../controllers/opportunityController.js";
import { verifyToken } from "../config/auth.js";

const router = express.Router();

// Create a new opportunity
router.post("/create", verifyToken, createOpportunity);

// Get all opportunities
router.get("/", getAllOpportunities);

// Get opportunities posted by a specific alumni
router.get("/posted/:alumniId", getOpportunitiesByPoster);

// Get opportunity by ID
router.get("/:opportunityId", getOpportunityById);

router.delete("/:opportunityId", verifyToken, deleteOpportunity);

export default router;