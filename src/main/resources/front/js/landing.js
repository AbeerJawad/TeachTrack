document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    
    // Create mobile menu content
    mobileMenu.innerHTML = `
        <div class="close-btn"><i class="fas fa-times"></i></div>
        <div class="nav-links">
            <a href="#" class="active">Home</a>
            <a href="#">Features</a>
            <a href="#">How It Works</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </div>
        <div class="auth-buttons">
            <button class="login-btn">Log In</button>
            <button class="signup-btn">Sign Up</button>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    const closeBtn = mobileMenu.querySelector('.close-btn');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Testimonial slider functionality
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    // Initialize testimonial slider
    showTestimonial(currentTestimonial);
    
    // Set up dot click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTestimonial(index);
        });
    });
    
    // Auto-rotate testimonials
    setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 6000);
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected testimonial and set the corresponding dot as active
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    // Smooth scroll for anchor links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only apply smooth scroll to hashtag links
            if(targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if(targetElement) {
                    const offsetTop = targetElement.offsetTop - header.offsetHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if(mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const steps = document.querySelectorAll('.step');
    
    // Check if IntersectionObserver is supported
    if('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Observe feature cards
        featureCards.forEach(card => {
            observer.observe(card);
        });
        
        // Observe steps
        steps.forEach(step => {
            observer.observe(step);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        featureCards.forEach(card => {
            card.classList.add('animated');
        });
        
        steps.forEach(step => {
            step.classList.add('animated');
        });
    }

    // Form submission handling for demo purposes
    const ctaButton = document.querySelector('.cta-btn');
    const primaryBtn = document.querySelector('.primary-btn');
    
    [ctaButton, primaryBtn].forEach(button => {
        if(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Thank you for your interest! This would normally redirect to a sign-up page.');
            });
        }
    });

    // Add CSS for animations if not already in the CSS file
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .step {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.animated, .step.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .step:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .step:nth-child(3) {
            transition-delay: 0.4s;
        }
        
        .feature-card:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(4) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);
});