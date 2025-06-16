# 📄 Configuration du fichier `.env`

Ce projet utilise un fichier `.env` pour stocker des informations sensibles, notamment la configuration de l'envoi d'e-mails via SMTP et des paramètres de sécurité.

⚠️ **Le fichier `.env` n'est pas fourni dans le projet pour des raisons de sécurité.**  
Vous devez le créer manuellement à la racine du projet.

---

## ✍️ Comment créer le fichier `.env`

1. Créez un fichier nommé `.env` à la racine du projet.
2. Copiez-y le contenu suivant, en remplaçant les valeurs par les vôtres :

```env

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=contact.formulaire.bet@gmail.com
SMTP_PASSWORD=mot_de_passe_application
SMTP_FROM_EMAIL=contact.formulaire.bet@gmail.com
SMTP_FROM_NAME=Site DC Consult
SMTP_TO_EMAIL=contact.formulaire.bet@gmail.com
SMTP_TO_NAME=DC Consult

MAX_MESSAGE_LENGTH=5000
ALLOWED_DOMAINS=www.dc-consult-bet.fr,dc-consult-bet.fr
