//#region Variables globales
let preguntaActual = 0;
let puntaje = 0;
let vidas = 3;
let tiempoRestante = 20;  // Tiempo inicial por pregunta
let temporizador;
let pausado = false; // Estado de pausa
let preguntas = []; // Almacenará las preguntas seleccionadas


//#region Función para iniciar el juego
export function iniciarJuego(categoria, finalizarJuego) {
    const pantallaMenu = document.getElementById('pantalla-menu');
    const pantallaJuego = document.getElementById('pantalla-juego');
    const preguntaElemento = document.getElementById('pregunta');
    const respuestasElemento = document.getElementById('respuestas');
    const temporizadorElemento = document.getElementById('temporizador');
    const puntajeElemento = document.getElementById('puntaje');
    const vidasElemento = document.getElementById('vidas');

    // Cargar preguntas según la categoría
    preguntas = obtenerPreguntas(categoria);
    
    // Ocultar menú y mostrar juego
    pantallaMenu.style.display = 'none';
    pantallaJuego.style.display = 'block';

    // Inicializar puntaje y vidas en pantalla
    puntajeElemento.textContent = `Puntaje: ${puntaje}`;
    vidasElemento.textContent = `Vidas: ${vidas}`;

    // Iniciar la primera pregunta
    mostrarPregunta();
}
//#endregion

//#region Función para mostrar una pregunta
function mostrarPregunta() {
    if (preguntaActual >= preguntas.length || vidas <= 0) {
        // Si no hay más preguntas o se han perdido todas las vidas, finalizar el juego
        mostrarPantallaFinal();
        return;
    }

    const pregunta = preguntas[preguntaActual];
    const preguntaElemento = document.getElementById('pregunta');
    const respuestasElemento = document.getElementById('respuestas');
    
    preguntaElemento.textContent = pregunta.pregunta;
    respuestasElemento.innerHTML = '';

    pregunta.respuestas.forEach((opcion, index) => {
        const boton = document.createElement('button');
        boton.textContent = opcion;
        boton.classList.add('opcion');
        boton.addEventListener('click', () => {
            const botones = document.querySelectorAll('.opcion');
            botones.forEach(boton => {
                boton.setAttribute('disabled', true); // Deshabilitar todos los botones de respuesta
                boton.classList.add('deshabilitado'); // Opcional: estilo para los demás botones
            });

            // Resaltar el botón seleccionado
            boton.classList.add('seleccionado');

            // Verificar respuesta
            verificarRespuesta(index, pregunta.correcta);
        });
        respuestasElemento.appendChild(boton);
    });

    // Reiniciar el temporizador
    tiempoRestante = 20; // Restablecer el tiempo a 20 segundos por pregunta
    iniciarTemporizador();
}
//#endregion

//#region Función para verificar la respuesta
function verificarRespuesta(indiceSeleccionado, indiceCorrecto) {
    detenerTemporizador();

    const datoInteresante = preguntas[preguntaActual].datoInteresante;

    let respuestaCorrecta = false;
    if (indiceSeleccionado === indiceCorrecto) {
        puntaje += 10;
        respuestaCorrecta = true;
    } else {
        vidas -= 1;
    }

    // Actualizar puntaje y vidas en pantalla
    const puntajeElemento = document.getElementById('puntaje');
    const vidasElemento = document.getElementById('vidas');
    puntajeElemento.textContent = `Puntaje: ${puntaje}`;
    vidasElemento.textContent = `Vidas: ${vidas}`;

    // Mostrar mensaje de feedback
    const feedbackElemento = document.createElement('div');
    feedbackElemento.id = 'respuesta-feedback';
    feedbackElemento.innerHTML = respuestaCorrecta
        ? `<p>¡Correcto! ${datoInteresante}</p>`
        : `<p>Incorrecto. ${datoInteresante}</p>`;

    const mensajePrevio = document.getElementById('respuesta-feedback');
    if (mensajePrevio) {
        mensajePrevio.remove();
    }
    const respuestasElemento = document.getElementById('respuestas');
    respuestasElemento.appendChild(feedbackElemento);

    // Pausa breve para mostrar el mensaje y luego continuar
    setTimeout(() => {
        if (vidas > 0 && preguntaActual < preguntas.length - 1) {
            preguntaActual++; // Avanzar a la siguiente pregunta
            mostrarPregunta();
        } else {
            mostrarPantallaFinal();
        }
    }, 1500);
}
//#endregion

//#region Función para mostrar la pantalla final
function mostrarPantallaFinal() {
    const pantallaJuego = document.getElementById('pantalla-juego');
    const totalPreguntas = preguntas.length;
    const nivelConocimiento = calcularNivelConocimiento(puntaje, totalPreguntas);

    pantallaJuego.innerHTML = `
        <h2>Juego Terminado</h2>
        <p>Tu puntaje final es: ${puntaje}</p>
        <p>Tu nivel de conocimiento es: <strong>${nivelConocimiento}</strong></p>
        <div>
            <button id="btnVolverJugar">Volver a Jugar</button>
            <button id="btnSalir">Salir</button>
        </div>
    `;

    // Botón para reiniciar el juego
    const btnVolverJugar = document.getElementById('btnVolverJugar');
    btnVolverJugar.addEventListener('click', () => {
        window.location.reload(); // Recargar la página para iniciar un nuevo juego
    });

    // Botón para salir del juego
    const btnSalir = document.getElementById('btnSalir');
    btnSalir.addEventListener('click', () => {
        pantallaJuego.innerHTML = `
            <h2>Gracias por jugar</h2>
            <p>¡Esperamos que vuelvas pronto!</p>
        `;
    });
}

//#endregion

//#region Función para iniciar el temporizador
function iniciarTemporizador() {
    if (pausado) return; // Si está pausado, no inicia el temporizador

    temporizador = setInterval(() => {
        if (!pausado) {
            tiempoRestante--; // Disminuye el tiempo restante
            const temporizadorElemento = document.getElementById('temporizador');
            temporizadorElemento.textContent = tiempoRestante; // Actualiza el contador en pantalla

            if (tiempoRestante <= 0) {
                detenerTemporizador(); // Detiene el temporizador cuando llega a 0
                vidas -= 1;
                const datoInteresante = preguntas[preguntaActual].datoInteresante;
                const respuestasElemento = document.getElementById('respuestas');
                respuestasElemento.innerHTML = `<p>Tiempo agotado. ${datoInteresante}</p>`;
                const vidasElemento = document.getElementById('vidas');
                vidasElemento.textContent = `Vidas: ${vidas}`;

                setTimeout(() => {
                    if (vidas > 0) {
                        preguntaActual++;
                        mostrarPregunta();
                    } else {
                        mostrarPantallaFinal();
                    }
                }, 2000);
            }
        }
    }, 1000);
}
//#endregion

//#region Función para detener el temporizador
function detenerTemporizador() {
    clearInterval(temporizador); // Detiene el temporizador
}
//#endregion

//#region Función para pausar y reanudar el juego
const btnPausa = document.createElement('button');
btnPausa.textContent = 'Pausar';
btnPausa.id = 'btnPausa';
document.getElementById('pantalla-juego').appendChild(btnPausa);

btnPausa.addEventListener('click', () => {
    pausado = !pausado;

    if (pausado) {
        detenerTemporizador();
        deshabilitarBotones(true); // Deshabilitar todas las opciones de respuesta
        btnPausa.textContent = 'Reanudar'; // Cambiar texto a "Reanudar"
    } else {
        iniciarTemporizador();
        deshabilitarBotones(false); // Habilitar las opciones de respuesta
        btnPausa.textContent = 'Pausar'; // Cambiar texto a "Pausar"
    }
});
//#endregion

//#region Función para deshabilitar los botones de respuesta
function deshabilitarBotones(deshabilitar) {
    const botones = document.querySelectorAll('.opcion');
    botones.forEach(boton => {
        boton.disabled = deshabilitar; // Deshabilita o habilita los botones de respuestas
    });
}
//#endregion

//#region Función para obtener las preguntas
function obtenerPreguntas(categoria) {
    const preguntasDemo =  {
        clubes: [
            { pregunta: "¿Qué club argentino es conocido como 'El Millonario'?", respuestas: ["River Plate", "Boca Juniors", "San Lorenzo", "Independiente"], correcta: 0, datoInteresante: "River Plate es apodado 'El Millonario' debido a una costosa compra de jugadores en los años 30." },
            { pregunta: "¿En qué año se fundó San Lorenzo?", respuestas: ["1908", "1930", "1912", "1895"], correcta: 2, datoInteresante: "San Lorenzo fue fundado el 1 de abril de 1908." },
            { pregunta: "¿Cuál es el estadio más grande de Argentina?", respuestas: ["Mario Kempes", "La Bombonera", "Cilindro de Avellaneda", "Monumental"], correcta: 3, datoInteresante: "El Estadio Monumental tiene capacidad para más de 83,000 personas." },
            { pregunta: "¿Qué equipo es apodado 'El Globo'?", respuestas: ["Vélez", "Argentinos Juniors", "Huracán", "Lanús"], correcta: 2, datoInteresante: "Huracán debe su apodo a su emblema, un globo aerostático rojo." },
            { pregunta: "¿Qué club ganó el primer campeonato profesional en Argentina?", respuestas: ["Boca Juniors", "River Plate", "Huracán", "Independiente"], correcta: 3, datoInteresante: "Independiente ganó el primer torneo profesional en 1931." },
            { pregunta: "¿Quién es el máximo goleador histórico de River Plate?", respuestas: ["Ángel Labruna", "Enzo Francescoli", "Fernando Cavenaghi", "Norberto Alonso"], correcta: 0, datoInteresante: "Ángel Labruna anotó 293 goles con River Plate." },
            { pregunta: "¿Cómo se llama el estadio de Rosario Central?", respuestas: ["Coloso del Parque", "Gigante de Arroyito", "Nuevo Gasómetro", "La Boutique"], correcta: 1, datoInteresante: "El estadio de Rosario Central es conocido como el Gigante de Arroyito." },
            { pregunta: "¿Cuál es el apodo de Vélez Sarsfield?", respuestas: ["El Ciclón", "El Matador", "El Fortín", "El Tifón"], correcta: 2, datoInteresante: "Vélez Sarsfield es conocido como 'El Fortín' debido a su estadio." },
            { pregunta: "¿Qué club es conocido como 'El Decano'?", respuestas: ["Atlético Tucumán", "Talleres", "Colón", "Banfield"], correcta: 0, datoInteresante: "Atlético Tucumán es apodado 'El Decano' por ser el club más antiguo de la provincia." },
            { pregunta: "¿Qué equipo argentino ha ganado más Copas Libertadores?", respuestas: ["Racing Club", "Boca Juniors", "River Plate", "Independiente"], correcta: 3, datoInteresante: "Independiente ha ganado 7 Copas Libertadores, siendo el máximo ganador del torneo." },
            { pregunta: "¿Qué equipo ascendió en 2022 a la Primera División de Argentina?", respuestas: ["Belgrano", "Instituto", "Tigre", "San Martín"], correcta: 1, datoInteresante: "Instituto ascendió a la Primera División en 2022 tras un excelente torneo en la Primera Nacional." },
            { pregunta: "¿Cómo se llama el clásico entre Newell's Old Boys y Rosario Central?", respuestas: ["Clásico Rosarino", "Clásico Santafesino", "Clásico del Interior", "Clásico del Parque"], correcta: 0, datoInteresante: "El Clásico Rosarino es uno de los más intensos y antiguos del fútbol argentino." },
            { pregunta: "¿Qué club tiene el apodo de 'La Academia'?", respuestas: ["Estudiantes", "San Lorenzo", "Racing Club", "Argentinos Juniors"], correcta: 2, datoInteresante: "Racing Club es conocido como 'La Academia' por ser un pionero en el fútbol argentino." },
            { pregunta: "¿Qué club fue fundado primero?", respuestas: ["Boca Juniors", "River Plate", "Racing Club", "Independiente"], correcta: 1, datoInteresante: "River Plate fue fundado en 1901, Racing Club en 1903, Boca Juniors en 1905, e Independiente en 1905 (aunque oficialmente registrado en 1904)." },
            { pregunta: "¿Cuál es el apodo de Lanús?", respuestas: ["La Gloria", "El Matador", "El Taladro", "El Granate"], correcta: 3, datoInteresante: "Lanús es conocido como 'El Granate' debido al color de su camiseta." },
            { pregunta: "¿Qué club juega en el estadio Ciudad de La Plata?", respuestas: ["Gimnasia", "Estudiantes", "Banfield", "Vélez"], correcta: 1, datoInteresante: "Estudiantes utiliza el moderno Estadio Ciudad de La Plata." },
            { pregunta: "¿Qué club es conocido como 'El Taladro'?", respuestas: ["Banfield", "Godoy Cruz", "Huracán", "Aldosivi"], correcta: 0, datoInteresante: "Banfield es apodado 'El Taladro' debido a su estilo ofensivo en los años 40." },
            { pregunta: "¿En qué provincia se encuentra Talleres de Córdoba?", respuestas: ["Mendoza", "Santa Fe", "Córdoba", "Tucumán"], correcta: 2, datoInteresante: "Talleres es uno de los clubes más importantes de la provincia de Córdoba." },
            { pregunta: "¿Qué club tiene como estadio el Cilindro de Avellaneda?", respuestas: ["Racing", "Independiente", "Tigre", "Huracán"], correcta: 0, datoInteresante: "El Cilindro de Avellaneda es el estadio de Racing Club." },
            { pregunta: "¿Qué club es apodado 'El Bicho'?", respuestas: ["Argentinos Juniors", "Colón", "Rosario Central", "Defensa y Justicia"], correcta: 0, datoInteresante: "Argentinos Juniors es conocido como 'El Bicho' debido a sus colores y logotipo." },
            { pregunta: "¿Qué equipo argentino es apodado 'El Sabalero'?", respuestas: ["Tigre", "Unión", "Colón", "Lanús"], correcta: 2, datoInteresante: "Colón de Santa Fe es conocido como 'El Sabalero' debido a un pez típico de la región." },
            { pregunta: "¿Qué equipo ganó el torneo de Primera División 2023?", respuestas: ["River Plate", "Boca Juniors", "Racing Club", "Estudiantes"], correcta: 0, datoInteresante: "River Plate ganó el torneo de Primera División en 2023 con amplia diferencia." },
            { pregunta: "¿Cuál es el clásico rival de Gimnasia y Esgrima La Plata?", respuestas: ["Banfield", "Estudiantes", "Lanús", "Tigre"], correcta: 1, datoInteresante: "El clásico platense enfrenta a Gimnasia y Estudiantes." },
            { pregunta: "¿Qué equipo es conocido como 'La Gloria'?", respuestas: ["Instituto", "Belgrano", "San Martín", "Talleres"], correcta: 0, datoInteresante: "Instituto de Córdoba es conocido como 'La Gloria' por su rica historia." },
            { pregunta: "¿Qué club es conocido como 'El Matador'?", respuestas: ["Lanús", "San Lorenzo", "Huracán", "Tigre"], correcta: 3, datoInteresante: "Tigre es apodado 'El Matador' por su garra y estilo de juego." }
        ],
           seleccion: [
            { pregunta: "¿Cuántas veces ha ganado Argentina la Copa América?", respuestas: ["16", "14", "15", "12"], correcta: 2, datoInteresante: "Argentina ha ganado la Copa América 15 veces, igualando a Uruguay como el máximo ganador." },
            { pregunta: "¿Quién es el máximo goleador histórico de la Selección Argentina?", respuestas: ["Lionel Messi", "Gabriel Batistuta", "Sergio Agüero", "Diego Maradona"], correcta: 0, datoInteresante: "Lionel Messi superó a Batistuta como el máximo goleador de la Selección con más de 100 goles." },
            { pregunta: "¿En qué año ganó Argentina su primer Mundial?", respuestas: ["1930", "1986", "1978", "2022"], correcta: 2, datoInteresante: "Argentina ganó su primer Mundial en 1978 bajo la dirección de César Luis Menotti." },
            { pregunta: "¿Quién anotó el gol de la victoria en la final del Mundial 1986?", respuestas: ["Jorge Burruchaga", "Diego Maradona", "Jorge Valdano", "Oscar Ruggeri"], correcta: 0, datoInteresante: "Jorge Burruchaga anotó el gol decisivo en la victoria por 3-2 contra Alemania." },
            { pregunta: "¿Contra qué país jugó Argentina en la final del Mundial 2022?", respuestas: ["Croacia", "Francia", "Alemania", "Brasil"], correcta: 1, datoInteresante: "Argentina venció a Francia en una emocionante final que terminó en penales." },
            { pregunta: "¿Qué jugador argentino tiene más apariciones en Mundiales?", respuestas: ["Lionel Messi", "Diego Maradona", "Javier Mascherano", "Daniel Passarella"], correcta: 0, datoInteresante: "Lionel Messi ha disputado cinco Mundiales, más que cualquier otro argentino." },
            { pregunta: "¿En qué estadio ganó Argentina el Mundial 1978?", respuestas: ["Estadio Monumental", "La Bombonera", "Estadio Malvinas Argentinas", "Estadio Centenario"], correcta: 0, datoInteresante: "La final del Mundial 1978 se jugó en el Estadio Monumental de Buenos Aires." },
            { pregunta: "¿Qué técnico dirigió a Argentina en el Mundial 1986?", respuestas: ["Marcelo Bielsa", "César Luis Menotti", "Alfio Basile", "Carlos Bilardo"], correcta: 3, datoInteresante: "Carlos Bilardo fue el estratega detrás del título de 1986." },
            { pregunta: "¿Cuál es el apodo de la Selección Argentina?", respuestas: ["La Celeste", "Los Gauchos", "La Albiceleste", "Los Pampas"], correcta: 2, datoInteresante: "La Albiceleste se refiere a los colores blanco y celeste de la bandera argentina." },
            { pregunta: "¿Quién fue el arquero titular de Argentina en el Mundial 2022?", respuestas: ["Emiliano Martínez", "Franco Armani", "Sergio Romero", "Juan Musso"], correcta: 0, datoInteresante: "Emiliano 'Dibu' Martínez fue clave en la conquista del Mundial 2022." },
            { pregunta: "¿En qué país se celebró el Mundial que Argentina ganó en 1986?", respuestas: ["Italia", "México", "España", "Argentina"], correcta: 1, datoInteresante: "Argentina ganó el Mundial 1986 en México con Diego Maradona como figura." },
            { pregunta: "¿Qué jugador argentino anotó el 'Gol del Siglo'?", respuestas: ["Diego Maradona", "Lionel Messi", "Gabriel Batistuta", "Jorge Valdano"], correcta: 0, datoInteresante: "Diego Maradona marcó el 'Gol del Siglo' contra Inglaterra en 1986." },
            { pregunta: "¿En qué año debutó Lionel Messi con la Selección Argentina?", respuestas: ["2004", "2005", "2006", "2003"], correcta: 1, datoInteresante: "Lionel Messi debutó en un amistoso contra Hungría en 2005." },
            { pregunta: "¿Cuántos goles anotó Lionel Messi en el Mundial 2022?", respuestas: ["5", "6", "8", "7"], correcta: 3, datoInteresante: "Lionel Messi anotó 7 goles en el Mundial 2022, siendo clave en el campeonato." },
            { pregunta: "¿Qué selección eliminó a Argentina en el Mundial 2002?", respuestas: ["Suecia", "Inglaterra", "Nigeria", "Corea del Sur"], correcta: 0, datoInteresante: "Suecia eliminó a Argentina en la fase de grupos del Mundial 2002." },
            { pregunta: "¿Qué jugador argentino es conocido como 'El Jefecito'?", respuestas: ["Javier Mascherano", "Diego Simeone", "Fernando Redondo", "Oscar Ruggeri"], correcta: 0, datoInteresante: "Javier Mascherano es apodado 'El Jefecito' por su liderazgo en el campo." },
            { pregunta: "¿Cuántas veces ha sido Argentina subcampeón del mundo?", respuestas: ["2", "4", "3", "5"], correcta: 2, datoInteresante: "Argentina fue subcampeón en 1930, 1990 y 2014." },
            { pregunta: "¿Qué jugador argentino marcó el primer gol en el Mundial 2022?", respuestas: ["Lionel Messi", "Ángel Di María", "Julián Álvarez", "Enzo Fernández"], correcta: 0, datoInteresante: "Lionel Messi anotó el primer gol contra Arabia Saudita en el Mundial 2022." },
            { pregunta: "¿Qué país fue el rival en la histórica victoria de Argentina 3-0 en la Copa América 2021?", respuestas: ["Uruguay", "Brasil", "Ecuador", "Paraguay"], correcta: 1, datoInteresante: "Argentina venció 3-0 a Ecuador en los cuartos de final de la Copa América 2021." },
            { pregunta: "¿Qué jugador marcó el gol decisivo en la final de la Copa América 2021?", respuestas: ["Ángel Di María", "Lionel Messi", "Lautaro Martínez", "Leandro Paredes"], correcta: 0, datoInteresante: "Ángel Di María anotó el gol que dio a Argentina la Copa América contra Brasil." },
            { pregunta: "¿Cuántos partidos invictos tuvo Argentina antes del Mundial 2022?", respuestas: ["37", "35", "34", "36"], correcta: 3, datoInteresante: "Argentina llegó al Mundial con una racha invicta de 36 partidos." },
            { pregunta: "¿Qué selección venció a Argentina en el primer partido del Mundial 2022?", respuestas: ["Arabia Saudita", "México", "Polonia", "Australia"], correcta: 0, datoInteresante: "Arabia Saudita sorprendió a Argentina con una victoria 2-1." },
            { pregunta: "¿Qué arquero argentino atajó penales clave en la Copa América 2021?", respuestas: ["Emiliano Martínez", "Franco Armani", "Sergio Romero", "Juan Musso"], correcta: 0, datoInteresante: "Emiliano Martínez atajó penales decisivos en la semifinal contra Colombia." },
            { pregunta: "¿Qué selección fue eliminada por Argentina en la semifinal del Mundial 2014?", respuestas: ["Alemania", "Holanda", "Brasil", "Bélgica"], correcta: 1, datoInteresante: "Argentina eliminó a Holanda en penales en la semifinal del Mundial 2014." },
            { pregunta: "¿Qué técnico llevó a Argentina al título del Mundial 2022?", respuestas: ["Lionel Scaloni", "Jorge Sampaoli", "Alejandro Sabella", "Marcelo Bielsa"], correcta: 0, datoInteresante: "Lionel Scaloni fue el técnico campeón en el Mundial de Qatar 2022." }
        ],
        reglamento: [
            { pregunta: "¿Cuántos jugadores conforman un equipo de fútbol en el campo?", respuestas: ["12", "10", "11", "9"], correcta: 2, datoInteresante: "Cada equipo tiene 11 jugadores en el campo, incluido el arquero." },
            { pregunta: "¿Cuánto dura un partido de fútbol reglamentario?", respuestas: ["100 minutos", "90 minutos", "80 minutos", "60 minutos"], correcta: 1, datoInteresante: "Un partido reglamentario dura 90 minutos, dividido en dos tiempos de 45 minutos." },
            { pregunta: "¿Cuántos cambios de jugadores se permiten actualmente en competiciones oficiales?", respuestas: ["5", "3", "4", "6"], correcta: 0, datoInteresante: "Desde la pandemia de COVID-19, se permiten 5 cambios en la mayoría de las competiciones oficiales." },
            { pregunta: "¿Qué acción realiza el árbitro si un jugador recibe dos tarjetas amarillas?", respuestas: ["Expulsión", "Advertencia verbal", "Cambio obligatorio", "Penalización de equipo"], correcta: 0, datoInteresante: "Dos tarjetas amarillas equivalen a una tarjeta roja, lo que resulta en la expulsión del jugador." },
            { pregunta: "¿Cuál es el diámetro reglamentario de un balón de fútbol?", respuestas: ["20 cm", "23 cm", "24 cm", "22 cm"], correcta: 3, datoInteresante: "El balón reglamentario tiene un diámetro de 22 cm." },
            { pregunta: "¿Qué pasa si un equipo tiene menos de 7 jugadores en el campo?", respuestas: ["Se suspende el partido", "Se permite continuar", "Se otorga victoria al rival", "Se reanuda tras un cambio"], correcta: 0, datoInteresante: "El reglamento indica que un equipo debe tener al menos 7 jugadores para continuar el partido." },
            { pregunta: "¿Cuántos árbitros asisten en un partido oficial de fútbol?", respuestas: ["2", "3", "4", "5"], correcta: 2, datoInteresante: "Un partido oficial cuenta con 4 árbitros: el principal, dos asistentes y un cuarto árbitro." },
            { pregunta: "¿Qué se marca si un jugador toca el balón con la mano intencionadamente dentro de su área?", respuestas: ["Penal", "Tiro libre indirecto", "Tiro de esquina", "Saque de arco"], correcta: 0, datoInteresante: "Un toque intencionado con la mano dentro del área se sanciona con un penal." },
            { pregunta: "¿Qué determina un saque de esquina?", respuestas: ["El balón cruza la línea de gol sin entrar en la portería, siendo tocado por un defensor", "El balón cruza la línea lateral", "El árbitro detiene el juego", "Una infracción en el área"], correcta: 0, datoInteresante: "Un saque de esquina ocurre si el balón cruza la línea de gol sin entrar en la portería y fue tocado por el último defensor." },
            { pregunta: "¿Cuál es la distancia mínima a respetar en un tiro libre?", respuestas: ["7.5 metros", "10 metros", "8 metros", "9.15 metros"], correcta: 3, datoInteresante: "Los jugadores deben estar al menos a 9.15 metros del balón en un tiro libre." },
            { pregunta: "¿Cuánto tiempo puede un arquero retener el balón con las manos?", respuestas: ["10 segundos", "5 segundos", "6 segundos", "7 segundos"], correcta: 2, datoInteresante: "El arquero puede retener el balón con las manos durante un máximo de 6 segundos." },
            { pregunta: "¿Qué ocurre si un equipo comete 6 faltas acumuladas en fútbol sala?", respuestas: ["Se concede un tiro libre sin barrera al rival", "Se otorga un penal", "El juego continúa normalmente", "Se expulsa al capitán del equipo"], correcta: 0, datoInteresante: "En fútbol sala, al acumular 6 faltas, el rival recibe un tiro libre sin barrera." },
            { pregunta: "¿Qué marca el árbitro si el balón cruza completamente la línea de gol entre los postes y debajo del travesaño?", respuestas: ["Tiro de esquina", "Gol", "Saque de arco", "Tiro libre"], correcta: 1, datoInteresante: "Se concede un gol cuando el balón cruza completamente la línea de gol entre los postes y debajo del travesaño." },
            { pregunta: "¿Qué acción se toma cuando el balón toca accidentalmente al árbitro e influye en el juego?", respuestas: ["Saque neutral", "Continúa el juego", "Tiro libre indirecto", "Saque de banda"], correcta: 0, datoInteresante: "Si el balón toca al árbitro y afecta el juego, se realiza un saque neutral." },
            { pregunta: "¿Qué pasa si un jugador marca un gol directamente desde un saque de banda?", respuestas: ["Se repite el saque", "Es válido", "Se otorga un tiro libre al rival", "No es válido"], correcta: 3, datoInteresante: "Un gol directo desde un saque de banda no es válido según el reglamento." },
            { pregunta: "¿Cuántos minutos puede añadir el árbitro por tiempo perdido?", respuestas: ["A discreción del árbitro", "Máximo 5 minutos", "Máximo 3 minutos", "No se permite añadir tiempo"], correcta: 0, datoInteresante: "El árbitro puede añadir el tiempo que considere necesario para compensar las interrupciones." },
            { pregunta: "¿Qué ocurre si un jugador está en fuera de juego pero no interfiere en el juego?", respuestas: ["El juego continúa", "Se sanciona fuera de juego", "Se otorga tiro libre indirecto", "Se repite la jugada"], correcta: 0, datoInteresante: "Un jugador en fuera de juego no será sancionado si no interfiere en el juego." },
            { pregunta: "¿Qué parte del cuerpo determina el fuera de juego?", respuestas: ["Cualquier parte con la que se pueda marcar gol", "La cabeza", "El tronco", "Los pies"], correcta: 0, datoInteresante: "El fuera de juego se determina con cualquier parte del cuerpo con la que se pueda marcar gol." },
            { pregunta: "¿Qué acción es válida durante un penal?", respuestas: ["El portero puede moverse lateralmente antes del tiro", "El portero debe permanecer inmóvil", "El portero puede avanzar hasta 2 metros", "El portero puede girar de espaldas"], correcta: 0, datoInteresante: "El portero puede moverse lateralmente, pero no avanzar antes del tiro." },
            { pregunta: "¿Qué determina el árbitro si un jugador agrede a un rival fuera del juego?", respuestas: ["Expulsión y reanudación con un tiro libre", "Saque neutral", "Tiro penal", "Advertencia verbal"], correcta: 0, datoInteresante: "Una agresión fuera del juego resulta en expulsión y tiro libre para el equipo contrario." },
            { pregunta: "¿Qué se concede si un jugador marca en su propia portería desde un tiro libre indirecto?", respuestas: ["Tiro de esquina", "Gol en contra", "Saque de banda", "Saque de arco"], correcta: 0, datoInteresante: "Si el balón entra directamente en la propia portería desde un tiro libre indirecto, se concede un tiro de esquina." },
            { pregunta: "¿Qué señala el árbitro si un jugador patea el balón fuera del campo por la línea de gol?", respuestas: ["Tiro de esquina", "Saque de arco", "Saque de banda", "Tiro libre"], correcta: 1, datoInteresante: "Si un jugador patea el balón fuera por su línea de gol, el rival ejecuta un saque de arco." },
            { pregunta: "¿Qué ocurre si un equipo cambia de arquero sin avisar al árbitro?", respuestas: ["Advertencia y continuación del juego", "Anulación de goles marcados", "Tiro libre para el rival", "Expulsión del arquero"], correcta: 0, datoInteresante: "Un cambio de arquero sin aviso puede llevar a una advertencia, pero el juego continúa." },
            { pregunta: "¿Qué ocurre si un jugador se quita la camiseta al celebrar un gol?", respuestas: ["Recibe una tarjeta amarilla", "No pasa nada", "Se anula el gol", "Se concede tiro libre al rival"], correcta: 0, datoInteresante: "Quitarse la camiseta al celebrar un gol resulta en tarjeta amarilla según las reglas." }
        ],
        mix: []
    };

    if (categoria === 'mix') {
        preguntasDemo.mix = [
            ...preguntasDemo.clubes,
            ...preguntasDemo.seleccion,
            ...preguntasDemo.reglamento
        ];
        preguntasDemo.mix = mezclarArray(preguntasDemo.mix); // Mezclamos las preguntas aleatoriamente
    }

    return preguntasDemo[categoria] || [];
}
//#endregion

//#region Función para mezclar las preguntas de manera aleatoria
function mezclarArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Intercambia los elementos
    }
    return arr;
}
//#endregion

//#region Calcular el nivel de conocimiento
function calcularNivelConocimiento(puntaje, totalPreguntas) {
    const porcentaje = (puntaje / (totalPreguntas * 10)) * 100; // Suponemos que cada respuesta correcta vale 10 puntos
if (porcentaje === 100){
    return "Leyenda, respondistes todas las preguntas correctamente.";
    }else if (porcentaje >= 80) {
        return "Experto, sabes mucho de futbol argentino, pronto seras Leyenda.";
    } else if (porcentaje >= 50) {
        return "Intermedio, vas camino a convertirte en Leyenda aún te falta aprender más.";
    } else {
        return "Principiante, no te preocupes, juntos te convertiremos en Leyenda.";
    }
}
//#endregion