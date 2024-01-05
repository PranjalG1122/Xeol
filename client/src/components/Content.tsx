import { Link } from "react-router-dom";

export default function Content({ text }: { text: string }) {
  return (
    <div className="w-full text-black dark:text-white">
      {text.split(" ").map((word, index) => {
        if (word.startsWith("@") || word.startsWith("#")) {
          return (
            <Link
              key={index}
              to={
                word.startsWith("@")
                  ? "/u/" + word.slice(1, word.length)
                  : "/home?&tag=" + word.slice(1, word.length)
              }
              className="text-blue-500"
            >
              {word + " "}
            </Link>
          );
        } else {
          return word + " ";
        }
      })}
    </div>
  );
}
