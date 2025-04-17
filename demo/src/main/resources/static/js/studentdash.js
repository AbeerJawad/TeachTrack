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
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterEvaluations);
    }
    
    const departmentFilter = document.getElementById("departmentFilter");
    if (departmentFilter) {
        departmentFilter.addEventListener("change", filterEvaluations);
    }
    
    // Setup refresh buttons
    document.querySelectorAll('.refresh-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add("spinning");
            setTimeout(() => {
                this.classList.remove("spinning");
                loadStudentDashboard(userEmail);
            }, 1000);
        });
    });
    
    // Setup logout functionality
    const logoutLink = document.querySelector('a[href="login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            window.location.href = "login.html";
        });
    }
});

// Load student dashboard data
async function loadStudentDashboard(email) {
    try {
        // Show loading state
        const contentArea = document.querySelector('.content-area');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        loadingDiv.textContent = 'Loading dashboard data...';
        contentArea.appendChild(loadingDiv);
        
        // Fetch student data from backend
        const response = await fetch(`http://localhost:8080/dashboard/student/${email}`);
        
        if (!response.ok) {
            throw new Error('Failed to load student data');
        }
        
        const data = await response.json();
        console.log("Student Data:", data);
        
        // Remove loading indicator
        document.getElementById("loading")?.remove();
        
        // Update welcome banner with student name
        document.querySelector('.welcome-banner h1').textContent = `Welcome, ${data.fullName || 'Student'}!`;
        
        // Update stats boxes
        updateStatBoxes(data.stats);
        
        // Load evaluations
        loadEvaluations(email);
        
    } catch (error) {
        console.error("Error loading dashboard:", error);
        document.getElementById("loading")?.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to load dashboard data. Please refresh the page or try again later.';
        
        document.querySelector('.content-area').appendChild(errorDiv);
    }
}

// Update statistics boxes
function updateStatBoxes(stats) {
    if (!stats) return;
    
    // Update pending evaluations count
    const pendingEvals = document.getElementById('pendingEvaluations');
    if (pendingEvals && stats.pendingEvaluations !== undefined) {
        pendingEvals.textContent = stats.pendingEvaluations;
    }
    
    // Update completed evaluations count
    const completedEvals = document.getElementById('completedEvaluations');
    if (completedEvals && stats.completedEvaluations !== undefined) {
        completedEvals.textContent = stats.completedEvaluations;
    }
    
    // Update next due date
    const upcomingDeadline = document.getElementById('upcomingDeadline');
    if (upcomingDeadline && stats.nextDueDate) {
        upcomingDeadline.textContent = stats.nextDueDate;
    }
}

// Load evaluations data
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
        updatePendingEvaluationsTable(evaluations.pending);
        updateCompletedEvaluationsTable(evaluations.completed);
        
        // Update department filter options
        updateDepartmentFilterOptions(evaluations);
        
    } catch (error) {
        console.error("Error loading evaluations:", error);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to load evaluations. Please refresh the page.';
        
        document.querySelector('.content-area').appendChild(errorDiv);
    }
}

// Update pending evaluations table
function updatePendingEvaluationsTable(pendingEvaluations) {
    const tableBody = document.getElementById('pendingEvaluationTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (pendingEvaluations && pendingEvaluations.length > 0) {
        pendingEvaluations.forEach(eval => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${eval.courseCode} - ${eval.courseName}</td>
                <td>${eval.facultyName}</td>
                <td>${formatDate(eval.dueDate)}</td>
                <td>
                    <button class="action-btn evaluate-btn" data-id="${eval.id}" 
                    data-faculty="${eval.facultyId}" data-course="${eval.courseName}">
                        <i class="fas fa-edit"></i> Evaluate
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to evaluation buttons
        document.querySelectorAll('.evaluate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const evalId = this.getAttribute('data-id');
                const facultyId = this.getAttribute('data-faculty');
                const courseName = this.getAttribute('data-course');
                openEvaluationForm(evalId, facultyId, courseName);
            });
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="no-data">No pending evaluations found.</td>`;
        tableBody.appendChild(row);
    }
}

// Update completed evaluations table
function updateCompletedEvaluationsTable(completedEvaluations) {
    const tableBody = document.getElementById('completedEvaluationTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (completedEvaluations && completedEvaluations.length > 0) {
        completedEvaluations.forEach(eval => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${eval.courseCode} - ${eval.courseName}</td>
                <td>${eval.facultyName}</td>
                <td>${formatDate(eval.submissionDate)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${eval.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const evalId = this.getAttribute('data-id');
                viewEvaluationDetails(evalId);
            });
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="no-data">No completed evaluations found.</td>`;
        tableBody.appendChild(row);
    }
}

// Update department filter options
function updateDepartmentFilterOptions(evaluations) {
    const departmentFilter = document.getElementById('departmentFilter');
    if (!departmentFilter) return;
    
    const departments = new Set();
    
    // Extract unique departments from evaluations
    if (evaluations.pending) {
        evaluations.pending.forEach(eval => {
            if (eval.department) departments.add(eval.department);
        });
    }
    
    if (evaluations.completed) {
        evaluations.completed.forEach(eval => {
            if (eval.department) departments.add(eval.department);
        });
    }
    
    // Keep the "All Departments" option
    departmentFilter.innerHTML = '<option value="">All Departments</option>';
    
    // Add department options
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
}

// Filter evaluations based on search and department
function filterEvaluations() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const department = document.getElementById("departmentFilter").value;
    
    // Filter function for table rows
    function filterTable(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return 0;
        
        const rows = table.querySelectorAll('tr:not(:first-child)');
        let visibleCount = 0;
        
        rows.forEach(row => {
            if (row.querySelector('.no-data')) return;
            
            const courseFaculty = row.querySelector('td:nth-child(1)').textContent.toLowerCase() + ' ' +
                                 row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            
            // We need to get department from the data attribute or from a specific column
            const rowDept = row.getAttribute('data-department') || '';
            
            const matchesSearch = courseFaculty.includes(searchTerm);
            const matchesDepartment = department === '' || rowDept.includes(department.toLowerCase());
            
            if (matchesSearch && matchesDepartment) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        return visibleCount;
    }
    
    // Apply filters to both tables
    const pendingVisible = filterTable('pendingEvaluationTable');
    const completedVisible = filterTable('completedEvaluationTable');
    
    // Show "no results" message if needed
    handleNoResults(pendingVisible, 'pendingEvaluationTable');
    handleNoResults(completedVisible, 'completedEvaluationTable');
}

// Handle "no results" message
function handleNoResults(visibleCount, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Remove any existing no results row
    const existingNoResults = table.querySelector('.no-results-row');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    // Add no results message if needed
    if (visibleCount === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-results-row';
        noResultsRow.innerHTML = `<td colspan="4" class="no-data">No evaluations match your search criteria.</td>`;
        table.appendChild(noResultsRow);
    }
}

// Open evaluation form
function openEvaluationForm(courseId, facultyId, courseName) {
    const studentId = localStorage.getItem('studentId');
    
    // Here you would typically open a modal with a form
    alert(`Opening evaluation form for ${courseName}`);
    
    // Example implementation:
    // const modal = document.createElement('div');
    // modal.className = 'modal';
    // modal.innerHTML = `
    //     <div class="modal-content">
    //         <span class="close">&times;</span>
    //         <h2>Evaluate: ${courseName}</h2>
    //         <form id="evaluationForm">
    //             <div class="rating-container">
    //                 <p>Rate this course:</p>
    //                 <div class="star-rating">
    //                     <input type="radio" name="rating" value="5" id="star5"><label for="star5"></label>
    //                     <input type="radio" name="rating" value="4" id="star4"><label for="star4"></label>
    //                     <input type="radio" name="rating" value="3" id="star3"><label for="star3"></label>
    //                     <input type="radio" name="rating" value="2" id="star2"><label for="star2"></label>
    //                     <input type="radio" name="rating" value="1" id="star1"><label for="star1"></label>
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="comments">Comments:</label>
    //                 <textarea id="comments" placeholder="Share your thoughts about this course..."></textarea>
    //             </div>
    //             <button type="submit" class="submit-btn">Submit Feedback</button>
    //         </form>
    //     </div>
    // `;
    // document.body.appendChild(modal);
}

// View evaluation details
function viewEvaluationDetails(evaluationId) {
    // Here you would typically open a modal showing details
    alert(`Viewing details for evaluation ID: ${evaluationId}`);
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
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