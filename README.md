# @riao/files

Save and load files from your application, with the power of typescript, sql and riao.

## Features

- **SQLite File Management**: Create and manage SQLite files with a simple, object-oriented interface
- **Automated Migrations**: Built-in migration system to handle file schema changes
- **Type Safety**: Full TypeScript support with type-safe database operations
- **Directory Creation**: Automatically creates necessary directories for database files
- **Extensible**: Abstract base class allows for custom file implementations with specific schemas

## Installation

```bash
npm install @riao/files
```

## Quick Start

### 1. Create a Custom File Class

Extend the `File` class and define your database migrations:

```typescript
import { File, FileOptions } from '@riao/files';
import { Migration } from '@riao/dbal';
import { BigIntKeyColumn, UsernameColumn } from '@riao/dbal/column-pack';

export class UserFile extends File {
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
```

### 2. Use Your File Class

```typescript
import { UserFile } from './user-file';

async function saveUser() {
  // Create a new file instance
  const userFile = new UserFile({ filepath: './data/users.db' });
  
  // Initialize the file (creates directories, connects to DB, runs migrations)
  await userFile.init();
  
  // Use the database
  const repo = userFile.db.getQueryRepository({ table: 'users' });
  await repo.insertOne({ record: { username: 'john_doe' } });
  
  console.log('User saved successfully!');
}

async function loadUsers() {
  const userFile = new UserFile({ filepath: './data/users.db' });
  await userFile.init();
  
  const repo = userFile.db.getQueryRepository({ table: 'users' });
  const users = await repo.find({});
  
  console.log('Users:', users);
}

// Usage
saveUser().catch(console.error);
loadUsers().catch(console.error);
```

## Examples

Check out the [examples directory](./examples/) for more usage examples:

- [`save-file.ts`](./examples/save-file.ts) - Creating and saving data to a file
- [`load-file.ts`](./examples/load-file.ts) - Loading data from an existing file

## Contributing & Development

See [contributing.md](docs/contributing/contributing.md) for information on how to develop or contribute to this project!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
