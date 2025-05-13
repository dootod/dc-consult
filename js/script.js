document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu burger
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', function() {
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
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Fermer le menu quand on clique n'importe où sur la page
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') || e.target.closest('.nav-links a:not(.dropdown a)')) {
            if (window.innerWidth <= 768) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    });

    // Fermer le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
});