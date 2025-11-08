import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const typographyVariants = cva("text-left", {
    variants: {
        variant: {
            body: "text-base text-gray-300",
            meta: "text-sm text-gray-400",
        },
    },
    defaultVariants: {
        variant: "body",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof typographyVariants> {
    as?: React.ElementType;
}

const Typography: React.FC<TypographyProps> = ({
    className,
    variant,
    as: Tag = "p",
    children,
    ...props
}) => {
    return (
        <Tag
            className={cn(typographyVariants({ variant, className }))}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default Typography;
