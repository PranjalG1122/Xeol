import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/index";
import Landing from "./pages/Landing/index";
import "./index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Verify from "./pages/Verify";
import PageNotFound from "./pages/404";
import SessionVerify from "./lib/SessionVerify";
import Onboarding from "./pages/Onboarding";
import Post from "./pages/Post";
import { SessionVerifyProps } from "./components/types/Types";
import User from "./pages/User";
import Followers from "./pages/User/followers";
import Follows from "./pages/User/follows";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? redirect("/home")
            : redirect("/onboarding")
          : null;
      });
    },
  },
  {
    path: "/home",
    element: <Home />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? redirect("/home")
            : null
          : redirect("/");
      });
    },
  },
  {
    path: "/u/:username",
    element: <User />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "/u/:username/followers",
    element: <Followers />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "/u/:username/follows",
    element: <Follows />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "/verify/:token",
    element: <Verify />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? redirect("/home")
            : redirect("/onboarding")
          : null;
      });
    },
  },
  {
    path: "/post/:id",
    element: <Post />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps) => {
        return data.verified
          ? data.onboarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-center"
      hideProgressBar={true}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={false}
      progressStyle={undefined}
      theme="dark"
      autoClose={2000}
    />
    <RouterProvider router={router} />
  </React.StrictMode>
);
