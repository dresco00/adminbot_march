import bcrypt from "bcrypt"

import { findUserByEmail } from "..models/auth.model.js"

export const finduserbyemail = async (email) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                ok: false,
                message: "datos incompletos"
            })
        }

        const user = await findUserByEmail(email);

        if(!user){
            return res.status(401).json({
                message: "credenciales incorrectas"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if(!validPassword){
            return res.status(401).json({
                message: "credenciales incorrectas"
            })
        }

        return res.status(200).json({
            ok: true,
            message: "usuario autenticado",
            user: {
                id: user.id,
                name: user.nombres,
                email: user.email
            }
        })

    }
    catch (err){
        return res.status(500).json({
            ok: false,
            message: "error del servidor",
            error: err
        })
    }
}