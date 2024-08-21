'use client';
import { useState } from 'react';
import { signInUser } from '@/lib/api/sign_in_out_user';
import {
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	Card
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setIsLoading(true);
			setError('');
			const response = await signInUser(username, password);
			if (response === 'Login failed') {
				setError('Login failed');
			}
		} catch {
			setError('Login failed');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="w-full justify-center pt-28">
			<Card className="mx-auto max-w-sm">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
					<CardDescription>
						Enter your username and password to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									onChange={(e) => setUsername(e.target.value)}
									onBlur={(e) => setUsername(e.target.value)}
									id="username"
									placeholder="Chloe Walker"
									required
									type="username"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									onChange={(e) => setPassword(e.target.value)}
									onBlur={(e) => setPassword(e.target.value)}
									id="password"
									required
									type="password"
									placeholder="•••••••••"
								/>
							</div>
							{error && <p className="text-red-500">{error}</p>}
							<Button disabled={isLoading} type="submit" className="w-full">
								{isLoading ? 'Logging in...' : 'Login'}
							</Button>
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Don't have an account? <Link href="/register">Register</Link>
								</p>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
