<?php
// test.php

$temario = $_GET['temario'] ?? '';
$numPreguntas = $_GET['num_preguntas'] ?? 10;

// Cargar preguntas desde JSON
$jsonFile = file_exists('preguntas.json') ? 'preguntas.json' : 'preguntas_ejemplo.json';
$preguntasData = json_decode(file_get_contents($jsonFile), true);

// Validar temario
if (!isset($preguntasData[$temario])) {
    die("❌ Temario no encontrado.");
}

// Obtener las preguntas del temario
$preguntasTemario = $preguntasData[$temario];

// Barajar y seleccionar el número deseado
shuffle($preguntasTemario);
$preguntasSeleccionadas = array_slice($preguntasTemario, 0, $numPreguntas);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test - <?php echo ucfirst($temario); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container py-4">
    <h2 class="text-center mb-4">🧩 Test de <?php echo ucfirst($temario); ?></h2>

    <form action="resultado.php" method="POST">
        <input type="hidden" name="temario" value="<?php echo htmlspecialchars($temario); ?>">
        <input type="hidden" name="num_preguntas" value="<?php echo htmlspecialchars($numPreguntas); ?>">

        <?php foreach ($preguntasSeleccionadas as $index => $pregunta): ?>
            <div class="card mb-3 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">
                        <?php echo ($index + 1) . ". " . htmlspecialchars($pregunta['pregunta']); ?>
                    </h5>

                    <?php foreach (['opcion1', 'opcion2', 'opcion3', 'opcion4'] as $claveOpcion): ?>
                        <?php if (!isset($pregunta[$claveOpcion])) continue; ?>
                        <div class="form-check">
                            <input class="form-check-input" type="radio"
                                name="respuestas[<?php echo $index; ?>]"
                                id="pregunta_<?php echo $index . '_' . $claveOpcion; ?>"
                                value="<?php echo htmlspecialchars($claveOpcion); ?>" required>
                            <label class="form-check-label" for="pregunta_<?php echo $index . '_' . $claveOpcion; ?>">
                                <?php echo htmlspecialchars($pregunta[$claveOpcion]); ?>
                            </label>
                        </div>
                    <?php endforeach; ?>

                    <!-- 🔹 Respuesta correcta -->
                    <input type="hidden" name="correctas[<?php echo $index; ?>]" 
                        value="<?php echo htmlspecialchars($pregunta['correcta']); ?>">

                    <!-- 🔹 Texto de la pregunta -->
                    <input type="hidden" name="preguntas[<?php echo $index; ?>]" 
                        value="<?php echo htmlspecialchars($pregunta['pregunta']); ?>">

                    <!-- 🔹 Textos de opciones -->
                    <?php foreach (['opcion1','opcion2','opcion3','opcion4'] as $opt): ?>
                        <?php if(isset($pregunta[$opt])): ?>
                            <input type="hidden" name="textos[<?php echo $index; ?>][<?php echo $opt; ?>]" 
                                value="<?php echo htmlspecialchars($pregunta[$opt]); ?>">
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>


        <div class="d-grid">
            <button type="submit" class="btn btn-success btn-lg">Enviar Respuestas</button>
        </div>
    </form>
</div>

</body>
</html>
