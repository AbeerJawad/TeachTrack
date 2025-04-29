// Handle Search Button
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const tableRows = document.querySelectorAll("tbody tr");

searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    tableRows.forEach(row => {
        const facultyName = row.cells[1].textContent.toLowerCase();
        if (facultyName.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// Handle Delete Feedback
const deleteButtons = document.querySelectorAll(".delete-button");

deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure you want to delete this feedback?");
        if (confirmDelete) {
            const row = button.closest("tr");
            row.remove();
            alert("Feedback deleted successfully!");
        }
    });
});
