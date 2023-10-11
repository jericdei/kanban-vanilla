import Database from 'bun:sqlite'

const db = Database.open('./database.sqlite', {
    create: true
})

export default db
