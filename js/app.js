
// Rutas de las páginas
const PAGINAS = {
    LOGIN: 'index.html',
    REGISTRO: 'registro.html',
    AGENDA: 'agenda.html',
    CARRITO: 'carrito.html'
  
};

// Almacenamiento global de la sesión (Simulación de la base de datos)
let dueñoRegistrado = {};    
let mascotaRegistrada = {};  
let serviciosAgendados = []; // Aquí se guardan las citas
let carrito = [];            // Aquí se guardan las compras
let indiceServicios = 0;
let indiceCompras = 0;

// ========================================
// 1. FUNCIONES DE REDIRECCIÓN Y CIERRE
// ========================================

// Funciones simples para cambiar de página
function irLogin() { window.location.href = PAGINAS.LOGIN; }
function irRegistro() { window.location.href = PAGINAS.REGISTRO; }
function irAgenda() { window.location.href = PAGINAS.AGENDA; }
function irCarrito() { window.location.href = PAGINAS.CARRITO; }

/**
 * Función para cerrar sesión, limpiar todos los datos y volver al inicio.
 */
function cerrarSesion() { 
    if (confirm("¡Sesión finalizada! ¿Deseas volver al inicio y limpiar los datos?")) {
        // Reiniciamos todas las variables de la sesión
        dueñoRegistrado = {};    
        mascotaRegistrada = {};  
        serviciosAgendados = []; 
        carrito = []; 
        indiceServicios = 0;
        indiceCompras = 0;
        
        window.location.href = PAGINAS.LOGIN; 
    }
}

// ========================================
// 2. NAVEGACIÓN Y LOGIN
// ========================================

const navPrincipal = document.getElementById('navPrincipal');
// Inyecta el menú de navegación
if (navPrincipal && window.location.pathname.indexOf('index.html') === -1) {
    navPrincipal.innerHTML = `
        <a href="${PAGINAS.AGENDA}" class="nav-link">📅 Servicios</a>
        <a href="${PAGINAS.REGISTRO}" class="nav-link">✍️ Registro</a>
        <a href="${PAGINAS.CARRITO}" class="nav-link">🛒 Tienda Pet</a>
        <button onclick="cerrarSesion()" class="btn-cerrar-sesion">❌ Salir / Reiniciar</button>
    `;
}

const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    // Cuando se presiona 'Entrar' en index.html, vamos al registro
    btnLogin.onclick = irRegistro;
}

// ========================================
// 3. MÓDULO REGISTROS (Dueño y Mascota)
// ========================================

const btnGuardarDueño = document.getElementById("btnGuardarDueño");
if (btnGuardarDueño) {
    btnGuardarDueño.onclick = function () {
        let n = document.getElementById("dueñoNombre").value.trim();
        let t = document.getElementById("dueñoTel").value.trim();
        let c = document.getElementById("dueñoCorreo").value.trim();
        
        // VALIDACIÓN 1 y 2: Nombre y Teléfono (8 dígitos numéricos)
        if (!n || !t) { return alert("⚠️ ERROR: Ingresa Nombre y Teléfono."); }
        if (t.length !== 8 || isNaN(t)) { return alert("⚠️ ERROR: El Teléfono debe tener exactamente 8 dígitos numéricos."); }
        
        // VALIDACIÓN 3: Formato de Correo
        if (c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) { return alert("⚠️ ERROR: Ingresa un formato de correo válido."); }

        // Guardamos el objeto Dueño
        dueñoRegistrado = { nombre: n, telefono: t, correo: c };
        alert(`✅ DATOS GUARDADOS: Dueño "${n}"`);
    };
}

const btnGuardarMascota = document.getElementById("btnGuardarMascota");
if (btnGuardarMascota) {
    btnGuardarMascota.onclick = function () {
        let n = document.getElementById("masNombre").value.trim();
        let e = document.getElementById("masEspecie").value.trim();

        if (!n || !e) { return alert("⚠️ ERROR: Ingresa Nombre y Especie de la Mascota."); }

        // Guardamos el objeto Mascota
        mascotaRegistrada = { 
            nombre: n, 
            especie: e, 
            raza: document.getElementById("masRaza").value.trim()
        };
        alert(`🐾 DATOS GUARDADOS: Mascota "${n}"`);
    };
}

// ========================================
// 4. MÓDULO AGENDA (Servicios)
// ========================================

const serviciosDisponibles = [
    { nombre: "Baño Relax", precio: 30 }, { nombre: "Corte Estelar", precio: 50 },
    { nombre: "Vacunación", precio: 75 }, { nombre: "Consulta General", precio: 40 },
];

const agServicio = document.getElementById("agServicio"); 
if (agServicio) {
    // Rellenamos el select de servicios usando .map()
    agServicio.innerHTML = '<option value="">-- Selecciona Servicio --</option>' + 
                           serviciosDisponibles.map(s => `<option value="${s.nombre},${s.precio}">${s.nombre} (Bs ${s.precio})</option>`).join('');

    document.getElementById("btnAgendar").onclick = function () {
        let f = document.getElementById("agFecha").value.trim();
        let h = document.getElementById("agHora").value.trim();
        let m = document.getElementById("agMascota").value.trim();
        let servicioCompleto = agServicio.value.trim(); 
        
        if (!f || !h || !m || !servicioCompleto) { return alert("⚠️ ERROR: Llena todos los campos de la cita."); }

        let [nombreServicio, precioTexto] = servicioCompleto.split(',');
        
        // Guardamos el servicio en el array global
        serviciosAgendados[indiceServicios] = {
            nombre: nombreServicio, 
            precio: parseFloat(precioTexto), 
            fecha: f, hora: h
        };
        indiceServicios++;

        alert(`✅ CITA GUARDADA: "${nombreServicio}".`);
    };
}

// ========================================
// 5. MÓDULO CARRITO (Compras y Total Parcial)
// ========================================

const catalogoProductos = [
    { id: 10, nombre: "Comida Super-Nutritiva", precio: 60, emoji: '🍖' },
    { id: 11, nombre: "Juguete indestructible", precio: 25, emoji: '🎾' },
    { id: 12, nombre: "Kit de Cepillado Mágico", precio: 45, emoji: '✨' },
];

const contCatalogo = document.getElementById("contCatalogo");
const contCarrito = document.getElementById("contCarrito");
const totalTexto = document.getElementById("totalTexto"); // Muestra solo el total de compras

if (contCatalogo) {
    // Dibuja el catálogo de productos
    contCatalogo.innerHTML = catalogoProductos.map(prod => `
        <div class="producto-card">
            <span class="emoji-img">${prod.emoji}</span>
            <div class="info-prod">
                <span class="nombre-prod">${prod.nombre}</span>
                <span class="precio">Bs ${prod.precio}</span>
            </div>
            <button onclick="comprarSimple(${prod.id})" class="btn-comprar">¡Quiero!</button>
        </div>
    `).join('');
    dibujarCarrito(); 
}

window.comprarSimple = function(idProducto) {
    const producto = catalogoProductos.find(p => p.id === idProducto);
    
    if (producto && confirm(`¿Añadir ${producto.nombre} por Bs ${producto.precio}?`)) {
        carrito[indiceCompras] = { nombre: producto.nombre, precio: producto.precio };
        indiceCompras++;
        alert(`🛒 ¡${producto.nombre} añadido!`);
        dibujarCarrito(); // Actualiza la vista del carrito
    }
}

/**
 * Función CLAVE: Dibuja la lista de compras y calcula SOLO el total de compras.
 */
function dibujarCarrito() {
    let totalCompras = 0;
    
    if (carrito.length === 0) {
        contCarrito.innerHTML = '<p class="mensaje-vacio">El carrito está vacío.</p>';
        totalTexto.textContent = "TOTAL EN COMPRAS = Bs 0.00";
        return;
    }

    // Dibujamos los ítems y sumamos el precio
    contCarrito.innerHTML = carrito.map(item => {
        if (item) {
            totalCompras += item.precio; 
            return `<div class="item-carrito"><span>📦 ${item.nombre}</span> <span class="precio">Bs ${item.precio.toFixed(2)}</span></div>`;
        }
    }).join('');

    // Muestra solo el total de compras
    totalTexto.textContent = `TOTAL EN COMPRAS = Bs ${totalCompras.toFixed(2)}`;
}

/**
 * Función llamada por el botón 'Finalizar Transacción'. Ya no genera recibo.
 */
window.generarRecibo = function() {
    if (indiceServicios === 0 && indiceCompras === 0) { return alert("¡No hay transacciones que finalizar!"); }
    
    alert("✅ ¡Servicios y Compras registradas con éxito! Gracias por su visita.");
    
    // Llamamos a cerrarSesion para limpiar los datos y volver al Login
    cerrarSesion();
}

// ========================================
// 6. MÓDULO RECIBO (ELIMINADO)
// ========================================

// Toda la lógica para recibo.html ha sido eliminada.