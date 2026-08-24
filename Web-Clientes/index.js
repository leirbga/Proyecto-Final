import { templatesCreadas, templatesFiltradas, templatesPrice } from "../PaginaPrincipal/Shop/shop.js";
import TodosFiltros from "../PaginaPrincipal/componentes/filtros.js";

TodosFiltros();

document.addEventListener("DOMContentLoaded", () => {
  const filtroTematica = document.querySelector("#filtro-tematica");
  const filtroPrecio = document.querySelector("#filtro-precio");
  templatesCreadas("shop-container");


  filtroTematica.addEventListener("change", async () => {
  try {
    const temaSeleccionado = filtroTematica.value;
    console.log(temaSeleccionado);
    if (temaSeleccionado === "todas" || temaSeleccionado === ""){
      templatesCreadas("shop-container");
    }else if (temaSeleccionado !== "todas"){
      templatesFiltradas(temaSeleccionado);
    }
  

  } catch (error) {
    console.error("Hubo un error en el proceso:", error);
  }
});

 filtroPrecio.addEventListener("change", async () => {
  try {
    const precioSeleccionado = filtroPrecio.value;
    console.log(precioSeleccionado);
    if (precioSeleccionado === "todos" || precioSeleccionado === ""){
      templatesCreadas("shop-container");
    }else if (precioSeleccionado !== "todas"){
      templatesPrice(precioSeleccionado);
    }
  

  } catch (error) {
    console.error("Hubo un error en el proceso:", error);
  }
});
 
});




//  const aplicarFiltros = () => {
//     const temaSeleccionado = filtroTematica.value;
//     const precioSeleccionado = filtroPrecio.value;
//     if (temaSeleccionado === "" || temaSeleccionado === "todas" && precioSeleccionado === "" || precioSeleccionado === "todos") {
//       templatesCreadas("shop-container");
//     } else if (temaSeleccionado != "todas"){
//       templatesFiltradas(temaSeleccionado, "shop-container");
//     } 
//     else if (precioSeleccionado != "todos"){
//       templatesPrice(precioSeleccionado, "shop-container");
//     }
//   };

//   if(filtroTematica){
//     filtroTematica.addEventListener("change", aplicarFiltros);
//   }

//   if(filtroPrecio){
//     filtroPrecio.addEventListener("change", aplicarFiltros);
//   }