'use client';
import { signOutUser } from '@/lib/api/sign_in_out_user';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

export default function Logout() {
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => signOutUser()}
				className="text-muted-foreground hover:text-primary"
			>
				<LogOut className="mr-2 h-4 w-4" />
				Logout
			</Button>
		</>
	);
}
