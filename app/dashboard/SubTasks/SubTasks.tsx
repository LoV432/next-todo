import { ObjectId } from 'mongoose';
import RemoveSubTask from './RemoveSubTask';
import MarkAsDone from './MarkAsDone';

export default function SubTasks({
	mainTaskId,
	subTasks
}: {
	mainTaskId: string;
	subTasks: {
		title: string;
		status: 'pending' | 'completed';
		_id: string;
	}[];
}) {
	return (
		<ul>
			{subTasks.map((subtask) => (
				<li
					key={subtask._id.toString()}
					className="flex items-center space-x-2"
				>
					<MarkAsDone
						mainTaskId={mainTaskId}
						subtask={{ status: subtask.status, _id: subtask._id.toString() }}
					/>
					<label
						htmlFor={`subtask-${subtask._id.toString()}`}
						className={`flex-grow ${subtask.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
					>
						{subtask.title}
					</label>
					<RemoveSubTask
						mainTaskId={mainTaskId}
						subTaskId={subtask._id.toString()}
					/>
				</li>
			))}
		</ul>
	);
}
