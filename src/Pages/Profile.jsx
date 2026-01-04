import React, { useContext, useEffect, useState } from "react";
import {
  Edit,
  CalendarDays,
  Mail,
  ShieldCheck,
  ShieldAlert,
  User,
  Key,
  X,
  Save,
} from "lucide-react";
import useTheme from "../utils/useTheme";
import Loader from "../Components/Loader";
import { AuthContext } from "../provider/AuthProvider";
import { updateProfile } from "firebase/auth";

const Profile = () => {
  const { user, getIdToken } = useContext(AuthContext);
  const { isDark } = useTheme();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
  });

  /* ================= Fetch User From MongoDB ================= */
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const token = await getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setDbUser(data.user);
        setFormData({
          name: data.user?.name || user.displayName || "",
          photoURL: data.user?.photoURL || user.photoURL || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, getIdToken]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Please log in to view profile.</p>
      </div>
    );
  }

  if (loading) return <Loader />;

  /* ================= Save Profile ================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getIdToken();

      // 🔁 Update MongoDB
      await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // 🔁 Update Firebase
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.photoURL,
      });

      // 🔄 Update UI
      setDbUser((prev) => ({
        ...prev,
        name: formData.name,
        photoURL: formData.photoURL,
      }));

      setShowModal(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        isDark ? "dark-bg" : "light-bg-reverse"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-2xl shadow-xl p-8 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src={
              dbUser?.photoURL ||
              "https://i.ibb.co/gbJ2W8mJ/MOHAMMAD-SAIFUR-RAHMAN-CHOWDHURY-2021.jpg"
            }
            alt="avatar"
            className="w-36 h-36 rounded-2xl object-cover border-4 border-purple-500"
          />

          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold gradient-text">
              {dbUser?.name || "Habitly User"}
            </h2>

            <p className="flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </p>

            <p className="flex items-center gap-2">
              <User size={16} /> Role:{" "}
              <span className="capitalize font-semibold">
                {dbUser?.role || "user"}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <Key size={16} /> Provider:{" "}
              {user.providerData?.[0]?.providerId || "email/password"}
            </p>

            <div className="flex items-center gap-2">
              {user.emailVerified ? (
                <span className="text-green-500 flex items-center gap-1">
                  <ShieldCheck size={16} /> Verified
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1">
                  <ShieldAlert size={16} /> Not Verified
                </span>
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center gap-2 cursor-pointer"
            >
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ================= Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md rounded-xl p-6 ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded border"
              />

              <input
                type="text"
                placeholder="Photo URL"
                value={formData.photoURL}
                onChange={(e) =>
                  setFormData({ ...formData, photoURL: e.target.value })
                }
                className="w-full px-4 py-2 rounded border"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-60 cursor-pointer"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
