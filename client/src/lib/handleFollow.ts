import { toast } from "react-toastify";

export const handleFollow = (username: string) => {
  fetch(import.meta.env.VITE_SERVER_LINK + "/user/follow/" + username, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data: { success: boolean }) => {
      if (data.success) {
        console.log(data);
        // finish this bruv
        return;
      }
      return toast("Something went wrong!", {
        className: "bg-red-600 dark:bg-red-600",
      });
    });
};
