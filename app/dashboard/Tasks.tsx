import { getTasks } from '@/app/api/tasks/route';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export default async function Tasks() {
	const tasks = await getTasks();
	if ('error' in tasks) {
		return <div className="text-red-500">{tasks.error}</div>;
	}
	return (
		<ul className="space-y-4">
			{tasks.map((task) => (
				<li key={task._id} className="space-y-2 rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">{task.title}</h3>
						<Button variant="ghost" size="icon">
							<Trash2Icon className="h-4 w-4" />
							<span className="sr-only">Delete Task</span>
						</Button>
					</div>
				</li>
			))}
		</ul>
	);
}
