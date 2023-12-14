// import { SessionCheck } from "../lib/SessionCheck";

// const protectedRoutes = ["/home"];

export default function SessionWrapper({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  // fetch(import.meta.env.VITE_SERVER_LINK + "/ping", {
  //   method: "GET",
  // }).then((res) => res.json());
  // if (protectedRoutes.includes(window.location.pathname)) {
  //   const session = SessionCheck();
  //   if (!session) {
  //     return <div>NOT ALLOWED</div>;
  //   }
  // }

  return <main className="min-h-screen h-full flex flex-col">{children}</main>;
}
