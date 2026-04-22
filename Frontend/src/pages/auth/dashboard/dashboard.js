import { obtenerUsuario, cerrarSesion } from "../../../shared/js/storage.js"
import { request } from "../../../shared/js/api.js"

// Verificar si el usuario está logeado
const user = obtenerUsuario()
if (!user) {
    window.location.href = '/index.html'
}

// Mostrar el nombre del usuario
const userName = document.querySelector('.user-name')
if (userName && user) {
    userName.textContent = user.name || 'Usuario'
}

document.addEventListener('DOMContentLoaded', async () => {
    const logoutBtn = document.getElementById('logoutButton');
    const cards = document.querySelectorAll('.dashboard-card');

    // Cargar datos del dashboard
    try {
        const response = await request('/dashboard');
        const data = response.dashboard;
        
        // Actualizar las tarjetas con datos reales
        const resumenCard = cards[0];
        const asistenciaCard = cards[1];
        const pagosCard = cards[2];
        const usuariosCard = cards[3];
        
        resumenCard.querySelector('p').textContent = `Total estudiantes: ${data.totalStudents}`;
        asistenciaCard.querySelector('p').textContent = `Ausencias hoy: ${data.absencesToday}`;
        pagosCard.querySelector('p').textContent = `Pagos pendientes: ${data.pendingPayments}`;
        usuariosCard.querySelector('p').textContent = `Accede al listado de usuarios administradores.`;
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        // Mantener texto por defecto si falla
    }

    // Efecto de entrada secuencial
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(' + (index % 2 === 0 ? 0.5 : -0.5) + 'deg)';
        }, 100 * index);
    });

    // Manejo de Logout con confirmación estilizada
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿ESTÁ SEGURO DE QUE DESEA CERRAR LA SESIÓN DE ADMIN?')) {
            // Animación de salida
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                cerrarSesion()
                window.location.href = '/index.html'
            }, 500);
        }
    });

    // Simular que las tarjetas son botones de acción
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const section = card.querySelector('h3').innerText;
            console.log(`Navegando a: ${section}...`);
            // Aquí podrías disparar un router o cambiar el contenido
        });
    });
});