'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';

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
			<div className="flex justify-end">
				<AddUserDialog refetch={refetch} />
			</div>
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
								<EditUserDialog user={user} refetch={refetch} />
								<Link href={`/dashboard/admin/${user.username}/${user._id}`}>
									<Button variant="secondary">View Tasks</Button>
								</Link>
								<DeleteUserDialog user={user} refetch={refetch} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function DeleteUserDialog({
	user,
	refetch
}: {
	user: User;
	refetch: () => Promise<any>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	async function handleDeleteUser() {
		try {
			setIsLoading(true);
			const res = await fetch(`/api/admin/all-users/delete-user`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: user._id })
			});
			if (!res.ok) {
				return;
			}
			await refetch();
			setIsOpen(false);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="ml-2">
					<TrashIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-fit">
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
				</DialogHeader>
				<div>
					<div className="pb-5">Are you sure you want to delete this user?</div>
					<Button onClick={handleDeleteUser} disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Delete User'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function EditUserDialog({
	user,
	refetch
}: {
	user: User;
	refetch: () => Promise<any>;
}) {
	const [isPasswordUpdateChecked, setIsPasswordUpdateChecked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(user.role);
	const formRef = useRef<HTMLFormElement>(null);

	async function handleUpdateUser(
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
	) {
		e.preventDefault();
		if (!formRef.current) {
			return;
		}
		const formData = new FormData(formRef.current);
		const { name, email, password } = Object.fromEntries(formData.entries());
		let body = {
			userId: user._id,
			name: name,
			email: email,
			role: selectedRole
		};
		if (isPasswordUpdateChecked && password) {
			//@ts-ignore
			body.password = password;
		}
		try {
			setIsLoading(true);
			const res = await fetch('/api/admin/all-users/edit-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				return;
			}
			await refetch();
			setIsOpen(false);
			setIsPasswordUpdateChecked(false);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="mr-2">
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleUpdateUser} ref={formRef}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Username
							</Label>
							<Input
								id="name"
								name="name"
								defaultValue={user.username}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								defaultValue={user.email}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role" className="text-right">
								Role
							</Label>
							<Select
								defaultValue={selectedRole}
								onValueChange={setSelectedRole}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<div className="col-span-3 col-start-2 flex items-center space-x-2">
								<Checkbox
									id="updatePassword"
									checked={isPasswordUpdateChecked}
									onCheckedChange={() =>
										setIsPasswordUpdateChecked(!isPasswordUpdateChecked)
									}
								/>
								<label
									htmlFor="updatePassword"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Update Password
								</label>
							</div>
						</div>
						{isPasswordUpdateChecked && (
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="password" className="text-right">
									New Password
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									className="col-span-3"
								/>
							</div>
						)}
					</div>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Save Changes'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function AddUserDialog({ refetch }: { refetch: () => Promise<any> }) {
	const [selectedRole, setSelectedRole] = useState('user');
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	async function handleUpdateUser(
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
	) {
		e.preventDefault();
		if (!formRef.current) {
			return;
		}
		const formData = new FormData(formRef.current);
		const { name, email, password } = Object.fromEntries(formData.entries());
		let body = {
			name: name,
			email: email,
			role: selectedRole,
			password: password
		};
		try {
			setIsLoading(true);
			const res = await fetch('/api/admin/all-users/add-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				return;
			}
			await refetch();
			setIsOpen(false);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="mr-2">
					Add User
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleUpdateUser} ref={formRef}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Username
							</Label>
							<Input id="name" name="name" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input id="email" name="email" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role" className="text-right">
								Role
							</Label>
							<Select
								defaultValue={selectedRole}
								onValueChange={setSelectedRole}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4"></div>
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
					</div>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Add User'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
