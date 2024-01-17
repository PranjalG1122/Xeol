import { Link, useNavigate } from "react-router-dom";
import fetchUserDetailsLocal from "../lib/fetchUserDetailsLocal";
import { FollowProps } from "./types/Types";
import { Button } from "./Button";
import Content from "./Content";
import { useState } from "react";
import { handleFollow } from "../lib/handleFollow";
import { toast } from "react-toastify";

export default function FollowingComponent({
  followDetails,
}: {
  followDetails: FollowProps;
}) {
  const userDetails = fetchUserDetailsLocal();
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFollowFromPost = (username: string) => {
    setLoadingFollow(true);
    if (username) {
      handleFollow(username).then((data) => {
        setLoadingFollow(false);
        if (data.success) return navigate(0);
        return toast("Something went wrong!", {
          className: "bg-red-600 dark:bg-red-600",
        });
      });
    }
  };

  return (
    <li className="flex flex-row items-start gap-2 w-full p-2 border border-neutral-300 dark:border-neutral-700">
      <img
        src={followDetails.avatar}
        alt="ava"
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col items-start gap-2 text-neutral-500 w-full">
        <div className="flex flex-row items-center justify-between w-full">
          <Link
            to={"/u/" + followDetails.username}
            className="flex flex-col items-start gap-1 w-full"
          >
            <p className="font-medium text-black dark:text-white truncate w-full lg:max-w-full max-sm:max-w-[120px]">
              {followDetails.name}
            </p>
            <p className="truncate w-full lg:max-w-full max-sm:max-w-[120px]">
              @{followDetails.username}
            </p>
          </Link>
          {userDetails &&
            userDetails.username !== followDetails.username &&
            (userDetails.follows.some(
              (follow) => follow.username === followDetails.username
            ) ? (
              <Button
                variant="outline"
                onClick={() => handleFollowFromPost(followDetails.username)}
                disabled={loadingFollow}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={() => handleFollowFromPost(followDetails.username)}
                disabled={loadingFollow}
              >
                Follow
              </Button>
            ))}
        </div>
        <Content text={followDetails.description} />
      </div>
    </li>
  );
}
