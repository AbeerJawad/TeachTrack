// Handle Search Button Click
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const tableRows = document.querySelectorAll("tbody tr");

searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value.toLowerCase().trim();

    // Filter table rows
    tableRows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const course = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchValue) || course.includes(searchValue)) {
            row.style.display = ""; // Show row
        } else {
            row.style.display = "none"; // Hide row
        }
    });
});

// Handle Add Student Button
const addStudentButton = document.getElementById("addStudentButton");
addStudentButton.addEventListener("click", () => {
    alert("Add Student button clicked! Implement the form here.");
});

// Handle Edit Button Click
const editButtons = document.querySelectorAll(".action-button:not(.delete-button)");
editButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Edit button clicked! Implement edit functionality here.");
    });
});

// Handle Delete Button Click
const deleteButtons = document.querySelectorAll(".delete-button");
deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Delete button clicked! Implement delete functionality here.");
    });
});
