import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {z} from 'zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {getFunctions, httpsCallable} from 'firebase/functions';
import {useAuth} from '../context/AuthUserContext';
import Layout from '../components/Layout';
import {useState} from 'react';

const roles = ['User', 'Employee'] as const;

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {message: 'password is too short'}),
});

type FormSchema = z.infer<typeof schema>;

const Login: NextPage = () => {
	const router = useRouter();
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	const {
		register,
		handleSubmit,
		formState: {errors, isSubmitting},
	} = useForm<FormSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const {login, signUp} = useAuth();

	const onLogin: SubmitHandler<FormSchema> = async data => {
		setError(null);
		setMessage('');
		login(data.email, data.password).then(user => {
			if (user) router.push('/');
		});
	};

	const onRegister: SubmitHandler<FormSchema> = async data => {
		setError(null);
		setMessage('');
		signUp(data.email, data.password)
			.then(user => {
				const functions = getFunctions();
				const addUserRole = httpsCallable(functions, 'addUserRole');
				addUserRole({user}).then(result => {
					console.log(result.data);
				});
				setMessage('Registered successfully');
			})
			.catch(error => {
				setError(error.code);
			});
	};

	return (
		<Layout>
			<div className="bg-white p-6 flex flex-col relative gap-2 sm:gap-4 sm:p-10">
				<div className="bg-gray-200 relative left-0 top-0 w-full p-2 grid place-items-center">
					<h4 className="self-center text-gray-400 text-base sm:text-3xl">Login/Register</h4>
				</div>
				<div className="card-content relative">
					{error && <h4 className="text-red-500">{error}</h4>}
					{message && <h4 className="text-green-500">{message}</h4>}

					<form className="flex flex-col gap-2 sm:gap-4">
						<div className="flex flex-col gap-2 sm:gap-4">
							<label className="text-base sm:xl">Email</label>
							<input
								type="text"
								{...register('email')}
								onChange={() => {
									setError(null);
									setMessage('');
								}}
								className="bg-blue-50 border border-black text-base sm:text-3xl"
								disabled={isSubmitting}
							/>
							{errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
						</div>
						<div className="flex flex-col gap-2 sm:gap-4">
							<label className="text-base sm:xl">Password</label>
							<input
								type="password"
								{...register('password')}
								className="bg-blue-50 border border-black text-base sm:text-3xl"
								onChange={() => {
									setError(null);
									setMessage('');
								}}
								disabled={isSubmitting}
							/>
							{errors.password && (
								<p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
							)}
						</div>

						<button
							disabled={isSubmitting}
							onClick={handleSubmit(onLogin)}
							className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
						>
							{isSubmitting && (
								<div
									className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
									role="status"
								>
									<span className="visually-hidden">Loading...</span>
								</div>
							)}
							Login
						</button>
						<button
							disabled={isSubmitting}
							onClick={handleSubmit(onRegister)}
							className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
						>
							{isSubmitting && (
								<div
									className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
									role="status"
								>
									<span className="visually-hidden">Loading...</span>
								</div>
							)}
							Register
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default Login;
