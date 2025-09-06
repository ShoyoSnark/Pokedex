import { setRegion } from "./utils.js";
import { rotateCarousel, updateSelected, centerCarouselOn } from "./carousel.js";
import { loadPokemonList, renderPokemonList, showDetail, setCurrentGame, allPokemons, currentGame } from "./pokedex.js";

// ----------------------------
// DOM PRINCIPAL
// Elementos visibles y contenedores de la Pokédex
const pokedex = document.getElementById("pokedex");
const menuGbGames = document.getElementById("gbGames");
const pokemonList = document.getElementById("pokemon-list");
const gameCover = document.getElementById("game-cover");
const gameName = document.getElementById("game-name");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const selectionTitle = document.querySelector(".selection-body");

// Elementos específicos para mostrar detalles de un Pokémon
const detailElements = {
  detailName: document.getElementById("detail-name"),
  detailSprite: document.getElementById("detail-sprite"),
  detailType: document.getElementById("detail-type"),
  detailDescription: document.getElementById("detail-description")
};

// ----------------------------
// BEEP OPTIMIZADO
// Audio que se reproducirá al seleccionar Pokémon
const beepSound = document.getElementById("beep-sound");
beepSound.volume = 0.1;

// ----------------------------
// ELEMENTOS DEL CAROUSEL
// Contenedores y flechas para navegación
const carouselWrapper = document.querySelector(".carousel-wrapper");
const carouselContainer = document.querySelector(".carousel-container");
const arrowUp = document.querySelector(".arrow-up");
const arrowDown = document.querySelector(".arrow-down");

// Header y body para aplicar estilos de región
const header = document.querySelector("header");
const body = document.querySelector("body");

// ----------------------------
// INICIALIZAR VISIBILIDAD DE ELEMENTOS
pokedex.style.display = "none";           // Pokédex oculta al inicio
carouselWrapper.style.display = "flex";   // Carousel visible
arrowUp.style.display = "block";          // Flechas visibles
arrowDown.style.display = "block";
searchInput.style.display = "none";       // Input de búsqueda oculto

// ----------------------------
// CONSOLAS Y JUEGOS DISPONIBLES
const consoles = [
  {
    name: "GameBoy",
    img: "./images/consolas/gameBoy.png",
    cssClass: "kanto",
    games: [
      { id: "red", title: "Pokémon Rojo", cover: "./images/caratulas/caratulaPokemonRojo.jpg", offset: 0, limit: 151 },
      { id: "blue", title: "Pokémon Azul", cover: "./images/caratulas/caratulaPokemonAzul.jpg", offset: 0, limit: 151 },
      { id: "yellow", title: "Pokémon Amarillo", cover: "./images/caratulas/caratulaPokemonAmarillo.jpg", offset: 0, limit: 151 }
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

// ----------------------------
// GENERAR MENÚ DE JUEGOS
function generateGameMenu() {
  carouselContainer.innerHTML = "";
  menuGbGames.innerHTML = "";

  // Crear cada consola y sus juegos
  consoles.forEach(consoleObj => {
    const gamesDiv = document.createElement("div");
    gamesDiv.className = `games console-container ${consoleObj.cssClass}`;

    const consoleIcon = document.createElement("div");
    consoleIcon.className = "consoleIcon";
    consoleIcon.innerHTML = `<h1>${consoleObj.name}</h1><img src="${consoleObj.img}" alt="${consoleObj.name}">`;

    const gameList = document.createElement("div");
    gameList.className = "gameList";

    // Crear botón para cada juego
    consoleObj.games.forEach(game => {
      const btn = document.createElement("button");
      btn.onclick = () => loadPokedexGame(game, consoleObj);
      btn.innerHTML = `<img src="${game.cover}" alt="${game.title}"><p>${game.title}</p>`;
      gameList.appendChild(btn);
    });

    gamesDiv.appendChild(consoleIcon);
    gamesDiv.appendChild(gameList);
    carouselContainer.appendChild(gamesDiv);
  });

  // Centrar el carousel en la primera consola
  centerCarouselOn(carouselContainer, "kanto");
}

// ----------------------------
// CARGAR POKÉDEX DE UN JUEGO
async function loadPokedexGame(game, consoleObj) {
  // Ocultar menú y mostrar Pokédex
  menuGbGames.style.display = "none";
  pokedex.style.display = "block";
  carouselWrapper.style.display = "none";
  arrowUp.style.display = "none";
  arrowDown.style.display = "none";
  searchInput.style.display = "block";
  searchInput.value = "";
  searchInput.placeholder = "Buscar Pokémon...";

  // Aplicar estilos según la región del juego
  setRegion(header, consoleObj.cssClass, "header");
  setRegion(body, consoleObj.cssClass, "body");
  setRegion(pokedex, consoleObj.cssClass, "pokedex");

  // Actualizar información del juego
  selectionTitle.textContent = "Selecciona un Pokémon";
  gameCover.src = game.cover;
  gameCover.alt = game.title;
  gameName.textContent = game.title;

  // Guardar juego actual y cargar lista de Pokémon
  setCurrentGame(game);
  await loadPokemonList(game, pokemonList, { showDetail: (p) => showDetail(p, detailElements) });

  // Foco en el input de búsqueda
  searchInput.focus();
}

// ----------------------------
// BÚSQUEDA DE POKÉMON
function renderForTyping(query) {
  if (!query) {
    // Si no hay texto, mostrar lista completa
    loadPokemonList(currentGame, pokemonList, { showDetail: (p) => showDetail(p, detailElements) });
    return;
  }

  // Filtrar Pokémon por coincidencia
  const filtered = allPokemons.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  renderPokemonList(filtered, currentGame, pokemonList, { showDetail: (p) => showDetail(p, detailElements) }, false);
}

function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  // Buscar Pokémon exacto
  const poke = allPokemons.find(p => p.name.toLowerCase() === query);
  if (!poke) {
    alert("Pokémon no encontrado");
    return;
  }

  // Reproducir beep al seleccionar
  try { beepSound.currentTime = 0; beepSound.play(); } catch {}

  // Seleccionar el Pokémon en la lista
  const card = pokemonList.querySelector(`.pokemon-slot[data-name="${poke.name.toLowerCase()}"]`);
  if (card) {
    pokemonList.querySelectorAll(".pokemon-slot").forEach(el => el.classList.remove("selected-slot"));
    card.classList.add("selected-slot");
  }

  // Mostrar detalles
  fetch(poke.url)
    .then(res => res.json())
    .then(pokeData => showDetail(pokeData, detailElements));
}

// ----------------------------
// VOLVER AL MENÚ DE CONSOLAS
function goBack() {
  pokedex.style.display = "none";
  menuGbGames.style.display = "flex";
  carouselWrapper.style.display = "flex";
  arrowUp.style.display = "block";
  arrowDown.style.display = "block";
  updateSelected(carouselContainer);

  // Limpiar información de Pokémon
  pokemonList.innerHTML = "";
  detailElements.detailName.textContent = "";
  detailElements.detailSprite.src = "";
  detailElements.detailType.textContent = "";
  detailElements.detailDescription.textContent = "";
  searchInput.style.display = "none";
  searchInput.value = "";

  // Resetear estilos
  header.classList.remove("kanto-header","johto-header","hoenn-header");
  header.classList.add("default-header");
  body.classList.remove("kanto-body","johto-body","hoenn-body");
  body.classList.add("default-body");
  selectionTitle.textContent = "Selecciona tu juego";
}

// ----------------------------
// INICIALIZAR EVENTOS DEL DOM
document.addEventListener("DOMContentLoaded", () => {
  // Generar menú de juegos
  generateGameMenu();

  // Navegación del carousel
  arrowUp.addEventListener("click", () => rotateCarousel("up", carouselContainer, updateSelected));
  arrowDown.addEventListener("click", () => rotateCarousel("down", carouselContainer, updateSelected));

  // Input de búsqueda
  searchInput.addEventListener("input", () => renderForTyping(searchInput.value));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); runSearch(); }
    if (e.key === "Escape") { searchInput.value = ""; renderForTyping(""); }
  });

  // Botón de búsqueda y volver
  searchBtn.addEventListener("click", runSearch);
  document.getElementById("backBtn").addEventListener("click", goBack);
});
