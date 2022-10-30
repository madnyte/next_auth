import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    onSubmit?: () => void;
    disabled?: boolean | undefined;
}

const Button: React.FC<ButtonProps> = ({children, onClick,disabled}: ButtonProps): JSX.Element => {
    return <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        {children}
    </button>
}

export default Button