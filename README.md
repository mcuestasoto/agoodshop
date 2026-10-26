# agoodshop

Actividad 1 de Desarrollo Web en Entorno Cliente. Carrito de compra desarrollado con HTML, CSS, JavaScript y una API local en PHP.

Repositorio público: https://github.com/mcuestasoto/agoodshop

## Requisitos

Un servidor web local con PHP (por ejemplo, MAMP o XAMPP).

## Ejecutar con MAMP (macOS)

1. Copiar la carpeta `agoodshop` en `/Applications/MAMP/htdocs/`.
2. Abrir MAMP e iniciar Apache.
3. Abrir `http://localhost:8888/agoodshop/` en el navegador (si se utiliza el puerto 8888).

## Ejecutar con XAMPP (Windows)

1. Copiar la carpeta `agoodshop` en `C:\xampp\htdocs\`.
2. Iniciar Apache en XAMPP. No es necesario iniciar MySQL.
3. Abrir `http://localhost/agoodshop/` en el navegador.

La aplicación consulta `api.php` para obtener los productos y muestra el carrito. No se debe abrir `index.html` directamente como archivo local.

## Archivos

- `index.html`: estructura de la página.
- `estilos.css`: presentación de la tienda.
- `app.js`: clase `Carrito` y funcionamiento de la interfaz.
- `api.php`: datos JSON de los tres productos.
- `img/`: imágenes de los productos.
