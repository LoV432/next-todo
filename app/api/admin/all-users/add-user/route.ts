import User from '@/models/User';
import dbConnect from '@/lib/db';
import { auth } from '@/auth';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
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
		const { name, email, role, password } = await req.json();
		if (!name || !email || !role || !password) {
			return new Response(JSON.stringify('Missing required fields'), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		const hashedPassword = await hash(password, 10);
		const user = new User({
			username: name,
			email,
			role,
			password: hashedPassword
		});
		await user.save();
		return new Response(JSON.stringify('User added'), {
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
