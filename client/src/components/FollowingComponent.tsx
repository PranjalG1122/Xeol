import { Link } from "react-router-dom";
import fetchUserDetailsLocal from "../lib/fetchUserDetailsLocal";
import { FollowProps } from "./types/Types";
import { Button } from "./Button";
import Content from "./Content";

export default function FollowingComponent({
  followDetails,
}: {
  followDetails: FollowProps;
}) {
  const userDetails = fetchUserDetailsLocal();

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
              <Button variant="outline">Unfollow</Button>
            ) : (
              <Button>Follow</Button>
            ))}
        </div>
        <Content text={followDetails.description} />
      </div>
    </li>
  );
}
