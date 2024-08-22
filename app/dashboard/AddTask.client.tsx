'use client';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AddTask({ refetch }: { refetch: () => Promise<any> }) {
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	async function addTask() {
		try {
			setIsLoading(true);
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title
				})
			});
			if (!res.ok) {
				setIsLoading(false);
				return;
			}
			await await refetch();
			setTitle('');
		} catch (error) {
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<div className="flex space-x-2">
			<Input
				type="text"
				value={title}
				disabled={isLoading}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						addTask();
					}
				}}
				placeholder="Task Title"
			/>
			<Button onClick={addTask} disabled={isLoading}>
				<PlusIcon className="h-4 w-4" />
				<span className="sr-only">Add Task</span>
			</Button>
		</div>
	);
}
