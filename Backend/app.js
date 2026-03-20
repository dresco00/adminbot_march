import express from "express";

import studenRoutes from './routes/students.route.js';
import acudienteRoutes from './routes/acudientes.route.js';
import pagoRoutes from './routes/pagos.route.js';
import usuarioRoutes from './routes/usuarios.route.js';
import asistenciaRoutes from './routes/asistencias.route.js';
import notificacionRoutes from './routes/notificaciones.route.js';

const app = express();
app.use(express.json())
const PORT = 3000
//Rutas
app.use('/api', studenRoutes);
app.use('/api', acudienteRoutes);
app.use('/api', pagoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', asistenciaRoutes);
app.use('/api', notificacionRoutes);

//ruta base
app.get("/", (req, res)=>{
    res.send("Api funcionando")
})

app.listen(PORT, ()=>{
    console.log("Servidor corriendo LocalHost...")
})