import { Heart, MessageSquare, Share2, UserPlus } from "react-feather";
import { PostProps } from "./types/Types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { handleFollow } from "../lib/handleFollow";

export default function PostComponent({ post }: { post: PostProps }) {
  const [loadingSetLike, setLoadingSetLike] = useState<boolean>(false);

  const handleLike = async () => {
    setLoadingSetLike(true);
    await fetch(import.meta.env.VITE_SERVER_LINK + "/post/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        postId: post.id,
      }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean }) => {
        data.success && setLoadingSetLike(false);
      });
  };

  return (
    <article
      title="Post"
      className="flex flex-row items-start gap-4 p-2 rounded-sm w-full border border-neutral-300 dark:border-neutral-700 text-sm"
    >
      <Link to={"/u/" + post.user.username} className="h-10 w-10">
        <img
          src={post.user.avatar ? post.user.avatar : "/default.png"}
          className="rounded-full"
          alt="n"
        />
      </Link>
      <Link to={"/post/" + post.id} className="flex-grow">
        post
      </Link>
      <div className="flex flex-col gap-2 w-full">
        <Link
          to={"/u/" + post.user.username}
          className="flex flex-row items-center gap-1"
        >
          <p className="font-medium">{post.user.name}</p>
          <p className="text-neutral-500">@{post.user.username}</p>
        </Link>
        <div className="">
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
          Posted on{" "}
          {new Date(post.createdAt).toLocaleDateString("us-en", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
          {post.city && post.country && (
            <>
              {" "}
              from{" "}
              <Link
                to={"/home?city=" + post.city + "&country=" + post.country}
                className="text-blue-500"
              >
                {post.city}, {post.country}
              </Link>
            </>
          )}
        </p>
        <div className="flex flex-row items-center lg:gap-8 gap-6 font-semibold text-neutral-500">
          <button className="flex flex-row items-center gap-1 hover:text-blue-500">
            <MessageSquare className="h-4 w-4" />
            <p>{post._count.replies}</p>
          </button>
          <button
            className={
              "flex flex-row items-center gap-1 hover:text-pink-500 " +
              (post.likes.length > 0 ? "text-pink-500" : "")
            }
            onClick={handleLike}
            disabled={loadingSetLike}
          >
            <Heart className="h-4 w-4" />
            <p>{post._count.likes}</p>
          </button>
          <button>
            <Share2 className="h-4 w-4 hover:text-orange-500" />
          </button>
          <button
            className="flex flex-row items-center gap-1 hover:text-green-500"
            onClick={() => {
              handleFollow(post.user.username);
            }}
          >
            <UserPlus className="h-4 w-4" />
            <p>Follow</p>
          </button>
        </div>
      </div>
    </article>
  );
}
