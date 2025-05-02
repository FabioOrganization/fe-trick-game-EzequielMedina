//////////////////////////////////////////////////////////////////////////////
// index.js - Truco reducido para estudiantes: deben implementar los métodos //
//////////////////////////////////////////////////////////////////////////////


/**
 * JERARQUIA - del mejor (índice 0) al peor (índice 14, para valores permitidos)
 * Para cartas NO únicas, se usa [valor, null] para que coincida con cualquier palo.
 * Si la carta no figura en la lista, se le da la peor jerarquía (más grande).
 */
let JERARQUIA = [
    [1, 'Espadas'],    // 0
    [1,  'Bastos'],     // 1
    [7,  'Espadas'],    // 2
    [7,  'Oros'],       // 3
    [3, null],         // 4 (Tres cualquiera)
    [2, null],         // 5 (Dos cualquiera)
    [1,  'Oros'],       // 6
    [1,  'Copas'],      // 7
    [12, null],        // 8 (Doce cualquiera)
    [11, null],        // 9 (Once cualquiera)
    [10, null],        // 10 (Diez cualquiera)
    [7, null],         // 11 (Siete de Copas o Bastos)
    [6, null],         // 12 (Seis cualquiera)
    [5, null],         // 13 (Cinco cualquiera)
    [4, null],         // 14 (Cuatro cualquiera)
];


// ---- Métodos a resolver ----
const API_CARTAS = 'http://localhost:3000/cartas';
const API_PARTIDAS = 'http://localhost:3000/partidas';

// Estado de la partida
globalThis.mazo = [];
globalThis.manos = [[], []];
globalThis.rondas = [];
globalThis.turno = 0;
globalThis.puntajeRondas = [0,0];
globalThis.historialPartidas = [];
globalThis.sePuedeEnvido = true;

// ---- Métodos a RESOLVER por el alumno (fetch) ----

/**
 * Debe obtener el array de objetos carta desde la API por fetch,
 * mezclarlo aleatoriamente, y actualizar la variable 'mazo'.
 * Usar: GET /cartas API_CARTAS
 * @returns {Promise<void>}
 */
async function obtenerMazoPorFetch() {
    /**
     * TODO:
     * 1. Realizar una solicitud GET a la API usando la variable `API_CARTAS`.
     * 2. Convertir la respuesta a JSON para obtener el array de cartas.
     * 3. Usar la función `mezclar` para desordenar el array de cartas.
     * 4. Asignar el array mezclado a la variable global `mazo`.
     */

    let peticionGet = await fetch(API_CARTAS)
    let mazoLocal = await peticionGet.json()

    // mezclo el mazo con el algoritmo de Fisher-Yates

    mazo = mezclar(mazoLocal)

}

/**
 * Cuando termina una partida, debe POSTear los datos de la partida
 * (ganador, jugadas, fecha) a la API.
 * Usar: POST /partidas API_PARTIDAS
 * @param {number|null} ganador 0/J1, 1/J2, o null si empate/noresuelta
 * @returns {Promise<void>}
 */
async function guardarPartidaFetch(ganador) {
    /**
     * TODO:
     * 1. Crear un objeto `partida` con las propiedades:
     *    - `ganador`: el parámetro recibido.
     *    - `jugadas`: la variable global `rondas`.
     *    - `fecha`: la fecha actual en formato ISO (usar `new Date().toISOString()`).
     * 2. Realizar una solicitud POST a la API usando la variable `API_PARTIDAS`.
     * 3. Enviar el objeto `partida` como cuerpo de la solicitud en formato JSON.
     * 4. Asegurarse de incluir el encabezado `Content-Type: application/json`.
     */

    let partida = {
        ganador: ganador,
        jugadas: rondas,
        fecha: new Date().toISOString()
    }

    let peticionPost = await fetch(API_PARTIDAS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partida)
    })

}

/**
 * Debe obtener por fetch (GET /partidas) el historial de partidas, debe usar la variable API_PARTIDAS,
 * actualizar la variable global historialPartidas (array) y llamar a mostrarEstado().
 * @returns {Promise<void>}
 */
async function getHistorialPartidasFetch() {
    /**
     * TODO:
     * 1. Realizar una solicitud GET a la API usando la variable `API_PARTIDAS`.
     * 2. Convertir la respuesta a JSON para obtener el historial de partidas.
     * 3. Asignar el historial obtenido a la variable global `historialPartidas`.
     * 4. Llamar a la función `mostrarEstado` para actualizar la interfaz.
     */

    let peticionGet = await fetch(API_PARTIDAS)
    let historial = await peticionGet.json()

    historialPartidas = historial
    mostrarEstado()
}

/**
 * Reparte 3 cartas a cada jugador, actualizando 'manos'.
 * Debe quitar las cartas del mazo.
 */
function repartirManos() {
    /**
     * TODO:
     * 1. Usar la variable global `mazo` para extraer las primeras 3 cartas.
     * 2. Asignar las 3 cartas extraídas al jugador 1 (`manos[0]`).
     * 3. Extraer otras 3 cartas del mazo y asignarlas al jugador 2 (`manos[1]`).
     * 4. Asegurarse de que las cartas extraídas se eliminen del mazo.
     */

    manos[0] = mazo.slice(0, 3)
    manos[1] = mazo.slice(3, 6)
    mazo.splice(0, 6)
}

/**
 * Devuelve la jerarquía absoluta de la carta (índice en JERARQUIA) o más si es baja.
 * Ejemplo: {valor: 1, palo:'Espadas'} ===> 0, {valor:12,palo:'Copas'} ===> 8
 * @param {{valor:number,palo:string}} carta
 * @returns {number} índice de jerarquía (0 mejor, mayor es peor)
 */
function jerarquiaCarta(carta) {
    /**
     * TODO:
     * 1. Recorrer el array `JERARQUIA` para encontrar la posición de la carta.
     * 2. Comparar el valor y el palo de la carta con los elementos de `JERARQUIA`.
     * 3. Si la carta coincide, devolver el índice correspondiente.
     * 4. Si no coincide, devolver el índice de la peor jerarquía (`JERARQUIA.length - 1`).
     */
    for (let i = 0; i < JERARQUIA.length; i++) {
        if (carta.valor === JERARQUIA[i][0] && (JERARQUIA[i][1] === carta.palo || JERARQUIA[i][1] === null)) {
            return i;
        }

    }
    return JERARQUIA.length - 1; // Si no se encuentra, devuelve el índice de la peor jerarquía.

}

/**
 * Recibe índice de jugador (0 o 1) y el índice de carta en su mano,
 * Juega esa carta (removiéndola de su mano), almacena la jugada en la ronda actual.
 * Cuando ambos juegan, determina quien ganó la ronda y suma punto.
 * Cambia el turno al otro jugador.
 * Llama a mostrarEstado() al final.
 * @param {number} jugador - 0 para J1, 1 para J2
 * @param {number} cartaIndex - carta seleccionada en la mano
 */
function jugarCarta(jugador, cartaIndex) {
    /**
     * TODO:
     * 1. Remover la carta seleccionada de la mano del jugador (`manos[jugador]`).
     * 2. Obtener la última ronda de `rondas` o crear una nueva si no existe.
     * 3. Asignar la carta jugada al campo correspondiente (`carta1` o `carta2`).
     * 4. Si ambos jugadores ya jugaron, determinar el ganador con `ganadorRonda`.
     * 5. Sumar un punto al ganador (si no es empate) en `puntajeRondas`.
     * 6. Cambiar el turno al otro jugador (`turno = 1 - jugador`).
     * 7. Llamar a `mostrarEstado` para actualizar la interfaz.
     * 8. Si hay un ganador de la partida (`ganadorPartida`), guardar la partida y refrescar el historial.
     */

    // Remover la carta de la mano del jugador
    const cartaJugando = manos[jugador].splice(cartaIndex, 1)[0];
    // Obtener la ronda actual o crear una nueva
    let rondaActual = rondas[rondas.length - 1];
    if (!rondaActual || (rondaActual.carta1 && rondaActual.carta2)) {
        rondaActual = { carta1: null, carta2: null };
        rondas.push(rondaActual);
    }
    // Asignar la carta jugada a la ronda
    if (jugador === 0) {
        rondaActual.carta1 = cartaJugando;
    }else {
        rondaActual.carta2 = cartaJugando;
    }

    // Si ambos jugadores jugaron, determinar el ganador
    if (rondaActual.carta1 && rondaActual.carta2) {
        const ganador = ganadorRonda(rondaActual);
        rondaActual.ganador = ganador;
        if (ganador !== -1) {
            puntajeRondas[ganador]++;
        }
    }
    // Cambiar el turno al otro jugador
    turno = 1 - jugador;

    mostrarEstado();
    // Chequea si terminó la partida, si sí guarda resultado y refresca historial
    if (ganadorPartida() !== null) {
        mostrarEstado('¡Fin de partida!');
        guardarPartidaFetch(ganadorPartida()).then(getHistorialPartidasFetch);
    }
}

/**
 * Determina quién ganó la ronda actual (de a pares).
 * Devuelve: 0 si ganó J1, 1 si ganó J2, -1 si empataron.
 * (Se basa en jerarquía de cartas, menor índice es mejor)
 * @param {{carta1, carta2}} ronda
 * @returns {number} 0, 1 o -1
 */
function ganadorRonda(ronda) {
    /**
     * TODO:
     * 1. Obtener la jerarquía de `carta1` y `carta2` usando `jerarquiaCarta`.
     * 2. Comparar las jerarquías:
     *    - Si son iguales, devolver -1 (empate).
     *    - Si `carta1` es mejor, devolver 0 (gana J1).
     *    - Si `carta2` es mejor, devolver 1 (gana J2).
     */

    const jerarquia1 = jerarquiaCarta(ronda.carta1);
    const jerarquia2 = jerarquiaCarta(ronda.carta2);
    if (jerarquia1 === jerarquia2) {
        return -1; // Empate
    } else if (jerarquia1 < jerarquia2) {
        return 0; // Gana J1
    } else {
        return 1; // Gana J2
    }


}

/**
 * Devuelve el ganador de la partida (según puntajeRondas), o null si aún no terminó.
 * Gana el primero en obtener 2 rondas ganadas.
 * @returns {number|null} 0, 1 o null
 */
function ganadorPartida() {
    /**
     * TODO:
     * 1. Verificar si el puntaje de J1 (`puntajeRondas[0]`) es mayor o igual a 2.
     *    - Si es así, devolver 0 (gana J1).
     * 2. Verificar si el puntaje de J2 (`puntajeRondas[1]`) es mayor o igual a 2.
     *    - Si es así, devolver 1 (gana J2).
     * 3. Si ninguno ha ganado, devolver null.
     */

    if (puntajeRondas[0] >= 2) {
        return 0; // Gana J1
    }
    if (puntajeRondas[1] >= 2) {
        return 1; // Gana J2
    }
    return null; // Aún no hay ganador
}

/**
 * Mezcla el array pasado como parámetro (Fisher-Yates)
 * @param {Array} arr - array a mezclar
 * @returns {Array} - array mezclado
 */

/**
 * Mezcla el array pasado como parámetro (Fisher-Yates)
 * @param {Array} arr - array a mezclar
 * @returns {Array} - array mezclado
 */
function mezclar(arr) {
    /**
     * TODO:
     * 1. Implementar el algoritmo de Fisher-Yates para mezclar el array.
     * 2. Recorrer el array desde el final hasta el inicio.
     * 3. En cada iteración, intercambiar el elemento actual con uno aleatorio.
     * 4. Devolver el array mezclado.
     */

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Inicializa todos los estados a una nueva partida y muestra en pantalla.
 */
function nuevaPartida() {
    // Completado: no modificar
    obtenerMazoPorFetch().then(() => {
        rondas = [];
        puntajeRondas = [0,0];
        turno = 0;
        sePuedeEnvido = true;
        repartirManos();
        mostrarEstado("¡Nueva partida iniciada! Juega el Jugador 1.");
    });
}

/**
 * Muestra el estado de manos, mesa y puntajes en el HTML.
 * (se provee implementado)
 */
/**
 * Muestra el estado de manos, rondas y partidas previas en el HTML.
 * (visualización ya provista, los alumnos NO la modifican)
 */
function mostrarEstado(mensaje = "") {
    document.getElementById('mano1').innerHTML = manos[0].map((c, i) =>
        `<button ${turno!==0||ganadorPartida()!==null?'disabled':''} onclick="jugarCarta(0,${i})"
      class="bg-white text-black p-2 rounded">${c.valor} de ${c.palo}</button>`).join('');

    document.getElementById('mano2').innerHTML = manos[1].map((c, i) =>
        `<button ${turno!==1||ganadorPartida()!==null?'disabled':''} onclick="jugarCarta(1,${i})"
      class="bg-white text-black p-2 rounded">${c.valor} de ${c.palo}</button>`).join('');

    document.getElementById('mensaje').innerHTML = mensaje + "<br>" +
        `Rondas ganadas: J1=${puntajeRondas[0]} | J2=${puntajeRondas[1]}<br>` +
        (ganadorPartida()!==null ? `<b>Ganador: Jugador ${ganadorPartida()+1}</b>` : '');

    document.getElementById('rondas').innerHTML = rondas.map((r,i) =>
        `Ronda ${i+1}: ${
            r.carta1 ? `J1: ${r.carta1.valor} de ${r.carta1.palo}` : ""
        } ${r.carta2 ? `| J2: ${r.carta2.valor} de ${r.carta2.palo}` : ""}
      ${'ganador' in r ? `--> ${r.ganador===-1?"Empate":("Gana J"+(r.ganador+1))}`:""}`
    ).join('<br>');

    document.getElementById('historial').innerHTML = '<h2 class="mt-4 font-bold">Partidas anteriores</h2>' +
        historialPartidas.map(p =>
            `<div class="my-2 border-b">
          <b>${p.fecha ? (new Date(p.fecha)).toLocaleString() : ''}</b>: 
          Ganador: ${p.ganador===null?'Empate/Indefinido': "Jugador "+(p.ganador+1)}
          <br>Jugadas: ${p.jugadas ? p.jugadas.length : ''}
        </div>`
        ).join('');
}

// Botón Nueva partida
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('nuevaPartidaBtn').addEventListener('click',nuevaPartida);
    document.getElementById('envidoBtn').addEventListener('click',cantarEnvido)
    nuevaPartida();
    getHistorialPartidasFetch();
});

/**
 * Calcula y compara los puntos de envido de ambos jugadores.
 * Muestra el resultado  con un alert.
 *
 * @returns {number[]} Un array con los puntos de envido: [jugador1, jugador2]
 */
 function cantarEnvido() {
    // TODO 1: Verificar si se puede cantar envido
    if (!sePuedeEnvido) {
        alert("No se puede cantar envido en esta partida.");
        return;
    }

    // TODO 2: Validar que ambos jugadores tengan 3 cartas
    if (globalThis.manos[0].length !== 3 || globalThis.manos[1].length !== 3) {
        alert("Ambos jugadores deben tener 3 cartas para cantar envido.");
        return;
    }

    // TODO 3: Calcular los puntos de envido de cada mano
    const puntosJugador1 = calcularEnvidoDeMano(globalThis.manos[0]);
    const puntosJugador2 = calcularEnvidoDeMano(globalThis.manos[1]);

    // TODO 4: Bloquear el envido para el resto de la partida
    sePuedeEnvido = false;

    // TODO 5: Comparar resultados ,asignar puntos y mostrar el resultado con un alert
    if (puntosJugador1 > puntosJugador2) {
        puntajeRondas[0] += 2;
        alert(`Jugador 1 canta envido y gana con ${puntosJugador1} puntos.`);
    } else if (puntosJugador2 > puntosJugador1) {
        puntajeRondas[1] += 2;
        alert(`Jugador 2 canta envido y gana con ${puntosJugador2} puntos.`);
    }

    // TODO 6: Verificar si hay un ganador de la partida
    const ganador = ganadorPartida();
    if (ganador !== null) {
        mostrarEstado("¡Fin de partida por envido!");
        guardarPartidaFetch(ganador).then(getHistorialPartidasFetch);
        nuevaPartida();
    }

    // TODO 7: Retornar los puntos de envido
    return [puntosJugador1, puntosJugador2];
}
/**
 * Calcula los puntos de envido de una mano.
 * Las cartas del mismo palo suman sus valores + 20.
 * Las figuras (10, 11, 12) valen 0 puntos para el envido.
 *
 * @param {Object[]} mano - Arreglo de cartas. Cada carta tiene `valor` y `palo`.
 * @param {number} mano[].valor - Número de la carta (1 al 12).
 * @param {string} mano[].palo - Palo de la carta ("Espadas", "Bastos", "Oros", "Copas").
 * @returns {number} Puntos de envido calculados para esa mano.
 */
function calcularEnvidoDeMano(mano) {
    // TODO: crear un objeto que contenga los valores de las cartas por palo
    const cartasPorPalo = {
        'Espadas': [],
        'Bastos': [],
        'Oros': [],
        'Copas': []
    };

    // TODO: Recorre la mano y agrupa las cartas por palo
    for (const carta of mano) {
        const numero = carta.valor;
        const palo = carta.palo;
        const valor = (numero >= 1 && numero <= 7) ? numero : 0;
        cartasPorPalo[palo].push(valor);
    }

    let maxPuntos = 0;

    // TODO: Calcula los puntos de envido para cada palo
    for (const palo in cartasPorPalo) {
        const valores = cartasPorPalo[palo];
        if (valores.length >= 2) {
            valores.sort((a, b) => b - a);
            maxPuntos = Math.max(maxPuntos, 20 + valores[0] + valores[1]);
        } else if (valores.length === 1) {
            maxPuntos = Math.max(maxPuntos, valores[0]);
        }
    }

    return maxPuntos;
}


// Para debug
window.jugarCarta = jugarCarta;

// Exports para testing
if (typeof module !== 'undefined') {
    module.exports = {
        obtenerMazoPorFetch,
        guardarPartidaFetch,
        getHistorialPartidasFetch,
        mezclar,
        repartirManos,
        jerarquiaCarta,
        jugarCarta,
        mostrarEstado,
        ganadorRonda,
        ganadorPartida,
        cantarEnvido,
        calcularEnvidoDeMano
    };
}