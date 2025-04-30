// Handle Add Course Button
document.getElementById("addCourseButton").addEventListener("click", () => {
    alert("Add Course button clicked! Form will open here.");
});

// Handle Assign Faculty Buttons
document.querySelectorAll(".assign-button").forEach(button => {
    button.addEventListener("click", function() {
        const row = this.closest("tr");
        const courseCode = row.cells[0].textContent;
        const faculty = row.querySelector(".faculty-select").value;
        alert(`Faculty ${faculty} has been assigned to ${courseCode}`);
    });
});

// Handle Delete Course Buttons
document.querySelectorAll(".delete-button").forEach(button => {
    button.addEventListener("click", function() {
        const row = this.closest("tr");
        const courseCode = row.cells[0].textContent;
        if (confirm(`Are you sure you want to delete course ${courseCode}?`)) {
            alert(`Course ${courseCode} has been deleted`);
            // In a real implementation, you would remove the row or make an API call
        }
    });
});