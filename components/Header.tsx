import { auth } from '@/auth';
import Logout from './Logout';

export default async function Header() {
	const session = await auth();
	const user = session?.user.user_name;
	return (
		user && (
			<header className="relative ml-auto flex flex-row pt-5">
				<>
					<h1 className="w-full text-center text-xl font-bold tracking-tight sm:text-3xl">
						{`Hello, ${user}!`}
					</h1>
					<Logout />
				</>
			</header>
		)
	);
}
