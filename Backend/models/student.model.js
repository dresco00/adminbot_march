import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM estudiantes ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM estudiantes WHERE id = ?', [id]);
  return rows[0] || null;
};

export const create = async (data) => {
  const { codigo, nombres, apellidos, documento, grado, anio, asistencia = 0, notas = 0, actividades = 0, participacion = 0 } = data;
  
  const [result] = await db.query(
    `INSERT INTO estudiantes (codigo, nombres, apellidos, documento, grado, anio, asistencia, notas, actividades, participacion) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [codigo, nombres, apellidos, documento, grado, anio, asistencia, notas, actividades, participacion]
  );
  return result;
};

export const update = async (id, data) => {
  const { codigo, nombres, apellidos, documento, grado, anio, asistencia, notas, actividades, participacion } = data;
  
  const [result] = await db.query(
    `UPDATE estudiantes SET codigo = ?, nombres = ?, apellidos = ?, documento = ?, grado = ?, anio = ?, asistencia = ?, notas = ?, actividades = ?, participacion = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [codigo, nombres, apellidos, documento, grado, anio, asistencia, notas, actividades, participacion, id]
  );
  return result;
};

export const remove = async (id) => {
  const [result] = await db.query('DELETE FROM estudiantes WHERE id = ?', [id]);
  return result;
};
