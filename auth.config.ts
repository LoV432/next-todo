import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
	pages: {
		signIn: '/login'
	},
	session: {
		strategy: 'jwt'
	},
	providers: []
} satisfies NextAuthConfig;
