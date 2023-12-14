import Navbar from "../Navbar";

export default function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      {...props}
      className={
        "flex w-full min-h-screen h-full dark:text-white flex-col items-center justify-start " +
        "text-black bg-white " +
        "dark:bg-neutral-950 " +
        className
      }
    >
      <Navbar />
      {children}
    </main>
  );
}
