export function guardarUsuario(){
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function eliminarUsuario(){
    return JSON.parse(localStorage.getItem("usuario"));
}

export function cerrarSesion(){
    localStorage.removeItem("usuario");
}
