import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router";
import Swal from "sweetalert2";

// Assets
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";

// Icons
import { GoSidebarCollapse } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { LuSettings2 } from "react-icons/lu";
import { MdOutlineAddTask } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LayoutDashboard, Moon, Sun, LogOut } from "lucide-react";

const DashboardLayout = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const isDark = theme === "dark";

  /* ================= DYNAMIC TITLE ================= */
  const titleMap = {
    "/dashboard": "Dashboard Home",
    "/dashboard/add-habit": "Add Habit",
    "/dashboard/my-habits": "My Habits",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
  };

  const pageTitle = titleMap[location.pathname] || "Dashboard";

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, log out",
    });

    if (result.isConfirmed) {
      await Swal.fire("Logged out!", "You have been logged out.", "success");
      navigate("/");
      logOut();
    }
  };

  /* ================= NAV ITEM STYLE ================= */
  const navItem = ({ isActive }) =>
    `flex items-center gap-3 transition-all duration-300 ${
      isActive
        ? isDark
          ? "text-pink-400"
          : "text-purple-600"
        : isDark
        ? "text-gray-300 hover:text-pink-400"
        : "text-gray-800 hover:text-purple-600"
    }`;

  const closeDrawerOnMobile = () => {
    const drawer = document.getElementById("dashboard-drawer");
    if (drawer && window.innerWidth < 1024) {
      drawer.checked = false;
    }
  };

  const navText = (isActive) =>
    isActive
      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent font-semibold"
      : "";

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ================= CONTENT ================= */}
      <div className="drawer-content min-h-screen flex flex-col">
        {/* Top Navbar */}
        <nav
          className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-md px-4 py-3 flex justify-between items-center ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 border-gray-800 text-gray-200"
              : "bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100 border-rose-200 text-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle — ONLY when sidebar is closed */}
            <label
              htmlFor="dashboard-drawer"
              className={`btn btn-ghost btn-square lg:hidden ${
                isDark ? "text-white" : "text-purple-600"
              }`}
            >
              <GoSidebarCollapse size={22} />
            </label>

            {/* Logo — ONLY when sidebar is closed */}
            <NavLink to="/" className="flex items-center gap-2 lg:hidden">
              <img
                src={isDark ? logoDark : logoLight}
                alt="Habitly"
                className="w-9 h-9"
              />
              <span className="text-xl font-bold gradient-text">Habitly</span>
            </NavLink>

            {/* Dynamic Title — desktop & mobile */}
            <h3 className="hidden lg:block text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {pageTitle}
            </h3>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border shadow-md transition cursor-pointer ${
              isDark
                ? "bg-gray-800 border-gray-700 text-yellow-400"
                : "border-pink-200 text-purple-600"
            }`}
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>

        <footer
          className={`transition-colors duration-700 ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-200"
              : "bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100 text-gray-800"
          }`}
        >
          <div
            className={`flex justify-center items-center gap-2 py-4 ${
              isDark
                ? "border-gray-700 text-gray-400"
                : "border-pink-500 text-pink-700"
            } text-sm`}
          >
            © {new Date().getFullYear()}{" "}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={isDark ? logoDark : logoLight}
                  alt="Habitly Logo"
                  className="w-6 transition-transform duration-300 hover:scale-110"
                />
                <span className="text-md font-bold gradient-text">
                  Habitly.
                </span>
              </Link>
            </div>
            <span>All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside
          className={`w-64 min-h-full flex flex-col border-r ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 border-gray-800"
              : "bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100 border-rose-200"
          }`}
        >
          {/* Top Section */}
          <ul className="menu p-5 gap-2 flex-1">
            <li className="mb-4">
              <NavLink to="/" className="flex items-center gap-3">
                <img
                  src={isDark ? logoDark : logoLight}
                  className="w-10"
                  alt="Habitly"
                />
                <span className="text-2xl font-bold gradient-text">
                  Habitly
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard"
                className={navItem}
                onClick={closeDrawerOnMobile}
              >
                {({ isActive }) => (
                  <>
                    <LayoutDashboard size={20} />
                    <span className={navText(isActive)}>Dashboard Home</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/add-habit"
                className={navItem}
                onClick={closeDrawerOnMobile}
              >
                {({ isActive }) => (
                  <>
                    <MdOutlineAddTask size={20} />
                    <span className={navText(isActive)}>Add Habit</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-habits"
                className={navItem}
                onClick={closeDrawerOnMobile}
              >
                {({ isActive }) => (
                  <>
                    <HiOutlineClipboardList size={20} />
                    <span className={navText(isActive)}>My Habits</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>

          {/* Bottom Section */}
          <div className="border-t p-5 space-y-3">
            <NavLink
              to="/dashboard/profile"
              className={navItem}
              onClick={closeDrawerOnMobile}
            >
              {({ isActive }) => (
                <>
                  <AiOutlineProfile size={20} />
                  <span className={navText(isActive)}>Profile</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={navItem}
              onClick={closeDrawerOnMobile}
            >
              {({ isActive }) => (
                <>
                  <LuSettings2 size={20} />
                  <span className={navText(isActive)}>Settings</span>
                </>
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full py-1 text-md rounded-full cursor-pointer font-medium text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition flex justify-center items-center gap-3 mt-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
