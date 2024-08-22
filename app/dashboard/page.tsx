import { use } from 'react';
import AddTask from './AddTask.client';
import Tasks from './Tasks';
import { getTasks } from '@/lib/get_tasks';
import { Suspense } from 'react';

export default function Page() {
	const tasks = use(getTasks());
	return (
		<div className="mx-auto w-full max-w-md space-y-4 p-4">
			<h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
			<AddTask />
			<Suspense fallback={<div>Loading...</div>}>
				<Tasks tasks={tasks} />
			</Suspense>
		</div>
	);
}
