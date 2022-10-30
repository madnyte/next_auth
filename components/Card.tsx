import React from "react";

interface CardProps {
    children: React.ReactNode
}

const Card = ({children}: CardProps) => {
    return <div className="card bg-white min-h-[2rem] p-6 w-3/4 sm:w-3/5 lg:w-1/2 xl:w-2/5 2xl:w-2/6 2xl:gap-8 border-none rounded-2xl flex flex-col gap-4 box-shadow">
        {children}
    </div>
}

export default Card;