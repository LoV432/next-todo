import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import Reminder from '@/models/Reminder';
import dbConnect from '@/lib/db';

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
		const { name, time } = await req.json();
		const userId = session.user.userId;

		try {
			const reminder = await Reminder.create({
				name,
				time,
				owner: userId
			});
			await reminder.save();
			return Response.json({ message: 'Reminder created successfully' });
		} catch (error) {
			return Response.json(
				{ message: 'Reminder creation failed' },
				{ status: 500 }
			);
		}
	} catch (error) {
		return Response.json(
			{ message: 'Reminder creation failed' },
			{ status: 500 }
		);
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
		const reminder = await Reminder.findOneAndDelete({
			_id: id,
			owner: userId
		});
		if (!reminder) {
			return Response.json({ message: 'Reminder not found.' }, { status: 404 });
		}
		return Response.json({ message: 'Reminder deleted successfully' });
	} catch (error) {
		console.error(error);
		return Response.json(
			{ message: 'Reminder deletion failed' },
			{ status: 500 }
		);
	}
}

export async function GET() {
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
		const userId = session.user.userId;
		const reminders = await Reminder.find({
			owner: userId,
			time: { $gt: new Date() }
		}).sort({ time: -1 });
		return Response.json(reminders);
	} catch (error) {
		return Response.json(
			{ message: 'Reminder fetching failed' },
			{ status: 500 }
		);
	}
}
