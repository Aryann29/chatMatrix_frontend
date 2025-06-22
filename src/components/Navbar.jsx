import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { tokenStorage, authAPI } from "../utils/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Navbar = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const isAuthenticated = tokenStorage.isAuthenticated();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = tokenStorage.getToken();
      if (!token) return;

      try {
        setLoadingUser(true);
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setUserDetails(null);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-neutral-800 shadow-lg w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex-shrink-0 text-2xl font-bold text-white transition-colors duration-200"
            >
              ChatMatrix
            </Link>

            {isAuthenticated && (
              <div className="hidden sm:flex sm:space-x-4">
                <Link
                  to="/dashboard/my-chatbots"
                  className="text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && userDetails ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-white text-sm font-medium hidden sm:block">
                {userDetails.username || userDetails.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-teal-400 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
