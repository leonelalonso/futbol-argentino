import { iniciarJuego } from './juego.js';

export function iniciarPantallaMenu(nombreUsuario) {
    const pantallaMenu = document.getElementById('pantalla-menu');
    const nombreJugador = document.getElementById('nombre-jugador');

    nombreJugador.textContent = nombreUsuario;
    pantallaMenu.style.display = 'block';

    const botonesCategoria = document.querySelectorAll('.btn-categoria');
    botonesCategoria.forEach((boton) => {
        boton.addEventListener('click', () => {
            const categoria = boton.getAttribute('data-categoria');
            iniciarJuego(categoria, (puntajeFinal) => finalizarJuego(puntajeFinal));
        });
    });
}

// Función para finalizar el juego
function finalizarJuego(puntaje) {
    alert(`¡Juego terminado! Puntaje final: ${puntaje}`);
    location.reload(); // Reinicia el juego
}
