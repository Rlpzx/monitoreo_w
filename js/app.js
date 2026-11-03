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


// =====================================================
// REFERENCIA A LA BASE DE DATOS
// =====================================================

const datosRef = ref(db);


// =====================================================
// INDICADOR DE CONEXIÓN
// =====================================================

const conexionRef =
    ref(db, ".info/connected");


onValue(conexionRef, (snapshot) => {

    const conectado =
        snapshot.val() === true;

    const indicador =
        document.getElementById(
            "indicadorConexion"
        );

    const estado =
        document.getElementById(
            "estadoConexion"
        );


    if (conectado) {

        indicador.style.background =
            "#16a34a";

        estado.textContent =
            "Conectado";

    } else {

        indicador.style.background =
            "#dc2626";

        estado.textContent =
            "Desconectado";

    }

});


// =====================================================
// LEER TODOS LOS DATOS DE FIREBASE
// =====================================================

onValue(datosRef, (snapshot) => {

    const datos = snapshot.val();

    console.log("Datos Firebase:", datos);


    if (!datos) {

        console.log(
            "No existen datos en Firebase"
        );

        return;
    }


    // =================================================
    // TEMPERATURA
    // =================================================

    const temperatura =
        datos.temperatura;

    document.getElementById(
        "temperatura"
    ).textContent =
        temperatura ?? "--";


    // =================================================
    // HUMEDAD AMBIENTE
    // =================================================

    const humedadAmbiente =
        datos.humedad_ambiente;

    document.getElementById(
        "humedadAmbiente"
    ).textContent =
        humedadAmbiente ?? "--";


    // =================================================
    // HUMEDAD DEL SUELO
    // =================================================

    const humedadSuelo =
        datos.humedad_suelo;

    document.getElementById(
        "humedadSuelo"
    ).textContent =
        humedadSuelo ?? "--";


    // =================================================
    // GAS
    // =================================================

    const gas =
        datos.gas;

    document.getElementById(
        "gas"
    ).textContent =
        gas ?? "--";


    // =================================================
    // LUZ
    // =================================================

    const luz =
        datos.luz;

    document.getElementById(
        "luz"
    ).textContent =
        luz ?? "--";


    // =================================================
    // LLUVIA
    // =================================================

    const lluvia =
        datos.lluvia;

    const elementoLluvia =
        document.getElementById(
            "lluvia"
        );


    if (lluvia === 1) {

        elementoLluvia.textContent =
            "Detectada";

    } else if (lluvia === 0) {

        elementoLluvia.textContent =
            "No detectada";

    } else {

        elementoLluvia.textContent =
            lluvia ?? "--";
    }


    // =================================================
    // MOTOBOMBA
    // =================================================

    actualizarEstadoBomba(
        datos.moto_bombs
    );


    // =================================================
    // ÚLTIMA ACTUALIZACIÓN
    // =================================================

    const ultima =
        datos.ultima_a;


    const elementoUltima =
        document.getElementById(
            "ultimaActualizacion"
        );


    if (
        ultima !== undefined &&
        ultima !== null &&
        ultima !== 0
    ) {

        const fecha =
            new Date(ultima);


        elementoUltima.textContent =
            fecha.toLocaleString(
                "es-CO"
            );

    } else {

        elementoUltima.textContent =
            "Sin actualización";

    }

});


// =====================================================
// ACTUALIZAR ESTADO DE LA BOMBA
// =====================================================

function actualizarEstadoBomba(estado) {

    const elemento =
        document.getElementById(
            "estadoBomba"
        );


    if (estado === true) {

        elemento.textContent =
            "ENCENDIDA";

        elemento.className =
            "estado-bomba encendida";

    } else {

        elemento.textContent =
            "APAGADA";

        elemento.className =
            "estado-bomba apagada";

    }

}


// =====================================================
// ENCENDER MOTOBOMBA
// =====================================================

document.getElementById(
    "btnEncender"
).addEventListener(
    "click",
    async () => {

        try {

            await set(
                ref(db, "moto_bombs"),
                true
            );

            console.log(
                "Motobomba ENCENDIDA"
            );

        } catch (error) {

            console.error(
                "Error:",
                error
            );

            alert(
                "No se pudo encender la motobomba"
            );

        }

    }
);


// =====================================================
// APAGAR MOTOBOMBA
// =====================================================

document.getElementById(
    "btnApagar"
).addEventListener(
    "click",
    async () => {

        try {

            await set(
                ref(db, "moto_bombs"),
                false
            );

            console.log(
                "Motobomba APAGADA"
            );

        } catch (error) {

            console.error(
                "Error:",
                error
            );

            alert(
                "No se pudo apagar la motobomba"
            );

        }

    }
);