'use client';
import { useState } from 'react';

export default function TaskTitle({
	title,
	id,
	refetch
}: {
	title: string;
	id: string;
	refetch: () => Promise<any>;
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
			const res = await fetch('/api/tasks', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
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
			{isEditing ? (
				<form onSubmit={handleSubmit}>
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
					<button type="button" onClick={() => setIsEditing(false)}>
						Cancel
					</button>
				</form>
			) : (
				<h3
					className="text-lg font-semibold"
					onClick={() => setIsEditing(true)}
				>
					{newTitle}
				</h3>
			)}
		</>
	);
}
