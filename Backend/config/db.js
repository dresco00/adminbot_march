import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../adminbot.db')

const sqlite = sqlite3.verbose()
const database = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database at:', dbPath)
  }
})

// Wrap database methods to return promises
const db = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        database.all(sql, params, (err, rows) => {
          if (err) reject(err)
          else resolve([rows || []])
        })
      } else {
        database.run(sql, params, function(err) {
          if (err) reject(err)
          else resolve([{ lastID: this.lastID, changes: this.changes }])
        })
      }
    })
  }
}

export default db
