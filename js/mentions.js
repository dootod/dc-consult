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