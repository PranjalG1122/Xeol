import { useEffect } from "react";
import Navbar from "./Navbar";
import { UserDetailsProps } from "./types/Types";

export default function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    fetch(window.location.href + "/api" + "/session/details", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { success: boolean; userDetails: UserDetailsProps }) => {
        if (data.success) {
          localStorage.setItem("userDetails", JSON.stringify(data.userDetails));
          return;
        }
        return;
      });
  }, []);

  return (
    <main
      {...props}
      className={
        "flex flex-col w-full min-h-screen h-full px-2 gap-2 dark:text-white items-center " +
        "text-black bg-white " +
        "dark:bg-neutral-950 " +
        className
      }
    >
      <Navbar />
      {children}
    </main>
  );
}
