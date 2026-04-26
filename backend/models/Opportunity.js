import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: String,
  location: String,
  experience: String,
  salary: String,
  description: String,
  skills: [String],
  type: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Opportunity", opportunitySchema);