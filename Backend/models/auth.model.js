import db from "../config/db.js"

export const FindUserByEmail = async (correo)=>{

    const [rows] = await db.query("SELECT id, nombres, apellidos, password_hash FROM usuarios WHERE correo = ? ", [correo])

    return rows[0];
}