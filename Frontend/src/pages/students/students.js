import { obtenerUsuario } from "../../shared/js/storage.js"
import { request } from "../../shared/js/api.js"

const user = obtenerUsuario()
if (!user) window.location.href = '/index.html'

let allStudents = []

const elements = {
    modal: document.getElementById('studentModal'),
    form: document.getElementById('studentForm'),
    filterInput: document.getElementById('filterInput'),
    gradeFilter: document.getElementById('gradeFilter'),
    tableBody: document.getElementById('studentsTableBody'),
    emptyState: document.getElementById('emptyState'),
    tableContainer: document.querySelector('.table-container')
}

const renderStudents = (students) => {
    if (students.length === 0) {
        elements.tableContainer.classList.add('hidden')
        elements.emptyState.classList.remove('hidden')
        return
    }

    elements.tableContainer.classList.remove('hidden')
    elements.emptyState.classList.add('hidden')

    elements.tableBody.innerHTML = students.map((s, i) => `
        <tr style="animation: slideIn 0.3s ease forwards ${i * 0.05}s; opacity: 0;">
            <td><strong>${s.codigo_estudiante || '-'}</strong></td>
            <td>${s.nombres}</td>
            <td>${s.apellidos}</td>
            <td>${s.numero_documento}</td>
            <td><span class="badge">Grado ${s.grado}</span></td>
            <td>${s.anio_lectivo}</td>
            <td>
                <button class="btn-action edit-btn" data-id="${s.id}">Edit</button>
                <button class="btn-action delete-btn" data-id="${s.id}">Del</button>
            </td>
        </tr>
    `).join('')
}

const filterData = () => {
    const search = elements.filterInput.value.toLowerCase()
    const grade = elements.gradeFilter.value
    
    const filtered = allStudents.filter(s => {
        const matchSearch = Object.values(s).some(v => String(v).toLowerCase().includes(search))
        const matchGrade = grade === '' || s.grado == grade
        return matchSearch && matchGrade
    })
    renderStudents(filtered)
}

const loadStudents = async () => {
    try {
        elements.tableBody.innerHTML = '<tr><td colspan="7">Sincronizando base de datos...</td></tr>'
        const data = await request('/student')
        allStudents = Array.isArray(data) ? data : data.data || []
        renderStudents(allStudents)
    } catch (error) {
        elements.tableBody.innerHTML = '<tr><td colspan="7" style="color:red">Error de conexión con el servidor</td></tr>'
    }
}

// Eventos
document.getElementById('addStudentBtn').onclick = () => elements.modal.classList.remove('hidden')
document.getElementById('closeModalBtn').onclick = () => elements.modal.classList.add('hidden')
elements.filterInput.oninput = filterData
elements.gradeFilter.onchange = filterData

elements.form.onsubmit = async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('button[type="submit"]')
    btn.innerText = 'Guardando...'
    
    try {
        const payload = Object.fromEntries(new FormData(e.target))
        await request('/student', { method: 'POST', body: JSON.stringify(payload) })
        elements.modal.classList.add('hidden')
        loadStudents()
    } catch (error) {
        alert('Error: ' + error.message)
    } finally {
        btn.innerText = 'Guardar Registro'
    }
}

document.addEventListener('DOMContentLoaded', loadStudents)