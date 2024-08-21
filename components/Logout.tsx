'use client';
import { signOutUser } from '@/lib/api/sign_in_out_user';
import { Button } from './ui/button';

export default function Logout() {
	return (
		<>
			<Button
				variant={'link'}
				className="absolute right-4"
				onClick={() => {
					signOutUser();
				}}
			>
				Logout
			</Button>
		</>
	);
}
