import { ObjectId } from 'mongoose';
import dbConnect from './db';
import Tasks from '@/models/Tasks';
import User from '@/models/User';
import { auth } from '@/auth';

export async function getTasks() {
	try {
		await dbConnect();
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
