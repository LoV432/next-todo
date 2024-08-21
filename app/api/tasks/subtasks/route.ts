import { auth } from '@/auth';
import Tasks from '@/models/Tasks';
import User from '@/models/User';

export async function POST(req: Request) {
	const { mainTaskId, title } = await req.json();
	if (!mainTaskId || !title) {
		return Response.json(
			{ message: 'Missing required fields.' },
			{ status: 400 }
		);
	}
	const session = await auth();
	if (!session) {
		return Response.json(
			{ message: 'You must be logged in to do this.' },
			{
				status: 401
			}
		);
	}
	const user = await User.findOne({ username: session.user.user_name });
	const userId = user?._id;
	if (!userId) {
		return Response.json({ message: 'User not found.' }, { status: 404 });
	}
	const subtask = await Tasks.findOneAndUpdate(
		{ _id: mainTaskId, owner: userId },
		{
			$push: {
				subTasks: {
					title
				}
			}
		},
		{
			new: true
		}
	);
	if (!subtask) {
		return Response.json({ message: 'Task not found.' }, { status: 404 });
	}
	try {
		await subtask.save();
		return Response.json({ message: 'Subtask created successfully' });
	} catch (error) {
		return Response.json(
			{ message: 'Subtask creation failed' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: Request) {
	const { mainTaskId, subTaskId } = await req.json();
	if (!mainTaskId || !subTaskId) {
		return Response.json(
			{ message: 'Missing required fields.' },
			{ status: 400 }
		);
	}
	const session = await auth();
	if (!session) {
		return Response.json(
			{ message: 'You must be logged in to do this.' },
			{
				status: 401
			}
		);
	}
	const user = await User.findOne({ username: session.user.user_name });
	const userId = user?._id;
	if (!userId) {
		return Response.json({ message: 'User not found.' }, { status: 404 });
	}
	const subtask = await Tasks.updateOne(
		{ _id: mainTaskId, owner: userId },
		{
			$pull: { subTasks: { _id: subTaskId } }
		}
	);
	if (!subtask) {
		return Response.json({ message: 'Subtask not found.' }, { status: 404 });
	}
	return Response.json({ message: 'Subtask deleted successfully' });
}

export async function PUT(req: Request) {
	const { mainTaskId, subTaskId, status } = await req.json();
	if (!mainTaskId || !subTaskId || !status) {
		return Response.json(
			{ message: 'Missing required fields.' },
			{ status: 400 }
		);
	}
	const session = await auth();
	if (!session) {
		return Response.json(
			{ message: 'You must be logged in to do this.' },
			{
				status: 401
			}
		);
	}
	const user = await User.findOne({ username: session.user.user_name });
	const userId = user?._id;
	if (!userId) {
		return Response.json({ message: 'User not found.' }, { status: 404 });
	}
	const subtask = await Tasks.updateOne(
		{
			_id: mainTaskId,
			'subTasks._id': subTaskId,
			owner: userId
		},
		{
			$set: { 'subTasks.$.status': status }
		}
	);
	if (subtask.matchedCount === 0) {
		return Response.json({ message: 'Subtask not found.' }, { status: 404 });
	}
	return Response.json({ message: 'Subtask updated successfully' });
}
