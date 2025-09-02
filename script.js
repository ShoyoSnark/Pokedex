// ----------------------------
// Referencias al DOM
const pokedex = document.getElementById("pokedex");
const menuGbGames = document.getElementById("gbGames");
const pokemonList = document.getElementById("pokemon-list");
const gameCover = document.getElementById("game-cover");
const gameName = document.getElementById("game-name");
const searchInput = document.getElementById("searchInput");
const regionStyle = document.getElementById("region-style");

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

// ----------------------------
// Consolas y juegos
const consoles = [
  {
    name: "GameBoy",
    img: "./images/consolas/gameBoy.png",
    region: "kanto",
    games: [
      { id: "red", title: "Pokémon Rojo", cover: "./images/caratulas/caratulaPokemonRojo.jpg", borderColor: "red", style: "style-kanto.css" },
      { id: "blue", title: "Pokémon Azul", cover: "./images/caratulas/caratulaPokemonAzul.jpg", borderColor: "blue", style: "style-kanto.css" },
      { id: "yellow", title: "Pokémon Amarillo", cover: "./images/caratulas/caratulaPokemonAmarillo.jpg", borderColor: "gold", style: "style-kanto.css" }
    ]
  },
  {
    name: "GameBoy<br>Color",
    img: "./images/consolas/gameBoyColor.png",
    region: "johto",
    games: [
      { id: "gold", title: "Pokémon Oro", cover: "./images/caratulas/caratulaPokemonOro.jpg", borderColor: "gold", style: "style-johto.css" },
      { id: "silver", title: "Pokémon Plata", cover: "./images/caratulas/caratulaPokemonPlata.jpg", borderColor: "#c0c0c0", style: "style-johto.css" },
      { id: "crystal", title: "Pokémon Cristal", cover: "./images/caratulas/caratulaPokemonCristal.jpg", borderColor: "#a7d8de", style: "style-johto.css" }
    ]
  }
];

// ----------------------------
// Generar menú de consolas y juegos dinámicamente
function generateGameMenu() {
  menuGbGames.innerHTML = ""; // limpiar

  consoles.forEach(console => {
    const gamesDiv = document.createElement("div");
    gamesDiv.className = `games console-container ${console.region}`;

    // Consola a la izquierda
    const consoleIcon = document.createElement("div");
    consoleIcon.className = "consoleIcon";
    consoleIcon.innerHTML = `<h1>${console.name}</h1><img src="${console.img}" height="200" alt="Consola ${console.name}">`;

    // Lista de juegos a la derecha
    const gameList = document.createElement("div");
    gameList.className = "gameList";

    console.games.forEach(game => {
      const btn = document.createElement("button");
      btn.onclick = () => loadPokedex(game.id);
      btn.innerHTML = `<img src="${game.cover}" alt="${game.title}"><p>${game.title}</p>`;
      gameList.appendChild(btn);
    });

    // Añadir ambos al contenedor
    gamesDiv.appendChild(consoleIcon);
    gamesDiv.appendChild(gameList);

    menuGbGames.appendChild(gamesDiv);
  });
}

// ----------------------------
// Cargar Pokédex según juego
function loadPokedex(gameId) {
  const game = consoles.flatMap(c => c.games).find(g => g.id === gameId);
  if (!game) return;

  menuGbGames.style.display = "none";
  pokedex.style.display = "block";

  pokedex.style.borderColor = game.borderColor;
  gameCover.src = game.cover;
  gameCover.alt = game.title;
  gameName.textContent = game.title;

  regionStyle.href = game.style;

  loadPokemonList();
}

// ----------------------------
// Volver al menú principal
function goBack() {
  pokedex.style.display = "none";
  menuGbGames.style.display = "flex";
  pokemonList.innerHTML = "";
}

// ----------------------------
// Cerrar modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// ----------------------------
// Cargar lista de Pokémon (151 inicial)
async function loadPokemonList() {
  pokemonList.innerHTML = "<p>Cargando Pokémon...</p>";

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151");
    const data = await response.json();
    pokemonList.innerHTML = "";

    data.results.forEach((poke, index) => {
      const pokemonId = index + 1;
      const pokemonName = capitalizeFirstLetter(poke.name);

      const card = document.createElement("div");
      card.className = "pokemon-card";
      card.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${pokemonId}.png" alt="${pokemonName}">
        <p>#${pokemonId}<br>${pokemonName}</p>
      `;

      card.addEventListener("click", async () => {
        const pokeData = await fetch(poke.url).then(res => res.json());
        showModal(pokeData);
      });

      pokemonList.appendChild(card);
    });

    // Filtro de búsqueda
    searchInput.addEventListener("input", () => filterPokemon(data.results));
  } catch (error) {
    console.error(error);
    pokemonList.innerHTML = "<p>Error cargando Pokémon.</p>";
  }
}

// Filtrar Pokémon por búsqueda
function filterPokemon(pokemons) {
  const query = searchInput.value.toLowerCase();
  pokemonList.innerHTML = "";

  pokemons.forEach((poke, index) => {
    if (!poke.name.includes(query)) return;
    const pokemonId = index + 1;
    const pokemonName = capitalizeFirstLetter(poke.name);

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${pokemonId}.png" alt="${pokemonName}">
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
  modalSprite.src = pokemon.sprites.versions["generation-i"]["red-blue"].front_default;
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
