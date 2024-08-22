import User from '@/models/User';
import Tasks from '@/models/Tasks';
import dbConnect from '@/lib/db';
import { put } from '@vercel/blob';
import { auth } from '@/auth';

export async function POST(req: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(req.url);
		const filename = searchParams.get('filename');
		const taskId = searchParams.get('taskId');

		if (!filename || !taskId) {
			return new Response(
				JSON.stringify({ message: 'Missing required fields.' }),
				{ status: 400 }
			);
		}

		if (!req.body) {
			return new Response(
				JSON.stringify({ message: 'Missing file content.' }),
				{ status: 400 }
			);
		}

		const session = await auth();
		if (!session) {
			return new Response(
				JSON.stringify({ message: 'You must be logged in to do this.' }),
				{ status: 401 }
			);
		}

		const user = await User.findOne({ username: session.user.user_name });
		const userId = user?._id;
		if (!userId) {
			return new Response(JSON.stringify({ message: 'User not found.' }), {
				status: 404
			});
		}

		const task = await Tasks.findOne({ _id: taskId, owner: userId });
		if (!task) {
			return new Response(JSON.stringify({ message: 'Task not found.' }), {
				status: 404
			});
		}

		// Upload the file
		try {
			const blob = await put(filename, req.body, {
				access: 'public'
			});

			// Add the uploaded file's information to the task
			task.files.push({ filename, fileUrl: blob.url });
			await task.save();

			return new Response(
				JSON.stringify({
					message: 'File uploaded and saved to task successfully.'
				}),
				{ status: 200 }
			);
		} catch (error) {
			console.error(error);
			return new Response(JSON.stringify({ message: 'File upload failed.' }), {
				status: 500
			});
		}
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ message: 'An error occurred.' }), {
			status: 500
		});
	}
}

export async function DELETE(req: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(req.url);
		const fileId = searchParams.get('fileId');
		const taskId = searchParams.get('taskId');

		if (!fileId || !taskId) {
			return new Response(
				JSON.stringify({ message: 'Missing required fields.' }),
				{ status: 400 }
			);
		}

		const session = await auth();
		if (!session) {
			return new Response(
				JSON.stringify({ message: 'You must be logged in to do this.' }),
				{ status: 401 }
			);
		}

		const user = await User.findOne({ username: session.user.user_name });
		const userId = user?._id;
		if (!userId) {
			return new Response(JSON.stringify({ message: 'User not found.' }), {
				status: 404
			});
		}

		const task = await Tasks.findOne({ _id: taskId, owner: userId });
		if (!task) {
			return new Response(JSON.stringify({ message: 'Task not found.' }), {
				status: 404
			});
		}

		// Remove the file from the task
		task.files = task.files.filter(
			(file: { _id: string }) => file._id.toString() !== fileId
		);
		await task.save();

		return new Response(
			JSON.stringify({
				message: 'File removed from task successfully.'
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ message: 'An error occurred.' }), {
			status: 500
		});
	}
}
