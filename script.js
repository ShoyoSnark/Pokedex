// ----------------------------
// Referencias al DOM
const pokedex = document.getElementById("pokedex");
const menuGbGames = document.getElementById("gbGames");
const pokemonList = document.getElementById("pokemon-list");
const gameCover = document.getElementById("game-cover");
const gameName = document.getElementById("game-name");
const searchInput = document.getElementById("searchInput");

// Modal
const modal = document.getElementById("pokemon-modal");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modal-name");
const modalNumber = document.getElementById("modal-number");
const modalType = document.getElementById("modal-type");
const modalHeight = document.getElementById("modal-height");
const modalWeight = document.getElementById("modal-weight");
const modalDescription = document.getElementById("modal-description");
const modalSprite = document.getElementById("modal-sprite");

// Sonido beep
const beepSound = document.getElementById("beep-sound");

// Carousel
const carouselWrapper = document.querySelector(".carousel-wrapper");
const carouselContainer = document.querySelector(".carousel-container");
let currentIndex = 0;

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
// Generar menú de consolas y juegos dinámicamente
function generateGameMenu() {
  menuGbGames.innerHTML = "";

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

  // Seleccionamos el primer contenedor por defecto
  carouselContainer.children[0].classList.add("selected");
}

// ----------------------------
// Cargar Pokédex según juego
async function loadPokedex(game) {
  menuGbGames.style.display = "none";
  pokedex.style.display = "block";

  // Ocultar carousel en vista de pokedex
  carouselWrapper.style.display = "none";

  pokedex.style.borderColor = game.borderColor;
  gameCover.src = game.cover;
  gameCover.alt = game.title;
  gameName.textContent = game.title;

  await loadPokemonList(game);
}

// ----------------------------
// Volver al menú principal
function goBack() {
  pokedex.style.display = "none";
  menuGbGames.style.display = "flex";

  // Mostrar carousel y flechas
  carouselWrapper.style.display = "flex";

  // Restaurar la posición del carousel al contenedor seleccionado previamente
  Array.from(carouselContainer.children).forEach(item => item.classList.remove("selected"));
  carouselContainer.children[currentIndex].classList.add("selected");

  const itemHeight = carouselContainer.children[0].offsetHeight + 15;
  const translateY = -currentIndex * itemHeight;
  carouselContainer.style.transform = `translateY(${translateY}px)`;

  pokemonList.innerHTML = "";
}

// ----------------------------
// Cerrar modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// ----------------------------
// Cargar lista de Pokémon
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
      card.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemonName}">
        <p>#${pokemonId}<br>${pokemonName}</p>
      `;

      card.addEventListener("click", async () => {
        const pokeData = await fetch(poke.url).then(res => res.json());
        showModal(pokeData);
      });

      pokemonList.appendChild(card);
    });

    // Filtro de búsqueda
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
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemonName}">
      <p>#${pokemonId}<br>${pokemonName}</p>
    `;
    card.addEventListener("click", async () => {
      const pokeData = await fetch(poke.url).then(res => res.json());
      showModal(pokeData);
    });

    pokemonList.appendChild(card);
  });
}

// ----------------------------
// Mostrar modal
async function showModal(pokemon) {
  beepSound.currentTime = 0;
  beepSound.play();

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
// Funciones auxiliares
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function translateType(type) {
  const typesES = {
    normal:"Normal", fire:"Fuego", water:"Agua", electric:"Eléctrico",
    grass:"Planta", ice:"Hielo", fighting:"Lucha", poison:"Veneno",
    ground:"Tierra", flying:"Volador", psychic:"Psíquico", bug:"Bicho",
    rock:"Roca", ghost:"Fantasma", dark:"Siniestro", dragon:"Dragón",
    steel:"Acero", fairy:"Hada"
  };
  return typesES[type] || type;
}

// ----------------------------
// Inicializar menú
generateGameMenu();

// ----------------------------
// Carousel vertical click
carouselWrapper.addEventListener("click", (e) => {
  // Solo permitir desplazamiento si la Pokédex está oculta
  if (window.getComputedStyle(pokedex).display !== "none") return;

  const clickY = e.offsetY;
  const wrapperHeight = carouselWrapper.clientHeight;
  const totalItems = carouselContainer.children.length;
  const itemHeight = carouselContainer.children[0].offsetHeight + 15; // incluye margen

  // Quitar selección previa
  Array.from(carouselContainer.children).forEach(item => item.classList.remove("selected"));

  if (clickY < wrapperHeight / 2) {
    // Click arriba
    currentIndex = Math.max(currentIndex - 1, 0);
  } else {
    // Click abajo
    currentIndex = Math.min(currentIndex + 1, totalItems - 1);
  }

  // Aplicar clase 'selected' al contenedor actual
  carouselContainer.children[currentIndex].classList.add("selected");

  const translateY = -currentIndex * itemHeight;
  carouselContainer.style.transform = `translateY(${translateY}px)`;
});
