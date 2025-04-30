// Function to get feedback details from URL parameters
function getFeedbackDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course');
    const student = urlParams.get('student');
    const rating = urlParams.get('rating');
    const comments = urlParams.get('comments');
    
    // Populate feedback details
    document.getElementById('course-name').innerText = course || "N/A";
    document.getElementById('student-name').innerText = student || "N/A";
    
    // Display rating with stars if available
    if (rating) {
        const ratingElement = document.getElementById('rating');
        const numericRating = parseFloat(rating);
        
        if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
            let starsHTML = '';
            const fullStars = Math.floor(numericRating);
            const hasHalfStar = numericRating % 1 >= 0.5;
            
            // Add full stars
            for (let i = 0; i < fullStars; i++) {
                starsHTML += '<i class="fas fa-star" style="color: #FFD700;"></i> ';
            }
            
            // Add half star if needed
            if (hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt" style="color: #FFD700;"></i> ';
            }
            
            // Add empty stars
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '<i class="far fa-star" style="color: #FFD700;"></i> ';
            }
            
            ratingElement.innerHTML = starsHTML + ` (${rating})`;
        } else {
            ratingElement.innerText = rating;
        }
    } else {
        document.getElementById('rating').innerText = "N/A";
    }
    
    // Set comments
    document.getElementById('comments').innerText = comments || "No additional comments provided.";
}

// Function to add animation effects to form elements
function addFormAnimations() {
    const sections = document.querySelectorAll('.response-section');
    
    sections.forEach((section, index) => {
        // Add staggered animation delay
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        section.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
        
        setTimeout(() => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }, 100);
    });
}

// Function to handle form submission
function handleFormSubmission() {
    document.getElementById("response-form").addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Show loading state on button
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Get form values
        const assessment = document.querySelector('input[name="assessment"]:checked')?.value || "Not Selected";
        const action = document.querySelector('input[name="action"]:checked')?.value || "Not Selected";
        const responseText = document.getElementById("faculty-response").value.trim();
        
        // Simulate processing time (remove in production)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Show success message
            alert(`Response Submitted!\nAssessment: ${assessment}\nAction: ${action}\nAdditional Response: ${responseText}`);
        }, 1000);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("theme-toggle"); // Adjust ID if needed

    // Apply dark mode if enabled in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");
    }

    // Toggle theme on button click
    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            if (document.body.classList.contains("dark-mode")) {
                document.body.classList.remove("dark-mode");
                document.documentElement.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "disabled"); // Save state
            } else {
                document.body.classList.add("dark-mode");
                document.documentElement.classList.add("dark-mode");
                localStorage.setItem("darkMode", "enabled"); // Save state
            }
        });
    }
});

// Initialize when the page loads
window.onload = function() {
    getFeedbackDetails();
    addFormAnimations();
    handleFormSubmission();
};