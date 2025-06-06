<?php
// Charger les variables d'environnement
require_once 'env-loader.php';

// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Configuration depuis les variables d'environnement
$maxMessageLength = env('MAX_MESSAGE_LENGTH', 5000);
// $allowedDomains = explode(',', env('ALLOWED_DOMAINS', ''));

// // Vérification du domaine (optionnel)
// $httpHost = $_SERVER['HTTP_HOST'] ?? '';
// if (!empty($allowedDomains) && !in_array($httpHost, $allowedDomains)) {
//     http_response_code(403);
//     echo json_encode(['success' => false, 'message' => 'Domaine non autorisé']);
//     exit;
// }

// Récupérer et nettoyer les données
$nom = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$sujet = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message_contenu = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation des données
$errors = [];

if (empty($nom)) {
    $errors[] = "Le nom est requis";
} elseif (strlen($nom) > 100) {
    $errors[] = "Le nom est trop long (maximum 100 caractères)";
}

if (empty($email)) {
    $errors[] = "L'email est requis";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "L'email n'est pas valide";
} elseif (strlen($email) > 255) {
    $errors[] = "L'email est trop long";
}

if (empty($sujet)) {
    $errors[] = "Le sujet est requis";
} elseif (strlen($sujet) > 200) {
    $errors[] = "Le sujet est trop long (maximum 200 caractères)";
}

if (empty($message_contenu)) {
    $errors[] = "Le message est requis";
} elseif (strlen($message_contenu) > $maxMessageLength) {
    $errors[] = "Le message est trop long (maximum {$maxMessageLength} caractères)";
}

// Si des erreurs, retourner un JSON avec les erreurs
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Protection contre le spam (vérifications supplémentaires)
$suspiciousPatterns = [
    '/\b(viagra|cialis|casino|lottery|winner)\b/i',
    '/\b(http|https|www\.)\b.*\b(http|https|www\.)\b/i', // Multiples liens
    '/(.)\1{10,}/', // Caractères répétés
];

foreach ($suspiciousPatterns as $pattern) {
    if (preg_match($pattern, $message_contenu) || preg_match($pattern, $sujet)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message détecté comme spam']);
        exit;
    }
}

// Construire le message email
$message_email = "Nouveau message depuis le site DC Consult\n\n";
$message_email .= "Nom : " . htmlspecialchars($nom, ENT_QUOTES, 'UTF-8') . "\n";
$message_email .= "Email : " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "\n";
$message_email .= "Sujet : " . htmlspecialchars($sujet, ENT_QUOTES, 'UTF-8') . "\n\n";
$message_email .= "Message :\n" . htmlspecialchars($message_contenu, ENT_QUOTES, 'UTF-8') . "\n\n";
$message_email .= "---\n";
$message_email .= "Envoyé le : " . date('d/m/Y à H:i:s') . "\n";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

// Créer une instance PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuration du serveur SMTP depuis les variables d'environnement
    $mail->isSMTP();
    $mail->Host       = env('SMTP_HOST', 'smtp.gmail.com');
    $mail->SMTPAuth   = true;
    $mail->Username   = env('SMTP_USERNAME');
    $mail->Password   = env('SMTP_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = env('SMTP_PORT', 465);
    
    // Encodage
    $mail->CharSet = 'UTF-8';
    
    // Destinataires depuis les variables d'environnement
    $mail->setFrom(
        env('SMTP_FROM_EMAIL'), 
        env('SMTP_FROM_NAME', 'Site DC Consult')
    );
    $mail->addAddress(
        env('SMTP_TO_EMAIL'), 
        env('SMTP_TO_NAME', 'DC Consult')
    );
    $mail->addReplyTo($email, $nom);
    
    // Contenu de l'email
    $mail->isHTML(false);
    $mail->Subject = '[DC Consult] ' . $sujet;
    $mail->Body    = $message_email;
    
    // Envoyer l'email
    $mail->send();
    
    // Log du succès (optionnel)
    error_log("Message envoyé avec succès depuis: $email");
    
    // Réponse de succès
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
    ]);
    
} catch (Exception $e) {
    // Log l'erreur complète pour le débogage
    error_log("Erreur PHPMailer: " . $mail->ErrorInfo . " | Exception: " . $e->getMessage());
    
    // Réponse d'erreur générique pour l'utilisateur
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.'
    ]);
}
?>