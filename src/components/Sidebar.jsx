import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUserGroup,
  HiBuildingOffice,
  HiCalendar,
  HiArrowLeftOnRectangle,
  HiXMark,
  HiChevronDoubleRight,
  HiChevronDoubleLeft,
} from "react-icons/hi2";

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false); // Desktop expand/collapse

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: HiHome },
    { name: "Guests", path: "/guests", icon: HiUserGroup },
    { name: "Rooms", path: "/rooms", icon: HiBuildingOffice },
    { name: "Bookings", path: "/bookings", icon: HiCalendar },
  ];

  const isActivePath = (path) => location.pathname === path;
  const isThin = !isExpanded && !isOpen; // Thin mode condition

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-gradient-to-b from-gray-800 to-gray-900 text-white
          fixed lg:relative h-full z-40 flex flex-col
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-all duration-300 ease-in-out
          shadow-xl lg:shadow-none
          ${isOpen ? "w-64" : isExpanded ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {/* If thin sidebar → show only open button */}
          {isThin && (
            <button
              onClick={() => setIsExpanded(true)}
              className="hidden lg:flex p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <HiChevronDoubleRight className="w-6 h-6" />
            </button>
          )}

          {/* Show title when expanded or open */}
          {(isOpen || isExpanded) && (
            <div className="flex items-center gap-3">
              <img
                src="/logo.png" // replace with your image path
                alt="EventHub Logo"
                className="w-10 h-10 object-contain"
              />
              <h2 className="text-1xl font-bold text-white tracking-wide">
                StayTrack
              </h2>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Collapse button in expanded mode */}
            {!isThin && (
              <button
                onClick={() => setIsExpanded(false)}
                className="hidden lg:flex p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <HiChevronDoubleLeft className="w-6 h-6" />
              </button>
            )}

            {/* Close on mobile */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 mt-3 space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = isActivePath(path);
            return (
              <Link
                key={name}
                to={path}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle?.();
                }}
                className={`
                  flex items-center ${
                    isExpanded || isOpen ? "justify-start" : "justify-center"
                  }
                  ${isThin ? "px-2 py-3" : "px-3 py-3"}
                  rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg scale-[0.98]"
                      : "text-gray-300 hover:text-white hover:bg-gray-700 hover:scale-[0.98]"
                  }
                  group relative
                `}
              >
                <Icon
                  className={`
                    ${isThin ? "w-5 h-4" : "w-6 h-6"}
                    transition-colors
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }
                  `}
                />
                {(isExpanded || isOpen) && (
                  <span className="ml-4 font-medium text-sm">{name}</span>
                )}
                {isThin && (
                  <span className="absolute left-full ml-2 w-max px-2 py-2 text-sm bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700 mt-auto space-y-1">
          {/* Logout */}
          <button
            onClick={onLogout}
            className={`
              flex items-center ${
                isExpanded || isOpen ? "justify-start" : "justify-center"
              }
              w-full ${isThin ? "px-2 py-3" : "px-3 py-3"}
              text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg
              transition-all duration-200 group hover:scale-[0.98]
            `}
          >
            <HiArrowLeftOnRectangle
              className={`${
                isThin ? "w-8 h-8" : "w-6 h-6"
              } group-hover:animate-pulse`}
            />
            {(isExpanded || isOpen) && (
              <span className="ml-4 font-medium text-sm">Logout</span>
            )}
            {isThin && (
              <span className="absolute left-full ml-2 w-max px-2 py-1 text-sm bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
