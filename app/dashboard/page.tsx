import Tasks from './Tasks';

export default function Page() {
	return (
		<div className="mx-auto w-full max-w-md space-y-4 p-4">
			<h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
			<Tasks />
		</div>
	);
}
