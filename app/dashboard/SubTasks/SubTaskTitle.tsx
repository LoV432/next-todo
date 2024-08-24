'use client';
import { useState } from 'react';

export default function TaskTitle({
	title,
	id,
	mainTaskId,
	refetch,
	checked,
	readOnly
}: {
	title: string;
	id: string;
	mainTaskId: string;
	checked: boolean;
	refetch: () => Promise<any>;
	readOnly?: boolean;
}) {
	const [newTitle, setNewTitle] = useState(title);
	const [isEditing, setIsEditing] = useState(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTitle(e.target.value);
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newTitle.trim() === '') return;
		if (newTitle === title) return;
		try {
			const res = await fetch('/api/tasks/subtasks', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					subTaskId: id,
					mainTaskId,
					title: newTitle
				})
			});
			if (!res.ok) {
				setNewTitle(title);
				return;
			}
			refetch();
		} catch (error) {
			console.error(error);
		} finally {
			setIsEditing(false);
		}
	};
	return (
		<>
			{isEditing && !readOnly ? (
				<form onSubmit={handleSubmit} className="flex-grow">
					<input
						onKeyDown={(e) => {
							if (e.key === 'Escape') {
								setIsEditing(false);
							}
						}}
						autoFocus
						type="text"
						value={newTitle}
						onChange={handleChange}
						placeholder="Task title"
					/>
					<button onClick={() => setIsEditing(false)}>Cancel</button>
				</form>
			) : (
				<span
					onClick={() => setIsEditing(true)}
					className={`flex-grow ${checked ? 'text-muted-foreground line-through' : ''}`}
				>
					{newTitle}
				</span>
			)}
		</>
	);
}
