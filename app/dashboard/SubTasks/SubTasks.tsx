'use client';
import RemoveSubTask from './RemoveSubTask';
import Label from './MarkAsDone';
import { useState } from 'react';

export default function SubTasks({
	mainTaskId,
	subTasks,
	refetch
}: {
	mainTaskId: string;
	subTasks: {
		title: string;
		status: 'pending' | 'completed';
		_id: string;
	}[];
	refetch: () => Promise<any>;
}) {
	return (
		<ul>
			{subTasks.map((subtask) => (
				<SubTask
					key={subtask._id.toString()}
					subtask={subtask}
					mainTaskId={mainTaskId}
					refetch={refetch}
				/>
			))}
		</ul>
	);
}

function SubTask({
	subtask,
	mainTaskId,
	refetch
}: {
	subtask: {
		title: string;
		status: 'pending' | 'completed';
		_id: string;
	};
	mainTaskId: string;
	refetch: () => Promise<any>;
}) {
	const [markedAsDeleted, setMarkedAsDeleted] = useState(false);
	return (
		<li
			className={`flex items-center space-x-2 ${markedAsDeleted ? 'hidden' : ''}`}
		>
			<Label
				title={subtask.title}
				mainTaskId={mainTaskId}
				subtask={{ status: subtask.status, _id: subtask._id.toString() }}
				refetch={refetch}
			/>
			<RemoveSubTask
				setMarkedAsDeleted={setMarkedAsDeleted}
				mainTaskId={mainTaskId}
				subTaskId={subtask._id.toString()}
				refetch={refetch}
			/>
		</li>
	);
}
