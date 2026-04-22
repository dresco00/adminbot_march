import db from "../config/db.js"

export const FindUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = ?",
    [email]
  )
  return rows[0]
}