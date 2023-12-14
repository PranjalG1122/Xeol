import { SessionVerifyProps } from "../components/types/SessionVerifyProps.interface";

export default async function SessionVerify(): Promise<SessionVerifyProps | null> {
  try {
    return await fetch(import.meta.env.VITE_SERVER_LINK + "/session", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: SessionVerifyProps) => {
        if (data.success) return data;
        else return null;
      });
  } catch (err) {
    console.error(err);
    return null;
  }
}
