'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

export default function RemoveSubTask({
	setMarkedAsDeleted,
	mainTaskId,
	subTaskId,
	refetch
}: {
	setMarkedAsDeleted: (value: boolean) => void;
	mainTaskId: string;
	subTaskId: string;
	refetch: () => Promise<any>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	async function deleteSubtask() {
		try {
			setMarkedAsDeleted(true);
			setIsLoading(true);
			const response = await fetch(`/api/tasks/subtasks`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ mainTaskId, subTaskId })
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
		<Button
			variant="ghost"
			size="icon"
			onClick={deleteSubtask}
			disabled={isLoading}
		>
			<XIcon className="h-4 w-4" />
			<span className="sr-only">Delete Subtask</span>
		</Button>
	);
}
