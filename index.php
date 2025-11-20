<?php
// index.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test de Estudio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">

            <div class="card shadow-sm">
                <div class="card-body">
                    <h1 class="text-center mb-4">🧠 Test de Estudio</h1>

                    <form action="test.php" method="GET">
                        <!-- Select Temario -->
                        <div class="mb-3">
                            <label for="temario" class="form-label">Selecciona el temario:</label>
                            <select class="form-select" name="temario" id="temario" required>
                                <option value="" selected disabled>Elige un tema...</option>
                                <option value="aprendizaje_1">Aprendizaje y desarrollo de la personalidad Tema 1</option>
                                <option value="aprendizaje_2">Aprendizaje y desarrollo de la personalidad Tema 2</option>
                                <option value="aprendizaje_3">Aprendizaje y desarrollo de la personalidad Tema 3</option>
                                <option value="aprendizaje_total">Aprendizaje y desarrollo de la personalidad TODO</option>
                            </select>
                        </div>

                        <!-- Número de preguntas -->
                        <div class="mb-3">
                            <label for="num_preguntas" class="form-label">Número de preguntas:</label>
                            <input type="number" class="form-control" id="num_preguntas" name="num_preguntas" 
                                   min="1" max="50" value="10" required>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-lg">Comenzar Test</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

</body>
</html>
