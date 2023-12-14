import { Link } from "react-router-dom";
import { Button, variants } from "../../components/Hooks/Button";
import { useState } from "react";
import { ResponseProps } from "../../components/types/ResponseProps.interface";
import Container from "../../components/Hooks/Container";

export default function Landing() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async () => {
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
        }
      });
  };

  return (
    <Container>
      <section className="flex flex-col items-center justify-center gap-8 h-full flex-grow">
        <div className="flex flex-row items-center gap-10">
          <p className="text-2xl font-bold text-orange-500">Global</p>
          <p className="text-2xl font-bold text-orange-500">Connected</p>
          <p className="text-2xl font-bold text-orange-500">Informed</p>
        </div>
        <div className="flex flex-col items-center text-8xl font-bold">
          <h1>Discover Your World,</h1>
          <h1>One Post at a Time</h1>
        </div>
        <h1 className="text-4xl font-bold">Get Started with Xeol</h1>
        <h1 className="text-2xl font-medium">
          Enter your email below to get started
        </h1>
        <div className="flex flex-row items-center gap-2 max-w-xl w-full">
          <input
            className={variants({
              variant: "input",
            })}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
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
