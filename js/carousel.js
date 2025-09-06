// ----------------------------
// Carousel.js
// ----------------------------

// Rotar carrusel
export function rotateCarousel(direction, container, updateFn) {
  const items = Array.from(container.children);
  if (items.length === 0) return;

  if (direction === "up") {
    const last = items.pop();
    if (last && items[0]) container.insertBefore(last, items[0]);
  } else if (direction === "down") {
    const first = items.shift();
    if (first) container.appendChild(first);
  }

  requestAnimationFrame(() => updateFn(container));
}

// Actualizar clases de los elementos seleccionados y adyacentes
export function updateSelected(container) {
  const items = Array.from(container.children);
  items.forEach(item => {
    item.classList.remove("selected", "adjacent", "prev", "far");
    const buttons = item.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
  });

  const middleIndex = Math.floor(items.length / 2);
  const selectedItem = items[middleIndex];
  if (!selectedItem) return;

  selectedItem.classList.add("selected");
  const buttons = selectedItem.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = false);

  if (items[middleIndex - 1]) items[middleIndex - 1].classList.add("adjacent", "prev");
  if (items[middleIndex + 1]) items[middleIndex + 1].classList.add("adjacent");
  if (items[middleIndex - 2]) items[middleIndex - 2].classList.add("far", "prev");
  if (items[middleIndex + 2]) items[middleIndex + 2].classList.add("far");
}

// Centrar carrusel en el elemento con la clase deseada
export function centerCarouselOn(container, cssClass) {
  const items = Array.from(container.children);
  if (items.length === 0) return;

  // Encontrar el elemento objetivo
  const targetItem = items.find(item => item.classList.contains(cssClass));
  if (!targetItem) return;

  // Mover el target al centro: primero lo eliminamos y lo insertamos en la posición central
  const middleIndex = Math.floor(items.length / 2);

  container.removeChild(targetItem);

  if (middleIndex >= container.children.length) {
    container.appendChild(targetItem);
  } else {
    container.insertBefore(targetItem, container.children[middleIndex]);
  }

  updateSelected(container);
}
