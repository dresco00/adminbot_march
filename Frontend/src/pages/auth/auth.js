import { request } from "../../shared/js/api.js"
import { validarCorreo, limpiarError, mostrarError } from "../../shared/js/utils.js"
import { guardarUsuario } from "../../shared/js/storage.js"

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
    mostrarError(error, "Correo inválido")
    return
  }

  if (clave.length < 6) {
    mostrarError(error, "La contraseña debe tener mínimo 6 caracteres")
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
    window.location.href = "./src/pages/auth/dashboard/index.html"
  } catch (err) {
    mostrarError(error, err.message || "Error al iniciar sesión")
  } finally {
    boton.disabled = false
    boton.innerHTML = originalLabel
  }
})