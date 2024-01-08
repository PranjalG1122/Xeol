import { useEffect, useState } from "react";
import { FollowListProps, FollowProps } from "../../components/types/Types";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../components/Container";
import { Button } from "../../components/Button";
import { ArrowLeft } from "react-feather";
import FollowingComponent from "../../components/FollowingComponent";
import LoadingIcon from "../../components/LoadingIcon";

export default function Follows() {
  const [followersList, setFollowersList] = useState<FollowListProps | null>(
    null
  );
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      import.meta.env.VITE_SERVER_LINK +
        "/user/" +
        params.username +
        "/follows",
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data: { success: boolean; follow: FollowListProps }) => {
        if (data.success) return setFollowersList(data.follow);
        // add error gate
        return;
      });
  }, []);
  return (
    <Container>
      {(followersList && (
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
              <button
                className="text-xl text-neutral-500"
                onClick={() => {
                  navigate("/u/" + followersList.username + "/followers");
                }}
              >
                Followers
              </button>
              <h1 className="text-xl font-semibold text-orange-500">Follows</h1>
            </div>
            {followersList && (
              <ul className="flex flex-col items-center gap-2 w-full">
                {followersList.follow.map(
                  (follows: FollowProps, index: number) => {
                    return (
                      <FollowingComponent followDetails={follows} key={index} />
                    );
                  }
                )}
              </ul>
            )}
          </div>
        </>
      )) || <LoadingIcon />}
    </Container>
  );
}
