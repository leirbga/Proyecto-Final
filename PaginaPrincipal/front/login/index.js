const emailInput = document.querySelector('#email');
const contrasenaInput = document.querySelector('#contrasena');
const formularioLogin = document.querySelector('#formularioLogin');
const textError = document.querySelector('#textError');

formularioLogin.addEventListener('submit', async evento => {
  evento.preventDefault();

  try {
    const credentials = {
      email: emailInput.value,
      password: contrasenaInput.value
    };
    

    const respuesta = await axios.post('/api/login', credentials);

    const usuarioLogueado = respuesta.data.user;

    if (usuarioLogueado && usuarioLogueado.dev) {
      window.location.pathname = '/Web-dev/';
    } else {
      window.location.pathname = '/Web-Clientes/';
    }

  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      textError.innerHTML = error.response.data.error;
    } else {
      textError.innerHTML = 'Error de conexión con el servidor';
    }
  }
});