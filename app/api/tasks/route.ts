import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import Tasks from '@/models/Tasks';
import User from '@/models/User';
import { ObjectId } from 'mongoose';

export async function POST(req: NextRequest) {
	try {
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
		const user = await User.findOne({ username: session.user.user_name });
		const userId = user?._id;
		if (!userId) {
			return Response.json({ message: 'User not found.' }, { status: 404 });
		}
		const task = await Tasks.create({
			title,
			owner: userId
		});
		try {
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
		const user = await User.findOne({ username: session.user.user_name });
		const userId = user?._id;
		if (!userId) {
			return Response.json({ message: 'User not found.' }, { status: 404 });
		}
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

export async function getTasks() {
	try {
		const session = await auth();
		if (!session) {
			return { error: 'You must be logged in to do this.', status: 401 };
		}
		const user = await User.findOne({ username: session.user.user_name });
		const userId = user?._id;
		if (!userId) {
			return { error: 'User not found.', status: 404 };
		}
		const tasks = await Tasks.find({ owner: userId }).sort({ createdAt: -1 });
		return tasks as {
			title: string;
			_id: ObjectId;
			status: 'pending' | 'completed';
			createdAt: string;
			updatedAt: string;
			subTasks: {
				title: string;
				status: 'pending' | 'completed';
				_id: ObjectId;
			}[];
		}[];
	} catch (error) {
		return { error: 'Task fetching failed', status: 500 };
	}
}
