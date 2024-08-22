import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Admin Dashboard'
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
	if (session.user.role !== 'admin') {
		redirect('/dashboard');
	}
	return children;
}
