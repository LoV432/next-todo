import User from '@/models/User';
import Tasks from '@/models/Tasks';
import dbConnect from '@/lib/db';
import { auth } from '@/auth';

export async function DELETE(req: Request) {
	try {
		const session = await auth();
		if (!session || !session.user || session.user.role !== 'admin') {
			return new Response(JSON.stringify('Unauthorized'), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		await dbConnect();
		const { id } = await req.json();
		if (!id) {
			return new Response(JSON.stringify('Missing required fields'), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return new Response(JSON.stringify('User not found'), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		const tasks = await Tasks.deleteMany({ owner: id });
		return new Response(JSON.stringify('User deleted'), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
