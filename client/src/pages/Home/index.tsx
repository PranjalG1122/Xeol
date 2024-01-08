import { useEffect, useState } from "react";
import Container from "../../components/Container";
import PostComponent from "../../components/PostComponent";
import { PostProps } from "../../components/types/Types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleFetchLocation } from "../../lib/handleFetchLocation";
import LoadingIcon from "../../components/LoadingIcon";

export default function Home() {
  const navigate = useNavigate();
  document.title = "Home / Xeol";
  const url = new URL(window.location.href);
  const city = url.searchParams.getAll("city");
  const country = url.searchParams.getAll("country");
  const tag = url.searchParams.getAll("tag");

  const currentURL = useLocation();

  const [posts, setPosts] = useState<PostProps[] | null>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_LINK + "/post/getposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        city: city[0],
        country: country[0],
        tag: tag[0],
      }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean; follows: PostProps[] }) => {
        setPosts(data.follows);
      });
  }, [currentURL.search]);

  const handleNavigateToMyCity = () => {
    handleFetchLocation.then((location) => {
      navigate(
        currentURL.pathname +
          (location
            ? "?&city=" + location.city + "&country=" + location.country
            : "")
      );
    });
  };

  return (
    <Container>
      <section className="w-full max-w-3xl gap-6 flex flex-col h-full flex-grow justify-start">
        <div className="flex flex-row items-center gap-6 font-semibold text-sm">
          <Link
            to="/home"
            className={
              "font-bold " +
              (!currentURL.search ? "text-orange-500" : "text-neutral-500")
            }
          >
            Following
          </Link>
          <button
            className={
              "font-semibold " +
              (currentURL.search.includes("city")
                ? "text-orange-500"
                : "text-neutral-500")
            }
            onClick={handleNavigateToMyCity}
          >
            Your City
          </button>
        </div>
        <h1 className="lg:text-2xl text-xl font-semibold">Posts</h1>
        <div className="w-full flex flex-col items-center gap-2">
          {(posts &&
            ((posts.length > 0 &&
              posts.map((post: PostProps, index: number) => {
                return <PostComponent key={index} post={post} />;
              })) || (
              <p className="font-medium text-neutral-500">No posts found</p>
            ))) || <LoadingIcon />}
        </div>
      </section>
    </Container>
  );
}
