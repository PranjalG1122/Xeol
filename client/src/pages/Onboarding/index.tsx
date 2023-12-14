import { Button, variants } from "../../components/Hooks/Button";
import Container from "../../components/Hooks/Container";

export default function Onboarding() {
  return (
    <Container>
      <section className="flex flex-col items-start w-full max-w-3xl gap-8">
        <h1 className="text-4xl font-semibold">Before you continue...</h1>
        <p className="text-xl text-neutral-500">Tell us about yourself</p>
        <div className="flex flex-col items-start w-full gap-2">
          <p className="text-lg">Name</p>
          <input
            placeholder="Your full name here"
            className={variants({
              variant: "input",
            })}
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <p className="text-lg">Username</p>
          <input
            placeholder="A unique username"
            className={variants({
              variant: "input",
            })}
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <p className="text-lg">Description</p>
          <textarea
            placeholder="A short description about yourself"
            maxLength={256}
            rows={4}
            className={
              variants({
                variant: "input",
              }) + "resize-none"
            }
          />
        </div>
        <Button>Submit</Button>
      </section>
    </Container>
  );
}
