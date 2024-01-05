import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import { useEffect, useRef, useState } from "react";
import { PostProps } from "../../components/types/Types";
import PostComponent from "../../components/PostComponent";
import CreatePost from "../../components/CreatePost";

export default function Post() {
  const { id } = useParams<{ id: string }>();

  const [postDetails, setPostDetails] = useState<{
    post: PostProps;
    replies: PostProps[];
  } | null>(null);

  const [newPostInView, setNewPostInView] = useState<boolean>(false);
  const replyBoxRef = useRef<HTMLTextAreaElement>(null);

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
        <div className="flex flex-col items-start gap-2 w-full max-w-3xl">
          <h1 className="lg:text-2xl font-medium text-xl">Post</h1>
          {<PostComponent post={postDetails.post} />}
          <h1 className="lg:text-xl font-medium text-lg">Replies</h1>
          <article className="flex flex-row items-start gap-4 lg:p-4 p-2 rounded-sm w-full bg-neutral-100 dark:bg-neutral-900 text-sm">
            <Link to="/" className="h-10 w-10">
              <img src={"/default.png"} className="rounded-full" alt="n" />
            </Link>
            <div className="flex flex-col gap-2 w-full">
              <textarea
                onClick={(e) => {
                  e.preventDefault();
                  setNewPostInView(true);
                  replyBoxRef.current?.blur();
                }}
                ref={replyBoxRef}
                placeholder="Post your reply"
                rows={3}
                className="w-full text-sm bg-neutral-100 dark:bg-neutral-900 resize-none placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
          </article>
          <div className="flex flex-col items-center gap-2 w-full">
            {postDetails.replies.map((reply: PostProps) => {
              return <PostComponent key={reply.id} post={reply} />;
            })}
          </div>
          {newPostInView && (
            <CreatePost
              setNewPostInView={setNewPostInView}
              post={postDetails.post}
            />
          )}
        </div>
      )}
    </Container>
  );
}
