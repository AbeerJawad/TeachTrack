// Function to format dates in a more readable way
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to load pending feedback responses
async function loadPendingResponses() {
    try {
        // This would be replaced with actual API call in your next sprint
        let feedbackList = [
            {
                course: "CS101",
                student: "Maryum Fasih",
                rating: "⭐⭐⭐⭐",
                comments: "Great teaching style!",
                id: "1234"
            },
            {
                course: "CS202",
                student: "John Smith",
                rating: "⭐⭐⭐",
                comments: "The assignments were challenging but helpful.",
                id: "1235"
            }
        ];
        
        let tableBody = document.getElementById("pendingResponsesTable");
        tableBody.innerHTML = ""; // Clear existing data
        
        feedbackList.forEach(feedback => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${feedback.course}</td>
                <td>${feedback.rating}</td>
                <td>${feedback.comments}</td>
                <td>
                    <button class="respond-btn"
                        onclick="window.location.href='respond-feedback.html?course=${feedback.course}&student=${feedback.student}&rating=${feedback.rating}&comments=${encodeURIComponent(feedback.comments)}'">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update counter
        document.getElementById('pendingCount').textContent = feedbackList.length;
        
    } catch (error) {
        console.error("Error loading pending responses:", error);
        showNotification("Failed to load pending responses", "error");
    }
}

// Function to load submitted responses
async function loadSubmittedResponses() {
    try {
        // This would be replaced with actual API call in your next sprint
        let responses = [
            {
                course: "CS101",
                response: "Thank you for your feedback! I will incorporate more examples in future lectures.",
                date: "2024-03-20"
            },
            {
                course: "MAT250",
                response: "I appreciate your suggestions on improving the problem sets. I've implemented changes for the next semester.",
                date: "2024-03-18"
            }
        ];
        
        let tableBody = document.getElementById("submittedResponses");
        tableBody.innerHTML = ""; // Clear existing data
        
        responses.forEach(response => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${response.course}</td>
                <td>${response.response || "No response yet"}</td>
                <td>${formatDate(response.date)}</td>
                <td>
                    <button class="view-btn" onclick="viewResponseDetails('${response.course}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update counter
        document.getElementById('submittedCount').textContent = responses.length;
        
    } catch (error) {
        console.error("Error loading submitted responses:", error);
        showNotification("Failed to load submitted responses", "error");
    }
}

// Function to view response details (to be implemented)
function viewResponseDetails(courseId) {
    // This would be implemented in the next sprint
    console.log(`Viewing details for course: ${courseId}`);
    // For now, just show an alert
    alert(`Viewing details for ${courseId} - This feature will be fully implemented in the next sprint.`);
}

// Function to show notifications
function showNotification(message, type = "info") {
    // Create notification element if it doesn't exist
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '2000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        document.body.appendChild(notification);
    }
    
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    // Set style based on notification type
    if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
    }
    
    // Show notification
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
    }, 3000);
}

// Toggle dark mode function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPendingResponses();
    loadSubmittedResponses();
    
    // Check if dark mode was previously enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

// Add event listener for network status
window.addEventListener('online', () => showNotification('You are back online!', 'success'));
window.addEventListener('offline', () => showNotification('You are offline. Some features may not work.', 'error'));