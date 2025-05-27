document.addEventListener('DOMContentLoaded', function() {
    // Animation des sections au défilement
    const legalSections = document.querySelectorAll('.legal-section');

    const animateOnScroll = () => {
        legalSections.forEach((section, index) => {
            const sectionPosition = section.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (sectionPosition < screenPosition) {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    // Set initial state
    legalSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease';
    });

    // Trigger on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Smooth anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

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