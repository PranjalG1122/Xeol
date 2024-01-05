import { useEffect, useState } from "react";
import Container from "../../components/Container";
import fetchUserDetailsLocal from "../../lib/fetchUserDetailsLocal";
import { FollowersListProps } from "../../components/types/Types";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { ArrowLeft } from "react-feather";
import Content from "../../components/Content";

export default function Followers() {
  const [followersList, setFollowersList] = useState<
    FollowersListProps[] | null
  >();

  const navigate = useNavigate();

  const userDetails = fetchUserDetailsLocal();

  useEffect(() => {
    const userDetails = fetchUserDetailsLocal();
    if (userDetails) {
      fetch(
        import.meta.env.VITE_SERVER_LINK +
          "/user/" +
          userDetails.username +
          "/followers",
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data: { success: boolean; followers: FollowersListProps[] }) => {
          if (data.success) return setFollowersList(data.followers);
          // add error gate
          return;
        });
    }
  }, []);
  return (
    <Container>
      <div className="flex flex-col items-start gap-4 w-full max-w-3xl text-sm">
        <div className="flex flex-row items-center w-full gap-4">
          <Button
            variant="icon"
            onClick={() => {
              navigate("/u/" + userDetails?.username);
            }}
          >
            <ArrowLeft />
          </Button>
          <div className="flex flex-col items-start">
            <h1 className="lg:text-lg text-base font-semibold">
              {userDetails?.name}
            </h1>
            <h1 className="text-neutral-500">@{userDetails?.username}</h1>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-xl font-semibold text-orange-500">Followers</h1>
          <button
            className="text-xl text-neutral-500"
            onClick={() => {
              navigate("/u/" + userDetails?.username + "/follows");
            }}
          >
            Follows
          </button>
        </div>
        {followersList && (
          <ul className="flex flex-col items-center gap-2 w-full">
            {followersList.map(
              (follower: FollowersListProps, index: number) => {
                return (
                  <li
                    className="flex flex-row items-start gap-2 w-full p-2 border border-neutral-300 dark:border-neutral-700"
                    key={index}
                  >
                    <img
                      src={follower.avatar}
                      alt="ava"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col items-start gap-2 w-full text-neutral-500">
                      <div className="flex flex-row items-center justify-between w-full">
                        <Link
                          to={"/u/" + follower.username}
                          className="flex flex-col items-center gap-1"
                        >
                          <p className="font-medium text-black dark:text-white truncate lg:max-w-full max-w-[80px]">
                            {follower.name}
                          </p>
                          <p className="truncate lg:max-w-full max-w-[80px]">
                            @{follower.username}
                          </p>
                        </Link>
                        <Button>Follow</Button>
                      </div>
                      <Content text={follower.description} />
                    </div>
                  </li>
                );
              }
            )}
          </ul>
        )}
      </div>
    </Container>
  );
}
