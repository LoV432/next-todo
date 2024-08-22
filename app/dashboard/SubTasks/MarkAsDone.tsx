'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MarkAsDone({
	mainTaskId,
	subtask,
	refetch
}: {
	mainTaskId: string;
	subtask: { status: 'pending' | 'completed'; _id: string };
	refetch: () => Promise<any>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState(subtask.status === 'completed');
	const router = useRouter();
	async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			setIsLoading(true);
			const res = await fetch(`/api/tasks/subtasks`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					status: !checked ? 'completed' : 'pending',
					mainTaskId,
					subTaskId: subtask._id
				})
			});
			if (!res.ok) {
				return;
			}
			await refetch();
		} catch (error) {
			console.error(error);
		} finally {
			setChecked(!checked);
			setIsLoading(false);
		}
	}
	return (
		<Checkbox
			defaultChecked={subtask.status === 'completed'}
			id={`subtask-${subtask._id.toString()}`}
			onClick={handleClick}
			disabled={isLoading}
		/>
	);
}
