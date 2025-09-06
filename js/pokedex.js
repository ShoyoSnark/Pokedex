import { translateType, capitalizeFirstLetter } from "./utils.js";

// ----------------------------
// Estado interno
let allPokemons = [];
let currentGame = null;

// ----------------------------
// Elemento de audio
const beepSound = document.getElementById("beep-sound");

// ----------------------------
// Función para establecer el juego actual
function setCurrentGame(game){
  currentGame = game;
}

// ----------------------------
// Cargar lista de Pokémon
async function loadPokemonList(game, container, callbacks){
  container.innerHTML = "<p>Cargando Pokémon...</p>";
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${game.offset}&limit=${game.limit}`);
    const data = await response.json();
    allPokemons = data.results.map((p,i)=>({...p,index:i}));
    renderPokemonList(allPokemons, game, container, callbacks, true);
  } catch(err){
    console.error(err);
    container.innerHTML = "<p>Error cargando Pokémon.</p>";
  }
}

// ----------------------------
// Renderizar lista de Pokémon
function renderPokemonList(pokemonArray, game, container, callbacks, autoSelectFirst=false){
  container.innerHTML = "";
  beepSound.volume = 0;
  beepSound.play().catch(() => {}); // ignora el error de autoplay
  beepSound.pause();
  beepSound.currentTime = 0;
  beepSound.volume = 0.1;
  pokemonArray.forEach(poke=>{
    const pokemonId = poke.index + 1 + game.offset;
    const pokemonName = capitalizeFirstLetter(poke.name);

    const card = document.createElement("div");
    card.className = "pokemon-slot";
    card.dataset.name = poke.name.toLowerCase();
    card.innerHTML = `<strong>#${pokemonId.toString().padStart(3,"0")}</strong> <span>${pokemonName}</span>`;

    // Evento click solo para el usuario
    card.addEventListener("click", async (e)=>{
      container.querySelectorAll(".pokemon-slot").forEach(el=>el.classList.remove("selected-slot"));
      card.classList.add("selected-slot");

      // Solo sonar si el click viene del usuario
      if(e.isTrusted){
        try { 
          beepSound.currentTime = 0; 
          beepSound.play(); 
        } catch{}
      }

      const pokeData = await fetch(poke.url).then(res=>res.json());
      callbacks.showDetail(pokeData);
    });

    container.appendChild(card);
  });

  if(autoSelectFirst){
    const firstCard = container.querySelector(".pokemon-slot");
    if(firstCard){
      firstCard.click(); // no dispara beep porque e.isTrusted=false
    }
  }

  const parentContainer = document.getElementById("pokemon-list-container");
  if(parentContainer) parentContainer.scrollTop = 0;
}

// ----------------------------
// Mostrar detalle Pokémon
async function showDetail(pokemon, elements){
  elements.detailName.textContent = `#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`;
  elements.detailSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  // Tipos en español
  elements.detailType.textContent = "Tipo: " + pokemon.types.map(t=>translateType(t.type.name)).join(" / ");

  const species = await fetch(pokemon.species.url).then(res=>res.json());
  const descES = species.flavor_text_entries.find(e=>e.language.name==="es");
  elements.detailDescription.textContent = descES ? descES.flavor_text.replace(/\n|\f/g,' ') : "Descripción no disponible";

  // Reproducir beep también al mostrar detalles vía búsqueda

}

// ----------------------------
// Exportar funciones y estado
export { loadPokemonList, renderPokemonList, showDetail, setCurrentGame, allPokemons, currentGame };
