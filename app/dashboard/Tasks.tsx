'use client';
import { TasksType } from '@/lib/get_tasks';
import DeleteTask from './DeleteTask';
import AddSubTask from './AddSubTask.client';
import SubTasks from './SubTasks/SubTasks';
import { Attachments } from './Attachments';
import { useQuery } from '@tanstack/react-query';
import AddTask from './AddTask.client';

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
			<ul className="space-y-4">
				{data.map((task) => (
					<li
						key={task._id.toString()}
						className="space-y-2 rounded-lg border p-4"
					>
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">{task.title}</h3>
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
				))}
			</ul>
		</>
	);
}
