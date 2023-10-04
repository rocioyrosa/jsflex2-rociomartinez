document.addEventListener('DOMContentLoaded', function() {
    // Se ejecuta cuando el DOM se ha cargado completamente

    // Obtiene del DOM 'viajesSection'
    const viajesSection = document.getElementById('viajesSection');
    
    // Obtiene del almacenamiento local los viajes calculados, si no hay, asignar un array vacío
    const viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    
    if (viajes.length > 0) {
        // Si hay viajes, los muestra y muestra la sección 'viajesSection' en bloque 
        mostrarViajes();
        viajesSection.style.display = 'block';
    } else {
        // Si no hay viajes, oculta la 'viajesSection' y comienza en 1 sola screenview
        viajesSection.style.display = 'none';
    }
});

document.getElementById('viajeForm').addEventListener('submit', function(event) {
    // Se ejecuta cuando el user envía formulario de viaje
    
    event.preventDefault(); // Previene el comportamiento por defecto: recarga de página en el navegador tras la acción de submit Calcular.
    
    // Obtiene los valores del formulario parseados en números decimales
    const distanciaViaje = parseFloat(document.getElementById('distancia').value);
    const precioCombustible = parseFloat(document.getElementById('precioCombustible').value);
    const rendimientoAuto = parseFloat(document.getElementById('rendimientoAuto').value);

    if (!isNaN(distanciaViaje) && !isNaN(precioCombustible) && !isNaN(rendimientoAuto) && rendimientoAuto !== 0) {
        // Verifica si los valores son válidos

        // Calcula la cantidad de litros necesarios y el costo total para cada viaje
        const litrosNecesarios = distanciaViaje / rendimientoAuto;
        const costoTotal = litrosNecesarios * precioCombustible;

        // Actualiza el DOM con el resultado en una case de alerta de BS, que tmb arregla el resultado final a decimal de 2 cifras.
        const resultadoContainer = document.getElementById('resultado');
        resultadoContainer.innerHTML = `<div class= "alert alert-success"><p>El costo total del combustible para tu viaje es de $${costoTotal.toFixed(2)}</p></div>`;

        // Objeto con propiedad y valor (variables) de los detalles del viaje
        const viaje = {
            distancia: distanciaViaje,
            precioLitro: precioCombustible,
            rendimientoAuto: rendimientoAuto,
            costoTotal: costoTotal
        };

        // Array que obtiene los objetos 'viaje' existentes en el almacenamiento local o asigna un array vacío en el caso de que no lo haya. 
        const viajes = JSON.parse(localStorage.getItem('viajes')) || [];
        viajes.push(viaje);
        
        // Guarda los viajes actualizados en el almacenamiento local
        localStorage.setItem('viajes', JSON.stringify(viajes));

        // Muestra la lista actualizada de viajes
        mostrarViajes();
    } else {
        // Si los valores no son válidos, muestra un mensaje de error, aunque es muy improbable que salga porque el form tiene validación desde BS, pero es una segunda capa para el correcto funcionamiento del cicloo.
        const resultadoContainer = document.getElementById('resultado');
        resultadoContainer.innerHTML = `<div class= "alert alert-danger"><p>Hubo un error en tu cálculo</p></div>`;
    }
});

function mostrarViajes() {
    // Función para mostrar la lista de viajes

    // Obtiene los viajes del almacenamiento local o asigna un array vacío si no hay
    const viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    const viajesContainer = document.getElementById('viajesContainer');
    const borrarHistorialBtn = document.getElementById('borrarHistorialBtn');
    const viajesTitle = document.getElementById('viajesTitle');

    viajesContainer.innerHTML = ''; // Limpia el contenido actual para que no se dupliquen las cards de viajes

    if (viajes.length > 0) {
        viajes.forEach((viaje, index) => {
            // Para cada viaje, si hay, crea una tarjeta (card) con la información

            const card = document.createElement('div');
            card.classList.add('card', 'm-2');

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Viaje Nro. ${index + 1}</h5>
                    <p class="card-text">Distancia: ${viaje.distancia} km</p>
                    <p class="card-text">Precio del litro: $${viaje.precioLitro.toFixed(2)}</p>
                    <p class="card-text">Rendimiento del auto: ${viaje.rendimientoAuto.toFixed(2)} km/l</p>
                    <p class="card-text">Costo total: $${viaje.costoTotal.toFixed(2)}</p>
                    <button class="btn btn-danger" onclick="borrarViaje(${index})">Borrar</button>
                </div>
            `; // En cada card que se crea se agrega el botón 'Borrar' con el atributo/evento onclick que al llamar a la función borrarViaje() y haciendo refe a ese array que se está recorriendo lo elimina del local storage.

            viajesContainer.appendChild(card); // Agregar la nueva card (hija) al contenedor padre
        });

        borrarHistorialBtn.style.display = 'block'; // Asegura que el botón y el título de la section se muestren en bloques
        viajesTitle.style.display = 'block';

    } else {
        // Si no hay viajes, muestra un mensaje que lo indica y oculta botón y título 
        borrarHistorialBtn.style.display = 'none';
        viajesTitle.style.display = 'none';

        const noViajesMessage = document.createElement('p');
        noViajesMessage.innerText = 'No hay viajes guardados.';
        viajesContainer.appendChild(noViajesMessage);
    }
}

function borrarHistorial() {
    // Función para borrar todos los viajes

    localStorage.removeItem('viajes'); // Elimina los viajes del almacenamiento local

    const viajesContainer = document.getElementById('viajesContainer');
    viajesContainer.innerHTML = ''; // Llama a viajesContainer y limpiar el contenido actual 

    const viajesTitle = document.getElementById('viajesTitle');
    viajesTitle.style.display = 'none'; // Llama a viajesTitle y lo oculta

    const borrarHistorialBtn = document.getElementById('borrarHistorialBtn');
    borrarHistorialBtn.style.display = 'none'; // Llama al botón de borrar historial y lo oculta

    const noViajesMessage = document.createElement('p');
    noViajesMessage.innerText = 'No hay viajes guardados.';
    viajesContainer.appendChild(noViajesMessage); // Crea y muestra un mensaje indicando que no hay viajes guardados
}

function borrarViaje(index) {
    // Función para borrar un viaje específico llamada en la template de card

    //Obtiene los viajes en el almacenamiento local
    let viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    viajes.splice(index, 1); // Elimina el viaje del array viajes
    localStorage.setItem('viajes', JSON.stringify(viajes)); // Guarda los viajes actualizados
    location.reload(); // Recarga la página para reflejar los cambios
}

mostrarViajes(); // Muestra los viajes al cargar la página 