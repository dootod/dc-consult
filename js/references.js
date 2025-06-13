document.addEventListener('DOMContentLoaded', function () {
    // Initialisation des carrousels
    const carousels = document.querySelectorAll('.image-carousel');

    // Création de la lightbox
    const lightbox = document.createElement('div');
    lightbox.classList.add('image-lightbox');
    lightbox.innerHTML = `
        <button class="close-lightbox"><i class="fas fa-times"></i></button>
        <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
        <div class="lightbox-counter"></div>
        <img src="" alt="Image en plein écran">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');

    let currentLightboxIndex = 0;
    let currentLightboxItems = [];

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

        // Événements pour la navigation du carousel
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

        // Gestion du clic sur les images pour la lightbox
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                img.style.cursor = 'pointer';

                img.addEventListener('click', () => {
                    currentLightboxItems = Array.from(items).map(item => {
                        const img = item.querySelector('img');
                        return img ? img.src : '';
                    }).filter(src => src !== '');

                    currentLightboxIndex = currentLightboxItems.indexOf(img.src);
                    if (currentLightboxIndex !== -1) {
                        openLightbox();
                    }
                });
            }
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        updateLightboxImage();
        document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Rétablit le défilement
    }

    function updateLightboxImage() {
        if (currentLightboxItems[currentLightboxIndex]) {
            lightboxImg.src = currentLightboxItems[currentLightboxIndex];
            counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxItems.length}`;
        }
    }

    function nextLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxItems.length;
        updateLightboxImage();
    }

    function prevLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxItems.length) % currentLightboxItems.length;
        updateLightboxImage();
    }

    // Événements pour la lightbox
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextLightboxImage);
    prevBtn.addEventListener('click', prevLightboxImage);

    // Fermer la lightbox en cliquant à l'extérieur de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextLightboxImage();
            } else if (e.key === 'ArrowLeft') {
                prevLightboxImage();
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
