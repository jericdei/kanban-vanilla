import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import db from './database'

async function getFiles(path: string) {
    try {
        const names = await readdir(path)

        return names.map((fn) => join(path, fn))
    } catch (err) {
        console.error(err)
    }
}

const migrationFiles = await getFiles('migrations')

type Count = {
    count: number
}

const tables = db
    .query('SELECT COUNT(*) as count FROM sqlite_schema')
    .get() as Count

if (tables.count === 0) {
    db.query(
        `
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file VARCHAR(255) NOT NULL,
            migrated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `,
    ).run()
}

if (!migrationFiles) {
    console.error('Nothing to migrate.')

    process.exit()
}

for (const path of migrationFiles) {
    const file = db.query('SELECT id from migrations WHERE file = ?').get(path)

    if (file) {
        console.info('Already migrated: ', path)
        continue
    }

    let queries: string[]

    const text = await Bun.file(path).text()

    if (text.includes(';')) {
        queries = text.split(';')
    } else {
        queries = [text]
    }

    for (const query of queries) {
        if (query.length > 0) {
            db.run(query)
        }
    }

    db.prepare('INSERT INTO migrations (file) VALUES (?)').run(path)

    console.log('Migration successful for: ' + path)
}
