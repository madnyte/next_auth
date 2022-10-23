import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import Layout from '../components/Layout';
import {useAuth} from '../context/AuthUserContext';
import Employee from './employee';
import User from './user';

const Home: NextPage = () => {
	const router = useRouter();

	const {user, loading, role} = useAuth();

	useEffect(() => {
		if (!user && !loading) {
			router.push('/login');
		}
	}, [loading, user]);

	return loading ? (
		<Layout>
			<h4>loading...</h4>
		</Layout>
	) : user != null && role ? (
		<Employee></Employee>
	) : (
		<User></User>
	);
};

export default Home;
