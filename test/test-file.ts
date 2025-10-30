import { File } from '../src';
import { BigIntKeyColumn, UsernameColumn } from '@riao/dbal/column-pack';
import { Migration } from '@riao/dbal';

export class TestFile extends File {
	public override async getMigrations(): Promise<Record<string, Migration>> {
		return {
			'create-users-table': new (class extends Migration {
				override async up(): Promise<void> {
					await this.ddl.createTable({
						name: 'users',
						columns: [BigIntKeyColumn, UsernameColumn],
					});
				}
			})(this.db),
		};
	}
}
