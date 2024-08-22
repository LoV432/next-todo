import User from '@/models/User';
import { compare } from 'bcrypt';
import dbConnect from './db';
import { ObjectId } from 'mongoose';

export async function authUser(username: string, password: string) {
	await dbConnect();
	const user = (await User.findOne({ username })) as {
		username: string;
		password: string;
		role: string;
		email: string;
		_id: ObjectId;
	} | null;
	if (!user) {
		return null;
	}
	const isMatch = await compare(password, user.password);
	if (!isMatch) {
		return null;
	}
	return {
		user_name: user.username,
		role: user.role,
		userId: user._id.toString()
	};
}
