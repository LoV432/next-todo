import { loadEnvConfig } from '@next/env';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
loadEnvConfig(process.cwd());
afterEach(() => {
	cleanup();
});
