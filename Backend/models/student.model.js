import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM estudiantes');
  return rows;
};

export const create = async (data) => {
  console.log(data)
  const { id, codigo_estudiante,
     nombres, apellidos, tipo_documento,
      numero_documento, fecha_nacimiento, grado, anio_lectivo } =
    data;

  const [result] = await db.query(
    `INSERT INTO estudiantes (id, codigo_estudiante,
     nombres, apellidos, tipo_documento,
      numero_documento, fecha_nacimiento, grado, anio_lectivo) VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, codigo_estudiante,
     nombres, apellidos, tipo_documento,
      numero_documento, fecha_nacimiento, grado, anio_lectivo]
  );
};
