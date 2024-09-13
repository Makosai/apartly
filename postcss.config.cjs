// eslint-disable-next-line
const tailwindcss = require('tailwindcss');
// eslint-disable-next-line
const autoprefixer = require('autoprefixer');

// eslint-disable-next-line
const path = require('path');
const tailwindConfig = path.join(__dirname, 'tailwind.config.ts');

const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss({ config: tailwindConfig }),
    //But others, like autoprefixer, need to run after,
    autoprefixer
  ]
};

module.exports = config;