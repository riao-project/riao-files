import { Migration, MigrationRunner } from '@riao/dbal';
import { DatabaseSqlite } from '@riao/sqlite';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

export interface FileOptions {
	db?: DatabaseSqlite;
	filepath: string;
}

export abstract class File {
	public readonly db: DatabaseSqlite;
	public readonly filepath: string;

	public constructor(options: FileOptions) {
		this.db = options.db ?? new DatabaseSqlite();
		this.filepath = options.filepath;
	}

	public async init(): Promise<void> {
		mkdirSync(dirname(this.filepath), { recursive: true });
		this.db.name = this.filepath;
		await this.db.init({
			connectionOptions: { ...this.db.env, database: this.filepath },
			useSchemaCache: false,
		});

		await this.migrate();
	}

	public abstract getMigrations(): Promise<Record<string, Migration>>;

	public async migrate(): Promise<void> {
		const runner = new MigrationRunner(this.db);
		const migrations = await this.getMigrations();

		await runner.run(migrations, () => {});
	}
}
