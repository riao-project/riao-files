/* eslint-disable no-console */
import { TestFile } from '../test/test-file';

export async function loadUserFile(dbPath: string): Promise<void> {
	const file = new TestFile({ filepath: dbPath });
	await file.init();

	const repo = file.db.getQueryRepository({ table: 'users' });
	const users = await repo.find({});

	console.log(`Users in file "${dbPath}":`, users);
}

loadUserFile('./examples/example-file.db').catch((error) => {
	console.error(error);
	process.exit(1);
});
