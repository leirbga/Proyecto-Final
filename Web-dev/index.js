import { cargarTemplates } from "../PaginaPrincipal/Shop/shop.js";
import TodosFiltros from "../PaginaPrincipal/componentes/filtros.js";

// Cargar las opciones de los filtros
TodosFiltros();

// Función que lee AMBOS filtros y realiza la petición combinada
const aplicarFiltrosCombinados = () => {
  const filtroTematica = document.querySelector("#filtro-tematica");
  const filtroPrecio = document.querySelector("#filtro-precio");

  const temaSeleccionado = filtroTematica ? filtroTematica.value : "todas";
  const precioSeleccionado = filtroPrecio ? filtroPrecio.value : "todos";

  cargarTemplates(temaSeleccionado, precioSeleccionado, "shop-container");
};

// Carga inicial al entrar a la vista
cargarTemplates("todas", "todos", "shop-container");

// Escuchar cambios en los selectores
document.addEventListener("DOMContentLoaded", () => {
  const filtroTematica = document.querySelector("#filtro-tematica");
  const filtroPrecio = document.querySelector("#filtro-precio");

  if (filtroTematica) {
    filtroTematica.addEventListener("change", aplicarFiltrosCombinados);
  }

  if (filtroPrecio) {
    filtroPrecio.addEventListener("change", aplicarFiltrosCombinados);
  }
});