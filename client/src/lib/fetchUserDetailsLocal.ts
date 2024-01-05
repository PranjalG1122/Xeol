import { UserDetailsProps } from "../components/types/Types";

export default function fetchUserDetailsLocal(): UserDetailsProps | null {
  const userDetails = localStorage.getItem("userDetails");
  if (userDetails) {
    return JSON.parse(userDetails);
  } else {
    return null;
  }
}
