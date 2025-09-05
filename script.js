// ----------------------------
// Referencias al DOM
const pokedex = document.getElementById("pokedex");
const menuGbGames = document.getElementById("gbGames");
const pokemonList = document.getElementById("pokemon-list");
const gameCover = document.getElementById("game-cover");
const gameName = document.getElementById("game-name");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn"); // <- AÑADIDO
const selectionTitle = document.querySelector(".selection-body");

const detailName = document.getElementById("detail-name");
const detailSprite = document.getElementById("detail-sprite");
const detailType = document.getElementById("detail-type");
const detailDescription = document.getElementById("detail-description");

const beepSound = document.getElementById("beep-sound");
beepSound.volume = 0.1;

const carouselWrapper = document.querySelector(".carousel-wrapper");
const carouselContainer = document.querySelector(".carousel-container");
const arrowUp = document.querySelector(".arrow-up");
const arrowDown = document.querySelector(".arrow-down");
const header = document.querySelector("header");
const body = document.querySelector("body");

let isRotating = false;
let currentGame = null;



// ----------------------------
// Consolas y juegos
const consoles = [
  {
    name: "GameBoy",
    img: "./images/consolas/gameBoy.png",
    cssClass: "kanto",
    games: [
      { id: "red", title: "Pokémon Rojo", cover: "./images/caratulas/caratulaPokemonRojo.jpg", offset: 0, limit: 151 },
      { id: "blue", title: "Pokémon Azul", cover: "./images/caratulas/caratulaPokemonAzul.jpg", offset: 0, limit: 151 },
      { id: "yellow", title: "Pokémon Amarillo", cover: "./images/caratulas/caratulaPokemonAmarillo.jpg",  offset: 0, limit: 151 }
    ]
  },
  {
    name: "GameBoy<br>Color",
    img: "./images/consolas/gameBoyColor.png",
    cssClass: "johto",
    games: [
      { id: "gold", title: "Pokémon Oro", cover: "./images/caratulas/caratulaPokemonOro.jpg", offset: 151, limit: 100 },
      { id: "silver", title: "Pokémon Plata", cover: "./images/caratulas/caratulaPokemonPlata.jpg", offset: 151, limit: 100 },
      { id: "crystal", title: "Pokémon Cristal", cover: "./images/caratulas/caratulaPokemonCristal.jpg", offset: 151, limit: 100 }
    ]
  },
  {
    name: "GameBoy<br>Advance",
    img: "./images/consolas/gameBoyAdvance.png",
    cssClass: "hoenn",
    games: [
      { id: "ruby", title: "Pokémon Rubí", cover: "./images/caratulas/caratulaPokemonRubi.jpg", offset: 251, limit: 135 },
      { id: "sapphire", title: "Pokémon Zafiro", cover: "./images/caratulas/caratulaPokemonZafiro.jpg", offset: 251, limit: 135 },
      { id: "emerald", title: "Pokémon Esmeralda", cover: "./images/caratulas/caratulaPokemonEsmeralda.jpg", offset: 251, limit: 135 }
    ]
  }
];

function setRegion(element, region, type) {
  element.classList.remove("kanto-"+type,"johto-"+type,"hoenn-"+type,"default-"+type);
  if (region === "kanto") element.classList.add("kanto-"+type);
  else if (region === "johto") element.classList.add("johto-"+type);
  else if (region === "hoenn") element.classList.add("hoenn-"+type);
  else element.classList.add("default-"+type);
}

// ----------------------------
// Generar menú dinámico
function generateGameMenu() {
  menuGbGames.innerHTML = "";
  carouselContainer.innerHTML = "";

  consoles.forEach(consoleObj => {
    const gamesDiv = document.createElement("div");
    gamesDiv.className = `games console-container ${consoleObj.cssClass}`;

    const consoleIcon = document.createElement("div");
    consoleIcon.className = "consoleIcon";
    consoleIcon.innerHTML = `<h1>${consoleObj.name}</h1><img src="${consoleObj.img}" alt="Consola ${consoleObj.name}">`;

    const gameList = document.createElement("div");
    gameList.className = "gameList";

    consoleObj.games.forEach(game => {
      const btn = document.createElement("button");
      btn.onclick = () => loadPokedex(game, consoleObj);
      btn.innerHTML = `<img src="${game.cover}" alt="${game.title}"><p>${game.title}</p>`;
      gameList.appendChild(btn);
    });

    gamesDiv.appendChild(consoleIcon);
    gamesDiv.appendChild(gameList);
    carouselContainer.appendChild(gamesDiv);
  });

  // Centrar GameBoy al inicio
  const items = Array.from(carouselContainer.children);
  const gameBoyIndex = items.findIndex(c => c.classList.contains("kanto"));
  const middleIndex = Math.floor(items.length / 2);

  if (gameBoyIndex !== middleIndex) {
    const shiftCount = middleIndex - gameBoyIndex + 1;
    if (shiftCount > 0) {
      for (let i = 0; i < shiftCount; i++) {
        const first = carouselContainer.firstChild;
        carouselContainer.appendChild(first);
      }
    } else {
      for (let i = 0; i < Math.abs(shiftCount); i++) {
        const last = carouselContainer.lastChild;
        carouselContainer.insertBefore(last, carouselContainer.firstChild);
      }
    }
  }

  updateSelected();
}

// ----------------------------
// Carousel tipo ruleta 3D
function rotateCarousel(direction) {
  if (isRotating) return;
  isRotating = true;

  const items = Array.from(carouselContainer.children);

  if (direction === "up") {
    const last = items.pop();
    carouselContainer.insertBefore(last, items[0]);
  } else if (direction === "down") {
    const first = items.shift();
    carouselContainer.appendChild(first);
  }

  requestAnimationFrame(() => updateSelected());

  setTimeout(() => {
    isRotating = false;
  }, 500);
}

function updateSelected() {
  const items = Array.from(carouselContainer.children);
  items.forEach(item => {
    item.classList.remove("selected", "adjacent", "prev", "far");
    const buttons = item.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
  });

  const middleIndex = Math.floor(items.length / 2);
  const selectedItem = items[middleIndex];
  selectedItem.classList.add("selected");
  const buttons = selectedItem.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = false);

  if (items[middleIndex - 1]) items[middleIndex - 1].classList.add("adjacent", "prev");
  if (items[middleIndex + 1]) items[middleIndex + 1].classList.add("adjacent");
  if (items[middleIndex - 2]) items[middleIndex - 2].classList.add("far", "prev");
  if (items[middleIndex + 2]) items[middleIndex + 2].classList.add("far");
}

// ----------------------------
// Lista Pokémon (sin límite) + búsqueda robusta
let allPokemons = [];

// Normaliza texto para comparar (lowercase + trim)
function normalizeQuery(q) {
  return (q || "").toLowerCase().trim();
}

async function loadPokemonList(game) {
  pokemonList.innerHTML = "<p>Cargando Pokémon...</p>";
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${game.offset}&limit=${game.limit}`);
    const data = await response.json();
    allPokemons = data.results;

    // Render inicial (lista completa) y seleccionar el primero
    const full = allPokemons.map((p, i) => ({ ...p, index: i }));
    renderPokemonList(full, game, /* autoSelectFirst */ true);

    // Eventos de búsqueda
    // 1) Filtrado en vivo (NO selecciona nada aún)
    searchInput.oninput = () => {
      const q = normalizeQuery(searchInput.value);
      renderForTyping(q, currentGame);
    };

    // 2) Click en botón Buscar
    searchBtn.onclick = () => runSearch();

    // 3) Enter en el input
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
      if (e.key === "Escape") {
        // Reset rápido con ESC
        searchInput.value = "";
        renderForTyping("", currentGame);
        // Mantener selección actual (no forzar cambio)
      }
    });

  } catch (error) {
    console.error(error);
    pokemonList.innerHTML = "<p>Error cargando Pokémon.</p>";
  }
}

/**
 * Renderiza lista. 
 * - pokemonArray: [{ name, url, index }]
 * - autoSelectFirst: si true, hace click en el primer item (solo para carga inicial)
 */
function renderPokemonList(pokemonArray, game, autoSelectFirst = false) {
  pokemonList.innerHTML = "";

  pokemonArray.forEach((poke) => {
    const pokemonId = poke.index + 1 + game.offset;
    const pokemonName = capitalizeFirstLetter(poke.name);

    const card = document.createElement("div");
    card.className = "pokemon-slot";
    card.dataset.name = poke.name.toLowerCase(); // para coincidencia exacta
    card.innerHTML = `<strong>#${pokemonId.toString().padStart(3, "0")}</strong> <span>${pokemonName}</span>`;

    card.addEventListener("click", async () => {
      document.querySelectorAll(".pokemon-slot").forEach(el => el.classList.remove("selected-slot"));
      card.classList.add("selected-slot");
      try { beepSound.currentTime = 0; beepSound.play(); } catch {}
      const pokeData = await fetch(poke.url).then(res => res.json());
      showDetail(pokeData);
    });

    pokemonList.appendChild(card);
  });

  // Solo selecciona automático si es carga inicial
  if (autoSelectFirst) {
    const firstCard = pokemonList.querySelector(".pokemon-slot");
    if (firstCard) firstCard.click();
  }

  // Asegura el scroll en top del contenedor de lista
  const container = document.getElementById("pokemon-list-container");
  if (container) container.scrollTop = 0;
}

/**
 * Renderiza mientras escribes (solo filtra y renderiza, NO selecciona).
 */
function renderForTyping(query, game) {
  if (!query) {
    const full = allPokemons.map((p, i) => ({ ...p, index: i }));
    // No auto-seleccionamos al escribir para no “saltar” selección
    renderPokemonList(full, game, /* autoSelectFirst */ false);
    return;
  }

  const filtered = allPokemons
    .map((p, i) => ({ ...p, index: i }))
    .filter(p => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    pokemonList.innerHTML = "<p>No se encontraron Pokémon.</p>";
    return;
  }

  renderPokemonList(filtered, game, /* autoSelectFirst */ false);
}

/**
 * Ejecuta la búsqueda (clic en botón o Enter):
 * - Renderiza según la query
 * - Selecciona exacto si existe; si no, primero del resultado.
 */
function runSearch() {
  const query = normalizeQuery(searchInput.value);

  // Construye el listado según la query (reutiliza la misma lógica)
  if (!query) {
    const full = allPokemons.map((p, i) => ({ ...p, index: i }));
    renderPokemonList(full, currentGame, /* autoSelectFirst */ true);
    return;
  }

  const filtered = allPokemons
    .map((p, i) => ({ ...p, index: i }))
    .filter(p => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    pokemonList.innerHTML = "<p>No se encontraron Pokémon.</p>";
    detailName.textContent = "";
    detailSprite.src = "";
    detailType.textContent = "";
    detailDescription.textContent = "";
    return;
  }

  // Render SIN auto select
  renderPokemonList(filtered, currentGame, false);

  // 1) Intentar coincidencia exacta
  const exactCard = pokemonList.querySelector(`.pokemon-slot[data-name="${query}"]`);
  if (exactCard) {
    exactCard.click();
    exactCard.scrollIntoView({ block: "nearest" });
  } else {
    // 2) Si no hay exacta, seleccionar primero del resultado
    const firstCard = pokemonList.querySelector(".pokemon-slot");
    if (firstCard) {
      firstCard.click();
      firstCard.scrollIntoView({ block: "nearest" });
    }
  }
}

// ----------------------------
// Mostrar detalle en contenedor lateral
async function showDetail(pokemon) {
  detailName.textContent = `#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`;
  detailSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  detailType.textContent = "Tipo: " + pokemon.types.map(t => translateType(t.type.name)).join(" / ");

  const species = await fetch(pokemon.species.url).then(res => res.json());
  const descriptionES = species.flavor_text_entries.find(e => e.language.name === "es");
  detailDescription.textContent = descriptionES ? descriptionES.flavor_text.replace(/\n|\f/g,' ') : "Descripción no disponible";
}

// ----------------------------
// Cargar Pokédex
async function loadPokedex(game, consoleObj) {
  menuGbGames.style.display = "none";
  pokedex.style.display = "block";
  carouselWrapper.style.display = "none";
  arrowUp.style.display = "none";
  arrowDown.style.display = "none";

  // Mostrar el input de búsqueda al abrir Pokédex
  searchInput.style.display = "block";
  searchInput.value = "";
  searchInput.placeholder = "Buscar Pokémon...";
  //------------------Estilos de Pagina--------------------
  //Cargar estilo de header segun region
  setRegion(header, consoleObj.cssClass, "header");
  //Cargar estilo de body segun region
  setRegion(body, consoleObj.cssClass, "body");
  //Cargar estilo de pokedex segun region
  setRegion(pokedex, consoleObj.cssClass, "pokedex");
  
  selectionTitle.textContent = "Selecciona un Pokémon";
  gameCover.src = game.cover;
  gameCover.alt = game.title;
  gameName.textContent = game.title;

  currentGame = game;
  await loadPokemonList(game);

  // Foco directo al input para poder escribir de inmediato
  setTimeout(() => searchInput.focus(), 0);
}

// ----------------------------
// Volver al menú
function goBack() {
  pokedex.style.display = "none";
  menuGbGames.style.display = "flex";
  carouselWrapper.style.display = "flex";
  arrowUp.style.display = "block";
  arrowDown.style.display = "block";
  updateSelected();
  pokemonList.innerHTML = "";
  detailName.textContent = "";
  detailSprite.src = "";
  detailType.textContent = "";
  detailDescription.textContent = "";

  // Ocultar input al volver al menú
  searchInput.style.display = "none";
  searchInput.value = "";

  header.classList.remove("kanto-header","johto-header","hoenn-header");
  header.classList.add("default-header");
  body.classList.remove("kanto-body","johto-body","hoenn-body");
  body.classList.add("default-body");
  selectionTitle.textContent = "Selecciona tu juego";
}

document.getElementById("backBtn").onclick = goBack;

// ----------------------------
// Auxiliares
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function translateType(type) {
  const typesES = {
    normal:"Normal", fighting:"Lucha", flying:"Volador", poison:"Veneno", ground:"Tierra", rock:"Roca",
    bug:"Bicho", ghost:"Fantasma", steel:"Acero", fire:"Fuego", water:"Agua", grass:"Planta", electric:"Eléctrico",
    psychic:"Psíquico", ice:"Hielo", dragon:"Dragón", dark:"Siniestro", fairy:"Hada"
  };
  return typesES[type] || type;
}

// ----------------------------
// Inicializar
generateGameMenu();
arrowUp.addEventListener("click", () => rotateCarousel("up"));
arrowDown.addEventListener("click", () => rotateCarousel("down"));
