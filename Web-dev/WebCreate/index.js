import createNotificacion from "../../PaginaPrincipal/componentes/notificaciones.js";

const formCrearPost = document.querySelector('#form-crear-post');
const tituloInput = document.querySelector('#titulo');
const descripcionInput = document.querySelector('#descripcion');
const precioInput = document.querySelector('#precio');
const urlDemoInput = document.querySelector('#url-demo');

const inputImagen = document.querySelector('#input-imagen');
const imgVistaPrevia = document.querySelector('#img-vista-previa');
const contenidoPlaceholder = document.querySelector('#contenido-placeholder');

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

    const newPost = {
      title: tituloInput.value.trim(),
      description: descripcionInput.value.trim(),
      price: Number(precioInput.value),
      theme: valorTematica,
      url: urlDemoInput.value.trim(),
      image: imageBase64
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