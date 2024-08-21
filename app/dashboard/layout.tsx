import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';

export const metadata: Metadata = {
	title: 'Dashboard'
};

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session || !session.user) {
		redirect('/login');
	}
	return (
		<>
			<Header />
			{children}
		</>
	);
}
