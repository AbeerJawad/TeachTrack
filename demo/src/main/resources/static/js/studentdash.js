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

// Toggle Evaluation Menu
function toggleEvaluationMenu() {
    document.getElementById("expanded-menu").classList.toggle("hidden");
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    
    if (!userEmail || userRole !== "STUDENT") {
        // Redirect to login if not logged in or not a student
        alert("Please log in as a student to access this page.");
        window.location.href = "login.html";
        return;
    }
    
    // Load student data
    loadStudentDashboard(userEmail);
    
    // Add event listeners
    document.getElementById("searchInput").addEventListener("input", filterFaculty);
    document.getElementById("departmentFilter").addEventListener("change", filterFaculty);
    document.getElementById("clearFilter").addEventListener("click", clearFilters);
    
    // Setup logout functionality
    setupLogout();
});

// Load student dashboard data
async function loadStudentDashboard(email) {
    try {
        // Show loading state
        document.querySelector('.content').innerHTML += '<div id="loading">Loading dashboard data...</div>';
        
        // Fetch student data from backend
        const response = await fetch(`http://localhost:8080/dashboard/student/${email}`);
        
        if (!response.ok) {
            throw new Error('Failed to load student data');
        }
        
        const data = await response.json();
        console.log("Student Data:", data);
        
        // Remove loading indicator
        document.getElementById("loading")?.remove();
        
        // Update dashboard with student info
        updateDashboardWithStudentData(data);
        
        // Update stats boxes with data from backend
        updateStatBoxes(data.stats);
        
        // Load evaluations
        loadEvaluations(email);
        
    } catch (error) {
        console.error("Error loading dashboard:", error);
        document.getElementById("loading")?.remove();
        document.querySelector('.content').innerHTML += '<div class="error-message">Failed to load dashboard data. Please refresh the page or try again later.</div>';
    }
}

// Update dashboard UI with student data
function updateDashboardWithStudentData(studentData) {
    // Add welcome message with student name
    const dashboardTitle = document.querySelector('.content h1');
    dashboardTitle.textContent = `Welcome, ${studentData.fullName || 'Student'}!`;
    
    // Add student ID if available
    if (studentData.studentId) {
        const studentIdElement = document.createElement('p');
        studentIdElement.className = 'student-id';
        studentIdElement.textContent = `Student ID: ${studentData.studentId}`;
        dashboardTitle.insertAdjacentElement('afterend', studentIdElement);
    }
}

// Update statistics boxes with data from backend
function updateStatBoxes(stats) {
    if (!stats) return;
    
    const statBoxes = document.querySelectorAll('.stat-box');
    
    // Update pending evaluations count
    if (stats.pendingEvaluations !== undefined && statBoxes[0]) {
        statBoxes[0].querySelector('h2').textContent = stats.pendingEvaluations;
    }
    
    // Update completed evaluations count
    if (stats.completedEvaluations !== undefined && statBoxes[1]) {
        statBoxes[1].querySelector('h2').textContent = stats.completedEvaluations;
    }
    
    // Update next due date
    if (stats.nextDueDate && statBoxes[2]) {
        statBoxes[2].querySelector('h2').textContent = stats.nextDueDate;
    }
}

// Load pending and completed evaluations
async function loadEvaluations(email) {
    try {
        // Fetch evaluations from the backend
        const response = await fetch(`http://localhost:8080/dashboard/student/${email}/evaluations`);
        
        if (!response.ok) {
            throw new Error('Failed to load evaluations');
        }
        
        const evaluations = await response.json();
        console.log("Evaluations:", evaluations);
        
        // Update the UI with the fetched evaluations
        updateEvaluationsUI(evaluations);
        
    } catch (error) {
        console.error("Error loading evaluations:", error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Failed to load evaluations. Please refresh the page.';
        document.querySelector('.content').appendChild(errorMsg);
    }
}

// Update UI with evaluation data
function updateEvaluationsUI(evaluationData) {
    // Update pending evaluations
    const pendingContainer = document.querySelector('.evaluation-container');
    if (pendingContainer && evaluationData.pending && evaluationData.pending.length > 0) {
        pendingContainer.innerHTML = ''; // Clear existing cards
        
        evaluationData.pending.forEach(eval => {
            pendingContainer.innerHTML += `
                <div class="evaluation-card">
                    <h3>${eval.facultyName}</h3>
                    <p>Course: ${eval.courseName}</p>
                    <p>Department: ${eval.department}</p>
                    <p class="due-date">Due: ${formatDate(eval.dueDate)}</p>
                    <button class="feedback-btn" data-id="${eval.id}">Give Feedback</button>
                </div>
            `;
        });
    } else if (pendingContainer && (!evaluationData.pending || evaluationData.pending.length === 0)) {
        pendingContainer.innerHTML = '<p class="no-evaluations">No pending evaluations found.</p>';
    }
    
    // Update completed evaluations
    const completedContainer = document.querySelectorAll('.evaluation-container')[1];
    if (completedContainer && evaluationData.completed && evaluationData.completed.length > 0) {
        completedContainer.innerHTML = ''; // Clear existing cards
        
        evaluationData.completed.forEach(eval => {
            completedContainer.innerHTML += `
                <div class="evaluation-card completed">
                    <h3>${eval.facultyName}</h3>
                    <p>Course: ${eval.courseName}</p>
                    <p>Department: ${eval.department}</p>
                    <p class="submission-date">Submitted: ${formatDate(eval.submissionDate)}</p>
                    <button class="completed-btn" disabled>Feedback Submitted</button>
                </div>
            `;
        });
    } else if (completedContainer && (!evaluationData.completed || evaluationData.completed.length === 0)) {
        completedContainer.innerHTML = '<p class="no-evaluations">No completed evaluations found.</p>';
    }
    
    // Add event listeners to feedback buttons
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', () => openFeedbackForm(btn.dataset.id));
    });
    
    // Update department filter options based on available departments
    updateDepartmentFilter(evaluationData);
}

// Helper function to format dates from ISO string
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        // Remove any time component and keep just the date
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        console.error("Date formatting error:", e);
        return dateString;
    }
}

// Update department filter with all departments from evaluations
function updateDepartmentFilter(evaluationData) {
    const departmentSet = new Set();
    
    // Collect all unique departments
    if (evaluationData.pending) {
        evaluationData.pending.forEach(eval => {
            if (eval.department) departmentSet.add(eval.department);
        });
    }
    
    if (evaluationData.completed) {
        evaluationData.completed.forEach(eval => {
            if (eval.department) departmentSet.add(eval.department);
        });
    }
    
    // Update the department filter dropdown
    const departmentFilter = document.getElementById('departmentFilter');
    
    // Keep the "All Departments" option
    departmentFilter.innerHTML = '<option value="">All Departments</option>';
    
    // Add all departments as options
    departmentSet.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });
}

// Filter faculty based on search and department
function filterFaculty() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const department = document.getElementById("departmentFilter").value;
    
    const cards = document.querySelectorAll('.evaluation-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const facultyName = card.querySelector('h3').textContent.toLowerCase();
        const courseName = card.querySelector('p:nth-child(2)').textContent.toLowerCase();
        const facultyDept = card.querySelector('p:nth-child(3)').textContent.toLowerCase();
        
        const matchesSearch = facultyName.includes(searchTerm) || courseName.includes(searchTerm);
        const matchesDepartment = department === '' || facultyDept.includes(department.toLowerCase());
        
        if (matchesSearch && matchesDepartment) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no cards are visible after filtering
    const noResults = document.querySelectorAll('.no-results');
    noResults.forEach(el => el.remove()); // Remove any existing no results messages
    
    if (visibleCount === 0) {
        const pendingContainer = document.querySelector('.evaluation-container');
        const completedContainer = document.querySelectorAll('.evaluation-container')[1];
        
        // Add "no results" message to both containers
        const noResultsMsg = document.createElement('p');
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No evaluations match your filter criteria.';
        
        pendingContainer.appendChild(noResultsMsg.cloneNode(true));
        completedContainer.appendChild(noResultsMsg);
    }
}

// Clear search and filter fields
function clearFilters() {
    document.getElementById("searchInput").value = '';
    document.getElementById("departmentFilter").value = '';
    
    // Show all cards
    document.querySelectorAll('.evaluation-card').forEach(card => {
        card.style.display = 'block';
    });
    
    // Remove any "no results" messages
    document.querySelectorAll('.no-results').forEach(el => el.remove());
}

// Function to open feedback form (to be implemented)
function openFeedbackForm(evaluationId) {
    console.log(`Opening feedback form for evaluation ID: ${evaluationId}`);
    // This would typically open a modal or redirect to a feedback form page
    alert("Feedback form functionality will be implemented in the future.");
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.querySelector('.nav-right span:nth-child(3)');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            
            // Redirect to login page
            window.location.href = "login.html";
        });
    }
}


// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function() {
    // Initialize data
    loadEvaluationData();
    
    // Dark Mode Logic
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", function() {
            if (this.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("darkMode", "enabled");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "disabled");
            }
        });
    }
    
    // Check existing dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
});

// Refresh Button Animation
document.addEventListener("click", function(e) {
    if (e.target.closest(".refresh-btn")) {
        const refreshBtn = e.target.closest(".refresh-btn");
        refreshBtn.classList.add("spinning");
        setTimeout(() => {
            refreshBtn.classList.remove("spinning");
            loadEvaluationData(); // Reload data on refresh
        }, 1000);
    }
});