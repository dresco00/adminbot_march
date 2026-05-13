import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario } from '../shared/js/storage.js';
import './Students.css';

const API_URL = 'http://localhost:3000/api';

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombres: '',
    apellidos: '',
    documento: '',
    grado: '1',
    anio: new Date().getFullYear().toString(),
    asistencia: 0,
    notas: 0,
    actividades: 0,
    participacion: 0,
  });

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
        student.documento.includes(filterText) ||
        student.codigo.includes(filterText)
      );
    }
    if (gradeFilter) {
      filtered = filtered.filter(student => student.grado === gradeFilter);
    }
    setFilteredStudents(filtered);
  }, [students, filterText, gradeFilter]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error('Error cargando estudiantes');
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading students:', error);
      alert('Error al cargar estudiantes');
    }
  };

  const isCertificable = (student) => {
    return (
      student.asistencia >= 80 &&
      student.notas >= 3.0 &&
      student.actividades >= 80 &&
      student.participacion >= 70
    );
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      codigo: '',
      nombres: '',
      apellidos: '',
      documento: '',
      grado: '1',
      anio: new Date().getFullYear().toString(),
      asistencia: 0,
      notas: 0,
      actividades: 0,
      participacion: 0,
    });
    setShowModal(true);
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setFormData({
      codigo: student.codigo,
      nombres: student.nombres,
      apellidos: student.apellidos,
      documento: student.documento,
      grado: student.grado,
      anio: student.anio,
      asistencia: student.asistencia || 0,
      notas: student.notas || 0,
      actividades: student.actividades || 0,
      participacion: student.participacion || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/students/${editingId}` : `${API_URL}/students`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error guardando estudiante');
      setShowModal(false);
      loadStudents();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar estudiante');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este estudiante?')) return;
    try {
      const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error eliminando estudiante');
      loadStudents();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar estudiante');
    }
  };

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'asistencia' || name === 'actividades' || name === 'participacion' ? Number(value) || 0 : 
              name === 'notas' ? Number(value) || 0 : value,
    }));
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
          <button onClick={handleAddClick} className="btn-main">+ Agregar Estudiante</button>
        </div>

        {filteredStudents.length > 0 ? (
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
                  <th>Asistencia</th>
                  <th>Notas</th>
                  <th>Actividades</th>
                  <th>Participación</th>
                  <th>Certificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.codigo}</td>
                    <td>{student.nombres}</td>
                    <td>{student.apellidos}</td>
                    <td>{student.documento}</td>
                    <td>{student.grado}</td>
                    <td>{student.anio}</td>
                    <td>{student.asistencia}%</td>
                    <td>{parseFloat(student.notas).toFixed(2)}</td>
                    <td>{student.actividades}%</td>
                    <td>{student.participacion}%</td>
                    <td>{isCertificable(student) ? '✓ Certificable' : '✗ No certificable'}</td>
                    <td>
                      <button onClick={() => handleEditClick(student)} className="btn-action">Editar</button>
                      <button onClick={() => handleDelete(student.id)} className="btn-action btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <p>No se encontraron registros en el sistema</p>
            <button onClick={handleAddClick} className="btn-main">+ Crear primer registro</button>
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="input-group">
                  <label>Código</label>
                  <input type="text" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Nombres</label>
                  <input type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Apellidos</label>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Documento</label>
                  <input type="text" name="documento" value={formData.documento} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Grado</label>
                  <select name="grado" value={formData.grado} onChange={handleInputChange} required>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(grade => (
                      <option key={grade} value={grade.toString()}>{grade}°</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Año Lectivo</label>
                  <input type="text" name="anio" value={formData.anio} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Asistencia (%)</label>
                  <input type="number" name="asistencia" min="0" max="100" value={formData.asistencia} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Notas</label>
                  <input type="number" step="0.1" name="notas" min="0" max="5" value={formData.notas} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Actividades (%)</label>
                  <input type="number" name="actividades" min="0" max="100" value={formData.actividades} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Participación (%)</label>
                  <input type="number" name="participacion" min="0" max="100" value={formData.participacion} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-main">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Students;