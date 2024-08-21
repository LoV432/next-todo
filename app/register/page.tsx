'use client';
import { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setIsLoading(true);
			setError('');
			setSuccess('');
			const response = await fetch('/api/user', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password,
					email
				})
			});
			setIsLoading(false);
			if (response.status === 201) {
				setSuccess('User created successfully');
				setTimeout(() => {
					router.push('/login');
				}, 2000);
			} else {
				const error = await response.text();
				setError(error);
			}
		} catch {
			setIsLoading(false);
			setError('User creation failed');
		}
	}

	return (
		<main className="w-full justify-center pt-28">
			<Card className="mx-auto max-w-sm">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Register</CardTitle>
					<CardDescription>
						Enter your details to register your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									onChange={(e) => setUsername(e.target.value)}
									id="username"
									placeholder="Chloe Walker"
									required
									type="username"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									onChange={(e) => setEmail(e.target.value)}
									id="email"
									placeholder="chloe@example.com"
									required
									type="email"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									onChange={(e) => setPassword(e.target.value)}
									id="password"
									required
									type="password"
									placeholder="•••••••••"
								/>
							</div>
							{error && <p className="text-red-500">{error}</p>}
							{success && <p className="text-green-500">{success}</p>}
							<Button disabled={isLoading} type="submit" className="w-full">
								{isLoading ? 'Registering...' : 'Register'}
							</Button>
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Already have an account? <Link href="/login">Login</Link>
								</p>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
