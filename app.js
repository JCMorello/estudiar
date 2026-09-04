const ARCHIVO_PREGUNTAS = "preguntas_valencia.json";

function cargarPreguntas() {
    return fetch(ARCHIVO_PREGUNTAS).then(r => r.json());
}

if (document.getElementById("formInicio")) {
    const selectorTema = document.getElementById("tema");

    cargarPreguntas().then(data => {
        const temas = [...new Set(data.valencia.map(pregunta => pregunta.tema))];

        selectorTema.innerHTML = temas
            .map(tema => `<option value="${tema}">${tema}</option>`)
            .join("");
    });

    document.getElementById("formInicio").addEventListener("submit", (e) => {
        e.preventDefault();

        const numPreguntas = parseInt(document.getElementById("num_preguntas").value);
        const tema = selectorTema.value;

        sessionStorage.setItem("numPreguntas", numPreguntas);
        sessionStorage.setItem("tema", tema);

        window.location.href = "test.html";
    });
}

function obtenerOpciones(pregunta) {
    return Object.entries(pregunta.opciones).map(([clave, texto]) => ({
        valor: clave,
        texto
    }));
}

function obtenerTextoRespuesta(pregunta, respuesta) {
    if (!respuesta) return "Sin responder";
    return pregunta.opciones[respuesta];
}

if (document.getElementById("formTest")) {
    const numPreguntas = parseInt(sessionStorage.getItem("numPreguntas")) || 10;
    const tema = sessionStorage.getItem("tema");

    cargarPreguntas()
        .then(data => {
            const preguntasTema = data.valencia.filter(pregunta => pregunta.tema === tema);
            const seleccion = preguntasTema.slice(0, Math.min(numPreguntas, preguntasTema.length));

            sessionStorage.setItem("preguntasActuales", JSON.stringify(seleccion));

            generarFormulario(seleccion, tema);
        });
}

function generarFormulario(preguntas, tema) {
    document.getElementById("tituloTest").textContent = "🧩 Test de " + tema;

    const form = document.getElementById("formTest");
    const btnEnviar = document.getElementById("btnEnviar");
    form.innerHTML = "";

    btnEnviar.disabled = preguntas.length === 0;

    if (preguntas.length === 0) {
        form.innerHTML = `
            <div class="alert alert-info">
                Todavia no hay preguntas cargadas.
            </div>
        `;
        return;
    }

    preguntas.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm";

        let opcionesHTML = "";
        obtenerOpciones(p).forEach(op => {
            opcionesHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="radio"
                           name="preg_${i}" value="${op.valor}" required>
                    <label class="form-check-label">${op.texto}</label>
                </div>`;
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
            usuario: obtenerTextoRespuesta(p, usuario),
            correcta: obtenerTextoRespuesta(p, p.correcta),
            acierto: esCorrecta,
            explicacion: p.explicacion || ""
        });
    });

    sessionStorage.setItem("aciertos", aciertos);
    sessionStorage.setItem("fallos", fallos);
    sessionStorage.setItem("resultados", JSON.stringify(resultados));

    window.location.href = "resultado.html";
}

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
                ${r.explicacion ? `
                    <div class="alert alert-secondary mb-0">
                        <strong>Explicacion:</strong> ${r.explicacion}
                    </div>
                ` : ""}
            </div>
        `;
        document.getElementById("listaResultados").appendChild(card);
    });
}
