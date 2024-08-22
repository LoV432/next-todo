'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Reminder = {
	_id: string;
	name: string;
	time: string;
};

export default function Reminders() {
	const [newReminder, setNewReminder] = useState({ name: '', time: '' });
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const { data, refetch } = useQuery({
		queryKey: ['reminders'],
		queryFn: async () => {
			const response = await fetch('/api/reminders');
			const data = await response.json();
			return data as Reminder[];
		},
		refetchOnWindowFocus: false
	});

	async function addReminder() {
		try {
			if (!newReminder.name || !newReminder.time) {
				return;
			}
			setIsLoading(true);
			const response = await fetch('/api/reminders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: newReminder.name, time: newReminder.time })
			});
			if (!response.ok) {
				return;
			}
			await refetch();
			setNewReminder({ name: '', time: '' });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>View Reminders</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Reminders</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<ScrollArea className="h-[200px] w-full rounded-md border p-4">
						<RemindersArea reminders={data} refetch={refetch} />
					</ScrollArea>
					<div className="grid gap-2">
						<Label htmlFor="name">Reminder Name</Label>
						<Input
							id="name"
							value={newReminder.name}
							onChange={(e) =>
								setNewReminder({ ...newReminder, name: e.target.value })
							}
							placeholder="Enter reminder name"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="datetime">Date and Time</Label>
						<div className="relative">
							<Input
								id="datetime"
								type="datetime-local"
								value={newReminder.time}
								onChange={(e) =>
									setNewReminder({ ...newReminder, time: e.target.value })
								}
							/>
						</div>
					</div>
					<Button onClick={addReminder} className="w-full" disabled={isLoading}>
						<Plus className="mr-2 h-4 w-4" />{' '}
						{isLoading ? 'Loading...' : 'Add Reminder'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RemindersArea({
	reminders,
	refetch
}: {
	reminders: Reminder[] | undefined;
	refetch: () => Promise<any>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	if (!reminders) return null;
	async function deleteReminder(id: string) {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/reminders`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			});
			if (!response.ok) {
				return;
			}
			await refetch();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<>
			{reminders.map((reminder) => (
				<div
					key={reminder._id}
					className="mb-2 flex items-center justify-between"
				>
					<div>
						<p className="font-medium">{reminder.name}</p>
						<p className="text-sm text-gray-500">{reminder.time}</p>
					</div>
					<Button
						disabled={isLoading}
						variant="ghost"
						size="icon"
						onClick={() => deleteReminder(reminder._id)}
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Delete reminder</span>
					</Button>
				</div>
			))}
		</>
	);
}
