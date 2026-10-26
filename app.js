class Carrito {
    constructor(productos, moneda) {
        this.moneda = moneda;
        this.productos = productos.map(producto => ({
            SKU: producto.SKU,
            title: producto.title,
            price: Number(producto.price),
            quantity: 0
        }));
    }

    actualizarUnidades(sku, unidades) {
        const producto = this.productos.find(p => p.SKU === sku);
        if (producto) {
            producto.quantity = Math.max(0, parseInt(unidades, 10) || 0);
        }
    }

    obtenerInformacionProducto(sku) {
        const producto = this.productos.find(p => p.SKU === sku);
        if (!producto) {
            return null;
        }

        return {
            SKU: producto.SKU,
            title: producto.title,
            price: producto.price,
            quantity: producto.quantity,
            subtotal: Number((producto.price * producto.quantity).toFixed(2))
        };
    }

    obtenerCarrito() {
        const seleccionados = this.productos
            .filter(producto => producto.quantity > 0)
            .map(producto => this.obtenerInformacionProducto(producto.SKU));

        let total = 0;
        for (const producto of seleccionados) {
            total += producto.subtotal;
        }

        return {
            currency: this.moneda,
            products: seleccionados,
            total: Number(total.toFixed(2))
        };
    }
}

const imagenes = {
    "0K3QOSOV4V": "img/telefono.jpg",
    "TGD5XORY1L": "img/cargador.jpg",
    "IOKW9BQ9F3": "img/funda.jpg"
};

let carrito;

const tabla = document.getElementById("productos");
const resumen = document.getElementById("resumen");
const total = document.getElementById("total");
const estado = document.getElementById("estado");

function mostrarPrecio(importe) {
    return importe.toFixed(2).replace(".", ",") + " " + carrito.moneda;
}

function mostrarProductos() {
    tabla.innerHTML = "";

    for (const producto of carrito.productos) {
        const fila = document.createElement("tr");
        const nombre = document.createElement("td");
        const cantidad = document.createElement("td");
        const precio = document.createElement("td");
        const subtotal = document.createElement("td");

        const ficha = document.createElement("div");
        ficha.className = "ficha-producto";

        const imagen = document.createElement("img");
        imagen.src = imagenes[producto.SKU];
        imagen.alt = producto.title;
        imagen.className = "imagen-producto";
        imagen.width = 76;
        imagen.height = 84;

        const descripcion = document.createElement("span");
        descripcion.textContent = producto.title;

        ficha.appendChild(imagen);
        ficha.appendChild(descripcion);
        nombre.appendChild(ficha);
        cantidad.className = "cantidad";
        precio.className = "precio";
        subtotal.className = "subtotal";

        const menos = document.createElement("button");
        menos.textContent = "−";
        menos.type = "button";
        menos.setAttribute("aria-label", "Quitar una unidad de " + producto.title);

        const unidades = document.createElement("span");
        unidades.textContent = producto.quantity;

        const mas = document.createElement("button");
        mas.textContent = "+";
        mas.type = "button";
        mas.setAttribute("aria-label", "Añadir una unidad de " + producto.title);

        menos.addEventListener("click", () => cambiarCantidad(producto.SKU, -1, unidades, subtotal));
        mas.addEventListener("click", () => cambiarCantidad(producto.SKU, 1, unidades, subtotal));

        cantidad.appendChild(menos);
        cantidad.appendChild(unidades);
        cantidad.appendChild(mas);

        precio.textContent = mostrarPrecio(producto.price);
        subtotal.textContent = mostrarPrecio(producto.price * producto.quantity);

        fila.appendChild(nombre);
        fila.appendChild(cantidad);
        fila.appendChild(precio);
        fila.appendChild(subtotal);
        tabla.appendChild(fila);
    }
}

function mostrarResumen() {
    resumen.innerHTML = "";
    const datos = carrito.obtenerCarrito();

    for (const producto of datos.products) {
        const linea = document.createElement("li");
        linea.textContent = producto.quantity + " × " + producto.title + ": " + mostrarPrecio(producto.subtotal);
        resumen.appendChild(linea);
    }

    total.textContent = mostrarPrecio(datos.total);
}

function cambiarCantidad(sku, cambio, unidades, subtotal) {
    const producto = carrito.obtenerInformacionProducto(sku);
    if (!producto) {
        return;
    }

    carrito.actualizarUnidades(sku, producto.quantity + cambio);
    const actualizado = carrito.obtenerInformacionProducto(sku);
    unidades.textContent = actualizado.quantity;
    subtotal.textContent = mostrarPrecio(actualizado.subtotal);
    mostrarResumen();
}

async function iniciar() {
    try {
        const respuesta = await fetch("api.php");
        if (!respuesta.ok) {
            throw new Error("No se ha podido consultar la API");
        }

        const datos = await respuesta.json();
        if (!Array.isArray(datos.products)) {
            throw new Error("Datos incorrectos");
        }

        carrito = new Carrito(datos.products, datos.currency);
        mostrarProductos();
        mostrarResumen();
        estado.textContent = "";
    } catch (error) {
        estado.className = "error";
        estado.textContent = "No se pudieron cargar los productos.";
    }
}

iniciar();
