import { useRef, useState } from "react";
import { Button, variants } from "../../components/Button";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UpdatedUserDetailsProps } from "../../components/types/Types";
import { Check, Info, X } from "react-feather";

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

  const [validUsername, setValidUsername] = useState<boolean | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [objectURL, setObjectURL] = useState<string>("");

  const VALID_USERNAME = /^[a-z0-9_]{3,25}$/;

  const handleCheckUsername = () => {
    if (!VALID_USERNAME.test(userDetails.username))
      return setValidUsername(false);
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
          setValidUsername(true);
        } else {
          setValidUsername(false);
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

    console.log(userDetails);

    if (
      userDetails.username.length < 1 ||
      userDetails.name.length < 1 ||
      userDetails.description.length < 1
    )
      return toast("Please fill in all the details!", {
        className: "bg-red-600 dark:bg-red-600",
      });

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
            return toast("Something went wrong!", {
              className: "bg-red-600 dark:bg-red-600",
            });
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
            required
            name="name"
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <div className="flex flex-row items-center gap-2 w-full">
            <p className="text-base font-semibold">Username</p>
            <div title="Username must be 3-32 characters long, with only lowercase letters, numbers, and underscores.">
              <Info className="h-4 w-4 text-neutral-500" />
            </div>
            {validUsername !== null &&
              (validUsername ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              ))}
          </div>
          <input
            placeholder="A unique username"
            className={variants({
              variant: "input",
            })}
            required
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
            required
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
