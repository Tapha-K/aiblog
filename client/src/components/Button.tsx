import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const buttonVariants = cva(
    // Common style
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        // Variants style
        variants: {
            variant: {
                primary: "bg-gray-900 text-white hover:bg-gray-700",
                secondary: "bg-gray-700 text-white hover:bg-gray-600",
            },
            size: {
                big: "px-4 py-2 text-2xl",
                base: "px-4 py-2 text-xl",
                small: "px-3 py-1.5 text-sm",
            },
        },
        // Initial style (No props)
        defaultVariants: {
            variant: "secondary",
            size: "base",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
    className,
    variant,
    size,
    children,
    ...props
}) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
