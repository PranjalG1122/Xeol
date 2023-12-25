import { useEffect, useState, createContext } from "react";
import Navbar from "./Navbar";
import { UserDetailsProps, UserDetailsResponseProps } from "./types/Types";

export const UserDetailsContext = createContext<UserDetailsProps | null>(null);

export default function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_LINK + "/session/details", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: UserDetailsResponseProps) => {
        if (data.success) {
          return setUserDetails(data.userDetails);
        }
        return;
      });
  }, []);

  return (
    <UserDetailsContext.Provider value={userDetails}>
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
    </UserDetailsContext.Provider>
  );
}
