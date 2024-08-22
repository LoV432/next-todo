'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

export default function RemoveSubTask({
	mainTaskId,
	subTaskId,
	refetch
}: {
	mainTaskId: string;
	subTaskId: string;
	refetch: () => Promise<any>;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	async function deleteSubtask() {
		try {
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
