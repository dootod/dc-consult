document.addEventListener('DOMContentLoaded', function () {
    // Animation des cartes logiciels au scroll
    const softwareCards = document.querySelectorAll('.software-card');
    
    const animateCardsOnScroll = () => {
        softwareCards.forEach((card, index) => {
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
    
    // Initial state
    softwareCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
    });
    
    // Trigger on load and scroll
    animateCardsOnScroll();
    window.addEventListener('scroll', animateCardsOnScroll);
});