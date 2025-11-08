import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

const inputVariants = cva(
    // 기본 스타일
    "w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" +
        // Autofill 핵(Hack)
        " autofill:[-webkit-box-shadow:0_0_0_1000px_rgb(31_41_55)_inset]" + // (다크모드 배경색)
        " autofill:[-webkit-text-fill-color:white]" // (다크모드 글자색)
);

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    label?: string;
    id: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xl font-medium text-gray-300 mb-1 text-left"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(inputVariants({ className }))}
                {...props}
            />
        </div>
    );
};

export default Input;
