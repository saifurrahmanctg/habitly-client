import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home Page</div>,
    children: [
      {
        index: true,
        element: <div>Dashboard</div>,
      },
    ],
  },
]);

export default router;
