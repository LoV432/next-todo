'use client';
import { TasksType } from '@/lib/get_tasks';
import DeleteTask from './DeleteTask';
import AddSubTask from './AddSubTask.client';
import SubTasks from './SubTasks/SubTasks';
import { Attachments } from './Attachments';
import { useQuery } from '@tanstack/react-query';
import AddTask from './AddTask.client';
import { Chart } from './Chart';
import Reminders from './Reminders';
import TaskTitle from './TaskTitle';

export default function Tasks() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['todos'],
		queryFn: async () => {
			const res = await fetch('/api/tasks');
			return (await res.json()) as TasksType;
		}
	});

	if (isLoading) {
		return (
			<>
				<AddTask refetch={refetch} />
				<div className="text-center">Loading...</div>
			</>
		);
	}

	if (data?.length === 0)
		return (
			<>
				<AddTask refetch={refetch} />
				<div className="text-center">No tasks found</div>
			</>
		);
	if (!data || error)
		return <div className="text-center">Something went wrong</div>;

	return (
		<>
			<AddTask refetch={refetch} />
			<div className="flex justify-between">
				<Chart tasks={data} />
				<Reminders />
			</div>
			<ul className="space-y-4">
				{data.map((task) => (
					<Task key={task._id.toString()} task={task} refetch={refetch} />
				))}
			</ul>
		</>
	);
}

function Task({
	task,
	refetch
}: {
	task: TasksType[0];
	refetch: () => Promise<any>;
}) {
	const totalSubTasks = task.subTasks.length;
	const totalSubTasksDone = task.subTasks.filter(
		(subTask) => subTask.status === 'completed'
	).length;
	return (
		<>
			<li className="space-y-2 rounded-lg border p-4">
				{totalSubTasks > 0 && (
					<div className="flex items-center justify-between border-b border-gray-200 pb-2">
						<div className="flex items-center space-x-2">
							<span className="text-sm font-semibold">
								{totalSubTasksDone} of {totalSubTasks} done
							</span>
							<span className="text-sm font-semibold">
								{totalSubTasks - totalSubTasksDone} left
							</span>
						</div>
						<span className="text-sm font-semibold">
							{totalSubTasksDone === totalSubTasks ? 'Done' : 'In Progress'}
						</span>
					</div>
				)}
				<div className="flex items-center justify-between">
					<TaskTitle
						title={task.title}
						id={task._id.toString()}
						refetch={refetch}
					/>
					<DeleteTask id={task._id.toString()} refetch={refetch} />
				</div>
				<SubTasks
					subTasks={task.subTasks}
					mainTaskId={task._id.toString()}
					refetch={refetch}
				/>
				<AddSubTask mainTaskId={task._id.toString()} refetch={refetch} />
				<Attachments
					taskId={task._id.toString()}
					files={task.files}
					refetch={refetch}
				/>
			</li>
		</>
	);
}
