import { useEffect, useState } from "react";
import Container from "../../components/Container";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "react-feather";
import { PostProps, UserDetailsPageProps } from "../../components/types/Types";
import PostComponent from "../../components/PostComponent";
import fetchUserDetailsLocal from "../../lib/fetchUserDetailsLocal";
import { Button } from "../../components/Button";

export default function User() {
  const { username } = useParams<{ username: string }>();
  const [userDetails, setUserDetails] = useState<UserDetailsPageProps | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_LINK + "/user/" + username, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { success: boolean; userDetails: UserDetailsPageProps }) => {
        return setUserDetails(data.userDetails);
      });
  }, [username]);

  useEffect(() => {
    document.title =
      (userDetails &&
        `${userDetails?.name} (@${userDetails?.username}) / Xeol`) ||
      "Xeol";
  }, [userDetails]);

  const userDetailsCurrent = fetchUserDetailsLocal();

  return (
    <Container>
      {(userDetails && (
        <div className="flex flex-col items-start gap-4 w-full max-w-3xl">
          <div className="flex lg:flex-row flex-col lg:gap-8 gap-2 lg:items-center">
            <img
              src={userDetails.avatar}
              alt="ava"
              className="lg:h-36 lg:w-36 h-16 w-16 rounded-full"
            />
            <div className="flex flex-col gap-2 items-start">
              <h1 className="lg:text-2xl text-xl font-bold">
                {userDetails.name}
              </h1>
              <div className="flex flex-row items-center gap-4 text-neutral-500 text-sm w-full">
                <p>@{userDetails.username}</p>
                <p className="flex flex-row items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(userDetails.createdAt).toLocaleDateString("us-en", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <p className="text-sm">{userDetails.description}</p>
              <div className="flex flex-row items-center gap-4 text-sm">
                <button
                  className="hover:underline underline-offset-2"
                  onClick={() => {
                    navigate("/u/" + userDetails.username + "/followers");
                  }}
                >
                  {userDetails._count.followers}{" "}
                  <span className="text-neutral-500">Followers</span>
                </button>
                <button
                  className="hover:underline underline-offset-2"
                  onClick={() => {
                    navigate("/u/" + userDetails.username + "/follows");
                  }}
                >
                  {userDetails._count.follows}{" "}
                  <span className="text-neutral-500">Following</span>
                </button>
                <p>
                  {userDetails._count.posts}{" "}
                  <span className="text-neutral-500">
                    Post{userDetails._count.posts > 1 ? "s" : ""}
                  </span>
                </p>
              </div>
              {(userDetailsCurrent &&
                userDetailsCurrent.username !== userDetails.username && (
                  <Button>Follow</Button>
                )) || <Button variant="outline">Edit Profile</Button>}
            </div>
          </div>
          <h1 className="font-semibold lg:text-xl text-lg">Posts</h1>
          <div className="flex flex-col items-center w-full gap-2">
            {userDetails.posts &&
              userDetails.posts.map((post: PostProps, index) => {
                return (
                  <PostComponent key={index} post={post} setPosts={null} />
                );
              })}
          </div>
        </div>
      )) || <div>loading</div>}
    </Container>
  );
}
