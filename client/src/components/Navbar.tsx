import { Sun, Moon, Plus } from "react-feather";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { SessionDecode } from "../lib/SessionDecode";
import CreatePost from "./CreatePost";
import fetchUserDetailsLocal from "../lib/fetchUserDetailsLocal";

const restrictedPages = ["/", "/*", "/onboarding"];

export default function Navbar() {
  const [newPostInView, setNewPostInView] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    localStorage.getItem("isDarkTheme") === "true" ? true : false
  );

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("isDarkTheme", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("isDarkTheme", "false");
    }
  }, [isDarkTheme]);

  const userDetails = fetchUserDetailsLocal();

  return (
    <nav className="w-full flex flex-row items-center justify-between lg:px-20 lg:py-4 py-2 sticky top-0  backdrop-blur-xl">
      <Link to="/">
        <img
          src={isDarkTheme ? "/logo_dark_theme.png" : "/logo_light_theme.png"}
          alt="logo"
          className="w-8"
        />
      </Link>
      <div className="flex flex-row items-center lg:gap-8 gap-4">
        {SessionDecode() &&
          !restrictedPages.includes(window.location.pathname) && (
            <Button
              onClick={() => {
                setNewPostInView(true);
              }}
              title="Create new post"
              className="p-1 rounded-full"
            >
              <Plus />
            </Button>
          )}
        {!restrictedPages.includes(window.location.pathname) && (
          <Link to={"/u/" + userDetails?.username}>
            <img
              src={userDetails?.avatar}
              alt="alt"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        )}
        <Button
          onClick={() => {
            setIsDarkTheme(!isDarkTheme);
          }}
          variant="icon"
        >
          {isDarkTheme ? <Sun /> : <Moon />}
        </Button>
      </div>
      {newPostInView && (
        <CreatePost setNewPostInView={setNewPostInView} post={null} />
      )}
    </nav>
  );
}
