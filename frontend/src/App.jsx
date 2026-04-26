import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import BrowseAlumni from "./pages/BrowseAlumni";
import Jobs from "./pages/Jobs";
import Mentorship from "./pages/Mentorship";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Applications from "./pages/Applications";
import Messages from "./pages/Messages";
import PostOpportunity from "./pages/PostOpportunity";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
          <Route path="/browse-alumni" element={<BrowseAlumni />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/post-opportunity" element={<PostOpportunity />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;