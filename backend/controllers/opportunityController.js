import Opportunity from "../models/Opportunity.js";

export const createOpportunity = async (req, res) => {
  try {
    const { title, company, location, type, experience, salary, description, skills } = req.body;
    const postedBy = req.userId;

    if (!title || !postedBy || !type) {
      return res
        .status(400)
        .json({ message: "Title, type, and postedBy are required fields" });
    }

    const opportunity = new Opportunity({
      title,
      company,
      location,
      type,
      experience,
      salary,
      description,
      skills: Array.isArray(skills) ? skills : [],
      postedBy,
    });

    await opportunity.save();
    const populatedOpportunity = await opportunity.populate(
      "postedBy",
      "firstName lastName email"
    );

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity: populatedOpportunity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("postedBy", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOpportunitiesByPoster = async (req, res) => {
  try {
    const { alumniId } = req.params;

    const opportunities = await Opportunity.find({ postedBy: alumniId })
      .populate("postedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId).populate(
      "postedBy",
      "firstName lastName email company"
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const alumniId = req.userId;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.postedBy.toString() !== alumniId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Opportunity.findByIdAndDelete(opportunityId);

    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
