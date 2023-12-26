import { Link } from "react-router-dom";
import { Button, variants } from "../../components/Button";
import { useRef, useState } from "react";
import { ResponseProps } from "../../components/types/Types";
import Container from "../../components/Container";

const VALID_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function Landing() {
  const [email, setEmail] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!VALID_EMAIL.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setLoadingSubmit(true);
    await fetch(import.meta.env.VITE_SERVER_LINK + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data: ResponseProps) => {
        if (data.success) {
          setMessage("Email sent!");
          setEmail("");
          formRef.current?.reset();
          setLoadingSubmit(false);
        }
      });
  };

  return (
    <Container>
      <section className="flex flex-col items-center justify-center lg:gap-8 gap-6 h-full flex-grow text-center">
        <div className="flex flex-row items-center lg:gap-10 gap-4 lg:text-2xl text-xl font-bold text-orange-500">
          <p>Global</p>
          <p>Connected</p>
          <p>Informed</p>
        </div>
        <div className="flex flex-col items-center lg:text-8xl text-3xl font-bold">
          <h1>Discover Your World,</h1>
          <h1>One Post at a Time</h1>
        </div>
        <h1 className="lg:text-2xl text-base font-semibold">
          Enter your email below to get started
        </h1>
        <form
          className="flex flex-col items-start gap-2 max-w-xl w-full"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-row items-center gap-2 w-full">
            <input
              className={variants({
                variant: "input",
              })}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Button type="submit" disabled={loadingSubmit}>
              Submit
            </Button>
          </div>
          {message ? (
            <p
              className={
                "text-sm font-medium " +
                (message === "Email sent!" ? "text-green-500" : "text-red-500")
              }
            >
              {message}
            </p>
          ) : (
            <span className="block h-5" />
          )}
        </form>
        <p className="text-neutral-400">
          By signing up to Xeol, you agree to our{" "}
          <Link
            to="/terms"
            className="font-semibold text-black dark:text-white"
          >
            Terms and Conditions
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
