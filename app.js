// ===============================
//   INICIO DEL TEST
// ===============================
if (document.getElementById("formInicio")) {
    document.getElementById("formInicio").addEventListener("submit", (e) => {
        e.preventDefault();

        const temario = document.getElementById("temario").value;
        const numPreguntas = parseInt(document.getElementById("num_preguntas").value);

        sessionStorage.setItem("temario", temario);
        sessionStorage.setItem("numPreguntas", numPreguntas);

        window.location.href = "test.html";
    });
}

// ===============================
//   CORRECCIÓN// ===============================
//   FUNCIÓN: Selección SIN repetir
// ===============================
function seleccionarPreguntasSinRepetir(lista, cantidad) {
    const copia = [...lista];

    // Fisher-Yates Shuffle
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia.slice(0, Math.min(cantidad, copia.length));
}

// ===============================
//   GENERAR TEST
// ===============================
if (document.getElementById("formTest")) {
    const temario = sessionStorage.getItem("temario");
    const numPreguntas = parseInt(sessionStorage.getItem("numPreguntas"));

    fetch("preguntas.json")
        .then(r => r.json())
        .then(data => {
            let preguntas = data[temario];

            // Caso especial: unir todos los temarios
            if (temario === "aprendizaje_total") {
                preguntas = Object.values(data).flat();
            }

            // Selección aleatoria sin repeticiones
            const seleccion = seleccionarPreguntasSinRepetir(preguntas, numPreguntas);

            sessionStorage.setItem("preguntasActuales", JSON.stringify(seleccion));

            generarFormulario(seleccion, temario);
        });
}

// ===============================
//   GENERAR FORMULARIO
// ===============================
function generarFormulario(preguntas, temario) {
    document.getElementById("tituloTest").textContent =
        "🧩 Test de " + temario.replace(/_/g, " ");

    const form = document.getElementById("formTest");
    form.innerHTML = "";

    preguntas.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm";

        let opcionesHTML = "";
        ["opcion1", "opcion2", "opcion3", "opcion4"].forEach(op => {
            if (p[op]) {
                opcionesHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="radio"
                           name="preg_${i}" value="${op}" required>
                    <label class="form-check-label">${p[op]}</label>
                </div>`;
            }
        });

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${i + 1}. ${p.pregunta}</h5>
                ${opcionesHTML}
            </div>
        `;

        form.appendChild(card);
    });

    document.getElementById("btnEnviar").onclick = corregirTest;
}

// ===============================
//   CORRECCIÓN DEL TEST
// ===============================
function corregirTest() {
    const preguntas = JSON.parse(sessionStorage.getItem("preguntasActuales"));

    let aciertos = 0;
    let fallos = 0;
    let resultados = [];

    preguntas.forEach((p, i) => {
        const seleccion = document.querySelector(`input[name="preg_${i}"]:checked`);
        const usuario = seleccion ? seleccion.value : null;

        const esCorrecta = usuario === p.correcta;

        if (esCorrecta) aciertos++;
        else fallos++;

        resultados.push({
            pregunta: p.pregunta,
            usuario: usuario ? p[usuario] : "Sin responder",
            correcta: p[p.correcta],
            acierto: esCorrecta
        });
    });

    sessionStorage.setItem("aciertos", aciertos);
    sessionStorage.setItem("fallos", fallos);
    sessionStorage.setItem("resultados", JSON.stringify(resultados));

    window.location.href = "resultado.html";
}

// ===============================
//   MOSTRAR RESULTADOS
// ===============================
if (document.getElementById("listaResultados")) {
    const aciertos = parseInt(sessionStorage.getItem("aciertos"));
    const fallos = parseInt(sessionStorage.getItem("fallos"));
    const resultados = JSON.parse(sessionStorage.getItem("resultados"));
    const numPreguntas = aciertos + fallos;

    document.getElementById("infoTotal").textContent = "Total de preguntas: " + numPreguntas;
    document.getElementById("infoAciertos").textContent = "✔ Aciertos: " + aciertos;
    document.getElementById("infoFallos").textContent = "✖ Fallos: " + fallos;

    resultados.forEach(r => {
        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm";

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${r.pregunta}</h5>
                ${r.acierto
                    ? `<p class="text-success fw-bold">✔ Correcto</p>
                       <p>${r.correcta}</p>`
                    : `<p class="text-danger fw-bold">✖ Incorrecto</p>
                       <p>Tu respuesta: <strong>${r.usuario}</strong></p>
                       <p>Correcta: <strong class="text-success">${r.correcta}</strong></p>`
                }
            </div>
        `;
        document.getElementById("listaResultados").appendChild(card);
    });
}