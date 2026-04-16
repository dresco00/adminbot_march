import db from "config/db.js"

export const findUserByEmail = async (email) => {

    const [rows] = await db.query("SELECT id, nombres, apellidos, password_hash FROM usuarios WHERE email = ?", [email]);
    return rows[0];
}