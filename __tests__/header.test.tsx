import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import * as auth from '@/auth';

test('unauthenticated user sees login button', async () => {
	//@ts-ignore
	vi.spyOn(auth, 'auth').mockImplementation(async () => null);
	const page = await Header();
	render(page);
	expect(screen.getByText('Next Tasks')).toBeDefined();
	expect(screen.getByText('Login')).toBeDefined();
});

test('authenticated user sees welcome message and logout button', async () => {
	//@ts-ignore
	vi.spyOn(auth, 'auth').mockImplementation(async () => ({
		user: { user_name: 'test', role: 'user' }
	}));
	const page = await Header();
	render(page);
	expect(screen.getByText('Welcome, test')).toBeDefined();
	expect(screen.queryByText('Admin')).toBeNull();
	expect(screen.getByText('Logout')).toBeDefined();
});

test('authenticated user sees admin button if admin', async () => {
	//@ts-ignore
	vi.spyOn(auth, 'auth').mockImplementation(async () => ({
		user: { user_name: 'admin user', role: 'admin' }
	}));
	const page = await Header();
	render(page);
	expect(screen.getByText('Welcome, admin user')).toBeDefined();
	expect(screen.getByText('Admin')).toBeDefined();
	expect(screen.getByText('Logout')).toBeDefined();
});
