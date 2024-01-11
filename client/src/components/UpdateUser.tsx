import { useRef, useState } from "react";
import { UpdatedUserDetailsProps } from "./types/Types";
import { Button, variants } from "./Button";
import { X } from "react-feather";
import { toast } from "react-toastify";
import fetchUserDetailsLocal from "../lib/fetchUserDetailsLocal";

export default function UpdateUser({
  setUpdateUserInView,
  name,
  avatar,
  description,
}: {
  setUpdateUserInView: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  avatar: string;
  description: string;
}) {
  const userDetails = fetchUserDetailsLocal();
  const [updatedUserDetails, setUpdatedUserDetails] =
    useState<UpdatedUserDetailsProps>({
      name: name,
      avatar: avatar,
      username: userDetails ? userDetails.username : "",
      description: description,
    });
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const handleSubmitUpdatedUserDetails = (e: any) => {
    e.preventDefault();
    setLoadingSubmit(true);
    console.log(updatedUserDetails);
    fetch(new URL("/api/onboarding/update", window.location.href), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedUserDetails),
    })
      .then((res) => res.json())
      .then(
        (data: {
          success: boolean;
          newUserDetails: UpdatedUserDetailsProps;
        }) => {
          if (data.success) {
            setLoadingSubmit(false);
            // setUpdatedUserDetails(data.newUserDetails);
            return toast("Updated Successfully!", {
              className: "bg-green-600 dark:bg-green-600",
            });
          }
          return toast("Something went wrong!", {
            className: "bg-red-600 dark:bg-red-600",
          });
        }
      );
  };

  const handleFileChange = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const URLBlob = new Blob([formData.get("avatar") as BlobPart], {
      type: "image/png",
    });
    setUpdatedUserDetails({
      ...updatedUserDetails,
      avatar: URLBlob.size > 0 ? URL.createObjectURL(URLBlob) : "/default.png",
    });
  };

  return (
    <section
      className="flex items-start pt-10 px-2 justify-center fixed min-h-screen h-full w-full top-0 left-0 bg-neutral-950 bg-opacity-30 dark:bg-opacity-70"
      onClick={() => {
        setUpdateUserInView(false);
      }}
    >
      <form
        encType="multipart/form-data"
        ref={formRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-start justify-center w-full max-w-xl lg:p-4 p-2 rounded gap-6 bg-white dark:bg-neutral-900"
      >
        <div className="flex flex-row items-center w-full justify-between gap-2">
          <h1 className="lg:text-xl text-lg font-medium">Edit Profile</h1>
          <Button
            variant="icon"
            onClick={() => {
              setUpdateUserInView(false);
            }}
          >
            <X />
          </Button>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="lg:h-20 h-14 lg:w-20 w-14 rounded-full relative">
            <img
              src={updatedUserDetails.avatar || "/default.png"}
              className="w-full h-full rounded-full"
              alt="avatar preview"
            />
            <div className="w-full h-full flex items-center justify-center absolute top-0 rounded-full hover:bg-neutral-950 hover:bg-opacity-40 transition-all">
              <button
                className="text-black dark:text-white"
                title="Remove Avatar"
                type="button"
                onClick={() => {
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    avatar: "/default.png",
                  });
                }}
              >
                <X />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="text-base font-medium">Upload Avatar</label>
            <input
              className={
                variants({
                  variant: "inputFile",
                }) + "file:dark:bg-neutral-800"
              }
              id="avatar"
              name="avatar"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            <p
              className="text-sm text-neutral-500 dark:text-neutral-400"
              id="file_input_help"
            >
              PNG or JPG (MAX SIZE: 512x512px).
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start w-full gap-2">
          <p className="text-base font-semibold">Name</p>
          <input
            placeholder="Your full name here"
            className={variants({
              variant: "input",
            })}
            maxLength={64}
            name="name"
            value={updatedUserDetails.name}
            onChange={(e) =>
              setUpdatedUserDetails({
                ...updatedUserDetails,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col items-start w-full gap-2">
          <p className="text-base font-semibold">Description</p>
          <textarea
            placeholder="A short description about yourself"
            maxLength={128}
            rows={4}
            className={
              variants({
                variant: "input",
              }) + "resize-none"
            }
            name="description"
            value={updatedUserDetails.description}
            onChange={(e) =>
              setUpdatedUserDetails({
                ...updatedUserDetails,
                description: e.target.value,
              })
            }
          />
        </div>

        <Button
          type="submit"
          onClick={(e) => {
            handleSubmitUpdatedUserDetails(e);
          }}
          disabled={loadingSubmit}
        >
          Save
        </Button>
      </form>
    </section>
  );
}
