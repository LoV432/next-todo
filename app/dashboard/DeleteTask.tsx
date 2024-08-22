'use client';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteTask({
	id,
	refetch
}: {
	id: string;
	refetch: () => Promise<any>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	async function deleteTask() {
		try {
			setIsLoading(true);
			const res = await fetch(`/api/tasks`, {
				body: JSON.stringify({ id }),
				method: 'DELETE'
			});
			if (!res.ok) {
				return;
			}
			await await refetch();
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
			onClick={deleteTask}
			disabled={isLoading}
		>
			<Trash2Icon className="h-4 w-4" />
			<span className="sr-only">Delete Task</span>
		</Button>
	);
}
