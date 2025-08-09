import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DasboardPage";
import GuestsPage from "./pages/GuestsPage";
import RoomsPage from "./pages/RoomsPage";
import BookingsPage from "./pages/BookingPage";
import Sidebar from "./components/Sidebar";
import userIcon from "./assets/user_icon.png";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      {token ? (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
          {/* Sidebar with overlay on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Fixed Navbar */}
            <div className="bg-white shadow-sm z-20">
              <div className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center">
                  <button
                    className="mr-4 text-gray-500 focus:outline-none lg:hidden"
                    onClick={toggleSidebar}
                  >
                    <FaBars size={20} />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-800">
                    StayTrack
                  </h1>
                </div>
                <div className="flex items-center  pr-5 mr-5">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={userIcon}
                    alt="User"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <main className="p-4">
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/guests" element={<GuestsPage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<AuthPage setToken={setToken} isLogin={true} />}
          />
          <Route
            path="/register"
            element={<AuthPage setToken={setToken} isLogin={false} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;