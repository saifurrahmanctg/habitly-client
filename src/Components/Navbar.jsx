import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Sun, Moon } from "lucide-react";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, log out",
    });

    if (confirm.isConfirmed) {
      await logOut();
      Swal.fire(
        "Logged out!",
        "You have been successfully logged out.",
        "success"
      );
      navigate("/");
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    ...(user
      ? [
          { name: "Add Habit", path: "/add-habit" },
          { name: "My Habits", path: "/my-habits" },
        ]
      : []),
    { name: "Browse Habits", path: "/habits" },
  ];

  const isDark = theme === "dark";
  const dropdownBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-pink-100 border-pink-200";
  const dropdownText = isDark
    ? "text-gray-200 hover:text-pink-400"
    : "text-gray-700 hover:text-purple-600";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b shadow-md ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-200 border-gray-800"
          : "bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100 text-gray-800 border-rose-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden focus:outline-none ${
              isDark ? "text-white" : "text-purple-600"
            }`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img
              src={isDark ? logoDark : logoLight}
              alt="Habitly Logo"
              className="h-10 w-10 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-2xl font-bold gradient-text">Habitly</span>
          </Link>
        </div>

        {/* Center Nav (Desktop) */}
        <div className="hidden md:flex space-x-8 font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative transition duration-300 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 font-semibold"
                    : `${
                        isDark
                          ? "text-gray-300 hover:text-pink-400"
                          : "text-gray-800 hover:text-purple-600"
                      }`
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Right: Theme + Profile / Auth */}
        <div className="flex items-center space-x-3 relative">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border shadow-md transition-all duration-800 cursor-pointer ${
              isDark
                ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700"
                : " border-pink-200 text-purple-600 hover:bg-pink-100"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* If no user, show Login/Register beside theme toggle */}
          {!user ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm rounded-full font-medium border border-purple-600 text-purple-600 hover:bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-sm rounded-full font-medium text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co.com/gbJ2W8mJ/MOHAMMAD-SAIFUR-RAHMAN-CHOWDHURY-2021.jpg"
                  }
                  alt="User Avatar"
                  className="h-10 w-10 rounded-lg border-2 border-gradient-to-r from-purple-600 to-pink-400 cursor-pointer transition-transform hover:scale-110"
                />
              </button>

              {/* Dropdown — themed */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-72 rounded-xl shadow-lg p-3 border ${dropdownBg}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs opacity-70">{user.email}</p>
                    <hr className="my-2 w-full border-pink-300" />
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={`w-full mb-2 text-left cursor-pointer ${dropdownText} transition`}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full py-1 text-lg rounded-full cursor-pointer font-medium text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden shadow-md border-t rounded-xl ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
          } w-fit px-6 py-3 ml-4`}
        >
          <div className="flex flex-col items-start space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `transition duration-300 ${
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400 font-semibold"
                      : `${
                          isDark
                            ? "text-gray-200 hover:text-pink-400"
                            : "text-gray-800 hover:text-purple-600"
                        }`
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
