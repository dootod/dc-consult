<?php
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        throw new Exception("Le fichier .env n'existe pas : $filePath");
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Ignorer les commentaires
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Séparer la clé et la valeur
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Supprimer les guillemets si présents
            if (preg_match('/^".*"$/', $value) || preg_match("/^'.*'$/", $value)) {
                $value = substr($value, 1, -1);
            }
            
            // Définir la variable d'environnement
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

/**
 * Récupérer une variable d'environnement avec valeur par défaut
 */
function env($key, $default = null) {
    $value = getenv($key);
    
    if ($value === false) {
        $value = $_ENV[$key] ?? $default;
    }
    
    // Conversion des valeurs booléennes
    if (is_string($value)) {
        switch (strtolower($value)) {
            case 'true':
            case '(true)':
                return true;
            case 'false':
            case '(false)':
                return false;
            case 'null':
            case '(null)':
                return null;
        }
    }
    
    return $value;
}

// Charger le fichier .env
try {
    loadEnv(__DIR__ . '/../.env');
} catch (Exception $e) {
    error_log("Erreur lors du chargement du fichier .env: " . $e->getMessage());
    // En production, vous pourriez vouloir utiliser des valeurs par défaut
    // ou arrêter l'exécution complètement
}
?>