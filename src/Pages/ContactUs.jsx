import React, { useState } from "react";
import Swal from "sweetalert2";
import useTheme from "../utils/useTheme";

const ContactUs = () => {
  const { theme } = useTheme?.() || {};
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Message Sent!",
      text: "Thank you for reaching out. We'll get back to you soon.",
      icon: "success",
      confirmButtonColor: "#7E3AF2",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-gray-950 text-gray-200"
          : "bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-2">Contact Us</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Have questions, feedback, or ideas? Fill out the form or reach out
          directly using our contact details below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 focus:ring-purple-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 focus:ring-purple-500 text-gray-800"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 focus:ring-purple-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 focus:ring-purple-500 text-gray-800"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 focus:ring-purple-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 focus:ring-purple-500 text-gray-800"
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-lg hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Details + Map */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Contact Info</h2>
            <p className="text-gray-400 mb-2">
              <strong>Address:</strong> 123 Agrabad, Chittagong, Bangladesh
            </p>
            <p className="text-gray-400 mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:contact@habitly.com"
                className="text-purple-500 hover:underline"
              >
                contact@habitly.com
              </a>
            </p>
            <p className="text-gray-400 mb-2">
              <strong>Phone:</strong> +880 1234 567890
            </p>
          </div>

          {/* Google Map */}
          <div
            className={`rounded-xl overflow-hidden shadow-lg ${
              isDark ? "border border-gray-700" : "border border-gray-200"
            }`}
          >
            <iframe
              title="Chittagong Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.581173162713!2d91.78130007501964!3d22.33704228530757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd89fda2e9db1%3A0x1df2e0e4c8a4de3e!2sAgrabad%2C%20Chattogram%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 mt-16">
        Built with ❤️ by <strong>Saifur Rahman Chowdhury</strong> |{" "}
        <a
          href="https://github.com/saifurrahmanctg/habitly-client"
          target="_blank"
          className="text-purple-500 hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
