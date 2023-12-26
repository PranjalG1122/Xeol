// Success boolean
export interface Success {
  success: boolean;
}

// Props for Responses which only require a success boolean and message string
export interface ResponseProps extends Success {
  message: string;
}

// For the "middleware" which runs before each page load to redirect the user if they are not logged in
export interface SessionVerifyProps {
  verified: boolean;
  onboarded: boolean;
}

// Props for the response from the server for a user's details and success boolean
export interface UserDetailsResponseProps extends Success {
  userDetails: UserDetailsProps;
}

// Props of the user details (name, username, avatar). Used when basic user details are needed anywhere
// in the app (e.g. the user's avatar in the navbar or their username/name in the NewPost component)
export interface UserDetailsProps {
  name: string;
  username: string;
  avatar: string;
}

// Props for details on the user's profile page
export interface UserDetailsPageProps {
  avatar: string;
  createdAt: Date;
  description: string;
  username: string;
  name: string;
  posts: PostProps[];
  _count: {
    posts: number;
    followers: number;
    follows: number;
  };
}

// Props for each post anywhere on Xeol (city and country can be null since the user might not set it)
// Used in the Post component
export type PostProps = {
  id: number;
  createdAt: Date;
  content: string;
  city: string | null;
  country: string | null;
  user: {
    username: string;
    name: string;
    avatar: string;
  };
  likes: {
    email: string;
  }[];
  _count: {
    likes: number;
    replies: number;
  };
};
