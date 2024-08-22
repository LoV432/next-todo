import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/auth';
import Logout from './Logout';

export default async function Component() {
	const session = await auth();
	const isLoggedIn = session?.user;
	const isAdmin = session?.user?.role === 'admin';
	const username = session?.user?.user_name;
	return (
		<header className="flex items-center justify-between border-b bg-background p-4">
			<div className="hidden items-center md:flex">
				<h1 className="text-xl font-bold">Next Tasks</h1>
			</div>
			<nav className="flex items-center space-x-4">
				{!isLoggedIn ? (
					<Button asChild>
						<Link href="/login">Login</Link>
					</Button>
				) : (
					<>
						<Link href="/dashboard">
							<span className="text-sm font-medium">Welcome, {username}</span>
						</Link>
						<Logout />
						{isAdmin && (
							<Button asChild variant="outline">
								<Link href="/dashboard/admin">Admin</Link>
							</Button>
						)}
					</>
				)}
			</nav>
		</header>
	);
}
