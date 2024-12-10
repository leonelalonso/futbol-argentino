export function iniciarPantallaInicio(mostrarMenu) {
    const formInicio = document.getElementById('form-inicio');
    const pantallaInicio = document.getElementById('pantalla-inicio');

    formInicio.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombreUsuario = document.getElementById('nombre-usuario').value.trim();
        if (nombreUsuario) {
            localStorage.setItem('nombreUsuario', nombreUsuario);
            pantallaInicio.style.display = 'none';
            mostrarMenu(nombreUsuario);
        } else {
            alert('Por favor, ingresa un nombre.');
        }
    });
}
