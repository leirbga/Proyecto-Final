/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",                 // HTMLs en la raíz del proyecto
    "./**/*.html",              // HTMLs en cualquier subcarpeta (ej: PaginaPrincipal/)
    "./**/*.js"                 // JS con clases dinámicas
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}