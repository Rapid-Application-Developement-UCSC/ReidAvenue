import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LandingLayout from "./layouts/LandingLayout";
import CollectionsPage from "./pages/app/CollectionsPage";
import FeedPage from "./pages/app/FeedPage";
import FriendsPage from "./pages/app/FriendsPage";
import MyPostsPage from "./pages/app/MyPostsPage";
import NewPostPage from "./pages/app/NewPostPage";
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
      {
        path: "/app/new-post",
        element: <NewPostPage />,
      },
      {
        path: "/app/my-posts",
        element: <MyPostsPage />,
      },
      {
        path: "/app/friends",
        element: <FriendsPage />,
      },
      {
        path: "/app/collections",
        element: <CollectionsPage />,
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
