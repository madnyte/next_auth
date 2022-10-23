import '../styles/globals.css';
// import '../styles/style.css';
import type {AppProps} from 'next/app';
import AuthProvider from '../helpers/auth/authProvider';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp;
