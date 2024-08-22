'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export default function MarkAsDone({
	title,
	mainTaskId,
	subtask,
	refetch,
	readOnly
}: {
	title: string;
	mainTaskId: string;
	subtask: { status: 'pending' | 'completed'; _id: string };
	refetch: () => Promise<any>;
	readOnly?: boolean;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState(subtask.status === 'completed');
	async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			setIsLoading(true);
			const checkedValue = !checked ? 'completed' : 'pending';
			setChecked(!checked);
			const res = await fetch(`/api/tasks/subtasks`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					status: checkedValue,
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
			setIsLoading(false);
		}
	}
	return (
		<>
			<Checkbox
				checked={checked}
				id={`subtask-${subtask._id.toString()}`}
				onClick={handleClick}
				disabled={isLoading || readOnly}
			/>
			<label
				htmlFor={`subtask-${subtask._id.toString()}`}
				className={`flex-grow ${checked ? 'text-muted-foreground line-through' : ''}`}
			>
				{title}
			</label>
		</>
	);
}
