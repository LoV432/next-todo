import User from '@/models/User';
import dbConnect from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
	try {
		const session = await auth();
		if (!session || !session.user) {
			return new Response(JSON.stringify('Unauthorized'), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		if (session.user.role !== 'admin') {
			return new Response(JSON.stringify('Unauthorized'), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		await dbConnect();
		const users = await User.find({}).select('-password');
		return new Response(JSON.stringify(users), {
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
