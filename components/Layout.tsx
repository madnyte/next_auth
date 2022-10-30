import React from "react";

export interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = props => {
	return (
		<main
			className={`grid place-items-center h-screen w-screen `}
		>
			{props.children}
		</main>
	);
};

export default Layout;
