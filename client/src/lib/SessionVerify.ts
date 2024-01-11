import { SessionVerifyProps } from "../components/types/Types";

export default async function SessionVerify(): Promise<SessionVerifyProps> {
  try {
    return await fetch(new URL("/api/session", window.location.href), {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: SessionVerifyProps) => {
        return data;
      });
  } catch (err) {
    console.error(err);
    return { verified: false, onboarded: false };
  }
}
