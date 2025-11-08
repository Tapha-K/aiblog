import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const cardVariants = cva(
    // Common style
    "bg-white rounded-lg border border-gray-700 shadow-sm p-6"
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <div className={cn(cardVariants({ className }))} {...props}>
            {children}
        </div>
    );
};

export default Card;
