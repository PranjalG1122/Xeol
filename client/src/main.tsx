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
import { SessionVerifyProps } from "./components/types/SessionVerifyProps.interface";
import Onboarding from "./pages/Onboarding";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps | null) => {
        if (data !== null) {
          return data.success
            ? data.data.onBoarded
              ? redirect("/home")
              : redirect("/onboarding")
            : null;
        }
        return null;
      });
    },
  },
  {
    path: "/home",
    element: <Home />,
    loader: async () => {
      return SessionVerify().then((data: SessionVerifyProps | null) => {
        return data!.success
          ? data!.data.onBoarded
            ? null
            : redirect("/onboarding")
          : redirect("/");
      });
    },
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
