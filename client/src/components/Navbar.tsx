import { Sun, Moon } from "react-feather";
import { Button, variants } from "./Hooks/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Navbar() {
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
  return (
    <nav
      className={
        "w-full flex flex-row items-center justify-between px-20 py-4 sticky top-0 " +
        "bg-white " +
        "dark:bg-neutral-950"
      }
    >
      <Link
        to="/"
        className={variants({
          variant: "logo",
        })}
      >
        <img
          src={isDarkTheme ? "./logo_dark_theme.png" : "./logo_light_theme.png"}
          alt="logo"
          className="w-8"
        />
      </Link>
      <div className="flex flex-row items-center gap-4">
        <Button
          onClick={() => {
            setIsDarkTheme(!isDarkTheme);
          }}
          variant="icon"
        >
          {isDarkTheme ? <Sun /> : <Moon />}
        </Button>
      </div>
    </nav>
  );
}
