import { useEffect, useState } from "react";
import Container from "../../components/Container";
import fetchUserDetailsLocal from "../../lib/fetchUserDetailsLocal";
import { FollowersListProps } from "../../components/types/Types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { ArrowLeft } from "react-feather";
import Content from "../../components/Content";

export default function Followers() {
  const [followersList, setFollowersList] = useState<FollowersListProps | null>(
    null
  );
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = fetchUserDetailsLocal();
    if (userDetails) {
      fetch(
        import.meta.env.VITE_SERVER_LINK +
          "/user/" +
          params.username +
          "/followers",
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data: { success: boolean; followers: FollowersListProps }) => {
          if (data.success) return setFollowersList(data.followers);
          // add error gate
          return;
        });
    }
  }, []);
  return (
    <Container>
      {followersList && (
        <>
          <div className="flex flex-col items-start gap-4 w-full max-w-3xl text-sm">
            <div className="flex flex-row items-center w-full gap-4">
              <Button
                variant="icon"
                onClick={() => {
                  navigate("/u/" + params.username);
                }}
              >
                <ArrowLeft />
              </Button>
              <div className="flex flex-col items-start">
                <h1 className="lg:text-lg text-base font-semibold">
                  {followersList.name}
                </h1>
                <h1 className="text-neutral-500">@{followersList.username}</h1>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-xl font-semibold text-orange-500">
                Followers
              </h1>
              <button
                className="text-xl text-neutral-500"
                onClick={() => {
                  navigate("/u/" + followersList.username + "/follows");
                }}
              >
                Follows
              </button>
            </div>
            {followersList && (
              <ul className="flex flex-col items-center gap-2 w-full">
                {followersList.followers.map(
                  (
                    follower: {
                      username: string;
                      avatar: string;
                      name: string;
                      description: string;
                    },
                    index: number
                  ) => {
                    return (
                      <li
                        className="flex flex-row items-start gap-2 w-full py-2"
                        key={index}
                      >
                        <img
                          src={follower.avatar}
                          alt="ava"
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex flex-col items-start gap-2 text-neutral-500 w-full">
                          <div className="flex flex-row items-center justify-between w-full">
                            <Link
                              to={"/u/" + follower.username}
                              className="flex flex-col items-start gap-1 w-full"
                            >
                              <p className="font-medium text-black dark:text-white truncate w-full lg:max-w-full max-sm:max-w-[120px]">
                                {follower.name}
                              </p>
                              <p className="truncate w-full lg:max-w-full max-sm:max-w-[120px]">
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
        </>
      )}
    </Container>
  );
}
