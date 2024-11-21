// eslint.config.js
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    rules: {
      indent: ['error', 2], // Usar 2 espacios de indentación
      'max-len': ['error', { code: 120 }], // Máximo 120 caracteres por línea
      'linebreak-style': ['error', 'unix'], // Forzar estilo LF para saltos de línea
    },
  },
];
