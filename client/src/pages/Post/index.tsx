import { useParams } from "react-router-dom";
import Container from "../../components/Container";
import { useEffect, useState } from "react";
import { PostProps } from "../../components/types/Types";
import PostComponent from "../../components/Post";

export default function Post() {
  const { id } = useParams<{ id: string }>();

  const [postDetails, setPostDetails] = useState<{
    post: PostProps;
    replies: PostProps[];
  } | null>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_LINK + "/post/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(
        (data: { success: boolean; post: PostProps; replies: PostProps[] }) => {
          console.log(data);
          data.success &&
            setPostDetails({
              post: data.post,
              replies: data.replies,
            });
        }
      );
  }, [id]);
  return (
    <Container>
      {postDetails && (
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
          {<PostComponent post={postDetails.post} />}
          <h1>Replies</h1>
          <div className="flex flex-col items-center gap-4 w-full"></div>
        </div>
      )}
    </Container>
  );
}
