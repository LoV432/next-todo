import { hash } from 'bcrypt';
import User from '@/models/User';
import { NextRequest } from 'next/server';
import { MongoServerError } from 'mongodb';
import dbConnect from '@/lib/db';

export async function PUT(req: NextRequest) {
	try {
		await dbConnect();
		const { username, password, email } = await req.json();
		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			typeof email !== 'string' ||
			!username.length ||
			!password.length ||
			!email.length
		) {
			return new Response('Missing username, email or password', {
				status: 400
			});
		}
		if (!email.includes('@')) {
			// TODO: This is obviously not a good way to do this
			return new Response('Invalid email', { status: 400 });
		}
		const hashedPassword = await hash(password, 10);
		const newUser = new User({ username, password: hashedPassword, email });
		try {
			await newUser.save();
			return new Response('User created', { status: 201 });
		} catch (error) {
			if (error instanceof MongoServerError) {
				if (error.message.includes('E11000')) {
					return new Response('User already exists', { status: 400 });
				}
			}
			return new Response('Something went wrong', { status: 500 });
		}
	} catch (error) {
		return new Response('Something went wrong', { status: 500 });
	}
}
