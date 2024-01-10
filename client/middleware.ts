import { rewrite } from "@vercel/edge";

export const config = {
  matcher: "/api",
};

export function Middleware(req: Request) {
  return rewrite(
    new URL(new URL(req.url).pathname, process.env.VITE_SERVER_LINK)
  );
}
