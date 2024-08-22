'use client';
import { TasksType } from '@/lib/get_tasks';
import SubTasks from '@/app/dashboard/SubTasks/SubTasks';
import { Attachments } from '@/app/dashboard/Attachments';
import { useQuery } from '@tanstack/react-query';

export default function Tasks({
	params
}: {
	params: {
		name: string;
		id: string;
	};
}) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['todos', params.id],
		queryFn: async () => {
			const res = await fetch(`/api/admin/tasks?customUserId=${params.id}`);
			return (await res.json()) as TasksType;
		}
	});

	if (isLoading) {
		return (
			<div className="mx-auto w-full max-w-md space-y-4 p-4">
				<div className="text-center">Loading...</div>
			</div>
		);
	}

	if (data?.length === 0)
		return (
			<div className="mx-auto w-full max-w-md space-y-4 p-4">
				<div className="text-center text-lg font-bold">
					Showing {decodeURI(params.name)} tasks
				</div>
				<div className="text-center">No tasks found</div>
			</div>
		);
	if (!data || error)
		return <div className="text-center">Something went wrong</div>;

	return (
		<div className="mx-auto w-full max-w-md space-y-4 p-4">
			<div className="text-center text-lg font-bold">
				Showing {decodeURI(params.name)} tasks
			</div>
			<ul className="space-y-4">
				{data.map((task) => (
					<Task key={task._id.toString()} task={task} refetch={refetch} />
				))}
			</ul>
		</div>
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
					<h3 className="text-lg font-semibold">{task.title}</h3>
				</div>
				<SubTasks
					readOnly={true}
					subTasks={task.subTasks}
					mainTaskId={task._id.toString()}
					refetch={refetch}
				/>
				<Attachments
					readOnly={true}
					taskId={task._id.toString()}
					files={task.files}
					refetch={refetch}
				/>
			</li>
		</>
	);
}
