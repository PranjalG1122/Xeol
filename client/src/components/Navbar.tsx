import { Sun, Moon } from "react-feather";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { SessionDecode } from "../lib/SessionDecode";
import NewPost from "./NewPost";
import { UserDetailsContext } from "./Container";

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

  const userDetails = useContext(UserDetailsContext);
  return (
    <nav className="w-full flex flex-row items-center justify-between lg:px-20 lg:py-4 py-2 sticky top-0 bg-white dark:bg-neutral-950">
      <Link to="/">
        <img
          src={isDarkTheme ? "/logo_dark_theme.png" : "/logo_light_theme.png"}
          alt="logo"
          className="w-8"
        />
      </Link>
      <div className="flex flex-row items-center lg:gap-8 gap-4">
        {SessionDecode() && window.location.pathname !== "/onboarding" && (
          <Button
            onClick={() => {
              setNewPostInView(true);
            }}
            variant="outline"
          >
            Create Post
          </Button>
        )}
        {window.location.pathname !== "/" && (
          <Link to={"/u/" + userDetails?.username}>
            <img
              src={userDetails?.avatar}
              alt="alt"
              className="lg:h-8 lg:w-8 h-6 w-6 rounded-full"
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
      {newPostInView && <NewPost setNewPostInView={setNewPostInView} />}
    </nav>
  );
}
