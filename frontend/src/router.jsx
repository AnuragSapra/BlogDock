import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import NewBlog from "./pages/NewBlog";
import ViewBlog from "./pages/ViewBlog";
import UserBlogs from "./pages/UserBlogs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "blog/create",
        element: <NewBlog />,
      },
      {
        path: "blog/:blogId",
        element: <ViewBlog />,
      },
      {
        path: "user/blogs",
        element: <UserBlogs />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
