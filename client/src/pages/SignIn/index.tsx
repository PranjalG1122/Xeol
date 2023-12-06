import { useSignIn } from "@clerk/clerk-react";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const email = "plumberjohn1221@gmail.com";
  const password = "password123";

  async function Submit(e: any) {
    e.preventDefault();
    if (signIn) {
      await signIn
        .create({
          identifier: email,
          password,
        })
        .then((result) => {
          if (result.status === "complete") {
            console.log(result);
            setActive({ session: result.createdSessionId });
          } else {
            console.log(result);
          }
        })
        .catch((err) => console.error("error", err.errors[0].longMessage));
    }
  }

  if (!isLoaded) {
    return <div>Loading ...</div>;
  }
  return (
    <main className="text-4xl">
      Status: {signIn.status}
      <button onClick={Submit}>Click</button>
    </main>
  );
}
