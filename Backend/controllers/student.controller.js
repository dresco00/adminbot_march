import { getAll, getById, create, update, remove } from '../models/student.model.js';

export const getStudent = async (req, res) => {
  try {
    const data = await getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes', err: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getById(id);
    if (!data) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiante', err: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { codigo, nombres, apellidos, documento, grado, anio, asistencia = 0, notas = 0, actividades = 0, participacion = 0 } = req.body;
    
    if (!codigo || !nombres || !apellidos || !documento || !grado || !anio) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Limpiar NaN usando Number() || 0
    const asistenciaNum = Number(asistencia) || 0;
    const notasNum = Number(notas) || 0;
    const actividadesNum = Number(actividades) || 0;
    const participacionNum = Number(participacion) || 0;

    const result = await create({ 
      codigo, 
      nombres, 
      apellidos, 
      documento, 
      grado, 
      anio, 
      asistencia: asistenciaNum, 
      notas: notasNum, 
      actividades: actividadesNum, 
      participacion: participacionNum 
    });
    res.status(201).json({ message: 'Estudiante creado', id: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear estudiante', err: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombres, apellidos, documento, grado, anio, asistencia = 0, notas = 0, actividades = 0, participacion = 0 } = req.body;
    
    if (!codigo || !nombres || !apellidos || !documento || !grado || !anio) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const student = await getById(id);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Limpiar NaN usando Number() || 0
    const asistenciaNum = Number(asistencia) || 0;
    const notasNum = Number(notas) || 0;
    const actividadesNum = Number(actividades) || 0;
    const participacionNum = Number(participacion) || 0;

    await update(id, { 
      codigo, 
      nombres, 
      apellidos, 
      documento, 
      grado, 
      anio, 
      asistencia: asistenciaNum, 
      notas: notasNum, 
      actividades: actividadesNum, 
      participacion: participacionNum 
    });
    res.status(200).json({ message: 'Estudiante actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estudiante', err: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await getById(id);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    await remove(id);
    res.status(200).json({ message: 'Estudiante eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar estudiante', err: error.message });
  }
};
