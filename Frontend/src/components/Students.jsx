import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario } from '../shared/js/storage.js';
import { request } from '../shared/js/api.js';
import './Students.css';

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    const user = obtenerUsuario();
    if (!user) {
      navigate('/');
      return;
    }
    loadStudents();
  }, [navigate]);

  useEffect(() => {
    let filtered = students;
    if (filterText) {
      filtered = filtered.filter(student =>
        student.nombres.toLowerCase().includes(filterText.toLowerCase()) ||
        student.apellidos.toLowerCase().includes(filterText.toLowerCase()) ||
        student.numero_documento.includes(filterText)
      );
    }
    if (gradeFilter) {
      filtered = filtered.filter(student => student.grado === gradeFilter);
    }
    setFilteredStudents(filtered);
  }, [students, filterText, gradeFilter]);

  const loadStudents = async () => {
    try {
      const response = await request('/students', 'GET');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <main className="dashboard-wrapper">
      <div className="deco-blob"></div>

      <section className="students-main">
        <div className="students-header">
          <div className="header-content">
            <div className="status-indicator"></div>
            <div>
              <h2>Gestión de Estudiantes</h2>
              <p className="students-copy">Panel de control de registros académicos</p>
            </div>
          </div>
          <button onClick={handleBack} className="btn-secondary">← Volver al Dashboard</button>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, documento o código..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="">Todos los grados</option>
            {Array.from({ length: 11 }, (_, i) => i + 1).map(grade => (
              <option key={grade} value={grade.toString()}>Grado {grade}</option>
            ))}
          </select>
          <button className="btn-main">+ Agregar Estudiante</button>
        </div>

        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Documento</th>
                <th>Grado</th>
                <th>Año</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.codigo_estudiante}</td>
                  <td>{student.nombres}</td>
                  <td>{student.apellidos}</td>
                  <td>{student.numero_documento}</td>
                  <td>{student.grado}</td>
                  <td>{student.anio_lectivo}</td>
                  <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <p>No se encontraron registros en el sistema</p>
            <button className="btn-main">+ Crear primer registro</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Students;