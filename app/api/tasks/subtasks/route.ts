import { auth } from '@/auth';
import Tasks from '@/models/Tasks';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
	await dbConnect();
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
	const userId = session.user.userId;
	try {
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
	await dbConnect();
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
	const userId = session.user.userId;
	try {
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
	} catch (error) {
		return Response.json(
			{ message: 'Subtask deletion failed' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	await dbConnect();
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
	const userId = session.user.userId;
	try {
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
	} catch (error) {
		return Response.json({ message: 'Subtask update failed' }, { status: 500 });
	}
}

export async function PATCH(req: Request) {
	await dbConnect();
	const { mainTaskId, subTaskId, title } = await req.json();
	if (!mainTaskId || !subTaskId || !title) {
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
	const userId = session.user.userId;
	try {
		const subtask = await Tasks.updateOne(
			{
				_id: mainTaskId,
				'subTasks._id': subTaskId,
				owner: userId
			},
			{
				$set: { 'subTasks.$.title': title }
			}
		);
		if (subtask.matchedCount === 0) {
			return Response.json({ message: 'Subtask not found.' }, { status: 404 });
		}
		return Response.json({ message: 'Subtask updated successfully' });
	} catch (error) {
		return Response.json({ message: 'Subtask update failed' }, { status: 500 });
	}
}
