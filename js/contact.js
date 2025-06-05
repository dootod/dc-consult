document.addEventListener('DOMContentLoaded', function () {
    // Gestion du menu burger
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function (event) {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            event.stopPropagation();
        });
    }

    // Gestion des dropdowns en mobile
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');

        if (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');

                    // Fermer les autres dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    // Fermer le menu quand on clique n'importe où sur la page
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar') || e.target.closest('.nav-links a:not(.dropdown a)')) {
            if (window.innerWidth <= 768 && menuBtn && navLinks) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    });

    // Fermer le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && menuBtn && navLinks) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('.submit-icon');

            // Désactiver le bouton pendant l'envoi
            submitBtn.disabled = true;
            submitText.textContent = 'Envoi en cours...';
            submitIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            // Préparer les données du formulaire
            const formData = new FormData(this);

            // Envoyer les données avec fetch
            fetch('../php/contact-form.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Succès
                        submitText.textContent = 'Message envoyé!';
                        submitIcon.innerHTML = '<i class="fas fa-check"></i>';
                        submitBtn.style.backgroundColor = 'var(--success)';

                        // Afficher la notification de succès
                        showNotification(data.message, 'success');

                        // Réinitialiser le formulaire après un délai
                        setTimeout(() => {
                            contactForm.reset();
                            resetSubmitButton();

                            // Réinitialiser les labels flottants
                            floatInputs.forEach(input => {
                                if (!input.value) {
                                    input.previousElementSibling.classList.remove('active');
                                }
                            });
                        }, 2000);

                    } else {
                        // Erreur
                        submitText.textContent = 'Erreur - Réessayer';
                        submitIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                        submitBtn.style.backgroundColor = 'var(--error)';

                        showNotification(data.message, 'error');

                        // Réinitialiser le bouton après un délai
                        setTimeout(resetSubmitButton, 3000);
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    submitText.textContent = 'Erreur réseau';
                    submitIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    submitBtn.style.backgroundColor = 'var(--error)';

                    showNotification('Une erreur réseau est survenue. Veuillez réessayer.', 'error');

                    setTimeout(resetSubmitButton, 3000);
                });

            function resetSubmitButton() {
                submitBtn.disabled = false;
                submitText.textContent = 'Envoyer';
                submitIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                submitBtn.style.backgroundColor = 'var(--primary)';
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            }
        });
    }

    // Gestion améliorée des labels flottants
    const floatInputs = document.querySelectorAll('.input-group input, .input-group textarea');

    floatInputs.forEach(input => {
        const inputGroup = input.closest('.input-group');

        // Fonction pour vérifier si l'input a une valeur
        function checkValue() {
            if (input.value.trim() !== '') {
                inputGroup.classList.add('has-value');
            } else {
                inputGroup.classList.remove('has-value');
            }
        }

        // Vérifier au chargement
        checkValue();

        // Événements
        input.addEventListener('input', checkValue);
        input.addEventListener('focus', () => {
            inputGroup.classList.add('has-value');
        });

        input.addEventListener('blur', () => {
            checkValue();
        });

        // Pour l'autocomplétion
        input.addEventListener('change', checkValue);
    });

    // Animation des cartes d'info au scroll
    const infoCards = document.querySelectorAll('.info-card');

    const animateOnScroll = () => {
        infoCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    // État initial des cartes
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });

    // Déclencher l'animation au chargement et au scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Fonction pour afficher les notifications
    function showNotification(message, type = 'success') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Icône selon le type
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Afficher avec animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Masquer automatiquement après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 500);
        }, 5000);
    }
});