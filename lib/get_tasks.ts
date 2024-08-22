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
		// We should remove the fileURL and then create a new endpoint for fetching the files
		// This way we can keep the fileURL private and only expose the filename
		// But vercel claims the fileURL are extremely hard to guess. So in theory this is not a problem
		// .select('-files.fileUrl');
		const sanatizedTasks = JSON.parse(JSON.stringify(tasks)); // This makes sure no moogose objects are returned
		return sanatizedTasks as {
			title: string;
			_id: string;
			status: 'pending' | 'completed';
			createdAt: string;
			updatedAt: string;
			subTasks: {
				title: string;
				status: 'pending' | 'completed';
				_id: string;
			}[];
			files: {
				filename: string;
				fileUrl: string;
				_id: string;
			}[];
		}[];
	} catch (error) {
		return { error: 'Task fetching failed', status: 500 };
	}
}
