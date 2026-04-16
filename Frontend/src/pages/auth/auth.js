import {request} from '../../shared/js/api.js';
import { validarCorreo,
  limpiarError,
  mostrarError
 } from '../../shared/js/util.js';
 import { guardarUsuario  } from '../../shared/css/js/storage.js';

 const form = document.getElementById('login-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const error = document.getElementById('errorMessage');
  const boton = document.getElementById('button primary');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    limpiarError()

    const correo = email.value.trim();
    const clave = password.value.trim();

    if (!validarCorreo(correo)) {
      mostrarError(error, 'Correo no válido');
      return;
    }

    if (clave.length < 6) {
      mostrarError(error, 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {}
    catch{}
    finally{}
  });
    