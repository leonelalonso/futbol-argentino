import { iniciarPantallaInicio } from './inicio.js';
import { iniciarPantallaMenu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarPantallaInicio((nombreUsuario) => {
        iniciarPantallaMenu(nombreUsuario);
    });
});
