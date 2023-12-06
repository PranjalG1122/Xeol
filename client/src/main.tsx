import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/index";
import Dashboard from "./pages/Dashboard/index";
import "./index.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export const ClerkProviderRoutes = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <div>SignedOut</div>
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
