document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const progressBars = document.querySelectorAll('.progress');
    const contactForm = document.querySelector('#contactForm');
    const projectModal = document.querySelector('#projectModal');
    const certificateModal = document.querySelector('#certificateModal');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const yearElement = document.getElementById('year');

    // Set current year in footer
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to Top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate Progress Bars
    function animateSkillCards() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    // Project Filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    animateSkillCards();
                }
                
                const animatedElements = entry.target.querySelectorAll('[class*="fade-in"], [class*="slide-up"], [class*="scale-in"]');
                animatedElements.forEach(el => {
                    const classes = el.className.split(' ');
                    const animationClass = classes.find(cls => 
                        cls.includes('fade-in') || 
                        cls.includes('slide-up') || 
                        cls.includes('scale-in') ||
                        cls.includes('fade-in-left') ||
                        cls.includes('fade-in-right')
                    );
                    
                    if (animationClass && !el.classList.contains('animated')) {
                        el.classList.add('animated');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors and messages
            const errorMessages = contactForm.querySelectorAll('.error-message');
            const formMessage = document.getElementById('formMessage');
            errorMessages.forEach(msg => {
                msg.textContent = '';
                msg.style.display = 'none';
            });
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            // Validate form
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            let hasError = false;

            if (!data.name.trim()) {
                showError('name', 'Name is required');
                hasError = true;
            }
            if (!data.email.trim() || !isValidEmail(data.email)) {
                showError('email', 'Valid email is required');
                hasError = true;
            }
            if (!data.message.trim()) {
                showError('message', 'Message is required');
                hasError = true;
            }

            if (hasError) return;

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    formMessage.className = 'form-message success-message';
                    formMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you!</h3>
                        <p>Your message has been sent successfully. I'll get back to you soon.</p>
                    `;
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Form submission failed');
                }
            } catch (error) {
                formMessage.className = 'form-message error-message';
                formMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Oops!</h3>
                    <p>${error.message || 'Something went wrong. Please try again later.'}</p>
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });

        function showError(fieldName, message) {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            const errorSpan = field.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error-message')) {
                errorSpan.textContent = message;
                errorSpan.style.display = 'block';
                field.style.borderColor = '#e74c3c';
            }
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    // Initialize Map
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const myLocation = [18.5204, 73.8567]; // Pune, India
        const map = L.map('map').setView(myLocation, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        L.marker(myLocation).addTo(map)
            .bindPopup("<b>My Location</b><br>Pune, India").openPopup();
        
        const mapLink = document.querySelector('.map-links a');
        if (mapLink) {
            mapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${myLocation[0]},${myLocation[1]}`;
        }
    }

    // Project Details Modal
    function setupProjectModal() {
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        const modalTitle = document.getElementById('modalTitle');
        const modalDetails = document.getElementById('modalDetails');
        const closeModal = projectModal.querySelector('.close-modal');

        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const project = button.getAttribute('data-project');
                let content = '';
                
                switch (project) {
                    case 'restaurant':
                        content = `
                            <div class="project-tech">
                                <span class="tech-tag">Android</span>
                                <span class="tech-tag">Java</span>
                                <span class="tech-tag">Firebase</span>
                            </div>
                            <h4>Project Overview:</h4>
                            <p>The Restaurant Management System is a full-stack web application designed to streamline restaurant operations such as menu management, order tracking, billing, and user management.</p>
                            <h4>Key Features:</h4>
                            <ul class="feature-list">
                                <li><i class="fas fa-check-circle"></i> Admin Panel: Manage menu items, staff users, order history, sales reports</li>
                                <li><i class="fas fa-check-circle"></i> Customer Module: View menu, place orders, receive confirmation</li>
                                <li><i class="fas fa-check-circle"></i> Order Management: Real-time updates, track status, table bookings</li>
                                <li><i class="fas fa-check-circle"></i> Billing System: Automated bill generation, digital payment integration</li>
                            </ul>
                            <div class="project-links">
                                <a href="https://github.com/yourusername/restaurant" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>
                                <a href="#" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                            </div>
                        `;
                        break;
                    case 'wanderlist':
                        content = `
                            <div class="project-tech">
                                <span class="tech-tag">Flutter</span>
                                <span class="tech-tag">Dart</span>
                                <span class="tech-tag">Firebase</span>
                            </div>
                            <h4>Project Overview:</h4>
                            <p>Wanderlist is a dynamic travel web application that allows users to explore, plan, and document travel destinations.</p>
                            <h4>Key Features:</h4>
                            <ul class="feature-list">
                                <li><i class="fas fa-check-circle"></i> Destination Browsing: Browse destinations with images and filters</li>
                                <li><i class="fas fa-check-circle"></i> Add to Wanderlist: Personal travel wishlist management</li>
                                <li><i class="fas fa-check-circle"></i> Trip Planning: Add notes, itineraries, mark destinations</li>
                                <li><i class="fas fa-check-circle"></i> User Authentication: Secure registration and login</li>
                            </ul>
                            <div class="project-links">
                                <a href="https://github.com/yourusername/wanderlist" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>
                                <a href="#" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                            </div>
                        `;
                        break;
                    case 'krishimitra':
                        content = `
                            <div class="project-tech">
                                <span class="tech-tag">Java</span>
                                <span class="tech-tag">Firebase</span>
                                <span class="tech-tag">AI Integration</span>
                            </div>
                            <h4>Project Overview:</h4>
                            <p>KrishiMitra is an agricultural marketplace platform connecting farmers with buyers, featuring an AI-powered chatbot.</p>
                            <h4>Key Features:</h4>
                            <ul class="feature-list">
                                <li><i class="fas fa-check-circle"></i> Marketplace: List and purchase agricultural products</li>
                                <li><i class="fas fa-check-circle"></i> AI Chatbot: Answer queries on products and farming</li>
                                <li><i class="fas fa-check-circle"></i> Real-time Chat: Messaging between farmers and buyers</li>
                                <li><i class="fas fa-check-circle"></i> Weather Widget: Real-time weather information</li>
                                <li><i class="fas fa-check-circle"></i> Multilingual Support: Hindi, Marathi, English</li>
                            </ul>
                            <div class="project-links">
                                <a href="https://github.com/yourusername/krishimitra" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>
                                <a href="#" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                            </div>
                        `;
                        break;
                    case 'zerodha':
                    content = `
                        <div class="project-tech">
                            <span class="tech-tag">React</span>
                            <span class="tech-tag">Node.js</span>
                            <span class="tech-tag">MongoDB</span>
                        </div>
                        <h4>Project Overview:</h4>
                        <p>I developed a fully functional stock trading web application inspired by Zerodha, India’s leading stock brokerage platform. This project simulates real-time trading, portfolio management, user onboarding, and watchlist tracking.</p>
                        <h4>Key Features:</h4>
                        <ul class="feature-list">
                            <li><i class="fas fa-check-circle"></i>User Authentication: Secure login/signup using JWT and bcrypt</li>
                            <li><i class="fas fa-check-circle"></i> Dashboard: Displays user's portfolio with real-time (mock) data</li>
                            <li><i class="fas fa-check-circle"></i> Watchlist: Add/remove stocks to a personal watchlist</li>
                            <li><i class="fas fa-check-circle"></i> Stock Market Simulation: Mock trading system with buy/sell functionality</li>
                            <li><i class="fas fa-check-circle"></i> Transaction History: View complete trade history with date, price, and volume</li>
                        </ul>
                        <div class="project-links">
                            <a href="https://github.com/morerohan24/Zerodha.git" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>
                            <a href="#" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i>Zerodha Clone</a>
                        </div>
                    `;
                    break;
                    case 'tripplanner':
                        content = `
                            <div class="project-tech">
                                <span class="tech-tag">Flutter</span>
                                <span class="tech-tag">Dart</span>
                                <span class="tech-tag">Firebase</span>
                            </div>
                            <h4>Project Overview:</h4>
                            <p>Tripplanner is a cross-platform mobile app for efficient trip planning.</p>
                            <h4>Key Features:</h4>
                            <ul class="feature-list">
                                <li><i class="fas fa-check-circle"></i> Itinerary Planning: Create day-by-day schedules</li>
                                <li><i class="fas fa-check-circle"></i> Budget Tracking: Manage trip expenses</li>
                                <li><i class="fas fa-check-circle"></i> Destination Discovery: Browse recommendations</li>
                                <li><i class="fas fa-check-circle"></i> Packing Lists: Manage packing for trips</li>
                                <li><i class="fas fa-check-circle"></i> Offline Access: Access plans offline</li>
                            </ul>
                            <div class="project-links">
                                <a href="https://github.com/yourusername/tripplanner" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>
                                <a href="#" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> App Store</a>
                            </div>
                        `;
                        break;
                }
                
                modalTitle.textContent = `${project.charAt(0).toUpperCase() + project.slice(1).replace(/([A-Z])/g, ' $1')}`;
                modalDetails.innerHTML = content;
                projectModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', () => {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Certificate Modal
    function setupCertificateModal() {
        const viewCertificateButtons = document.querySelectorAll('.view-certificate');
        const certificateImage = document.getElementById('certificateImage');
        const certificateTitle = document.getElementById('certificateTitle');
        const closeCertificateModal = certificateModal.querySelector('.close-modal');

        viewCertificateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.certificate-card');
                certificateImage.src = card.querySelector('img').src;
                certificateTitle.textContent = card.querySelector('h4').textContent;
                certificateModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        closeCertificateModal.addEventListener('click', () => {
            certificateModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === certificateModal) {
                certificateModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize everything
    initMap();
    setupProjectModal();
    setupCertificateModal();

    setTimeout(() => {
        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('animated');
            }
        });
    }, 500);
});