// Function to get URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const feedbackId = urlParams.get('feedbackId');
    
    return { userId, feedbackId };
}

// Function to fetch feedback details from API
async function fetchFeedbackDetails() {
    const { userId, feedbackId } = getUrlParams();
    
    if (!userId || !feedbackId) {
        showError("Missing required parameters: userId and feedbackId");
        return;
    }
    
    try {
        // First, fetch the specific feedback
        const response = await fetch(`/dashboard/faculty/feedback/${userId}/details?feedbackId=${feedbackId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const feedbackData = await response.json();
        displayFeedbackDetails(feedbackData);
    } catch (error) {
        console.error("Error fetching feedback details:", error);
        showError("Failed to load feedback details. Please try again later.");
    }
}

// Function to display feedback details
function displayFeedbackDetails(data) {
    // Populate course name
    document.getElementById('course-name').innerText = data.courseCode + " - " + data.courseName || "N/A";
    
    // Populate student name (keep anonymous if needed)
    document.getElementById('student-name').innerText = "Anonymous";
    
    // Display rating with stars
    const ratingElement = document.getElementById('rating');
    if (data.rating) {
        const numericRating = parseFloat(data.rating);
        
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
            
            ratingElement.innerHTML = starsHTML + ` (${data.rating})`;
        } else {
            ratingElement.innerText = data.rating;
        }
    } else {
        ratingElement.innerText = "N/A";
    }
    
    // Set comments
    document.getElementById('comments').innerText = data.comments || "No additional comments provided.";
}

// Function to show error message
function showError(message) {
    const responseContainer = document.querySelector('.response-container');
    responseContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <a href="FacultyDash.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
        </div>
    `;
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
async function handleFormSubmission() {
    document.getElementById("response-form").addEventListener("submit", async function(event) {
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
        
        const { userId, feedbackId } = getUrlParams();
        
        try {
            // Submit response to API
            const response = await fetch(`/dashboard/faculty/feedback/${userId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedbackId: feedbackId,
                    assessment: assessment,
                    action: action,
                    response: responseText
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Handle successful submission
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted';
            setTimeout(() => {
                alert("Response submitted successfully!");
                window.location.href = `FacultyDash.html?userId=${userId}`;
            }, 1000);
            
        } catch (error) {
            console.error("Error submitting response:", error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert("Failed to submit response. Please try again later.");
        }
    });
}

// Handle dark mode toggle
function setupDarkMode() {
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
}

// Initialize when the page loads
window.onload = function() {
    setupDarkMode();
    fetchFeedbackDetails();
    addFormAnimations();
    handleFormSubmission();
};