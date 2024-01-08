import { MapPin, X } from "react-feather";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";
import { PostProps } from "./types/Types";
import { Link } from "react-router-dom";
import fetchUserDetailsLocal from "../lib/fetchUserDetailsLocal";
import { handleFetchLocation } from "../lib/handleFetchLocation";
import { toast } from "react-toastify";

export default function CreatePost({
  setNewPostInView,
  post,
}: {
  setNewPostInView: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostProps | null;
}) {
  const userDetails = fetchUserDetailsLocal();

  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<{
    city: string;
    country: string;
  } | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSubmitPost = (replyTo: string | null) => {
    if (content.length < 1) {
      // setError("Post cannot be 0 characters long");
      return;
    }
    fetch(`https://${import.meta.env.VERCEL_URL}/api` + "/post/newpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
        location: location,
        replyTo: replyTo,
      }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean }) => {
        if (data.success) {
          toast("Created Post!", {
            className: "bg-green-600 dark:bg-green-600",
          });
          return setNewPostInView(false);
        }
        toast("Error Creating Post", {
          className: "bg-red-600 dark:bg-red-600",
        });
      });
  };

  return (
    <section
      className="flex items-start pt-10 px-2 justify-center fixed min-h-screen h-full w-full top-0 left-0 bg-neutral-950 bg-opacity-30 dark:bg-opacity-70"
      onClick={() => {
        setNewPostInView(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (!post) return handleSubmitPost(null);
          return handleSubmitPost(post.id);
        }
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-start justify-center w-full max-w-xl lg:p-4 p-2 rounded gap-6 bg-white dark:bg-neutral-900"
      >
        <div className="w-full flex flex-row items-center justify-between h-full">
          <h1 className="font-medium lg:text-xl text-lg">Post</h1>
          <Button
            variant="icon"
            onClick={() => {
              setNewPostInView(false);
            }}
          >
            <X />
          </Button>
        </div>
        {post && <ReplyToPost post={post} />}

        {(userDetails && (
          <div className="flex flex-col items-center w-full gap-4">
            <div className="flex flex-row items-start justify-center w-full max-w-xl rounded gap-4">
              <img
                className="h-10 w-10 rounded-full"
                alt="l"
                src={userDetails.avatar}
              />
              <div className="w-full max-w-xl flex flex-col gap-4 text-sm">
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold">{userDetails.name}</p>
                  <p className="text-neutral-500">@{userDetails.username}</p>
                </div>
                <textarea
                  className="bg-white dark:bg-neutral-900 resize-none focus:outline-none placeholder:text-neutral-500"
                  placeholder="What's on your mind?"
                  maxLength={1024}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  ref={textAreaRef}
                  rows={4}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-end w-full gap-4">
              {location && (
                <div className="flex flex-row items-center gap-2 text-blue-500">
                  <p>{location.city}</p>
                  <p>{location.country}</p>
                  <Button
                    variant="icon"
                    title="Remove location"
                    onClick={() => {
                      setLocation(null);
                    }}
                  >
                    <X className="h-5 w-5 text-neutral-500" />
                  </Button>
                </div>
              )}
              <Button
                variant="icon"
                title="Pin location to post"
                onClick={() => {
                  handleFetchLocation.then((location) => {
                    setLocation(location);
                  });
                }}
              >
                <MapPin className="h-5 w-5 text-neutral-500" />
              </Button>
              <p className="text-neutral-400 text-sm">{content.length}/1024</p>
              <Button
                onClick={() => {
                  if (!post) return handleSubmitPost(null);
                  return handleSubmitPost(post.id);
                }}
              >
                Post
              </Button>
            </div>
          </div>
        )) || <UserDetailsLoading />}
      </div>
      {/* <TemporaryMessage message={message} /> */}
    </section>
  );
}

const UserDetailsLoading = () => {
  return <div></div>;
};

const ReplyToPost = ({ post }: { post: PostProps }) => {
  return (
    <article className="flex flex-row items-start gap-4 rounded-sm w-full text-sm h-full">
      <Link to={"/u/" + post.user.username} className="w-10 h-10">
        <img
          src={post.user.avatar ? post.user.avatar : "/default.png"}
          className="rounded-full"
          alt="n"
        />
      </Link>

      <div className="flex flex-col gap-1 w-full">
        <Link
          to={"/u/" + post.user.username}
          className="flex flex-row items-center gap-1"
        >
          <p className="font-medium">{post.user.name}</p>
          <p className="text-neutral-500">@{post.user.username}</p>
        </Link>
        <div className="flex flex-col items-start w-full gap-4">
          <div className="w-full">
            {post.content.split(" ").map((word, index) => {
              if (word.startsWith("@") || word.startsWith("#")) {
                return (
                  <Link
                    key={index}
                    to={
                      word.startsWith("@")
                        ? "/u/" + word.slice(1, word.length)
                        : "/"
                    }
                    className="text-blue-500"
                  >
                    {word + " "}
                  </Link>
                );
              } else {
                return word + " ";
              }
            })}
          </div>
          <p className="text-neutral-500">
            Replying to{" "}
            <Link to={"/u/" + post.user.username} className="text-blue-500">
              @{post.user.username}
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
};
