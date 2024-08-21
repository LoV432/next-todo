'use server';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
// TODO: Turn this into normal API route
export async function signInUser(username: string, password: string) {
	try {
		await signIn('credentials', {
			username,
			password,
			redirectTo: '/dashboard'
		});
	} catch (error) {
		if (error instanceof AuthError) {
			return 'Login failed';
		}
		throw error;
	}
}

export async function signOutUser() {
	await signOut({ redirect: true, redirectTo: '/login' });
}
