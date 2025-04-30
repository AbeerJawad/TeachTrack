// Role selection functionality with animation
function redirectToFacultyLogin() {
    // Add fade-out animation
    document.querySelector('.welcome-container').classList.add('fade-out');
    
    // Store role selection in session storage
    sessionStorage.setItem('userRole', 'faculty');
    
    // Delay redirect for animation
    setTimeout(() => {
        window.location.href = 'faculty/FacLogin.html';
    }, 300);
}

function redirectToStudentLogin() {
    // Add fade-out animation
    document.querySelector('.welcome-container').classList.add('fade-out');
    
    // Store role selection in session storage
    sessionStorage.setItem('userRole', 'student');
    
    // Delay redirect for animation
    setTimeout(() => {
        window.location.href = 'student/StuLogin.html';
    }, 300);
}

// Initialize page with fade-in effect and animations
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class after a short delay
    setTimeout(() => {
        document.querySelector('.welcome-container').classList.add('fade-in');
    }, 100);
    
    // Add subtle hover animations and interactions for role cards
    const facultyCard = document.getElementById('faculty-card');
    const studentCard = document.getElementById('student-card');
    
    if (facultyCard && studentCard) {
        // Apply enhanced hover effects to faculty card
        facultyCard.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.querySelector('.role-icon').style.transform = 'scale(1.1)';
            this.querySelector('h2').style.color = 'var(--primary-color)';
        });
        
        facultyCard.addEventListener('mouseleave', function() {
            this.style.borderColor = 'rgba(0, 0, 0, 0.05)';
            this.querySelector('.role-icon').style.transform = 'scale(1)';
            this.querySelector('h2').style.color = 'var(--dark-color)';
        });
        
        // Apply enhanced hover effects to student card
        studentCard.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--secondary-color)';
            this.querySelector('.role-icon').style.transform = 'scale(1.1)';
            this.querySelector('h2').style.color = 'var(--secondary-color)';
        });
        
        studentCard.addEventListener('mouseleave', function() {
            this.style.borderColor = 'rgba(0, 0, 0, 0.05)';
            this.querySelector('.role-icon').style.transform = 'scale(1)';
            this.querySelector('h2').style.color = 'var(--dark-color)';
        });
        
        // Add transition properties for smooth animation
        const roleIcons = document.querySelectorAll('.role-icon');
        const roleHeadings = document.querySelectorAll('.role-card h2');
        
        roleIcons.forEach(icon => {
            icon.style.transition = 'transform 0.3s ease';
        });
        
        roleHeadings.forEach(heading => {
            heading.style.transition = 'color 0.3s ease';
        });
    }
    
    // Set body class based on role when on login pages
    const role = sessionStorage.getItem('userRole');
    
    // Check for faculty login page
    if (window.location.pathname.includes('FacLogin')) {
        document.body.classList.add('faculty-page');
        
        // Apply fade-in animation to login container
        const loginContainer = document.querySelector('.login-form-container');
        if (loginContainer) {
            loginContainer.style.opacity = '0';
            loginContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                loginContainer.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                loginContainer.style.opacity = '1';
                loginContainer.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (role) {
            const roleField = document.getElementById('roleField');
            if (roleField) roleField.value = 'faculty';
        }
        
        // Add back button functionality with improved animation
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Fade out the login container
                const loginContainer = document.querySelector('.login-form-container') || document.querySelector('.welcome-container');
                loginContainer.style.opacity = '0';
                loginContainer.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    window.location.href = '../Startpage.html';
                }, 300);
            });
        }
    }
    
    // Check for student login page
    else if (window.location.pathname.includes('StuLogin')) {
        document.body.classList.add('student-page');
        
        // Apply fade-in animation to login container
        const loginContainer = document.querySelector('.login-form-container');
        if (loginContainer) {
            loginContainer.style.opacity = '0';
            loginContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                loginContainer.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                loginContainer.style.opacity = '1';
                loginContainer.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (role) {
            const roleField = document.getElementById('roleField');
            if (roleField) roleField.value = 'student';
        }
        
        // Add back button functionality with improved animation
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Fade out the login container
                const loginContainer = document.querySelector('.login-form-container') || document.querySelector('.welcome-container');
                loginContainer.style.opacity = '0';
                loginContainer.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    window.location.href = '../Startpage.html';
                }, 300);
            });
        }
    }
    
    // Add subtle parallax effect to role cards
    if (document.querySelector('.role-selection')) {
        document.addEventListener('mousemove', function(e) {
            const cards = document.querySelectorAll('.role-card');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                
                const offsetX = (mouseX - 0.5) * 10;
                const offsetY = (mouseY - 0.5) * 10;
                
                card.style.transform = `perspective(1000px) rotateY(${offsetX}deg) rotateX(${-offsetY}deg) translateZ(0)`;
            });
        });
        
        // Reset transform when mouse leaves window
        document.addEventListener('mouseleave', function() {
            const cards = document.querySelectorAll('.role-card');
            cards.forEach(card => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
            });
        });
    }
});