import bcrypt from "bcrypt"
//npm install bcrypt
import { FindUserByEmail } from "../models/auth.model.js"


export const login = async (req,res)=>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                ok: false,
                message: "Datos incompletos"
            })
        }

        const user = await FindUserByEmail(email)

        if(!user){
            return res.status(401).json({
                message: "Usuario no encontrado"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if(!validPassword){
            return res.status(401).json({
                message: "Contraseña incorrecta"
            })
        }

        return res.status(200).json({
            ok:true,
            message:"Login exitoso",
            user: {
                id: user.id,
                name: user.nombres,
                email: user.email
            }
        })
    }
    catch (err){
        return res.status(500).json({
            ok:false,
            message: "Error del servidor",
            error: err
        })
    }
}
/*
-- Contraseñas:
-- Juan: 123456
-- María: maria123
-- Carlos: carlos123
-- Laura: laura123
-- Andrés: admin123

INSERT INTO adminbot.usuarios 
(id, nombres, apellidos, correo, password_hash, telefono, rol, activo)
VALUES
(1, 'Juan', 'Pérez', 'juan.perez@gmail.com', '$2b$10$hash123456789', '3001234567', 'admin', 1),
(2, 'María', 'Gómez', 'maria.gomez@gmail.com', '$2b$10$hash123456789', '3012345678', 'docente', 1),
(3, 'Carlos', 'Ramírez', 'carlos.ramirez@gmail.com', '$2b$10$hash123456789', '3023456789', 'coordinador', 1),
(4, 'Laura', 'Martínez', 'laura.martinez@gmail.com', '$2b$10$hash123456789', '3034567890', 'docente', 1),
(5, 'Andrés', 'Torres', 'andres.torres@gmail.com', '$2b$10$hash123456789', '3045678901', 'admin', 1);
*/