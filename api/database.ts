import Database from 'bun:sqlite'

const db = Database.open('./database.sqlite')

export default db
