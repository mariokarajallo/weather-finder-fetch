// selectores
const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    //validacion
    mostrarError("Ambos campos son obligatorios");

    return;
  }

  consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
  const appId = "5b281bcd48ed0e5111b7bd92e24eefc5";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      console.log(datos);

      limpiarHTML(); // limpiar HTML
      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");
        return;
      }

      //imprimir la respuesta del fetch en el HTML
      mostrarClima(datos);
    });
}

function mostrarClima(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  const centigrados = kelvinACentigrados(temp);
  const centigradosMax = kelvinACentigrados(temp_max);
  const centigradosMin = kelvinACentigrados(temp_min);

  //creamos el elemento para nombre de ciudad
  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Ciudad ${name}`;
  nombreCiudad.classList.add("text-bold", "text-2xl");

  // creamos el elemento para la temperatura actual
  const tempActual = document.createElement("p");
  tempActual.innerHTML = `${centigrados} &#8451;`;
  tempActual.classList.add("font-bold", "text-6xl");

  // creamos el elemento para la temperatura maxima
  const tempMax = document.createElement("p");
  tempMax.innerHTML = `Max: ${centigradosMax} &#8451;`;
  tempMax.classList.add("text-xl");

  // creamos el elemento para la temperatura minima
  const tempMin = document.createElement("p");
  tempMin.innerHTML = `Min: ${centigradosMin} &#8451;`;
  tempMin.classList.add("text-xl");

  // contenedor de nombre ciudad y temperaturas
  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(tempMax);
  resultadoDiv.appendChild(tempMin);

  // agregamos nuestro contenedor de nombre ciudad y temperaturas al HTML
  resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".alerta");
  if (!alerta) {
    //crear alerta
    const alerta = document.createElement("div");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "relative",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center",
      "alerta"
    );

    alerta.innerHTML = `
    <strong class="font-bold">Error</strong>
    <span class="block">${mensaje}</span>
  `;

    container.appendChild(alerta);

    //eliminar la alerta despues de un tiempo
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}
