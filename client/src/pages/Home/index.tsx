import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="text-4xl">
      Home
      <Link to="/dashboard" className="text-2xl">
        Dashboard
      </Link>
    </main>
  );
}
