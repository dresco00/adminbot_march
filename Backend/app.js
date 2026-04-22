import express from "express";
import bcrypt from "bcrypt"

import studenRoutes from './routes/students.route.js';
import acudienteRoutes from './routes/acudientes.route.js';
import pagoRoutes from './routes/pagos.route.js';
import usuarioRoutes from './routes/usuarios.route.js';
import asistenciaRoutes from './routes/asistencias.route.js';
import notificacionRoutes from './routes/notificaciones.route.js';
import authRoutes from "./routes/auth.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"

const app = express();
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
const PORT = 3000
//Rutas
app.use('/api', studenRoutes);
app.use('/api', acudienteRoutes);
app.use('/api', pagoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', asistenciaRoutes);
app.use('/api', notificacionRoutes);
app.use("/api",authRoutes)
app.use("/api",dashboardRoutes)

//ruta base
app.get("/", (req, res)=>{
    res.send("Api funcionando")
})

// const passwordlist = [
//     "joel123",
//     "juan123",
//     "andres123",
//     "alejandro123",
//     "guillermo123"
// ]

// for(let i = 0; i < passwordlist.length; i++){
//     const hash = await bcrypt.hash(passwordlist[i], 10)
//     console.log(` Contraseña : ${passwordlist[i]}, hash: ${hash}`)

// }
//  Contraseña : joel123, hash: $2b$10$F1oI.0dmB9mOrERMfD4d1.B53faodgtF.d3MNjs5UDB5ondE9ZSm2
//  Contraseña : juan123, hash: $2b$10$xrmBSu87.9D49R3SfWaQe.r6Fma.vzLAlYDKQInGqWWVVicuJBBJG
//  Contraseña : andres123, hash: $2b$10$2/.a1car1DEKKq9ckLdUDeQuR3NAGudkpzSoyCrR6pkmaNhszq5py
//  Contraseña : alejandro123, hash: $2b$10$vDOELZ5QNW.VwjoTJTKdNu4mj7WzPnzxH3U3sZtur7Tjpo0K8Wg62
//  Contraseña : guillermo123, hash: $2b$10$GO0OHumgEBkqv7xKbRGcxexRPuSTizBQh21oR67ozyE2fLrKLZSAe
// Servidor corriendo LocalHost...


app.listen(PORT, ()=>{
    console.log("Servidor corriendo LocalHost...")
})