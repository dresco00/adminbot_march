import { request } from "../../shared/js/api.js"
import { validarCorreo, limpiarError, mostrarError } from "../../shared/js/utils.js"
import { guardarUsuario } from "../../shared/js/storage.js"
import Toastify from "toastify-js"

const form = document.getElementById('login-form')
const email = document.getElementById('email')
const password = document.getElementById('password')
const error = document.getElementById('errorMessage')
const boton = document.getElementById('button-primary')

form.addEventListener("submit", async function (e) {
  e.preventDefault()
  limpiarError(error)

  const correo = email.value.trim()
  const clave = password.value.trim()

  if (!validarCorreo(correo)) {
    Toastify({
      text: "Correo inválido",
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true
    }).showToast()
    return
  }

  if (clave.length < 6) {
    Toastify({
      text: "La contraseña debe tener mínimo 6 caracteres",
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true
    }).showToast()
    return
  }

  boton.disabled = true
  const originalLabel = boton.innerHTML
  boton.innerHTML = "Verificando..."

  try {
    const response = await request("/login", {
      method: "POST",
      body: JSON.stringify({
        email: correo,
        password: clave,
      }),
    })

    guardarUsuario(response.user)
    Toastify({
      text: "Inicio de sesión exitoso",
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      close: true
    }).showToast()
    setTimeout(() => {
      window.location.href = "./src/pages/auth/dashboard/index.html"
    }, 1000)
  } catch (err) {
    Toastify({
      text: err.message || "Error al iniciar sesión",
      duration: 3000,
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true
    }).showToast()
  } finally {
    boton.disabled = false
    boton.innerHTML = originalLabel
  }
})