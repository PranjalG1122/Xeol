import Container from "../../components/Hooks/Container";

export default function Home() {
  return (
    <Container>
      <section className="w-full max-w-3xl gap-8 flex flex-col">
        <h1 className="text-4xl font-bold">What is new Today?</h1>
        <div className="flex flex-row items-center gap-8">
          <p>For You</p>
          <p>Global</p>
          <p>Following</p>
        </div>
        {/* <textarea
          className={
            "resize-none w-full border overflow-hidden " +
            "bg-white border-neutral-300 focus:border-neutral-500 focus:outline-none " +
            "dark:bg-neutral-950 dark:border-neutral-700 dark:focus:border-neutral-500 "
          }
          rows={4}
        /> */}
        <h1 className="text-4xl font-semibold">Posts</h1>
      </section>
    </Container>
  );
}
