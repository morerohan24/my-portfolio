// This file would contain more complex animations using libraries like GSAP or Framer Motion
// Here's an example using vanilla JS for simple animations

// Staggered animation for project cards
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Floating animation for hero image
function floatHeroImage() {
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        setInterval(() => {
            heroImage.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                heroImage.style.transform = 'translateY(10px)';
            }, 1500);
        }, 3000);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateProjectCards();
    floatHeroImage();
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('[class*="delay-"]');
    animatedElements.forEach(el => {
        const classes = el.className.split(' ');
        const delayClass = classes.find(cls => cls.startsWith('delay-'));
        if (delayClass) {
            const animationType = classes.find(cls => 
                cls.includes('fade-in') || cls.includes('slide-up') || cls.includes('scale-in')
            );
            
            if (animationType) {
                setTimeout(() => {
                    el.classList.add('animated');
                }, parseInt(delayClass.split('-')[1]) * 1000);
            }
        }
    });
});

// Intersection Observer for more complex animations
const complexObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Example: Animate the about section image
            if (entry.target.id === 'about') {
                const aboutImage = entry.target.querySelector('.about-image img');
                const glassFrame = entry.target.querySelector('.glass-frame');
                
                if (aboutImage && glassFrame) {
                    aboutImage.style.transform = 'translateX(-20px)';
                    aboutImage.style.opacity = '0';
                    glassFrame.style.transform = 'translateX(20px)';
                    glassFrame.style.opacity = '0';
                    
                    setTimeout(() => {
                        aboutImage.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
                        glassFrame.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
                        aboutImage.style.transform = 'translateX(0)';
                        aboutImage.style.opacity = '1';
                        glassFrame.style.transform = 'translateX(0)';
                        glassFrame.style.opacity = '1';
                    }, 300);
                }
            }
        }
    });
}, { threshold: 0.3 });

// Observe sections for complex animations
document.querySelectorAll('section').forEach(section => {
    complexObserver.observe(section);
});