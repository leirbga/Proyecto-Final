const TodosFiltros = () => {
  const precios = document.querySelector("#filtro-precio");
  const tematicas = document.querySelector("#filtro-tematica");

  if (precios) {
    precios.innerHTML = `
      <option value="todos" selected class="bg-slate-900 text-slate-200">Todos los precios</option>
      <option value="0" class="bg-slate-900 text-slate-200">Gratis ($0)</option>
      <option value="15" class="bg-slate-900 text-slate-200">Hasta $15</option>
      <option value="20+" class="bg-slate-900 text-slate-200">Más de $15</option>
    `;
  }

  if (tematicas) {
    tematicas.innerHTML = `
      <option value="todas" selected class="bg-slate-900 text-slate-200">Todas las categorías</option>
      <option value="tecnologia" class="bg-slate-900 text-slate-200">Tecnología</option>
      <option value="restaurantes" class="bg-slate-900 text-slate-200">Restaurantes</option>
      <option value="ecommerce" class="bg-slate-900 text-slate-200">Moda / Ecommerce</option>
      <option value="blogs" class="bg-slate-900 text-slate-200">Blogs Personales</option>
    `;
  }
};

export default TodosFiltros;