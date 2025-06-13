document.addEventListener('DOMContentLoaded', function () {
    // Initialisation des carrousels
    const carousels = document.querySelectorAll('.image-carousel');

    carousels.forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');

        let currentIndex = 0;
        const totalItems = items.length;

        // Création des indicateurs
        items.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToIndex(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = carousel.querySelectorAll('.carousel-indicator');

        function updateCarousel() {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Mise à jour des indicateurs
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        function goToIndex(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        // Événements
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide();
            }
        }
    });

    // Animation des cartes références au scroll
    const referenceCards = document.querySelectorAll('.reference-card');

    const animateCardsOnScroll = () => {
        referenceCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    };

    // État initial
    referenceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
    });

    // Déclenchement au chargement et au scroll
    animateCardsOnScroll();
    window.addEventListener('scroll', animateCardsOnScroll);

    // Gestion du menu burger
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', function (event) {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
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

                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // Fermer le menu quand on clique ailleurs sur la page
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