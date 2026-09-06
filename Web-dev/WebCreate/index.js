import createNotificacion from "../../PaginaPrincipal/componentes/notificaciones.js";

const formCrearPost = document.querySelector('#form-crear-post');
const tituloInput = document.querySelector('#titulo');
const descripcionInput = document.querySelector('#descripcion');
const precioInput = document.querySelector('#precio');
const urlDemoInput = document.querySelector('#url-demo');

// Contenedor DIV que está presente en tu HTML (<div id="tematicas"></div>)
const contenedorTematicas = document.querySelector('#tematicas');

// Selectores para el número de WhatsApp
const codigoPaisSelect = document.querySelector('#codigo-pais');
const numeroWhatsappInput = document.querySelector('#numero-whatsapp');

const inputImagen = document.querySelector('#input-imagen');
const imgVistaPrevia = document.querySelector('#img-vista-previa');
const contenidoPlaceholder = document.querySelector('#contenido-placeholder');

// Inyectamos el <select> ÚNICO dentro del contenedor DIV
if (contenedorTematicas) {
  contenedorTematicas.innerHTML = `
    <select id="select-tematica" required
      class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition-all text-sm cursor-pointer">
      <option value="" disabled selected class="bg-slate-900 text-slate-400">Seleccione temática</option>
      <option value="tecnologia" class="bg-slate-900 text-slate-200">Tecnología</option>
      <option value="restaurantes" class="bg-slate-900 text-slate-200">Restaurantes</option>
      <option value="ecommerce" class="bg-slate-900 text-slate-200">Moda / Ecommerce</option>
      <option value="blogs" class="bg-slate-900 text-slate-200">Blogs Personales</option>
    </select>
  `;
}

// Previsualización de la imagen
inputImagen.addEventListener('change', (evento) => {
  const archivo = evento.target.files[0];

  if (archivo) {
    const urlTemporal = URL.createObjectURL(archivo);
    imgVistaPrevia.src = urlTemporal;
    imgVistaPrevia.classList.remove('hidden');
    contenidoPlaceholder.classList.add('hidden');
  } else {
    imgVistaPrevia.src = '';
    imgVistaPrevia.classList.add('hidden');
    contenidoPlaceholder.classList.remove('hidden');
  }
});

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};

formCrearPost.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  try {
    // Obtenemos el <select> generado dinámicamente
    const selectTematica = document.querySelector('#select-tematica');
    const valorTematica = selectTematica ? selectTematica.value : '';

    if (!valorTematica) {
      createNotificacion(true, 'Por favor selecciona una temática');
      return;
    }

    let imageBase64 = '';
    if (inputImagen && inputImagen.files.length > 0) {
      imageBase64 = await convertToBase64(inputImagen.files[0]);
    }

    // Limpieza del número ingresado
    const numeroLimpio = numeroWhatsappInput.value.replace(/[^0-9]/g, '');
    const codigoPais = codigoPaisSelect.value;
    
    // Concatenación final (Ej: '58' + '4121234567' = '584121234567')
    const whatsappCompleto = `${codigoPais}${numeroLimpio}`;

    const newPost = {
      title: tituloInput.value.trim(),
      description: descripcionInput.value.trim(),
      price: Number(precioInput.value),
      theme: valorTematica,
      url: urlDemoInput.value.trim(),
      image: imageBase64,
      whatsappCreator: whatsappCompleto
    };

    const { data } = await axios.post('/api/CreateWeb', newPost);
    
    // Notificación de éxito
    createNotificacion(false, data.message || 'Post guardado con éxito');
    
    // Limpieza del formulario
    formCrearPost.reset();
    imgVistaPrevia.src = '';
    imgVistaPrevia.classList.add('hidden');
    contenidoPlaceholder.classList.remove('hidden');

  } catch (error) {
    console.error('Error al enviar:', error.response?.data);
    const mensajeError = error.response?.data?.error || 'Error al guardar el post';
    createNotificacion(true, mensajeError);
  }
});