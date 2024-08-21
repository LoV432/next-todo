'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSubTask({ mainTaskId }: { mainTaskId: string }) {
	const router = useRouter();
	const [subTaskName, setSubTaskName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	async function addSubTask() {
		try {
			setIsLoading(true);
			const response = await fetch('/api/tasks/subtasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: subTaskName,
					mainTaskId
				})
			});
			if (response.ok) {
				setSubTaskName('');
			}
			router.refresh();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<div className="mt-2 flex space-x-2">
			<Input
				disabled={isLoading}
				type="text"
				placeholder="Add a subtask"
				onChange={(e) => setSubTaskName(e.target.value)}
				value={subTaskName}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						addSubTask();
					}
				}}
			/>
			<Button disabled={isLoading} onClick={addSubTask}>
				<PlusIcon className="h-4 w-4" />
				<span className="sr-only">Add Subtask</span>
			</Button>
		</div>
	);
}
