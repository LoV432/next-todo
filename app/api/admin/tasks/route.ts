import { getTasks } from '@/lib/get_tasks';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
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
		const customUserId = request.nextUrl.searchParams.get('customUserId');
		if (!customUserId || customUserId.length === 0) {
			return new Response(JSON.stringify('Custom user id not provided'), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		const tasks = await getTasks(customUserId);
		if ('error' in tasks) {
			return Response.json({ error: tasks.error }, { status: tasks.status });
		}
		return Response.json(tasks);
	} catch (error) {
		return Response.json({ message: 'Task fetching failed' }, { status: 500 });
	}
}
