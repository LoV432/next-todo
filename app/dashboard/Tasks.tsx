import { getTasks } from '@/app/api/tasks/route';
import DeleteTask from './DeleteTask';

export default async function Tasks() {
	const tasks = await getTasks();
	if ('error' in tasks) {
		return <div className="text-red-500">{tasks.error}</div>;
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
				</li>
			))}
		</ul>
	);
}
