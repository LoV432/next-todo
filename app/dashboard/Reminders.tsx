'use client';

import { useState, useEffect, useRef } from 'react';
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
import { X, Plus } from 'lucide-react';
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
	const scheduledReminders = useRef<Set<string>>(new Set());

	const { data, refetch } = useQuery({
		queryKey: ['reminders'],
		queryFn: async () => {
			const response = await fetch('/api/reminders');
			const data = await response.json();
			return data as Reminder[];
		},
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		if (data) {
			scheduleNotifications(data);
		}
	}, [data]);

	async function addReminder() {
		try {
			if (!newReminder.name || !newReminder.time) {
				return;
			}

			// Request notification permission if not already granted
			if (Notification.permission !== 'granted') {
				await Notification.requestPermission();
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

	function scheduleNotifications(reminders: Reminder[]) {
		if (Notification.permission === 'granted') {
			reminders.forEach((reminder) => {
				if (scheduledReminders.current.has(reminder._id)) {
					return; // Skip if already scheduled
				}

				const reminderTime = new Date(reminder.time).getTime();
				const currentTime = Date.now();
				const timeDifference = reminderTime - currentTime;

				if (timeDifference > 0) {
					setTimeout(() => {
						new Notification('Reminder', {
							body: `It's time for: ${reminder.name}`
						});
					}, timeDifference);

					// Add to the set of scheduled reminders
					scheduledReminders.current.add(reminder._id);
				}
			});
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
