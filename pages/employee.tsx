import type {NextPage} from 'next';
import Layout from '../components/Layout';
import {useAuth} from '../context/AuthUserContext';

const Employee = () => {
	const {loading, auth, logout} = useAuth();

	const user = auth.currentUser;

	const onSubmit = async () => {
		await logout();
	};

	return (
		<Layout>
			{loading ? (
				<div className="grid place-items-center w-full max-h-screen">
					<h4>loading...</h4>
				</div>
			) : (
				<div className="flex flex-col justify-center gap-3 sm:gap-4 lg:gap-8">
					<h4 className="text-xl sm:text-3xl">You are logged in</h4>
					<h2 className="text-xl sm:text-3xl">Email: {user?.email}</h2>
					<h2 className="text-xl sm:text-3xl">Your Role is: Employee</h2>
					<button
						onClick={onSubmit}
						className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
					>
						logout
					</button>
				</div>
			)}
		</Layout>
	);
};

export default Employee;
