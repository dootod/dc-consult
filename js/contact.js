document.addEventListener('DOMContentLoaded', function () {
    // Gestion du menu burger
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', function (event) {
        // Basculer la classe active sur le bouton et la navbar
        this.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Empêcher la propagation de l'événement
        event.stopPropagation();
    });

    // Gestion des dropdowns en mobile
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');

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
    });

    // Fermer le menu quand on clique n'importe où sur la page
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar') || e.target.closest('.nav-links a:not(.dropdown a)')) {
            if (window.innerWidth <= 768) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    });

    // Fermer le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('.submit-icon');

            // Change button state
            submitText.textContent = 'Envoi en cours...';
            submitIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.pointerEvents = 'none';

            // Simulate form submission
            setTimeout(() => {
                // Success state
                submitText.textContent = 'Message envoyé!';
                submitIcon.innerHTML = '<i class="fas fa-check"></i>';
                submitBtn.style.backgroundColor = 'var(--success)';

                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitText.textContent = 'Envoyer';
                    submitIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    submitBtn.style.backgroundColor = 'var(--primary)';
                    submitBtn.style.pointerEvents = 'auto';

                    // Show success message
                    showNotification('Votre message a été envoyé avec succès!');
                }, 2000);
            }, 1500);
        });
    }

    // Floating label initialization
    const floatInputs = document.querySelectorAll('.input-group.floating input, .input-group.floating textarea');

    floatInputs.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.previousElementSibling.classList.add('active');
        }

        input.addEventListener('focus', () => {
            input.previousElementSibling.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.previousElementSibling.classList.remove('active');
            }
        });
    });

    // Animate info cards on scroll
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

    // Set initial state
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });

    // Trigger on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});

