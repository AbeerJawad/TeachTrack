// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initCourseEvaluationsChart();
    initDepartmentDistributionChart();
    initEnrollmentChart();
    
    // Set up event handlers
    setupEventHandlers();
});

// Initialize Course Evaluations Chart
function initCourseEvaluationsChart() {
    const ctx = document.getElementById("courseEvaluationsChart").getContext("2d");
    
    // Course evaluation data (easily retrievable from MySQL)
    const courseData = {
        labels: ["CS101", "CS102", "CS103", "MA201", "EE101"],
        datasets: [{
            label: "Number of Evaluations",
            data: [80, 70, 65, 50, 40],
            backgroundColor: [
                "#1a5236", // Dark green for consistency
                "#2d7a4f",
                "#409466",
                "#56b07e",
                "#6fcb97"
            ],
            borderWidth: 1
        }]
    };
    
    // Configure and render the chart
    new Chart(ctx, {
        type: "bar",
        data: courseData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Evaluations'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Course Code'
                    }
                }
            }
        }
    });
}

// Initialize Department Distribution Chart
function initDepartmentDistributionChart() {
    const ctx = document.getElementById("departmentDistributionChart").getContext("2d");
    
    // Department distribution data (easily retrievable from MySQL)
    const departmentData = {
        labels: ["Computer Science", "Mathematics", "Engineering", "Business", "Other"],
        datasets: [{
            data: [25, 15, 20, 18, 12],
            backgroundColor: [
                "#1a5236",
                "#2d7a4f", 
                "#409466", 
                "#56b07e", 
                "#6fcb97"
            ],
            borderWidth: 1
        }]
    };
    
    // Configure and render the chart
    new Chart(ctx, {
        type: "pie",
        data: departmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Initialize Enrollment Chart
function initEnrollmentChart() {
    const ctx = document.getElementById("enrollmentChart").getContext("2d");
    
    // Monthly enrollment data (easily retrievable from MySQL)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    const enrollmentData = {
        labels: months,
        datasets: [{
            label: "Student Enrollment",
            data: [450, 470, 480, 500, 510, 520],
            borderColor: "#1a5236",
            backgroundColor: "rgba(26, 82, 54, 0.1)",
            tension: 0.3,
            fill: true
        }]
    };
    
    // Configure and render the chart
    new Chart(ctx, {
        type: "line",
        data: enrollmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

// Set up event handlers
function setupEventHandlers() {
    // Time period buttons
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would fetch new data based on time period
            console.log(`Selected time period: ${this.textContent}`);
        });
    });
    
    // Chart download buttons
    const downloadButtons = document.querySelectorAll('.chart-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would generate and download chart data
            alert('Chart data would be downloaded here');
        });
    });
    
    // View all button
    const viewAllButton = document.querySelector('.view-all-btn');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            // In a real app, this would show all courses data
            alert('All courses data would be displayed here');
        });
    }
    
    // Export buttons
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get export format from button class
            const format = this.classList.contains('pdf') ? 'PDF' : 
                          this.classList.contains('excel') ? 'Excel' : 'CSV';
            
            // In a real app, this would generate and download the report
            alert(`Report would be exported as ${format}`);
        });
    });
}