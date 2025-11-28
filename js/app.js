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
  const appId = import.meta.env.VITE_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  spinner();

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
    weather,
  } = datos;

  const centigrados = kelvinACentigrados(temp);
  const centigradosMax = kelvinACentigrados(temp_max);
  const centigradosMin = kelvinACentigrados(temp_min);
  const descripcion = weather[0] ? weather[0].description : "";

  // Contenedor principal del resultado
  const contentDiv = document.createElement("div");
  contentDiv.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-between",
    "h-full",
    "py-4",
    "animate-fade-in-up",
    "w-full"
  );

  // 1. Ciudad (Top)
  const cityDiv = document.createElement("div");
  cityDiv.classList.add("text-center", "mt-4");

  const nombreCiudad = document.createElement("h2");
  nombreCiudad.textContent = name;
  nombreCiudad.classList.add("text-3xl", "font-medium", "tracking-wide");

  cityDiv.appendChild(nombreCiudad);

  // 2. Temperatura (Center - Huge)
  const tempDiv = document.createElement("div");
  tempDiv.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "flex-1"
  );

  const tempActual = document.createElement("p");
  tempActual.innerHTML = `${centigrados}&deg;`;
  tempActual.classList.add(
    "text-[6rem]",
    "font-extralight",
    "leading-none",
    "tracking-tighter"
  );

  const climaDesc = document.createElement("p");
  climaDesc.textContent =
    descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
  climaDesc.classList.add("text-lg", "font-medium", "mt-2", "text-white/90");

  tempDiv.appendChild(tempActual);
  tempDiv.appendChild(climaDesc);

  // 3. High/Low (Bottom)
  const hlDiv = document.createElement("div");
  hlDiv.classList.add("flex", "gap-4", "text-lg", "font-medium", "mb-8");

  const maxSpan = document.createElement("span");
  maxSpan.innerHTML = `H:${centigradosMax}&deg;`;

  const minSpan = document.createElement("span");
  minSpan.innerHTML = `L:${centigradosMin}&deg;`;

  hlDiv.appendChild(maxSpan);
  hlDiv.appendChild(minSpan);

  // Append everything
  contentDiv.appendChild(cityDiv);
  contentDiv.appendChild(tempDiv);
  contentDiv.appendChild(hlDiv);

  resultado.appendChild(contentDiv);
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
      "bg-red-500",
      "text-white",
      "px-6",
      "py-4",
      "rounded-xl",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center",
      "alerta",
      "shadow-lg",
      "transform",
      "transition-all",
      "duration-500",
      "hover:scale-105",
      "flex",
      "items-center",
      "justify-center",
      "gap-3"
    );

    alerta.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
        <strong class="font-bold block">¡Error!</strong>
        <span class="block text-sm">${mensaje}</span>
    </div>
  `;

    limpiarHTML();
    resultado.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
      // Restore initial state if needed, or just leave empty
    }, 3000);
  }
}

function spinner() {
  limpiarHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("flex", "justify-center", "items-center", "mt-10");

  divSpinner.innerHTML = `
    <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `;

  resultado.appendChild(divSpinner);
}
