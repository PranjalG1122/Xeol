import { useClerk } from "@clerk/clerk-react";

export default function Signup() {
  const clerk = useClerk();

  return <button onClick={() => clerk.openSignUp({})}>Sign up</button>;
}
