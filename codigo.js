// Variable para almacenar la información de forma local (Caché)
let peliculasCache = null;
const URL_API = "https://ghibliapi.vercel.app/films";

/**
 * Función principal que gestiona la carga de datos y la optimización.
 * Cumple con el requisito de ir al servidor solo la primera vez.
 */
async function obtenerPeliculas(accion) {
    const statusDiv = document.getElementById("status");
    const listaUI = document.getElementById("listaPeliculas");
    
    // Limpiar vista previa
    listaUI.innerHTML = "";

    try {
        // OPTIMIZACIÓN: Solo buscamos en la API si no tenemos los datos guardados
        if (peliculasCache === null) {
            statusDiv.innerText = "Estado: Obteniendo datos desde el servidor (Primera vez)...";
            const respuesta = await fetch(URL_API);
            peliculasCache = await respuesta.json();
            console.log("%c Datos cargados desde el servidor API ", "background: #222; color: #bada55");
        } else {
            statusDiv.innerText = "Estado: Mostrando datos desde caché local (Optimizado).";
            console.log("%c Usando datos locales ", "background: #222; color: #3498db");
        }

        // Una vez que tenemos los datos (de la API o del caché), procesamos según el botón
        procesarDatos(accion, peliculasCache);

    } catch (error) {
        statusDiv.innerText = "Error: No se pudo conectar con el servicio.";
        console.error("Error al obtener películas:", error);
    }
}

/**
 * Función para mostrar la información según el botón presionado
 */
function procesarDatos(accion, datos) {
    const listaUI = document.getElementById("listaPeliculas");
    console.clear(); // Limpiamos consola para ver solo el resultado actual
    console.log(`--- Resultados para: ${accion} ---`);

    datos.forEach(cine => {
        let item = document.createElement("li");
        let mensajeConsola = "";

        switch (accion) {
            case 'titulo-director':
                mensajeConsola = `Título: ${cine.title} | Director: ${cine.director}`;
                item.innerHTML = `<strong>${cine.title}</strong> - Dirigido por: ${cine.director}`;
                break;
            
            case 'titulo-año':
                mensajeConsola = `Título: ${cine.title} | Año: ${cine.release_date}`;
                item.innerHTML = `<strong>${cine.title}</strong> (${cine.release_date})`;
                break;

            case 'titulo-descripcion':
                mensajeConsola = `Título: ${cine.title}\nDescripción: ${cine.description}`;
                item.innerHTML = `<strong>${cine.title}</strong>: ${cine.description}`;
                break;

            case 'solo-id':
                mensajeConsola = `ID: ${cine.id}`;
                item.innerText = `ID: ${cine.id}`;
                break;
        }

        console.log(mensajeConsola);
        listaUI.appendChild(item);
    });
}