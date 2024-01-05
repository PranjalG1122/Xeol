import {
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  UserPlus,
} from "react-feather";
import { PostProps } from "./types/Types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { handleFollow } from "../lib/handleFollow";
import CreatePost from "./CreatePost";
import ReplyToPostComponent from "./ReplyToPostComponent";
import Content from "./Content";

export default function PostComponent({ post }: { post: PostProps }) {
  const [newPostInView, setNewPostInView] = useState<boolean>(false);
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
      className="flex flex-row items-start gap-4 lg:p-4 p-2 rounded-md w-full bg-neutral-100 dark:bg-neutral-900 text-sm"
      // onClick={(e) => {
      //   e.stopPropagation();
      //   window.location.href = "/post/" + post.id;
      // }}
    >
      <Link to={"/u/" + post.user.username} className="h-10 w-10">
        <img
          src={post.user.avatar ? post.user.avatar : "/default.png"}
          className="rounded-full"
          alt="n"
        />
      </Link>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-1 text-neutral-500">
          <Link
            to={"/u/" + post.user.username}
            className="flex flex-row items-center gap-1"
          >
            <p className="font-medium text-black dark:text-white truncate lg:max-w-full max-w-[80px]">
              {post.user.name}
            </p>
            <p className="truncate lg:max-w-full max-w-[80px]">
              @{post.user.username}
            </p>
          </Link>
          &bull;
          <p>
            {new Date(post.createdAt).toLocaleDateString("us-en", {
              year: "2-digit",
              month: "short",
              day: "2-digit",
            })}
          </p>
        </div>
        <Content text={post.content} />

        {post.replyTo && <ReplyToPostComponent reply={post.replyTo} />}
        {post.city && post.country && (
          <div className="flex flex-row items-center gap-1 text-neutral-500">
            Posted from{" "}
            <Link
              to={"/home?city=" + post.city + "&country=" + post.country}
              className="text-blue-500"
            >
              {post.city}, {post.country}
            </Link>
          </div>
        )}
        <div className="flex flex-row items-center gap-6 font-semibold text-neutral-500">
          <button
            title="Reply"
            className="flex flex-row items-center gap-1 hover:text-blue-500"
            onClick={() => {
              setNewPostInView(true);
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <p>{post._count.replies}</p>
          </button>
          <button
            title="Like"
            className={
              "flex flex-row items-center gap-1 hover:text-pink-500 " +
              (post.likes.length > 0 ? "text-pink-500" : "")
            }
            onClick={() => {
              handleLike();
            }}
            disabled={loadingSetLike}
          >
            <Heart className="h-4 w-4" />
            <p>{post._count.likes}</p>
          </button>
          <button title="Share">
            <Share2 className="h-4 w-4 hover:text-blue-500" />
          </button>
          <button
            className="flex flex-row items-center gap-1 hover:text-green-500"
            onClick={() => {
              handleFollow(post.user.username);
            }}
            title="Follow"
          >
            <UserPlus className="h-4 w-4" />
            <p>Follow</p>
          </button>
          <Link
            to={"/post/" + post.id}
            title="Open Post"
            className="flex flex-row items-center gap-1 hover:text-blue-500"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {newPostInView && (
        <CreatePost setNewPostInView={setNewPostInView} post={post} />
      )}
    </article>
  );
}