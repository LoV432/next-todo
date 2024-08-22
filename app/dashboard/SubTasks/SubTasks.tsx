'use client';
import RemoveSubTask from './RemoveSubTask';
import Label from './MarkAsDone';
import { useState } from 'react';

export default function SubTasks({
	mainTaskId,
	subTasks,
	refetch,
	readOnly
}: {
	mainTaskId: string;
	subTasks: {
		title: string;
		status: 'pending' | 'completed';
		_id: string;
	}[];
	refetch: () => Promise<any>;
	readOnly?: boolean;
}) {
	return (
		<ul>
			{subTasks.map((subtask) => (
				<SubTask
					key={subtask._id.toString()}
					subtask={subtask}
					mainTaskId={mainTaskId}
					refetch={refetch}
					readOnly={readOnly}
				/>
			))}
		</ul>
	);
}

function SubTask({
	subtask,
	mainTaskId,
	refetch,
	readOnly
}: {
	subtask: {
		title: string;
		status: 'pending' | 'completed';
		_id: string;
	};
	mainTaskId: string;
	refetch: () => Promise<any>;
	readOnly?: boolean;
}) {
	const [markedAsDeleted, setMarkedAsDeleted] = useState(false);
	return (
		<li
			className={`flex items-center space-x-2 ${markedAsDeleted ? 'hidden' : ''}`}
		>
			<Label
				readOnly={readOnly}
				title={subtask.title}
				mainTaskId={mainTaskId}
				subtask={{ status: subtask.status, _id: subtask._id.toString() }}
				refetch={refetch}
			/>
			{!readOnly && (
				<RemoveSubTask
					setMarkedAsDeleted={setMarkedAsDeleted}
					mainTaskId={mainTaskId}
					subTaskId={subtask._id.toString()}
					refetch={refetch}
				/>
			)}
		</li>
	);
}
