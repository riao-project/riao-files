/* eslint-disable no-console */
import { TestFile } from '../test/test-file';

export async function saveUserFile(
	dbPath: string,
	username: string
): Promise<void> {
	const file = new TestFile({ filepath: dbPath });
	await file.init();

	const repo = file.db.getQueryRepository({ table: 'users' });
	await repo.insertOne({ record: { username } });

	console.log(`User "${username}" saved to file "${dbPath}".`);
}

saveUserFile('./examples/example-file.db', 'exampleuser').catch((error) => {
	console.error(error);
	process.exit(1);
});
