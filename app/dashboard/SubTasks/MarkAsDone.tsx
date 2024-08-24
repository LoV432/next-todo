'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export default function MarkAsDone({
	mainTaskId,
	subtask,
	refetch,
	setChecked,
	checked,
	readOnly
}: {
	mainTaskId: string;
	subtask: { status: 'pending' | 'completed'; _id: string };
	refetch: () => Promise<any>;
	setChecked: (checked: boolean) => void;
	checked: boolean;
	readOnly?: boolean;
}) {
	const [isLoading, setIsLoading] = useState(false);
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
		</>
	);
}
