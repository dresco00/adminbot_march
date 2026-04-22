import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'adminbot.db')

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
    return
  }

  console.log('Initializing SQLite database with AdminBot schema...\n')

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'admin',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err)
    else console.log('✓ Table users created/exists')
  })

  // Create guardians table
  db.run(`
    CREATE TABLE IF NOT EXISTS guardians (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      whatsapp_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating guardians table:', err)
    else console.log('✓ Table guardians created/exists')
  })

  // Create students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      student_code TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      document_type TEXT,
      document_number TEXT UNIQUE,
      birth_date DATE,
      grade TEXT,
      school_year INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating students table:', err)
    else console.log('✓ Table students created/exists')
  })

  // Create student_guardians table
  db.run(`
    CREATE TABLE IF NOT EXISTS student_guardians (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      guardian_id TEXT NOT NULL,
      relationship TEXT,
      is_primary INTEGER NOT NULL DEFAULT 0,
      is_payment_responsible INTEGER NOT NULL DEFAULT 1,
      receives_notifications INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, guardian_id),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating student_guardians table:', err)
    else console.log('✓ Table student_guardians created/exists')
  })

  // Create charge_types table
  db.run(`
    CREATE TABLE IF NOT EXISTS charge_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating charge_types table:', err)
    else console.log('✓ Table charge_types created/exists')
  })

  // Create accounts_receivable table
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts_receivable (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      charge_type_id TEXT NOT NULL,
      period TEXT NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      outstanding_balance DECIMAL(12,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (charge_type_id) REFERENCES charge_types(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating accounts_receivable table:', err)
    else console.log('✓ Table accounts_receivable created/exists')
  })

  // Create payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      account_receivable_id TEXT NOT NULL,
      recorded_by_user_id TEXT,
      payment_date DATETIME NOT NULL,
      amount_paid DECIMAL(12,2) NOT NULL,
      payment_method TEXT NOT NULL,
      reference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_receivable_id) REFERENCES accounts_receivable(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating payments table:', err)
    else console.log('✓ Table payments created/exists')
  })

  // Create whatsapp_notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS whatsapp_notifications (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      guardian_id TEXT NOT NULL,
      account_receivable_id TEXT,
      destination_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      sent_at DATETIME,
      delivery_status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (account_receivable_id) REFERENCES accounts_receivable(id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating whatsapp_notifications table:', err)
    else console.log('✓ Table whatsapp_notifications created/exists')
  })

  // Create attendance table
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      attendance_date DATE NOT NULL,
      status TEXT NOT NULL,
      check_in_time TIME,
      check_out_time TIME,
      observation TEXT,
      recorded_by_user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, attendance_date),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating attendance table:', err)
    else console.log('✓ Table attendance created/exists')
  })

  // Insert test users
  const testUsers = [
    { first_name: 'Juan', last_name: 'Pérez', email: 'juan.perez@gmail.com', password: '123456', role: 'admin' },
    { first_name: 'María', last_name: 'Gómez', email: 'maria.gomez@gmail.com', password: 'maria123', role: 'docente' },
    { first_name: 'Carlos', last_name: 'Ramírez', email: 'carlos.ramirez@gmail.com', password: 'carlos123', role: 'coordinador' },
    { first_name: 'Laura', last_name: 'Martínez', email: 'laura.martinez@gmail.com', password: 'laura123', role: 'docente' },
    { first_name: 'Andrés', last_name: 'Torres', email: 'andres.torres@gmail.com', password: 'admin123', role: 'admin' }
  ]

  for (const user of testUsers) {
    const hash = await bcrypt.hash(user.password, 10)
    const id = uuidv4()
    db.run(
      'INSERT OR IGNORE INTO users (id, first_name, last_name, email, password_hash, role, phone, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.first_name, user.last_name, user.email, hash, user.role, '3001234567', 1],
      (err) => {
        if (err) console.error('Error inserting user:', err)
        else console.log(`✓ User ${user.email} created/exists`)
      }
    )
  }

  // Insert test students
  const testStudents = [
    { student_code: 'STU001', first_name: 'Ana', last_name: 'García', grade: '10A' },
    { student_code: 'STU002', first_name: 'Pedro', last_name: 'López', grade: '10B' },
    { student_code: 'STU003', first_name: 'María', last_name: 'Rodríguez', grade: '11A' },
    { student_code: 'STU004', first_name: 'Carlos', last_name: 'Martínez', grade: '11B' },
    { student_code: 'STU005', first_name: 'Laura', last_name: 'Hernández', grade: '12A' }
  ]

  for (const student of testStudents) {
    const id = uuidv4()
    db.run(
      'INSERT OR IGNORE INTO students (id, student_code, first_name, last_name, grade, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, student.student_code, student.first_name, student.last_name, student.grade, 'active'],
      (err) => {
        if (err) console.error('Error inserting student:', err)
        else console.log(`✓ Student ${student.first_name} created/exists`)
      }
    )
  }

  setTimeout(() => {
    console.log('\n✅ Database initialized successfully!')
    console.log('\nTest credentials:')
    testUsers.forEach(u => {
      console.log(`  Email: ${u.email} | Password: ${u.password}`)
    })
    db.close()
  }, 1000)
})