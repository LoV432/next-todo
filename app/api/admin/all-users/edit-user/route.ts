import User from '@/models/User';
import dbConnect from '@/lib/db';
import { auth } from '@/auth';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
	try {
		await dbConnect();
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

		const { userId, name, email, role, password } = await request.json();
		let hashedPassword;
		if (password && password.length > 0) {
			hashedPassword = await hash(password, 10);
		}
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return new Response(JSON.stringify('User not found'), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		// Update user
		if (hashedPassword) {
			await User.updateOne(
				{ _id: userId },
				{
					$set: {
						username: name,
						email,
						role,
						password: hashedPassword
					}
				}
			);
		} else {
			await User.updateOne(
				{ _id: userId },
				{
					$set: {
						username: name,
						email,
						role
					}
				}
			);
		}
		return new Response(JSON.stringify('User updated'), {
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
