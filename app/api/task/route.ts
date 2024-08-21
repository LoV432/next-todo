import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import Tasks from '@/models/Tasks';
import User from '@/models/User';

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
