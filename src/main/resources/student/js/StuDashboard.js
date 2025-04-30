// Toggle Sidebar function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainSection = document.getElementById('mainSection');
    
    sidebar.classList.toggle('collapsed');
    mainSection.classList.toggle('expanded');
    
    // Save sidebar state to localStorage
    localStorage.setItem("sidebarState", sidebar.classList.contains('collapsed') ? "collapsed" : "expanded");
}

// Check sidebar state and initialize page
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainSection = document.getElementById('mainSection');
    const menuToggle = document.getElementById('menuToggle');
    
    // Load sidebar state from localStorage or set default
    const sidebarState = localStorage.getItem("sidebarState");
    
    if (sidebarState === "collapsed") {
        sidebar.classList.add('collapsed');
        mainSection.classList.add('expanded');
    }
    
    // Apply dark mode if enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    // Setup menu toggle button event listener
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Initialize page data
    loadDashboardStats();
    loadCoursesData();
    loadFeedbackFormsData();
    
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCourses();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchCourses);
    }
    
    // Initialize filter functionality
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyCourseFilter);
    }
    
    // Initialize refresh buttons
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshCourses);
    }
    
    const refreshFeedbackBtn = document.getElementById('refreshFeedbackBtn');
    if (refreshFeedbackBtn) {
        refreshFeedbackBtn.addEventListener('click', refreshFeedbackForms);
    }
    
    // Initialize pagination
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', prevPage);
        nextPageBtn.addEventListener('click', nextPage);
    }
    
    // Listen for dark mode changes from other pages
    window.addEventListener("storage", function(event) {
        if (event.key === "darkModeChanged") {
            const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
            document.body.classList.toggle("dark-mode", darkModeEnabled);
        }
    });
});

// Global variables to track current state
let currentPage = 1;
let pageSize = 5;
let selectedCourseFilter = '';
let searchQuery = '';

// Get current user ID from session/localStorage
function getUserIdFromSession() {
    return localStorage.getItem('userId') || 1; // Default to 1 if not found
}

const currentUserId = getUserIdFromSession();

// Load dashboard statistics
function loadDashboardStats() {
    console.log("Loading dashboard stats for student:", currentUserId);

    // For development purposes, use mock data
    // In production, you would fetch from your API
    
    // Mock data
    const mockStats = {
        enrolledCourses: 5,
        completedFeedback: 3,
        pendingFeedback: 2
    };
    
    updateDashboardStats(mockStats);
    
    /*
    fetch(`/api/students/${currentUserId}/stats`)
        .then(response => {
            console.log("Dashboard stats response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(stats => {
            console.log("Dashboard stats data received:", stats);
            updateDashboardStats(stats);
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            showNotification('Failed to load dashboard statistics.', 'error');
        });
    */
}

// Update dashboard stats in UI
function updateDashboardStats(stats) {
    console.log("Updating UI with stats:", stats);
    
    const enrolledCoursesEl = document.getElementById('enrolledCourses');
    const completedFeedbackEl = document.getElementById('completedFeedback');
    const pendingFeedbackEl = document.getElementById('pendingFeedback');
    
    if (enrolledCoursesEl) enrolledCoursesEl.textContent = stats.enrolledCourses || 0;
    if (completedFeedbackEl) completedFeedbackEl.textContent = stats.completedFeedback || 0;
    if (pendingFeedbackEl) pendingFeedbackEl.textContent = stats.pendingFeedback || 0;
}

// Load courses data
function loadCoursesData() {
    console.log("Loading courses for student:", currentUserId);

    const tableBody = document.getElementById('coursesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading...</td></tr>';

    // For development purposes, use mock data
    // In production, you would fetch from your API
    
    // Mock course data
    const mockCourses = [
        {
            course_id: "cs101",
            course_code: "CS101",
            course_name: "Intro to Programming",
            instructor: "Dr. Jane Smith",
            semester: "Spring 2025",
            feedback_status: "Completed"
        },
        {
            course_id: "math201",
            course_code: "MATH201",
            course_name: "Calculus II",
            instructor: "Prof. Michael Chen",
            semester: "Spring 2025",
            feedback_status: "Pending"
        },
        {
            course_id: "eng105",
            course_code: "ENG105",
            course_name: "Academic Writing",
            instructor: "Dr. Sarah Johnson",
            semester: "Spring 2025",
            feedback_status: "Completed"
        },
        {
            course_id: "phys110",
            course_code: "PHYS110",
            course_name: "Physics I",
            instructor: "Prof. Robert Garcia",
            semester: "Spring 2025",
            feedback_status: "Completed"
        },
        {
            course_id: "chem101",
            course_code: "CHEM101",
            course_name: "General Chemistry",
            instructor: "Dr. Lisa Wong",
            semester: "Spring 2025",
            feedback_status: "Pending"
        }
    ];
    
    populateCoursesTable(mockCourses);
    populateCourseDropdown(mockCourses);
    
    /*
    let url = `/api/students/${currentUserId}/courses`;

    const params = new URLSearchParams();
    if (searchQuery) {
        console.log("Applying search query:", searchQuery);
        params.append('search', searchQuery);
    }
    if (selectedCourseFilter) {
        console.log("Applying course filter:", selectedCourseFilter);
        params.append('courseCode', selectedCourseFilter);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    console.log("Fetching course data from:", url);

    fetch(url)
        .then(response => {
            console.log("Courses response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(courses => {
            console.log("Courses data received:", courses);
            populateCoursesTable(courses);
            populateCourseDropdown(courses);
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Failed to load courses. Please try again.</td></tr>';
            showNotification('Failed to load courses. Please try again later.', 'error');
        });
    */
}

// Populate course dropdown
function populateCourseDropdown(courses) {
    console.log("Populating course dropdown with:", courses);

    const courseFilter = document.getElementById('courseFilter');
    if (!courseFilter) return;

    while (courseFilter.options.length > 1) {
        courseFilter.remove(1);
    }

    const uniqueCourses = new Set();

    courses.forEach(course => {
        const courseCode = course.course_code;
        if (!uniqueCourses.has(courseCode)) {
            uniqueCourses.add(courseCode);

            const option = document.createElement('option');
            option.value = courseCode;
            option.text = `${courseCode} - ${course.course_name}`;
            courseFilter.appendChild(option);
        }
    });
}

// Populate courses table with data
function populateCoursesTable(courses) {
    const tableBody = document.getElementById('coursesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    if (courses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No courses found.</td></tr>';
        return;
    }

    courses.forEach(course => {
        const statusBadge = course.feedback_status === 'Completed'
            ? '<span class="badge badge-success">Completed</span>'
            : '<span class="badge badge-danger">Pending</span>';

        const actionButton = course.feedback_status === 'Completed'
            ? `<button class="action-btn view-btn" title="View Submitted Feedback" 
                  onclick="viewSubmittedFeedback('${course.course_id}')">
                  <i class="fas fa-eye"></i> View
               </button>`
            : `<button class="action-btn respond-btn" title="Provide Feedback" 
                  onclick="provideFeedback('${course.course_id}')">
                  <i class="fas fa-comment"></i> Feedback
               </button>`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.course_code} - ${course.course_name}</td>
            <td>${course.instructor}</td>
            <td>${course.semester}</td>
            <td>${statusBadge}</td>
            <td>${actionButton}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Load feedback forms data
function loadFeedbackFormsData() {
    console.log("Loading feedback forms, page:", currentPage);

    const tableBody = document.getElementById('feedbackFormsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading...</td></tr>';

    // For development purposes, use mock data
    // In production, you would fetch from your API
    
    // Mock feedback forms data
    const mockForms = {
        content: [
            {
                form_id: "form1",
                course_code: "MATH201",
                course_name: "Calculus II",
                form_title: "Mid-semester Feedback",
                deadline: "2025-05-15",
                status: "Open"
            },
            {
                form_id: "form2",
                course_code: "CHEM101",
                course_name: "General Chemistry",
                form_title: "End of Term Evaluation",
                deadline: "2025-05-20",
                status: "Open"
            },
            {
                form_id: "form3",
                course_code: "CS101",
                course_name: "Intro to Programming",
                form_title: "Teaching Effectiveness Survey",
                deadline: "2025-04-30",
                status: "Submitted"
            }
        ],
        currentPage: 0,
        totalPages: 1
    };
    
    populateFeedbackFormsTable(mockForms.content);
    updatePagination(mockForms.currentPage + 1, mockForms.totalPages);
    
    /*
    fetch(`/api/students/${currentUserId}/feedback-forms?page=${currentPage-1}&size=${pageSize}`)
        .then(response => {
            console.log("Feedback forms response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Feedback forms data received:", data);
            populateFeedbackFormsTable(data.content);
            updatePagination(data.currentPage + 1, data.totalPages);
        })
        .catch(error => {
            console.error('Error loading feedback forms:', error);
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Failed to load feedback forms. Please try again.</td></tr>';
            showNotification('Failed to load feedback forms.', 'error');
        });
    */
}

// Populate feedback forms table with data
function populateFeedbackFormsTable(forms) {
    const tableBody = document.getElementById('feedbackFormsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (forms.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No feedback forms available.</td></tr>';
        return;
    }
    
    forms.forEach(form => {
        const statusBadge = form.status === 'Submitted'
            ? '<span class="badge badge-info">Submitted</span>'
            : '<span class="badge badge-warning">Open</span>';
        
        const actionButton = form.status === 'Submitted'
            ? `<button class="action-btn view-btn" title="View Submission" 
                  onclick="viewFeedbackSubmission('${form.form_id}')">
                  <i class="fas fa-eye"></i> View
               </button>`
            : `<button class="action-btn respond-btn" title="Fill Form" 
                  onclick="fillFeedbackForm('${form.form_id}')">
                  <i class="fas fa-edit"></i> Fill Form
               </button>`;
        
        const deadlineDate = new Date(form.deadline);
        const formattedDeadline = deadlineDate.toLocaleDateString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${form.course_code} - ${form.course_name}</td>
            <td>${form.form_title}</td>
            <td>${formattedDeadline}</td>
            <td>${statusBadge}</td>
            <td>${actionButton}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update pagination UI
function updatePagination(currentPageNum, totalPages) {
    const currentPageEl = document.getElementById('currentPage');
    if (!currentPageEl) return;
    
    currentPageEl.textContent = currentPageNum;
    
    // Update button states
    const prevButton = document.getElementById('prevPageBtn');
    const nextButton = document.getElementById('nextPageBtn');
    
    if (prevButton && nextButton) {
        if (currentPageNum <= 1) {
            prevButton.classList.add('disabled');
            prevButton.disabled = true;
        } else {
            prevButton.classList.remove('disabled');
            prevButton.disabled = false;
        }
        
        if (currentPageNum >= totalPages) {
            nextButton.classList.add('disabled');
            nextButton.disabled = true;
        } else {
            nextButton.classList.remove('disabled');
            nextButton.disabled = false;
        }
    }
}

// Apply course filter
function applyCourseFilter() {
    const courseFilterEl = document.getElementById('courseFilter');
    if (courseFilterEl) {
        selectedCourseFilter = courseFilterEl.value;
        loadCoursesData();
    }
}

// Search courses
function searchCourses() {
    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) {
        searchQuery = searchInputEl.value.trim();
        loadCoursesData();
    }
}

// Refresh courses data
function refreshCourses() {
    loadCoursesData();
    showNotification('Courses data refreshed.', 'success');
}

// Refresh feedback forms data
function refreshFeedbackForms() {
    loadFeedbackFormsData();
    showNotification('Feedback forms refreshed.', 'success');
}

// Navigate to previous page of feedback forms
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadFeedbackFormsData();
    }
}

// Navigate to next page of feedback forms
function nextPage() {
    currentPage++;
    loadFeedbackFormsData();
}

// View submitted feedback for a course
function viewSubmittedFeedback(courseId) {
    window.location.href = `ViewSubmitted.html?courseId=${courseId}`;
}

// Provide feedback for a course
function provideFeedback(courseId) {
    window.location.href = `stuFeedback.html?courseId=${courseId}`;
}

// View specific feedback submission
function viewFeedbackSubmission(formId) {
    window.location.href = `ViewSubmitted.html?id=${formId}`;
}

// Fill a feedback form
function fillFeedbackForm(formId) {
    const userId = getUserIdFromSession();
    sessionStorage.setItem('currentFormId', formId);
    window.location.href = `stuFeedback.html?userId=${userId}&formId=${formId}`;
}

// Show notification message
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation classes
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300); // Match the CSS transition time
    }, 3000);
}

// Logout functionality
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = 'StuLogin.html';
}

// Attach logout handler
document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.querySelector('a[href="StuLogin.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});