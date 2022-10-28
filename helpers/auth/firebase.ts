import {FirebaseOptions, initializeApp} from 'firebase/app';

const firebaseCredentials: FirebaseOptions = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseCredentials);

export default firebaseApp;
