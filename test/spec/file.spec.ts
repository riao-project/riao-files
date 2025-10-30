import { existsSync, rmSync } from 'fs';
import { TestFile } from '../test-file';

describe('File', () => {
	beforeAll(() => {
		rmSync('./test/fs/new-file.db', { force: true });
		rmSync('./test/fs/save-load-file.db', { force: true });
	});

	it('can load from an existing file', async () => {
		const file = new TestFile({
			filepath: './examples/example-file.db',
		});
		await file.init();

		const repo = file.db.getQueryRepository({ table: 'users' });
		const user = await repo.findOne({
			where: { username: 'exampleuser' },
		});

		expect(user).not.toBeNull();
		expect(user!['username']).toBe('exampleuser');
	});

	it('can save a new file', async () => {
		const file = new TestFile({ filepath: './test/fs/new-file.db' });
		await file.init();

		const repo = file.db.getQueryRepository({ table: 'users' });
		await repo.insertOne({ record: { username: 'testuser' } });

		expect(existsSync('./test/fs/new-file.db')).toBe(true);
	});

	it('can save and load a file', async () => {
		const filepath = './test/fs/save-load-file.db';
		const file = new TestFile({ filepath });
		await file.init();

		const repo = file.db.getQueryRepository({ table: 'users' });
		await repo.insertOne({ record: { username: 'saveuser' } });

		const file2 = new TestFile({ filepath });
		await file2.init();
		const repo2 = file2.db.getQueryRepository({ table: 'users' });
		const user = await repo2.findOne({ where: { username: 'saveuser' } });

		expect(user).not.toBeNull();
		expect(user!['username']).toBe('saveuser');
	});
});
