// For the "middleware" which runs before each page load to redirect the user if they are not logged in
export interface SessionVerifyProps {
  verified: boolean;
  onboarded: boolean;
}

// Props of the user details (name, username, avatar). Used when basic user details are needed anywhere
// in the app (e.g. the user's avatar in the navbar or their username/name in the NewPost component)
export interface UserDetailsProps {
  name: string;
  username: string;
  avatar: string;
  follows: {
    username: string;
  }[];
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

// Props for each post anywhere on Xeol (city and country can be null since the user might have not set it)
// Used in the Post component
export interface PostProps {
  id: string;
  createdAt: Date;
  content: string;
  city: string | null;
  country: string | null;
  tags:
    | {
        name: string;
      }[]
    | null;
  likes: {
    email: string;
  }[];
  replyTo: ReplyToPostProps | null;
  _count: {
    likes: number;
    replies: number;
  };
  user: UserDetailsProps;
}

// Props for each reply to a post (used in the Post component)
// It extends the UserProps interface since it has the same user details as a post
export interface ReplyToPostProps {
  id: string;
  createdAt: Date;
  content: string;
  user: UserDetailsProps;
}

// Props for the Follows and Followers List component
export interface FollowListProps {
  name: string;
  username: string;
  follow: FollowProps[];
}

export interface FollowProps {
  username: string;
  avatar: string;
  name: string;
  description: string;
}

// Props for updating user details on UpdateUser Component
export interface UpdatedUserDetailsProps {
  name: string;
  description: string;
  avatar: string;
  username: string;
}
