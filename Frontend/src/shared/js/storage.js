export function guardarUsuario(usuario){
    localStorage.setItem("usuario", JSON.stringify(usuario))
}

export function obtenerUsuario(){
   return JSON.parse(localStorage.getItem("usuario"))
}

export function cerrarSesion(){
    localStorage.removeItem("usuario")
}
