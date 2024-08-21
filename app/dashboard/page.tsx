import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
	const session = await auth();
	const user = session?.user;
	if (!user) redirect('/login');
	return (
		<main className="w-full justify-center pt-28">
			<h1>Hello {user.user_name}</h1>
		</main>
	);
}
