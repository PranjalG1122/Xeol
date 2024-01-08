import { Link } from "react-router-dom";
import { ReplyToPostProps } from "./types/Types";
import Content from "./Content";
import { ExternalLink } from "react-feather";

export default function ReplyToPostComponent({
  reply,
}: {
  reply: ReplyToPostProps;
}) {
  return (
    <section
      className="flex flex-col items-start w-full gap-2 p-2 rounded-sm border border-neutral-300 dark:border-neutral-700 text-neutral-500"
      title="Post"
    >
      <div className="flex flex-row items-center gap-2">
        <p>Replying to @{reply.user.username}</p>{" "}
        <Link
          to={"/post/" + reply.id}
          title="Go to Post"
          className="flex flex-row items-center gap-1 hover:text-neutral-600"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-row items-start gap-2 w-full">
        <Link to={"/u/" + reply.user.username} className="h-8 w-8">
          <img
            src={reply.user.avatar ? reply.user.avatar : "/default.png"}
            className="rounded-full "
            alt="n"
          />
        </Link>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-row items-center gap-1">
            <Link
              to={"/u/" + reply.user.username}
              className="flex flex-row items-center gap-1"
            >
              <p className="font-medium text-black dark:text-white truncate lg:max-w-full max-w-[60px]">
                {reply.user.name}
              </p>
              <p className="truncate lg:max-w-full max-w-[60px]">
                @{reply.user.username}
              </p>
            </Link>
            &bull;
            <p>
              {new Date(reply.createdAt).toLocaleDateString("us-en", {
                year: "2-digit",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
          <Content text={reply.content} />
        </div>
      </div>
    </section>
  );
}
