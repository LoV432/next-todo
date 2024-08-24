import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import Tasks from '@/models/Tasks';
import dbConnect from '@/lib/db';
import { getTasks } from '@/lib/get_tasks';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const session = await auth();
		if (!session) {
			return Response.json(
				{ message: 'You must be logged in to do this.' },
				{
					status: 401
				}
			);
		}
		const { title } = await req.json();
		const userId = session.user.userId;
		try {
			const task = await Tasks.create({
				title,
				owner: userId
			});
			await task.save();
			return Response.json({ message: 'Task created successfully' });
		} catch (error) {
			return Response.json(
				{ message: 'Task creation failed' },
				{ status: 500 }
			);
		}
	} catch (error) {
		return Response.json({ message: 'Task creation failed' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		await dbConnect();
		const session = await auth();
		if (!session) {
			return Response.json(
				{ message: 'You must be logged in to do this.' },
				{
					status: 401
				}
			);
		}
		const { id } = await req.json();
		const userId = session.user.userId;
		const task = await Tasks.findOneAndDelete({ _id: id, owner: userId });
		if (!task) {
			return Response.json({ message: 'Task not found.' }, { status: 404 });
		}
		return Response.json({ message: 'Task deleted successfully' });
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Task deletion failed' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const tasks = await getTasks();
		if ('error' in tasks) {
			return Response.json({ error: tasks.error }, { status: tasks.status });
		}
		return Response.json(tasks);
	} catch (error) {
		return Response.json({ message: 'Task fetching failed' }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest) {
	try {
		await dbConnect();
		const session = await auth();
		if (!session) {
			return Response.json(
				{ message: 'You must be logged in to do this.' },
				{
					status: 401
				}
			);
		}
		const { id, title } = await req.json();
		const userId = session.user.userId;
		try {
			const task = await Tasks.findOneAndUpdate(
				{ _id: id, owner: userId },
				{
					$set: {
						title
					}
				},
				{
					new: true
				}
			);
			if (!task) {
				return Response.json({ message: 'Task not found.' }, { status: 404 });
			}
			return Response.json({ message: 'Task updated successfully' });
		} catch (error) {
			return Response.json({ message: 'Task update failed' }, { status: 500 });
		}
	} catch (error) {
		return Response.json({ message: 'Task update failed' }, { status: 500 });
	}
}
