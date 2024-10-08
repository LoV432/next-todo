import dbConnect from './db';
import Tasks from '@/models/Tasks';
import { auth } from '@/auth';

export type TasksType = {
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

export async function getTasks(customUserId?: string) {
	try {
		await dbConnect();
		const session = await auth();
		if (!session) {
			return { error: 'You must be logged in to do this.', status: 401 };
		}
		let userId = session.user.userId;
		if (session.user.role === 'admin' && customUserId) {
			userId = customUserId;
		}
		const tasks = await Tasks.find({ owner: userId }).sort({ createdAt: -1 });
		// We should remove the fileURL and then create a new endpoint for fetching the files
		// This way we can keep the fileURL private and only expose the filename
		// But vercel claims the fileURL are extremely hard to guess. So in theory this is not a problem
		// .select('-files.fileUrl');
		const sanatizedTasks = JSON.parse(JSON.stringify(tasks)); // This makes sure no moogose objects are returned
		return sanatizedTasks as TasksType;
	} catch (error) {
		return { error: 'Task fetching failed', status: 500 };
	}
}
