import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const sectionTitleVariants = cva(
    "text-xl font-semibold text-white text-left mb-3"
);

export interface SectionTitleProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof sectionTitleVariants> {}

const SectionTitle: React.FC<SectionTitleProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <h2 className={cn(sectionTitleVariants({ className }))} {...props}>
            {children}
        </h2>
    );
};

export default SectionTitle;
