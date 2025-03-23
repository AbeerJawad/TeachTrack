// Handle Search Button Click
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const tableRows = document.querySelectorAll("tbody tr");

searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value.toLowerCase().trim();

    // Filter table rows
    tableRows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const department = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchValue) || department.includes(searchValue)) {
            row.style.display = ""; // Show row
        } else {
            row.style.display = "none"; // Hide row
        }
    });
});

// Handle Add Faculty Button
const addFacultyButton = document.getElementById("addFacultyButton");
addFacultyButton.addEventListener("click", () => {
    alert("Add Faculty button clicked! Implement the form here.");
});

// Handle Edit Button Click
const editButtons = document.querySelectorAll(".action-button:not(.delete-button):not(.assign-button)");
editButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Edit button clicked! Implement edit functionality here.");
    });
});

// Handle Assign Courses Button Click
const assignButtons = document.querySelectorAll(".assign-button");
assignButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Assign Courses button clicked! Implement assign functionality here.");
    });
});

// Handle Delete Button Click
const deleteButtons = document.querySelectorAll(".delete-button");
deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Delete button clicked! Implement delete functionality here.");
    });
});
