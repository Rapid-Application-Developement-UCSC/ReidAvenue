import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LandingLayout from "./layouts/LandingLayout";
import FeedPage from "./pages/FeedPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [{ path: "/", element: <IndexPage /> }],
  },

  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "/app/feed",
        element: <FeedPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
]);
