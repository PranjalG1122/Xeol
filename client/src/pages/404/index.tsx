import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { variants } from "../../components/Button";

export default function PageNotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center h-full gap-4 my-auto">
        <h1 className="lg:text-8xl text-6xl font-semibold">404</h1>
        <p className="text-neutral-400">
          The page you are looking for does not exist.
        </p>
        <Link
          className={variants({
            variant: "orange",
          })}
          to="/"
        >
          Home
        </Link>
      </div>
    </Container>
  );
}
