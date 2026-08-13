import createNotificacion from "/componentes/notificaciones.js";

const formulario = document.querySelector('#formulario');
const nameInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const contrasenaInput = document.querySelector('#contrasena');
const confirmarContrasena = document.querySelector('#confirmarContrasena');
const btnFormulario = document.querySelector('#btn-formulario');


// Expresiones regulares
const EMAIL_VALIDATION = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const NAME_VALIDATION = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

// Variables de control
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let confirPasswordValidation = false;

if (btnFormulario) {
    btnFormulario.disabled = true;
}

// Función de estilos dinámicos y actualización del botón
const validation = (input, isValid) => {
    if (!input) return;

    if (input.value.trim() === '') {
        input.classList.remove('outline-red-700', 'outline-green-700', 'outline-2', 'outline');
        input.classList.add('focus:outline-indigo-700');
    } else if (isValid) {
        input.classList.remove('focus:outline-indigo-700', 'outline-red-700');
        input.classList.add('outline-green-700', 'outline-2', 'outline');
    } else {
        input.classList.remove('focus:outline-indigo-700', 'outline-green-700');
        input.classList.add('outline-red-700', 'outline-2', 'outline');
    }

    btnFormulario.disabled = !(nameValidation && emailValidation && passwordValidation && confirPasswordValidation);
};

// Limpieza total de estilos
const resetInputStyles = (...inputs) => {
    inputs.forEach(input => {
        if (!input) return;
        input.classList.remove('outline-red-700', 'outline-green-700', 'outline-2', 'outline');
        input.classList.add('focus:outline-indigo-700');
    });
};

// Eventos de entrada
nameInput.addEventListener('input', (evento) => {
    nameValidation = NAME_VALIDATION.test(evento.target.value);
    validation(nameInput, nameValidation);
});

emailInput.addEventListener('input', (evento) => {
    emailValidation = EMAIL_VALIDATION.test(evento.target.value);
    validation(emailInput, emailValidation);
});

contrasenaInput.addEventListener('input', (evento) => {
    passwordValidation = PASSWORD_VALIDATION.test(evento.target.value);
    validation(contrasenaInput, passwordValidation);

    // Si ya se ingresó confirmación, reevaluarla al cambiar la contraseña principal
    if (confirmarContrasena.value.length > 0) {
        confirPasswordValidation = evento.target.value === confirmarContrasena.value;
        validation(confirmarContrasena, confirPasswordValidation);
    }
});

confirmarContrasena.addEventListener('input', (evento) => {
    confirPasswordValidation = evento.target.value === contrasenaInput.value && evento.target.value !== '';
    validation(confirmarContrasena, confirPasswordValidation);
});

// Envío del formulario
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const newUser = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: contrasenaInput.value,
        };
        
        const { data } = await axios.post('/api/users', newUser);
        
        createNotificacion(false, data.message || "Usuario registrado con éxito");

        // Reiniciar formulario y variables de estado
        formulario.reset();
        nameValidation = false;
        emailValidation = false;
        passwordValidation = false;
        confirPasswordValidation = false;

        // Limpiar bordes/estilos y desactivar botón
        resetInputStyles(nameInput, emailInput, contrasenaInput, confirmarContrasena);
        btnFormulario.disabled = true;

    } catch (error) {
        const mensajeError = error.response.data.error || "Error al conectar con el servidor";
        createNotificacion(true, mensajeError);
    }
});