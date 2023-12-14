import { useParams } from "react-router-dom";

export default function Verify() {
  const { token } = useParams<{ token: string }>();
  fetch(`${import.meta.env.VITE_SERVER_LINK}/auth/${token}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) console.log("he");
    });
  return <div>Verify</div>;
}
