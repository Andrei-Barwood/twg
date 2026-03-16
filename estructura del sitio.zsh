#!/bin/zsh
# Script para crear la estructura base del sitio web del artista breakcore

# Crear la jerarquía de directorios
mkdir -p assets/{css,js,images,fonts}

# Crear los archivos (vacíos) en sus respectivas carpetas
touch assets/css/style.css
touch assets/js/{main.js,posts.js}
touch index.html about.html music.html shows.html blog.html contact.html 404.html

echo "✅ Estructura de archivos creada exitosamente."