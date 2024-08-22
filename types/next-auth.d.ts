import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			user_name: string;
			role: string;
			userId: string;
		};
	}
	interface User {
		user_name: string;
		role: string;
		userId: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user_name: string;
		role: string;
		userId: string;
	}
}
