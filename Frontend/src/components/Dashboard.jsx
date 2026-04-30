import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario, cerrarSesion } from '../shared/js/storage.js';
import { request } from '../shared/js/api.js';
import Chart from 'chart.js/auto';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summaryData, setSummaryData] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const currentUser = obtenerUsuario();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Inicializar gráfica
    const ctx = document.getElementById('summaryChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['L', 'M', 'M', 'J', 'V', 'S'],
        datasets: [{
          label: 'Actividad',
          data: summaryData,
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

    // Cargar datos
    loadDashboardData();

    return () => chart.destroy();
  }, [navigate, summaryData]);

  const loadDashboardData = async () => {
    try {
      // Lógica para cargar datos del dashboard
      // ...
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    navigate('/');
  };

  const handleStudentsClick = () => {
    navigate('/students');
  };

  return (
    <main className="dashboard-wrapper">
      <div id="back-img" className="deco-blob"></div>

      <section className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p className="dashboard-copy">Bienvenido de nuevo, <span className="user-name">{user?.name || 'Usuario'}</span></p>
          </div>
          <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card summary-card">
            <div className="card-info">
              <h3>Resumen</h3>
              <p id="totalStudentsText">Cargando métricas...</p>
            </div>
            <div className="chart-container">
              <canvas id="summaryChart"></canvas>
            </div>
          </article>

          <article className="dashboard-card">
            <h3>Asistencia</h3>
            <p id="absencesText">Verifica el estado actual y los informes diarios de asistencia.</p>
          </article>

          <article className="dashboard-card">
            <h3>Pagos</h3>
            <p id="paymentsText">Gestiona facturas, pagos pendientes y registros de transacciones.</p>
          </article>

          <article className="dashboard-card" onClick={handleStudentsClick} style={{ cursor: 'pointer' }}>
            <h3>Estudiantes</h3>
            <p>Gestiona el listado de estudiantes, filtra por grado y agrega nuevos estudiantes.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;