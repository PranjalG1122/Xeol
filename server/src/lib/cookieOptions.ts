interface CookieOptionsProps {
  maxAge?: number | undefined;
  signed?: boolean | undefined;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  path?: string | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  encode?: ((val: string) => string) | undefined;
  sameSite?: boolean | "lax" | "strict" | "none" | undefined;
}

export const COOKIE_OPTIONS: CookieOptionsProps = {
  path: "/",
  domain: "localhost",
  secure: false,
  sameSite: "lax",
  maxAge: 90 * 24 * 60 * 60 * 1000,
};
