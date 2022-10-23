import {
	getAuth,
	User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	browserLocalPersistence,
} from 'firebase/auth';
import {useState, useEffect} from 'react';
import {AuthContext, AuthProviderProps} from '../../context/AuthUserContext';
import firebaseApp from './firebase';

const auth = getAuth(firebaseApp);

const AuthProvider = ({children}: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<Boolean>(false);
	const [loading, setLoading] = useState(true);

	const clear = () => {
		setUser(null);
		setLoading(false);
	};

	const login = (email: string, password: string) =>
		signInWithEmailAndPassword(auth, email, password);

	const signUp = (email: string, password: string) =>
		createUserWithEmailAndPassword(auth, email, password);

	const logout = () => {
		setLoading(true);

		return signOut(auth).then(clear);
	};

	const authStateChanged = async (state: User | null) => {
		if (!state) {
			setLoading(false);
			return;
		}

		setLoading(true);

		setUser(state);
		await state?.getIdTokenResult(true).then(data => {
			const obj = data.claims;
			const res = Object.hasOwn(obj, 'isUser');
			setRole(res);
		});

		setLoading(false);
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(authStateChanged);
		return () => unsubscribe();
	}, []);

	const values = {
		user,
		login,
		signUp,
		logout,
		role,
		auth,
		loading,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
