import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const studentLinks = [
    { path: "/student-dashboard", label: "Dashboard", icon: "📊" },
    { path: "/browse-alumni", label: "Browse Alumni", icon: "👥" },
    { path: "/jobs", label: "Job Opportunities", icon: "💼" },
    { path: "/mentorship", label: "Find a Mentor", icon: "🎓" },
    { path: "/connections", label: "Connections", icon: "🤝" },
    { path: "/messages", label: "Messages", icon: "💬" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  const alumniLinks = [
    { path: "/alumni-dashboard", label: "Dashboard", icon: "📊" },
    { path: "/post-opportunity", label: "Post Opportunity", icon: "📝" },
    { path: "/applications", label: "Applications", icon: "📋" },
    { path: "/connections", label: "Connections", icon: "🤝" },
    { path: "/messages", label: "Messages", icon: "💬" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  const links = user.role === "student" ? studentLinks : alumniLinks;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">AlumniHub</h2>
      </div>
      <nav className="px-4 py-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname === link.path
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
