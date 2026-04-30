import { obtenerUsuario, cerrarSesion } from "../../../shared/js/storage.js"
import { request } from "../../../shared/js/api.js"

// 1. Verificación de Seguridad
const user = obtenerUsuario()
if (!user) {
    window.location.href = '/index.html'
}

// 2. Inicialización
const userName = document.querySelector('.user-name')
if (userName && user) {
    userName.textContent = user.name || 'Usuario'
}

document.addEventListener('DOMContentLoaded', async () => {
    const logoutBtn = document.getElementById('logoutButton');
    const cards = document.querySelectorAll('.dashboard-card');
    let summaryChart;

    // 3. Función para crear la gráfica Neo-Brutalista
    const initChart = (dataValues = [0, 0, 0, 0, 0, 0]) => {
        const ctx = document.getElementById('summaryChart').getContext('2d');
        summaryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['L', 'M', 'M', 'J', 'V', 'S'],
                datasets: [{
                    label: 'Actividad',
                    data: dataValues,
                    backgroundColor: '#760909',
                    borderColor: '#1a1a1a',
                    borderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: '#ddd' },
                        ticks: { font: { family: 'Space Grotesk', weight: 'bold' } }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { font: { family: 'Space Grotesk', weight: 'bold' } }
                    }
                }
            }
        });
    };

    // 4. Cargar datos de la API
    try {
        const response = await request('/dashboard');
        const data = response.dashboard;
        
        // Actualizar Textos
        document.getElementById('totalStudentsText').textContent = `Total estudiantes: ${data.totalStudents}`;
        document.getElementById('absencesText').textContent = `Ausencias hoy: ${data.absencesToday}`;
        document.getElementById('paymentsText').textContent = `Pagos pendientes: ${data.pendingPayments}`;
        
        // Inicializar gráfica con datos reales (suponiendo que data.weeklyActivity existe)
        const weeklyData = data.weeklyActivity || [12, 19, 15, 8, 22, 10];
        initChart(weeklyData);

    } catch (error) {
        console.error('Error cargando datos:', error);
        initChart([5, 10, 5, 2, 8, 3]); // Datos por defecto en caso de error
    }

    // 5. Animación de entrada
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = `translateY(0) rotate(${index % 2 === 0 ? 0.5 : -0.5}deg)`;
        }, 100 * index);
    });

    // 6. Logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿ESTÁ SEGURO DE QUE DESEA CERRAR LA SESIÓN DE ADMIN?')) {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                cerrarSesion();
                window.location.href = '/index.html';
            }, 500);
        }
    });

    // 7. Navegación de tarjetas
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'CANVAS') {
                const section = card.querySelector('h3').innerText;
                console.log('Click en:', section);
                
                if (section === 'Estudiantes') {
                    const url = new URL('../../students/index.html', window.location.href);
                    console.log('Navegando a:', url.href);
                    window.location.replace(url.href);
                } else if (section === 'Asistencia') {
                    console.log(`Navegando a: ${section}...`);
                } else if (section === 'Pagos') {
                    console.log(`Navegando a: ${section}...`);
                } else if (section === 'Resumen') {
                    console.log(`Navegando a: ${section}...`);
                }
            }
        });
    });
});