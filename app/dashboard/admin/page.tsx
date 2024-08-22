'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';

type User = {
	_id: string;
	username: string;
	email: string;
	createdAt: string;
	role: string;
};

export default function Component() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const res = await fetch('/api/admin/all-users');
			return (await res.json()) as User[];
		}
	});
	if (isLoading) {
		return <div className="pt-48 text-center">Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	return (
		<div className="container mx-auto max-w-[900px] p-4">
			<h1 className="mb-4 text-center text-2xl font-bold">User List</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.map((user) => (
						<TableRow key={user._id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.createdAt}</TableCell>
							<TableCell>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" className="mr-2">
											Edit
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit User</DialogTitle>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="username" className="text-right">
													Username
												</Label>
												<Input
													id="username"
													name="name"
													className="col-span-3"
												/>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="email" className="text-right">
													Email
												</Label>
												<Input id="email" name="email" className="col-span-3" />
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="password" className="text-right">
													Password
												</Label>
												<Input
													id="password"
													name="password"
													type="password"
													className="col-span-3"
												/>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="role" className="text-right">
													Role
												</Label>
												<Select>
													<SelectTrigger className="col-span-3">
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="user">User</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<Button>Save Changes</Button>
									</DialogContent>
								</Dialog>
								<Button variant="secondary">View Tasks</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
