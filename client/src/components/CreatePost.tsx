import { MapPin, X } from "react-feather";
import { Button } from "./Button";
import { useContext, useEffect, useRef, useState } from "react";
import { ResponseProps } from "./types/Types";
import { UserDetailsContext } from "./Container";
import MDEditor, { commands } from "@uiw/react-md-editor";

export default function CreatePost({
  setNewPostInView,
}: {
  setNewPostInView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<{ city: string; country: string }>({
    city: "",
    country: "",
  });
  const userDetails = useContext(UserDetailsContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSubmitPost = async ({ replyTo }: { replyTo?: string }) => {
    if (content.length < 1) {
      // setError("Post cannot be 0 characters long");
      return;
    }
    await fetch(import.meta.env.VITE_SERVER_LINK + "/post/newpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
        location: location,
      }),
    })
      .then((res) => res.json())
      .then((data: ResponseProps) => {
        if (data.success) {
          return setNewPostInView(false);
          // handle success message :/
        }
        alert("Erro2");
        // setMessage(data.message);
      });
  };

  const handleAddLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!position) {
          return;
        }
        fetch(
          import.meta.env.VITE_LOCATION_API_LINK +
            `/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1&zoom=10`
        ).then((res) => {
          res.json().then((data) => {
            setLocation({
              city: data.address.city,
              country: data.address.country,
            });
          });
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <section
      className="flex items-start pt-10 px-2 justify-center fixed min-h-screen h-full w-full top-0 left-0 bg-neutral-950 bg-opacity-30 dark:bg-opacity-70"
      onClick={() => {
        setNewPostInView(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-start justify-center w-full max-w-xl p-4 rounded gap-4 bg-white dark:bg-neutral-900"
      >
        {(userDetails && (
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
              {/* <textarea
                className="bg-white dark:bg-neutral-900 resize-none focus:outline-none placeholder:text-neutral-500"
                placeholder="What's on your mind?"
                maxLength={512}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                ref={textAreaRef}
                rows={4}
              /> */}
              <MDEditor
                value={content}
                onChange={(e) => setContent(e || "")}
                preview="edit"
                visibleDragbar={false}
                hideToolbar={true}
                components={{}}
              />
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row items-center gap-4">
                  <Button
                    variant="icon"
                    title="Pin location to post"
                    onClick={handleAddLocation}
                  >
                    <MapPin className="h-5 w-5 text-neutral-500" />
                  </Button>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <p className="text-neutral-400 text-sm">
                    {content.length}/512
                  </p>
                  <Button
                    onClick={() => {
                      handleSubmitPost({});
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="icon"
              onClick={() => {
                setNewPostInView(false);
              }}
            >
              <X />
            </Button>
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
