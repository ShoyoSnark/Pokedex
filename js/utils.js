// ----------------------------
// FUNCIONES DE UTILIDAD

/**
 * Cambia la clase CSS de un elemento según la región del juego.
 * Esto permite aplicar estilos específicos para Kanto, Johto, Hoenn o por defecto.
 * 
 * @param {HTMLElement} element - Elemento del DOM al que se le cambiará la clase
 * @param {string} region - Nombre de la región ("kanto", "johto", "hoenn")
 * @param {string} type - Tipo de elemento que se estiliza ("header", "body", "pokedex", etc.)
 */
export function setRegion(element, region, type) {
  // Elimina todas las clases posibles relacionadas con regiones y tipo
  element.classList.remove(
    "kanto-" + type,
    "johto-" + type,
    "hoenn-" + type,
    "default-" + type
  );

  // Asigna la clase correspondiente según la región
  if (region === "kanto") element.classList.add("kanto-" + type);
  else if (region === "johto") element.classList.add("johto-" + type);
  else if (region === "hoenn") element.classList.add("hoenn-" + type);
  else element.classList.add("default-" + type); // Si la región no coincide, se asigna la clase por defecto
}

/**
 * Capitaliza la primera letra de un string.
 * Útil para nombres de Pokémon o títulos.
 * 
 * @param {string} string - Texto a capitalizar
 * @returns {string} Texto con la primera letra en mayúscula
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Traduce el tipo de Pokémon de inglés a español.
 * Devuelve el mismo tipo si no se encuentra traducción.
 * 
 * @param {string} type - Tipo en inglés (por ejemplo: "fire", "water")
 * @returns {string} Tipo traducido al español
 */
export function translateType(type){
  const typesES = {
    normal: "Normal",
    fighting: "Lucha",
    flying: "Volador",
    poison: "Veneno",
    ground: "Tierra",
    rock: "Roca",
    bug: "Bicho",
    ghost: "Fantasma",
    steel: "Acero",
    fire: "Fuego",
    water: "Agua",
    grass: "Planta",
    electric: "Eléctrico",
    psychic: "Psíquico",
    ice: "Hielo",
    dragon: "Dragón",
    dark: "Siniestro",
    fairy: "Hada"
  };

  // Retorna la traducción si existe, si no, devuelve el mismo tipo
  return typesES[type] || type;
}
