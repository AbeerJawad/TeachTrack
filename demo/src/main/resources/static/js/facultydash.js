// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-280px";
        document.querySelector('.main-section').style.marginLeft = "0";
    } else {
        sidebar.style.left = "0px";
        document.querySelector('.main-section').style.marginLeft = "280px";
    }
}

// Toggle Feedback Menu
function toggleFeedbackMenu() {
    document.getElementById("expanded-menu").classList.toggle("hidden");
}

// Renders star rating based on the score (1-5)
function renderStars(rating) {
    const fullStar = '<i class="fas fa-star"></i>';
    const halfStar = '<i class="fas fa-star-half-alt"></i>';
    const emptyStar = '<i class="far fa-star"></i>';
    
    let stars = '';
    
    // Add full stars
    for (let i = 1; i <= Math.floor(rating); i++) {
        stars += fullStar;
    }
    
    // Add half star if needed
    if (rating % 1 >= 0.5) {
        stars += halfStar;
    }
    
    // Add empty stars to make up to 5
    while (stars.match(/<i/g)?.length < 5) {
        stars += emptyStar;
    }
    
    return stars;
}

// Main function to load faculty dashboard data
async function loadFacultyDashboard(userId = null, courseFilter = null) {
    if (!userId) {
        userId = getUserId();
        if (!userId) return;
    }
    
    try {
        // Prepare the URL, add course filter if available
        let url = `/dashboard/faculty/feedback/${userId}`;
        if (courseFilter) {
            url = `/dashboard/faculty/feedback/${userId}/filter?courseCode=${courseFilter}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded faculty data:', data);
        
        // Update UI with the dashboard data
        updateFacultyDashboard(data);
        
        // Also load course options for filter
        loadCourseOptions(userId);
        
        return data;
    } catch (error) {
        console.error("Failed to load faculty dashboard:", error);
        document.getElementById("feedbackTable").innerHTML = 
            `<tr><td colspan="4" class="error-message">Error loading feedback data. Please try again.</td></tr>`;
    }
}

// Update Faculty Dashboard UI with the fetched data
function updateFacultyDashboard(facultyData) {
    // Update stats cards
    document.getElementById("totalFeedback").innerText = facultyData.feedbackCount || 0;
    document.getElementById("positiveFeedback").innerText = facultyData.positiveFeedback || 0;
    document.getElementById("negativeFeedback").innerText = facultyData.negativeFeedback || 0;

    // Populate feedback table
    let feedbackTable = document.getElementById("feedbackTable");
    feedbackTable.innerHTML = "";

    if (facultyData.feedbackList && facultyData.feedbackList.length > 0) {
        facultyData.feedbackList.forEach(feedback => {
            const stars = renderStars(feedback.rating);
            const courseDisplay = feedback.courseCode ? 
                `${feedback.courseCode} ${feedback.courseName ? '- ' + feedback.courseName : ''}` : 
                'N/A';
            
            const formattedDate = new Date(feedback.createdAt).toLocaleDateString();
            
            let row = `<tr>
                <td>${courseDisplay}</td>
                <td>${stars}</td>
                <td>${feedback.comments || 'No comments'}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewFeedbackDetails(${feedback.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn respond-btn" onclick="respondToFeedback(${feedback.id})">
                        <i class="fas fa-reply"></i>
                    </button>
                </td>
            </tr>`;
            feedbackTable.innerHTML += row;
        });
    } else {
        feedbackTable.innerHTML = `<tr><td colspan="4" style="text-align: center;">No feedback available</td></tr>`;
    }
}

// Load course options for filter dropdown
async function loadCourseOptions(userId) {
    try {
        console.log(`Fetching courses for user ID: ${userId}`);
        const response = await fetch(`/dashboard/faculty/courses/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const courses = await response.json();
        console.log('Courses loaded from backend:', courses);
        
        const courseFilter = document.getElementById("courseFilter");
        
        if (!courseFilter) {
            console.warn("Course filter element not found");
            return;
        }
        
        // Keep only the first option (All Courses) and remove the rest
        while (courseFilter.options.length > 1) {
            courseFilter.remove(1);
        }
        
        if (courses && courses.length > 0) {
            // Add course options
            courses.forEach(course => {
                console.log(`Adding course: ${course.courseCode} - ${course.courseName}`);
                const option = document.createElement('option');
                option.value = course.courseCode;
                option.textContent = `${course.courseCode} - ${course.courseName}`;
                courseFilter.appendChild(option);
            });
            console.log(`Added ${courses.length} courses to dropdown`);
        } else {
            console.log('No courses returned from backend');
        }
    } catch (error) {
        console.error("Error loading course options:", error);
    }
}

// Search feedback functionality
function searchFeedback() {
    const searchInput = document.getElementById('searchFeedback');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // If search term is empty, reload all feedback
        const userId = getUserId();
        loadFacultyDashboard(userId);
        return;
    }
    
    // Get the table rows
    const rows = document.querySelectorAll('#feedbackTable tr');
    
    // Loop through rows and hide/show based on search term
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// View detailed feedback (placeholder for future implementation)
function viewFeedbackDetails(feedbackId) {
    console.log(`View feedback details for ID: ${feedbackId}`);
    alert(`Viewing feedback details will be implemented in a future release.`);
    // In a real implementation, this might open a modal or navigate to a detailed view
}

// Respond to feedback (placeholder for future implementation)
function respondToFeedback(feedbackId) {
    console.log(`Respond to feedback ID: ${feedbackId}`);
    window.location.href = `FacultyRespond.html?feedbackId=${feedbackId}`;
}

function getUserId() {
    // 1. Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('userId');
    
    // 2. Fallback to storage
    if (!userId) {
        userId = localStorage.getItem("userId") || 
                sessionStorage.getItem("userId");
    }
    
    // 3. Final validation
    if (!userId) {
        console.error("Invalid user ID:", userId);
        
        window.location.href = "login.html";
        return null;
    }
    
    return userId;
}

// Handle course filter changes
function handleCourseFilter() {
    const courseFilter = document.getElementById("courseFilter");
    const selectedCourse = courseFilter.value;
    const userId = getUserId();
    
    if (selectedCourse) {
        loadFacultyDashboard(userId, selectedCourse);
    } else {
        loadFacultyDashboard(userId);
    }
}

// Reload feedback data (for refresh button)
function loadFeedbackData() {
    const userId = getUserId();
    loadFacultyDashboard(userId);
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function() {
    const userId = getUserId();
    if (!userId) return;
    
    console.log("Bootstrapped userId:", userId);
    loadFacultyDashboard(userId);
    
    // Add event listeners
    const courseFilter = document.getElementById("courseFilter");
    if (courseFilter) {
        courseFilter.addEventListener("change", handleCourseFilter);
    }
    
    // Add event listener for search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchFeedback);
    }
    
    // Add event listener for pressing Enter in search field
    const searchInput = document.getElementById('searchFeedback');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchFeedback();
            }
        });
    }
    
    // Add event listener for filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', handleCourseFilter);
    }
});