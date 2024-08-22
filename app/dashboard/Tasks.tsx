import { TasksType } from '@/lib/get_tasks';
import DeleteTask from './DeleteTask';
import AddSubTask from './AddSubTask.client';
import SubTasks from './SubTasks/SubTasks';
import { Attachments } from './Attachments';

export default async function Tasks({
	tasks
}: {
	tasks: TasksType | { error: string; status: number };
}) {
	if ('error' in tasks) {
		return <div>{tasks.error}</div>;
	}
	return (
		<ul className="space-y-4">
			{tasks.map((task) => (
				<li
					key={task._id.toString()}
					className="space-y-2 rounded-lg border p-4"
				>
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">{task.title}</h3>
						<DeleteTask id={task._id.toString()} />
					</div>
					<SubTasks subTasks={task.subTasks} mainTaskId={task._id.toString()} />
					<AddSubTask mainTaskId={task._id.toString()} />
					<Attachments taskId={task._id.toString()} files={task.files} />
				</li>
			))}
		</ul>
	);
}
