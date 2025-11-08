import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const spinnerVariants = cva("animate-spin", {
    variants: {
        theme: {
            light: "text-white dark:text-gray-900",
            primary: "text-blue-500", // 페이지 로딩용
        },
        size: {
            small: "h-4 w-4",
            base: "h-6 w-6",
            large: "h-8 w-8",
        },
    },
    defaultVariants: {
        theme: "light",
        size: "small",
    },
});

export interface LoadingSpinnerProps
    extends React.SVGAttributes<SVGSVGElement>,
        VariantProps<typeof spinnerVariants> {}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    className,
    theme,
    size,
    ...props
}) => {
    return (
        <svg
            className={cn(spinnerVariants({ theme, size, className }))}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
};

export default LoadingSpinner;
