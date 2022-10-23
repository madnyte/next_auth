import {Auth, User, UserCredential} from 'firebase/auth';
import {createContext, useContext, ReactNode} from 'react';

export interface AuthProviderProps {
	children?: ReactNode;
}

export interface UserContextState {
	isAuthenticated: boolean;
	isLoading: boolean;
	id?: string;
}

export const UserStateContext = createContext<UserContextState>({} as UserContextState);

export interface AuthContextModel {
	auth: Auth;
	user: User | null;
	login: (email: string, password: string) => Promise<UserCredential>;
	signUp: (email: string, password: string) => Promise<UserCredential>;
	logout: () => Promise<void>;
	role: Boolean;
	loading: Boolean;
}

export const AuthContext = createContext<AuthContextModel>({} as AuthContextModel);

export function useAuth(): AuthContextModel {
	return useContext(AuthContext);
}

export const useUserContext = (): UserContextState => {
	return useContext(UserStateContext);
};
