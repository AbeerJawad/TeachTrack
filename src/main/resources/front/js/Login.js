document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePasswordElements = document.querySelectorAll('.toggle-password');
    togglePasswordElements.forEach(element => {
        element.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Change the icon based on password visibility
            if (type === 'text') {
                this.innerHTML = `
                    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="#6B8CAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6B8CAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 3L21 21" stroke="#6B8CAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                this.innerHTML = `
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#6B8CAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#6B8CAE" stroke-width="1.5"/>
                `;
            }
        });
    });

    // Handle form submissions
    const facultyLoginForm = document.getElementById('facultyLoginForm');
    const studentLoginForm = document.getElementById('studentLoginForm');

    if (facultyLoginForm) {
        facultyLoginForm.addEventListener('submit', handleFormSubmission);
    }
    
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', handleFormSubmission);
    }

    function handleFormSubmission(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        
        // Show loading state on button
        const button = event.target.querySelector('button[type="submit"]');
        const originalButtonText = button.innerHTML;
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="loading-spinner">
                <path d="M12 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 18V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.93 4.93L7.76 7.76" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.24 16.24L19.07 19.07" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 12H22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.93 19.07L7.76 16.24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.24 7.76L19.07 4.93" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Logging in...
        `;
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Here you would typically make an API call to authenticate
            console.log('Form submission data:', formDataObject);
            
            // For demonstration, we'll redirect based on the role
            // In a real app, this would happen after successful authentication
            if (formDataObject.role === 'faculty') {
                window.location.href = '../faculty/dashboard.html';
            } else if (formDataObject.role === 'student') {
                window.location.href = '../student/dashboard.html';
            }
            
            // Reset button state in case the redirect fails
            button.innerHTML = originalButtonText;
            button.disabled = false;
        }, 1500);
    }

    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Add animation when input gains focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove animation when input loses focus
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check on load if input has value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Add CSS for loading spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-spinner {
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        .input-container.focused {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(46, 136, 251, 0.15);
        }
    `;
    document.head.appendChild(style);
});