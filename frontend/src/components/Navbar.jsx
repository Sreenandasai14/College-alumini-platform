import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">AlumniHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName || user.email}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Profile
                      </Link>
                      {user.role === "alumni" && (
                        <Link
                          to="/alumni-dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          Alumni Dashboard
                        </Link>
                      )}
                      {user.role === "student" && (
                        <Link
                          to="/student-dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 last:rounded-b-lg border-t border-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
