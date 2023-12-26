import Container from "../../components/Container";

export default function Home() {
  const url = new URL(window.location.href);
  console.log(url.searchParams.getAll("country"));
  document.title = "Home / Xeol";

  return (
    <Container>
      <section className="w-full max-w-3xl gap-6 flex flex-col h-full flex-grow justify-start">
        <div className="flex flex-row items-center gap-6 font-semibold text-sm">
          <p>For You</p>
          <p>Global</p>
          <p>Following</p>
        </div>
        <h1 className="lg:text-2xl text-xl font-semibold">Posts</h1>
      </section>
    </Container>
  );
}
