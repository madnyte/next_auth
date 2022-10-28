import {useAuth} from '../context/AuthUserContext';
import React from "react";

export interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = props => {
	const {role, user, auth} = useAuth();
	return (
		<main
			className={`grid place-items-center h-screen w-screen ${
				role && user != null
					? 'bg-green-200'
					: user != null && auth != null
					? 'bg-blue-300'
					: 'bg-indigo-50'
			} `}
		>
			{props.children}
		</main>
	);
};

export default Layout;
