import { templatesCreadas } from "../PaginaPrincipal/Shop/shop.js";
import TodosFiltros from "../PaginaPrincipal/componentes/filtros.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Cargar las opciones en los <select> de los filtros
  if (typeof TodosFiltros === "function") {
    await TodosFiltros();
  }

  const filtroTematica = document.querySelector("#filtro-tematica");
  const filtroPrecio = document.querySelector("#filtro-precio");

  // 2. Cargar todas las plantillas al iniciar
  templatesCreadas("shop-container");

  // 3. Función unificada para combinar ambos filtros
  const aplicarFiltros = () => {
    const tema = filtroTematica ? filtroTematica.value : "todas";
    const precio = filtroPrecio ? filtroPrecio.value : "todos";

    // Caso 1: Sin filtros activos (mostrar todo)
    if ((tema === "todas" || tema === "") && (precio === "todos" || precio === "")) {
      templatesCreadas("shop-container");
      return;
    }

    // Caso 2: Solo filtro por precio activo
    if ((tema === "todas" || tema === "") && (precio !== "todos" && precio !== "")) {
      templatesPrice(precio, "shop-container");
      return;
    }

    // Caso 3: Filtro por temática activo (o combinado)
    if (tema !== "todas" && tema !== "") {
      templatesFiltradas(tema, precio, "shop-container");
      return;
    }
  };

  // 4. Asignar los eventos de cambio
  if (filtroTematica) {
    filtroTematica.addEventListener("change", aplicarFiltros);
  }

  if (filtroPrecio) {
    filtroPrecio.addEventListener("change", aplicarFiltros);
  }
});