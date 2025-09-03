// ----------------------------
// Referencias al DOM
const pokedex = document.getElementById("pokedex");
const menuGbGames = document.getElementById("gbGames");
const pokemonList = document.getElementById("pokemon-list");
const gameCover = document.getElementById("game-cover");
const gameName = document.getElementById("game-name");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("pokemon-modal");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modal-name");
const modalNumber = document.getElementById("modal-number");
const modalType = document.getElementById("modal-type");
const modalHeight = document.getElementById("modal-height");
const modalWeight = document.getElementById("modal-weight");
const modalDescription = document.getElementById("modal-description");
const modalSprite = document.getElementById("modal-sprite");

const beepSound = document.getElementById("beep-sound");
// Pre-cargar y reproducir en silencio al inicio para evitar retraso
beepSound.volume = 0;
beepSound.play().catch(() => {}); // ignora el error de autoplay
beepSound.pause();
beepSound.currentTime = 0;
beepSound.volume = 0.1;

const carouselWrapper = document.querySelector(".carousel-wrapper");
const carouselContainer = document.querySelector(".carousel-container");
const arrowUp = document.querySelector(".arrow-up");
const arrowDown = document.querySelector(".arrow-down");

// ----------------------------
// Consolas y juegos
const consoles = [
  {
    name: "GameBoy",
    img: "./images/consolas/gameBoy.png",
    cssClass: "kanto",
    games: [
      { id: "red", title: "Pokémon Rojo", cover: "./images/caratulas/caratulaPokemonRojo.jpg", borderColor: "red", offset: 0, limit: 151 },
      { id: "blue", title: "Pokémon Azul", cover: "./images/caratulas/caratulaPokemonAzul.jpg", borderColor: "blue", offset: 0, limit: 151 },
      { id: "yellow", title: "Pokémon Amarillo", cover: "./images/caratulas/caratulaPokemonAmarillo.jpg", borderColor: "gold", offset: 0, limit: 151 }
    ]
  },
  {
    name: "GameBoy<br>Color",
    img: "./images/consolas/gameBoyColor.png",
    cssClass: "johto",
    games: [
      { id: "gold", title: "Pokémon Oro", cover: "./images/caratulas/caratulaPokemonOro.jpg", borderColor: "gold", offset: 151, limit: 100 },
      { id: "silver", title: "Pokémon Plata", cover: "./images/caratulas/caratulaPokemonPlata.jpg", borderColor: "#c0c0c0", offset: 151, limit: 100 },
      { id: "crystal", title: "Pokémon Cristal", cover: "./images/caratulas/caratulaPokemonCristal.jpg", borderColor: "#a7d8de", offset: 151, limit: 100 }
    ]
  },
  {
    name: "GameBoy<br>Advance",
    img: "./images/consolas/gameBoyAdvance.png",
    cssClass: "hoenn",
    games: [
      { id: "ruby", title: "Pokémon Rubí", cover: "./images/caratulas/caratulaPokemonRubi.jpg", borderColor: "#d32f2f", offset: 251, limit: 135 },
      { id: "sapphire", title: "Pokémon Zafiro", cover: "./images/caratulas/caratulaPokemonZafiro.jpg", borderColor: "#1976d2", offset: 251, limit: 135 },
      { id: "emerald", title: "Pokémon Esmeralda", cover: "./images/caratulas/caratulaPokemonEsmeralda.jpg", borderColor: "#43a047", offset: 251, limit: 135 }
    ]
  }
];

// ----------------------------
// Generar menú dinámico
function generateGameMenu() {
  menuGbGames.innerHTML = "";
  carouselContainer.innerHTML = "";

  consoles.forEach(console => {
    const gamesDiv = document.createElement("div");
    gamesDiv.className = `games console-container ${console.cssClass}`;

    const consoleIcon = document.createElement("div");
    consoleIcon.className = "consoleIcon";
    consoleIcon.innerHTML = `<h1>${console.name}</h1><img src="${console.img}" alt="Consola ${console.name}">`;

    const gameList = document.createElement("div");
    gameList.className = "gameList";

    console.games.forEach(game => {
      const btn = document.createElement("button");
      btn.onclick = () => loadPokedex(game);
      btn.innerHTML = `<img src="${game.cover}" alt="${game.title}"><p>${game.title}</p>`;
      gameList.appendChild(btn);
    });

    gamesDiv.appendChild(consoleIcon);
    gamesDiv.appendChild(gameList);
    carouselContainer.appendChild(gamesDiv);
  });

  // ----------------------------
  // Centrar GameBoy al inicio
  const items = Array.from(carouselContainer.children);
  const gameBoyIndex = items.findIndex(c => c.classList.contains("kanto"));
  const middleIndex = Math.floor(items.length / 2);

  if (gameBoyIndex !== middleIndex) {
    const shiftCount = middleIndex - gameBoyIndex+1;
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
  const items = Array.from(carouselContainer.children);

  if (direction === "up") {
    const last = items.pop();
    carouselContainer.insertBefore(last, items[0]);
  } else if (direction === "down") {
    const first = items.shift();
    carouselContainer.appendChild(first);
  }

  requestAnimationFrame(() => updateSelected());
}

function updateSelected() {
  const items = Array.from(carouselContainer.children);
  items.forEach(item => {
    item.classList.remove("selected", "adjacent", "prev", "far");
    // Bloquear botones de los no seleccionados
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
// Cargar Pokédex
async function loadPokedex(game) {
  menuGbGames.style.display = "none";
  pokedex.style.display = "block";
  carouselWrapper.style.display = "none";
  arrowUp.style.display = "none";
  arrowDown.style.display = "none";

  pokedex.style.borderColor = game.borderColor;
  gameCover.src = game.cover;
  gameCover.alt = game.title;
  gameName.textContent = game.title;

  await loadPokemonList(game);
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
}

document.getElementById("backBtn").onclick = goBack;

// ----------------------------
// Modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// ----------------------------
// Lista Pokémon
async function loadPokemonList(game) {
  pokemonList.innerHTML = "<p>Cargando Pokémon...</p>";
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${game.offset}&limit=${game.limit}`);
    const data = await response.json();
    pokemonList.innerHTML = "";

    data.results.forEach((poke, index) => {
      const pokemonId = game.offset + index + 1;
      const pokemonName = capitalizeFirstLetter(poke.name);

      const card = document.createElement("div");
      card.className = "pokemon-card";
      card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemonName}"><p>#${pokemonId}<br>${pokemonName}</p>`;
      card.addEventListener("click", async () => {
        beepSound.currentTime = 0;
        beepSound.play();
        const pokeData = await fetch(poke.url).then(res => res.json());
        showModal(pokeData);
      });
      pokemonList.appendChild(card);
    });

    searchInput.oninput = () => filterPokemon(data.results, game);
  } catch (error) {
    console.error(error);
    pokemonList.innerHTML = "<p>Error cargando Pokémon.</p>";
  }
}

// ----------------------------
// Filtrar Pokémon
function filterPokemon(pokemons, game) {
  const query = searchInput.value.toLowerCase();
  pokemonList.innerHTML = "";
  pokemons.forEach((poke, index) => {
    if (!poke.name.includes(query)) return;
    const pokemonId = game.offset + index + 1;
    const pokemonName = capitalizeFirstLetter(poke.name);

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemonName}"><p>#${pokemonId}<br>${pokemonName}</p>`;
    card.addEventListener("click", async () => {
      beepSound.currentTime = 0;
      beepSound.play();
      const pokeData = await fetch(poke.url).then(res => res.json());
      showModal(pokeData);
    });
    pokemonList.appendChild(card);
  });
}

// ----------------------------
// Modal
async function showModal(pokemon) {
  modalName.textContent = `#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`;
  modalNumber.textContent = `Nº: ${pokemon.id}`;
  modalSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  modalType.textContent = "Tipo: " + pokemon.types.map(t => translateType(t.type.name)).join(" / ");
  modalHeight.textContent = `Altura: ${(pokemon.height / 10).toFixed(1)}m`;
  modalWeight.textContent = `Peso: ${(pokemon.weight / 10).toFixed(1)}kg`;

  const species = await fetch(pokemon.species.url).then(res => res.json());
  const descriptionES = species.flavor_text_entries.find(e => e.language.name === "es");
  modalDescription.textContent = descriptionES ? `Descripción: ${descriptionES.flavor_text.replace(/\n|\f/g,' ')}` : "Descripción no disponible";

  modal.style.display = "flex";
}

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

// Flechas click
arrowUp.addEventListener("click", () => rotateCarousel("up"));
arrowDown.addEventListener("click", () => rotateCarousel("down"));
