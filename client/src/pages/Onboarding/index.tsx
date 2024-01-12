import { useRef, useState } from "react";
import { Button, variants } from "../../components/Button";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UpdatedUserDetailsProps } from "../../components/types/Types";

type userDetailsProps = {
  name: string;
  username: string;
  description: string;
};

export default function Onboarding() {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<userDetailsProps>({
    name: "",
    username: "",
    description: "",
  });

  const [usernameValidMessage, setUsernameValidMessage] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [objectURL, setObjectURL] = useState<string>("");

  const VALID_USERNAME = /^[a-zA-Z0-9_]{3,25}$/;

  const handleCheckUsername = () => {
    if (!VALID_USERNAME.test(userDetails.username))
      return setUsernameValidMessage("Username must be 3-25 characters long");
    fetch(new URL("/api/onboarding/username", window.location.href), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: userDetails.username }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean }) => {
        if (data.success) {
          setUsernameValidMessage("Username is valid");
        } else {
          setUsernameValidMessage("Username is taken");
        }
      });
  };

  const handleFileChange = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const URLBlob = new Blob([formData.get("avatar") as BlobPart], {
      type: "image/png",
    });
    setObjectURL(URL.createObjectURL(URLBlob));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    setSubmitLoading(true);
    fetch(new URL("/api/onboarding/update", window.location.href), {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(
        (data: {
          success: boolean;
          updatedDetails: UpdatedUserDetailsProps;
        }) => {
          if (data.success) {
            return navigate("/home");
          } else {
            setSubmitLoading(false);
            toast("Something went wrong!", {
              className: "bg-red-600 dark:bg-red-600",
            });
            return;
          }
        }
      );
  };

  return (
    <Container>
      <form
        className="flex flex-col items-start w-full max-w-3xl gap-6 my-auto"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        ref={formRef}
      >
        <h1 className="text-2xl font-semibold">Before you continue</h1>
        <div className="flex flex-row items-center gap-4">
          <img
            src={objectURL ? objectURL : "/default.png"}
            className="lg:h-20 h-14 lg:w-20 w-14 rounded-full"
            alt="avatar preview"
          />

          <div className="flex flex-col items-start gap-2">
            <label className="text-base font-medium">Upload Avatar</label>
            <input
              className={variants({
                variant: "inputFile",
              })}
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
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <div className="flex flex-row items-center gap-2 w-full">
            <p className="text-base font-semibold">Username</p>
            <p
              className={
                "text-sm font-medium " +
                (usernameValidMessage === "Username is valid"
                  ? "text-green-500"
                  : "text-red-500")
              }
            >
              {usernameValidMessage}
            </p>
          </div>
          <input
            placeholder="A unique username"
            className={variants({
              variant: "input",
            })}
            maxLength={32}
            name="username"
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            onBlur={handleCheckUsername}
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
            onChange={(e) =>
              setUserDetails({ ...userDetails, description: e.target.value })
            }
          />
        </div>

        <Button type="submit" disabled={submitLoading}>
          Submit
        </Button>
      </form>
    </Container>
  );
}
