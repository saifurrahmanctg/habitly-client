import React from "react";
import { Facebook, Instagram, X, Github, Mail, Phone } from "lucide-react";
import { Link } from "react-router";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import useTheme from "../utils/useTheme";

const Footer = () => {
  const { isDark } = useTheme();
  return (
    <footer
      className={`py-12 px-6 sm:px-10 transition-colors duration-700 ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-200"
          : "bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={`${isDark ? logoDark : logoLight}`}
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <h2 className="text-2xl font-extrabold gradient-text">Habitly</h2>
          </div>
          <p
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-700"
            } max-w-xs`}
          >
            Build better habits, one step at a time. Track your progress and
            stay consistent with HabitFlow.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#7E3AF2]" />{" "}
              <a
                href="mailto:support@habitflow.com"
                className="hover:underline"
              >
                support@habitly.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#EC4899]" /> +1 (555) 123-4567
            </li>
          </ul>
        </div>

        {/* Links & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm mb-4">
            <li>
              <Link
                to="/terms"
                className="hover:text-[#7E3AF2] transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-[#7E3AF2] transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className="flex gap-4 mt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7E3AF2] transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7E3AF2] transition-colors"
            >
              <X size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7E3AF2] transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7E3AF2] transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>

      <div
        className={`mt-10 pt-6 text-center border-t ${
          isDark
            ? "border-gray-700 text-gray-400"
            : "border-pink-500 text-pink-700"
        } text-sm`}
      >
        © {new Date().getFullYear()} Habitly. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
