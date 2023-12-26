import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("lg:text-sm text-xs rounded-sm", {
  variants: {
    variant: {
      orange:
        "focus:outline-none font-medium px-6 py-1 bg-orange-600 text-white hover:bg-orange-500",
      icon: "text-black dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300",
      input:
        "px-4 py-1 placeholder:text-neutral-500 w-full border focus:outline-none outline-none bg-white border-neutral-300 focus:border-neutral-500 dark:bg-neutral-950 dark:border-neutral-700 dark:focus:border-neutral-500 ",
      inputFile:
        "file:appearance-none file:border-solid file:border file:bg-white file:dark:bg-neutral-950 file:text-black file:dark:text-white file:font-medium file:px-4 file:py-2 file:rounded-sm file:border-neutral-300 file:dark:border-neutral-700 file:shadow-none file:outline-none file:hover:cursor-pointer",
      outline:
        "focus:outline-none font-medium px-6 py-1 border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 bg-transparent",
    },
  },
  defaultVariants: {
    variant: "orange",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(variants({ variant }), className)}
        {...props}
      />
    );
  }
);
