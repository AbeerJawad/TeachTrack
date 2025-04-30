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

// Search Feedback Function
function searchFeedback() {
    const searchText = document.getElementById("searchFeedback").value.toLowerCase();
    const tableRows = document.querySelectorAll("#feedbackTable tr");
    
    tableRows.forEach(row => {
        const courseCell = row.cells[0].textContent.toLowerCase();
        const commentsCell = row.cells[2].textContent.toLowerCase();
        
        if (courseCell.includes(searchText) || commentsCell.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Load Dummy Feedback Data
function loadFeedbackData() {
    // Show loading indicators
    document.getElementById("totalFeedback").innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.getElementById("positiveFeedback").innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.getElementById("negativeFeedback").innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate API call delay
    setTimeout(() => {
        let dummyData = {
            totalFeedback: 10,
            positiveFeedback: 70,
            negativeFeedback: 30,
            feedbackList: [
                { course: "CS101", rating: "⭐⭐⭐⭐", comments: "Great teaching style!" },
                { course: "CS102", rating: "⭐⭐⭐", comments: "Needs more examples." },
                { course: "CS201", rating: "⭐⭐⭐⭐⭐", comments: "Very helpful!" },
                { course: "CS203", rating: "⭐⭐", comments: "Difficult to follow lectures." },
                { course: "CS301", rating: "⭐⭐⭐⭐", comments: "Clear explanations, good examples." }
            ]
        };
        
        // Fill in dummy data
        document.getElementById("totalFeedback").innerText = dummyData.totalFeedback;
        document.getElementById("positiveFeedback").innerText = `${dummyData.positiveFeedback}%`;
        document.getElementById("negativeFeedback").innerText = `${dummyData.negativeFeedback}%`;
        
        let feedbackTable = document.getElementById("feedbackTable");
        feedbackTable.innerHTML = "";
        
        dummyData.feedbackList.forEach(feedback => {
            let row = `<tr>
                <td>${feedback.course}</td>
                <td>${feedback.rating}</td>
                <td>${feedback.comments}</td>
                <td>
                    <button class="view-btn" onclick="window.location.href='view-feedback.html?course=${feedback.course}&rating=${feedback.rating}&comments=${encodeURIComponent(feedback.comments)}'">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="respond-btn" onclick="window.location.href='respond-feedback.html?course=${feedback.course}&rating=${feedback.rating}&comments=${encodeURIComponent(feedback.comments)}'">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                </td>
            </tr>`;
            feedbackTable.innerHTML += row;
        });
    }, 800); // Simulate a slight delay for loading effect
}

// Filter by Course
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("courseFilter")) {
        document.getElementById("courseFilter").addEventListener("change", function() {
            const filterValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll("#feedbackTable tr");
            
            if (filterValue === "") {
                tableRows.forEach(row => {
                    row.style.display = "";
                });
                return;
            }
            
            tableRows.forEach(row => {
                const courseCell = row.cells[0].textContent.toLowerCase();
                
                if (courseCell === filterValue) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
    
    // Initialize the dashboard
    loadFeedbackData();
    
    // Add dark mode toggle event listener if it exists on the page
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
});

// Refresh animation
document.addEventListener("click", function(e) {
    if (e.target.closest(".refresh-btn")) {
        const refreshBtn = e.target.closest(".refresh-btn");
        refreshBtn.classList.add("spinning");
        setTimeout(() => {
            refreshBtn.classList.remove("spinning");
        }, 1000);
    }
});