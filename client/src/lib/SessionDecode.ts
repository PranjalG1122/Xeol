import { jwtDecode } from "jwt-decode";

type DecodedSessionProps = {
  email: string;
  exp: number;
  iat: number;
};

// Function to check if a session is valid
// Session can be considered valid if the following conditions are met:
// 1. Session cookie exists, is not null, and is not undefined
// 2. Session cookie can be decoded
// 3. Session cookie has not expired
// Returns decoded session if valid, undefined if not valid

export const SessionDecode = (): DecodedSessionProps | undefined => {
  try {
    const session = document.cookie.split("=")[1];
    if (!session || session === null || session === undefined) {
      return;
    }
    const decodedSession: DecodedSessionProps = jwtDecode(session);
    if (decodedSession.exp * 1000 < Date.now()) {
      return;
    }
    return decodedSession;
  } catch (err) {
    return;
  }
};
