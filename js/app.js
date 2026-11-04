
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================================
// CONFIGURACIÓN FIREBASE
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyAVL4BgkP6PoTcsXRylTL57YiAnvNQRF20",
    authDomain: "monitoreo-327e3.firebaseapp.com",
    databaseURL: "https://monitoreo-327e3-default-rtdb.firebaseio.com",
    projectId: "monitoreo-327e3",
    storageBucket: "monitoreo-327e3.firebasestorage.app",
    messagingSenderId: "553290100761",
    appId: "1:553290100761:web:4c367975bfe0aa8090fa88",
    measurementId: "G-DY3DXZJ4QD"
};


// =====================================================
// INICIALIZAR FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let modoAutomatico = false;


// =====================================================
// REFERENCIAS FIREBASE
// =====================================================

const datosRef = ref(db);
const bombaRef = ref(db, "moto_bombs");
const modoAutoRef = ref(db, "modo_auto");
const conexionRef = ref(db, ".info/connected");


// =====================================================
// ELEMENTOS HTML
// =====================================================

const indicadorConexion =
    document.getElementById("indicadorConexion");

const estadoConexion =
    document.getElementById("estadoConexion");

const estadoBomba =
    document.getElementById("estadoBomba");

const estadoModo =
    document.getElementById("estadoModo");

const btnModoAuto =
    document.getElementById("btnModoAuto");

const descripcionModo =
    document.getElementById("descripcionModo");

const btnEncender =
    document.getElementById("btnEncender");

const btnApagar =
    document.getElementById("btnApagar");


// =====================================================
// VERIFICAR CONEXIÓN CON FIREBASE
// =====================================================

onValue(conexionRef, (snapshot) => {

    const conectado = snapshot.val() === true;

    if (indicadorConexion && estadoConexion) {

        if (conectado) {

            indicadorConexion.style.background = "#16a34a";
            estadoConexion.textContent = "Conectado";

        } else {

            indicadorConexion.style.background = "#dc2626";
            estadoConexion.textContent = "Desconectado";

        }

    }

});


// =====================================================
// LEER DATOS DE FIREBASE EN TIEMPO REAL
// =====================================================

onValue(datosRef, (snapshot) => {

    const datos = snapshot.val();

    console.log("Datos Firebase:", datos);

    if (!datos) {
        console.log("No existen datos en Firebase");
        return;
    }


    // ================================================
    // TEMPERATURA
    // ================================================

    document.getElementById("temperatura").textContent =
        datos.temperatura ?? "--";


    // ================================================
    // HUMEDAD AMBIENTAL
    // ================================================

    document.getElementById("humedadAmbiente").textContent =
        datos.humedad_ambiente ?? "--";


    // ================================================
    // HUMEDAD DEL SUELO
    // ================================================

    document.getElementById("humedadSuelo").textContent =
        datos.humedad_suelo ?? "--";


    // ================================================
    // GAS
    // ================================================

    document.getElementById("gas").textContent =
        datos.gas ?? "--";


    // ================================================
    // LUZ
    // ================================================

    document.getElementById("luz").textContent =
        datos.luz ?? "--";


    // ================================================
    // LLUVIA
    // ================================================

    const lluvia = datos.lluvia;

    const elementoLluvia =
        document.getElementById("lluvia");

    if (lluvia === 1) {

        elementoLluvia.textContent = "Detectada";

    } else if (lluvia === 0) {

        elementoLluvia.textContent = "No detectada";

    } else {

        elementoLluvia.textContent = lluvia ?? "--";

    }


    // ================================================
    // MODO AUTOMÁTICO
    // ================================================

    modoAutomatico = datos.modo_auto === true;

    actualizarModo();


    // ================================================
    // ESTADO DE LA MOTOBOMBA
    // ================================================

    actualizarEstadoBomba(datos.moto_bombs);


    // ================================================
    // ÚLTIMA ACTUALIZACIÓN
    // ================================================

    const ultima = datos.ultima_a;

    const elementoUltima =
        document.getElementById("ultimaActualizacion");

    if (
        ultima !== undefined &&
        ultima !== null &&
        ultima !== 0
    ) {

        const fecha = new Date(ultima);

        elementoUltima.textContent =
            fecha.toLocaleString("es-CO");

    } else {

        elementoUltima.textContent = "Sin actualización";

    }

});


// =====================================================
// ACTUALIZAR ESTADO DE LA MOTOBOMBA
// =====================================================

function actualizarEstadoBomba(estado) {

    if (!estadoBomba) return;

    if (estado === true) {

        estadoBomba.textContent = "ENCENDIDA";
        estadoBomba.className = "estado-bomba encendida";

    } else {

        estadoBomba.textContent = "APAGADA";
        estadoBomba.className = "estado-bomba apagada";

    }

}


// =====================================================
// ACTUALIZAR INTERFAZ DEL MODO DE FUNCIONAMIENTO
// =====================================================

function actualizarModo() {

    if (
        !estadoModo ||
        !btnModoAuto ||
        !descripcionModo ||
        !btnEncender ||
        !btnApagar
    ) {
        console.error("Faltan elementos HTML del modo automático");
        return;
    }


    if (modoAutomatico) {

        // MODO AUTOMÁTICO ACTIVADO

        estadoModo.textContent = "MODO AUTOMÁTICO";

        estadoModo.className =
            "estado-bomba encendida";

        btnModoAuto.textContent =
            "Desactivar modo automático";

        btnModoAuto.classList.add("desactivar");

        descripcionModo.textContent =
            "El ESP32 controla automáticamente el riego según los sensores.";

        // Bloquear control manual

        btnEncender.disabled = true;
        btnApagar.disabled = true;


    } else {

        // MODO MANUAL ACTIVADO

        estadoModo.textContent = "MODO MANUAL";

        estadoModo.className =
            "estado-bomba apagada";

        btnModoAuto.textContent =
            "Activar modo automático";

        btnModoAuto.classList.remove("desactivar");

        descripcionModo.textContent =
            "Puedes controlar manualmente el encendido y apagado de la motobomba.";

        // Habilitar control manual

        btnEncender.disabled = false;
        btnApagar.disabled = false;

    }

}


// =====================================================
// ENCENDER MOTOBOMBA MANUALMENTE
// =====================================================

btnEncender.addEventListener("click", async () => {

    if (modoAutomatico) {

        alert(
            "El modo automático está activado. Desactívalo para controlar la motobomba."
        );

        return;
    }

    try {

        await set(bombaRef, true);

        console.log("Motobomba ENCENDIDA");

    } catch (error) {

        console.error("Error:", error);

        alert("No se pudo encender la motobomba");

    }

});


// =====================================================
// APAGAR MOTOBOMBA MANUALMENTE
// =====================================================

btnApagar.addEventListener("click", async () => {

    if (modoAutomatico) {

        alert(
            "El modo automático está activado. Desactívalo para controlar la motobomba."
        );

        return;
    }

    try {

        await set(bombaRef, false);

        console.log("Motobomba APAGADA");

    } catch (error) {

        console.error("Error:", error);

        alert("No se pudo apagar la motobomba");

    }

});


// =====================================================
// ACTIVAR / DESACTIVAR MODO AUTOMÁTICO
// =====================================================

btnModoAuto.addEventListener("click", async () => {

    const nuevoModo = !modoAutomatico;

    try {

        btnModoAuto.disabled = true;

        await set(modoAutoRef, nuevoModo);

        console.log(
            nuevoModo
                ? "Modo automático activado"
                : "Modo manual activado"
        );

    } catch (error) {

        console.error("Error al cambiar el modo:", error);

        alert("No se pudo cambiar el modo de funcionamiento");

    } finally {

        btnModoAuto.disabled = false;

    }

});
