<?php
$respuestasUsuario = $_POST['respuestas'] ?? [];
$respuestasCorrectas = $_POST['correctas'] ?? [];
$textosOpciones = $_POST['textos'] ?? [];
$preguntas = $_POST['preguntas'] ?? [];
$temario = $_POST['temario'] ?? '';
$numPreguntas = $_POST['num_preguntas'] ?? count($respuestasCorrectas);

$aciertos = 0;
$fallos = 0;
$resultados = [];

foreach ($respuestasCorrectas as $i => $correcta) {
    $usuario = $respuestasUsuario[$i] ?? null;
    $textoCorrecta = $textosOpciones[$i][$correcta] ?? '';
    $textoUsuario = $usuario ? $textosOpciones[$i][$usuario] : 'Sin responder';
    $preguntaTexto = $preguntas[$i] ?? 'Pregunta no disponible';

    $esCorrecta = ($usuario === $correcta);
    if ($esCorrecta) $aciertos++; else $fallos++;

    $resultados[] = [
        'pregunta' => $preguntaTexto,
        'usuario' => $usuario,
        'correcta' => $correcta,
        'texto_usuario' => $textoUsuario,
        'texto_correcta' => $textoCorrecta,
        'acierto' => $esCorrecta
    ];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados del Test</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container py-4">
    <div class="text-center mb-4">
        <h2>📊 Resultados del Test de <?php echo ucfirst($temario); ?></h2>
        <p>Total de preguntas: <?php echo $numPreguntas; ?></p>
        <h4 class="text-success">✅ Aciertos: <?php echo $aciertos; ?></h4>
        <h4 class="text-danger">❌ Fallos: <?php echo $fallos; ?></h4>
    </div>

    <?php foreach ($resultados as $r): ?>
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <h5 class="card-title"><?php echo htmlspecialchars($r['pregunta']); ?></h5>

                <?php if ($r['acierto']): ?>
                    <p class="text-success fw-bold">✔ Correcto:</p>
                    <p><?php echo htmlspecialchars($r['texto_correcta']); ?></p>
                <?php else: ?>
                    <p class="text-danger fw-bold">✖ Incorrecto</p>
                    <p>Tu respuesta: <strong><?php echo htmlspecialchars($r['texto_usuario']); ?></strong></p>
                    <p>Correcta: <strong class="text-success"><?php echo htmlspecialchars($r['texto_correcta']); ?></strong></p>
                <?php endif; ?>
            </div>
        </div>
    <?php endforeach; ?>

    <div class="d-grid">
        <a href="index.php" class="btn btn-primary btn-lg">Volver al inicio</a>
    </div>
</div>

</body>
</html>
