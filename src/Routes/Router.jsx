import { createBrowserRouter } from "react-router";
import { getAuth } from "firebase/auth";
import MainLayout from "../Layouts/MainLayout";
import Error404 from "../Pages/Error404";
import Home from "../Pages/Home";
import AllHabits from "../Pages/AllHabits";
import AddHabit from "../Pages/AddHabit";
import Login from "../UsersPage/Login";
import Register from "../UsersPage/Register";
import HabitDetails from "../Pages/HabitDetails";
import PrivateRoute from "./PrivateRoute";
import MyHabits from "../Pages/MyHabits";
import Profile from "../Pages/Profile";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 🧠 Helper function to securely fetch data
const secureFetch = async (url) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      // 🌍 Public route: All Habits
      {
        path: "habits",
        loader: async () => fetch(`${API_BASE}/habits`),
        element: <AllHabits />,
      },

      // 👤 Auth routes
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },

      // 🔒 Protected routes
      {
        path: "add-habit",
        element: (
          <PrivateRoute>
            <AddHabit />
          </PrivateRoute>
        ),
      },
      {
        path: "habit-details/:id",
        loader: async ({ params }) => fetch(`${API_BASE}/habits/${params.id}`),
        element: (
          <PrivateRoute>
            <HabitDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "my-habits",
        element: (
          <PrivateRoute>
            <MyHabits />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
