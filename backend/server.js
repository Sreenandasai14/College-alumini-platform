import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Connect MongoDB
connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/mentorship", mentorshipRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("AlumniHub Backend Running");
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});