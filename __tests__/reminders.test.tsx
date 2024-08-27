import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { createRequest } from 'node-mocks-http';

import { GET, POST } from '@/app/api/reminders/route';
import * as auth from '@/auth';
import * as testDb from '@/db.vitest';

vi.mock('@/lib/db', () => ({
	__esModule: true,
	default: vi.fn().mockImplementation(() => Promise.resolve())
}));

beforeAll(async () => {
	try {
		await testDb.connect();
	} catch (error) {
		console.error('Failed to connect to test database:', error);
		throw error;
	}
});

afterEach(async () => {
	try {
		await testDb.clearDatabase();
	} catch (error) {
		console.error('Failed to clear database:', error);
	}
});

afterAll(async () => {
	try {
		await testDb.closeDatabase();
	} catch (error) {
		console.error('Failed to close test database connection:', error);
	}
});

test('User endpoint works as expected', async () => {
	try {
		//@ts-ignore
		vi.spyOn(auth, 'auth').mockImplementation(async () => ({
			user: {
				user_name: 'test',
				role: 'user',
				userId: '66cd1700916f6f81cd61f75e'
			}
		}));

		const postRequest = createRequest({
			method: 'POST',
			url: '/api/reminders',
			headers: {
				'Content-Type': 'application/json'
			},
			json: () => ({
				name: 'Test Reminder',
				time: '2026-01-01T00:00:00.000Z'
			})
		});
		const postResponse = await POST(postRequest as any);
		expect(postResponse.status).toBe(200);

		const getRequest = createRequest({ method: 'GET', url: '/api/reminders' });
		//@ts-ignore
		const getResponse = await GET(getRequest as any);
		expect(getResponse.status).toBe(200);
		expect(await getResponse.json()).toEqual([
			{
				_id: expect.any(String),
				name: 'Test Reminder',
				time: expect.any(String),
				owner: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				__v: expect.any(Number)
			}
		]);
	} catch (error) {
		console.error('Test failed:', error);
		throw error;
	}
});
