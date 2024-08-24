'use client';
import RemoveSubTask from './RemoveSubTask';
import MarkAsDone from './MarkAsDone';
import { useState } from 'react';
import SubTaskTitle from './SubTaskTitle';

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
	const [checked, setChecked] = useState(subtask.status === 'completed');
	return (
		<li
			className={`flex items-center space-x-2 ${markedAsDeleted ? 'hidden' : ''}`}
		>
			<MarkAsDone
				readOnly={readOnly}
				mainTaskId={mainTaskId}
				subtask={{ status: subtask.status, _id: subtask._id.toString() }}
				refetch={refetch}
				setChecked={setChecked}
				checked={checked}
			/>
			<SubTaskTitle
				title={subtask.title}
				id={subtask._id.toString()}
				mainTaskId={mainTaskId}
				refetch={refetch}
				checked={checked}
				readOnly={readOnly}
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
