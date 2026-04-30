import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'adminbot.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
    process.exit(1)
  }

  const userId = uuidv4()
  const email = 'admin@system.com'
  const passwordHash = '$2b$10$F1oI.0dmB9mOrERMfD4d1.B53faodgtF.d3MNjs5UDB5ondE9ZSm2'

  db.run(
    `INSERT INTO users (id, first_name, last_name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
    [userId, 'Admin', 'User', email, passwordHash, 'admin', 1],
    (err) => {
      if (err) {
        console.error('Error inserting user:', err.message)
        process.exit(1)
      }
      console.log('✓ Usuario insertado:', email)
      console.log('  Contraseña: joel123')
      db.close()
      process.exit(0)
    }
  )
})
