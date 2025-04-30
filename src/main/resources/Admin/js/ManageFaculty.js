// Global Variables
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const tableRows = document.querySelectorAll("tbody tr");
const addFacultyButton = document.getElementById("addFacultyButton");
const facultyCounter = document.getElementById("facultyCounter");

// Initialize faculty count
function updateFacultyCount() {
    const visibleRows = document.querySelectorAll("tbody tr:not([style*='display: none'])").length;
    facultyCounter.textContent = `Total faculty members: ${visibleRows}`;
}

// Handle Search Function
function searchFaculty() {
    const searchValue = searchInput.value.toLowerCase().trim();
    
    // Filter table rows
    tableRows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const department = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        
        if (name.includes(searchValue) || department.includes(searchValue) || email.includes(searchValue)) {
            row.style.display = ""; // Show row
        } else {
            row.style.display = "none"; // Hide row
        }
    });
    
    // Update the displayed count
    updateFacultyCount();
}

// Event Listeners
// Search button click
searchButton.addEventListener("click", searchFaculty);

// Search on Enter key
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchFaculty();
    }
});

// Handle Add Faculty Button
addFacultyButton.addEventListener("click", () => {
    // This can be replaced with actual form display or navigation
    alert("Add Faculty button clicked! Implement the form here.");
});

// Handle Edit Button Click - using event delegation for better performance
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
        const row = e.target.closest("tr");
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        
        // This can be replaced with actual edit form display
        alert(`Edit faculty member: ${name} (ID: ${id})`);
    }
});

// Handle Assign Courses Button Click - using event delegation
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("assign-button")) {
        const row = e.target.closest("tr");
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        
        // This can be replaced with actual course assignment UI
        alert(`Assign courses to faculty member: ${name} (ID: ${id})`);
    }
});

// Handle Delete Button Click - using event delegation
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        const row = e.target.closest("tr");
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        
        if(confirm(`Are you sure you want to delete faculty member: ${name} (ID: ${id})?`)) {
            // For demonstration purposes only - in a real app this would connect to backend
            row.remove();
            updateFacultyCount();
            alert(`Faculty member deleted: ${name} (ID: ${id})`);
        }
    }
});

// Add subtle animations for table rows
tableRows.forEach(row => {
    row.addEventListener("mouseenter", () => {
        row.style.transition = "background-color 0.3s ease";
    });
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    updateFacultyCount();
});