import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../shared/js/api.js';
import { validarCorreo } from '../shared/js/utils.js';
import { guardarUsuario } from '../shared/js/storage.js';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarCorreo(email)) {
      toast.error('Correo inválido');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await request('/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      guardarUsuario(response.user);
      toast.success('Inicio de sesión exitoso');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-wrapper">
      <div id="back-img" className="deco-blob"></div>

      <div id="login" className="bento-card">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <span className="status-dot"></span>
            <h2>AdminBot</h2>
          </div>

          <div className="input-group">
            <label htmlFor="email">User Email</label>
            <input
              type="text"
              id="email"
              placeholder="name@system.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Access Code</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="error-message">{error}</p>

          <button type="submit" className="btn-main" disabled={loading}>
            {loading ? 'Verificando...' : 'Authorize'} <span>→</span>
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;