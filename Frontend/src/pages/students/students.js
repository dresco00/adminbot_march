const addStudentBtn = document.getElementById('addStudentBtn');
const addStudentBtnEmpty = document.getElementById('addStudentBtnEmpty');
const backButton = document.getElementById('backButton');
const modal = document.getElementById('studentModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentForm = document.getElementById('studentForm');
const modalTitle = document.getElementById('modalTitle');
const filterInput = document.getElementById('filterInput');
const gradeFilter = document.getElementById('gradeFilter');

let editingId = null;

function openModal(student = null) {
  modal.classList.remove('hidden');
  if (student) {
    modalTitle.textContent = 'Editar Estudiante';
    editingId = student.id;
    studentForm.codigo.value = student.codigo || '';
    studentForm.nombres.value = student.nombres || '';
    studentForm.apellidos.value = student.apellidos || '';
    studentForm.documento.value = student.documento || '';
    studentForm.grado.value = student.grado || '1';
    studentForm.anio.value = student.anio || '';
    studentForm.asistencia.value = student.asistencia || 0;
    studentForm.notas.value = student.notas || 0;
    studentForm.actividades.value = student.actividades || 0;
    studentForm.participacion.value = student.participacion || 0;
  } else {
    modalTitle.textContent = 'Nuevo Estudiante';
    editingId = null;
    studentForm.reset();
    studentForm.asistencia.value = 0;
    studentForm.notas.value = 0;
    studentForm.actividades.value = 0;
    studentForm.participacion.value = 0;
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

const API_BASE = 'http://localhost:3000/api';

async function submitStudent(event) {
  event.preventDefault();

  const asistenciaVal = Number(studentForm.asistencia.value) || 0;
  const notasVal = Number(studentForm.notas.value) || 0;
  const actividadesVal = Number(studentForm.actividades.value) || 0;
  const participacionVal = Number(studentForm.participacion.value) || 0;

  const payload = {
    codigo: studentForm.codigo.value.trim(),
    nombres: studentForm.nombres.value.trim(),
    apellidos: studentForm.apellidos.value.trim(),
    documento: studentForm.documento.value.trim(),
    grado: studentForm.grado.value,
    anio: studentForm.anio.value.trim(),
    asistencia: asistenciaVal,
    notas: notasVal,
    actividades: actividadesVal,
    participacion: participacionVal,
  };

  try {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/students/${editingId}` : `${API_BASE}/students`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || data.error || 'Ocurrió un error al guardar el estudiante.');
      return;
    }

    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión. Verifica que el servidor esté corriendo.');
  }
}

async function deleteStudent(studentId) {
  if (!confirm('¿Deseas eliminar este estudiante?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/students/${studentId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || data.error || 'No se pudo eliminar el estudiante.');
      return;
    }

    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión. Verifica que el servidor esté corriendo.');
  }
}

function attachRowActions() {
  document.querySelectorAll('.editBtn').forEach((button) => {
    button.addEventListener('click', () => {
      const student = JSON.parse(button.dataset.student);
      openModal(student);
    });
  });

  document.querySelectorAll('.deleteBtn').forEach((button) => {
    button.addEventListener('click', () => {
      deleteStudent(button.dataset.id);
    });
  });
}

function filterTable() {
  const searchTerm = filterInput.value.toLowerCase();
  const gradeValue = gradeFilter.value;

  document.querySelectorAll('#studentsTableBody tr').forEach((row) => {
    const values = Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent.toLowerCase());
    const matchesSearch = values.some((value) => value.includes(searchTerm));
    const gradeCell = row.querySelector('td:nth-child(5)').textContent;
    const matchesGrade = !gradeValue || gradeCell === gradeValue;
    row.style.display = matchesSearch && matchesGrade ? '' : 'none';
  });
}

if (addStudentBtn) {
  addStudentBtn.addEventListener('click', () => openModal());
}

if (addStudentBtnEmpty) {
  addStudentBtnEmpty.addEventListener('click', () => openModal());
}

if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = '/dashboard';
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', closeModal);
}

if (studentForm) {
  studentForm.addEventListener('submit', submitStudent);
}

if (filterInput) {
  filterInput.addEventListener('input', filterTable);
}

if (gradeFilter) {
  gradeFilter.addEventListener('change', filterTable);
}

attachRowActions();
