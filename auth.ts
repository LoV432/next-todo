import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authUser } from '@/lib/auth_user';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				username: { type: 'text' },
				password: { type: 'password' }
			},
			authorize: async (credentials) => {
				if (
					typeof credentials.username !== 'string' ||
					typeof credentials.password !== 'string'
				) {
					return null;
				}
				let user = await authUser(credentials.username, credentials.password);
				return user;
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.user_name = user.user_name
			}
			return token;
		},
		session({ session, token }) {
			session.user.role = token.role;
			session.user.user_name = token.user_name; 
			return session;
		}
	}
});
