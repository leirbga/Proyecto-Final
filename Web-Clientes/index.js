import { cargarTemplates, templatesCreadas } from "../../PaginaPrincipal/Shop/shop.js";
import { renderizarMisComprasCliente } from "../../PaginaPrincipal/Shop/misPaginas.js";
import TodosFiltros from "../../PaginaPrincipal/componentes/filtros.js";
import { renderSocialLinks } from "../../PaginaPrincipal/componentes/links.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 0. Renderizar los links sociales en el contenedor del sidebar
  renderSocialLinks("social-links-container");

  // Si estás en la sección de mis compras, renderizarlas
  if (document.getElementById("mis-paginas-container")) {
    renderizarMisComprasCliente("mis-paginas-container");
  }

  // 1. Cargar las opciones en los <select> de los filtros
  if (typeof TodosFiltros === "function") {
    await TodosFiltros();
  }

  const filtroTematica = document.querySelector("#filtro-tematica");
  const filtroPrecio = document.querySelector("#filtro-precio");

  // 2. Cargar todas las plantillas al iniciar
  if (document.getElementById("shop-container")) {
    templatesCreadas("shop-container");
  }

  // 3. Función unificada para combinar ambos filtros usando cargarTemplates de shop.js
  const aplicarFiltros = () => {
    const tema = filtroTematica ? filtroTematica.value : "todas";
    const precio = filtroPrecio ? filtroPrecio.value : "todos";

    if (document.getElementById("shop-container")) {
      // cargarTemplates ya soporta ambos filtros de forma interna gracias a su URLSearchParams
      cargarTemplates(tema, precio, "shop-container");
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