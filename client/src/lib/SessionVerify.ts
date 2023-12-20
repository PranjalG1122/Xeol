import { SessionVerifyProps } from "../components/types/SessionVerifyProps.interface";

export default async function SessionVerify(): Promise<SessionVerifyProps> {
  try {
    return await fetch(import.meta.env.VITE_SERVER_LINK + "/session", {
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
