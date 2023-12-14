import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = cva("", {
  variants: {
    variant: {
      orange:
        "focus:outline-none transition-all font-medium text-md px-10 py-2 bg-orange-500 text-white hover:bg-orange-600 dark:hover:bg-orange-400",
      logo: "hover:scale-110",
      icon: "w-6 h-6 text-black dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300",
      input:
        "px-5 py-2 placeholder:text-neutral-500 w-full border focus:outline-none bg-white border-neutral-300 focus:border-neutral-500 dark:bg-neutral-950 dark:border-neutral-700 dark:focus:border-neutral-500 ",
    },
  },
  defaultVariants: {
    variant: "orange",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, variants };
