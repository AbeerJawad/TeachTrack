// Handle Add Course Button
const addCourseButton = document.getElementById("addCourseButton");
addCourseButton.addEventListener("click", () => {
    alert("Add Course button clicked! Implement the form here.");
});

// Handle Assign Faculty Button
const assignButtons = document.querySelectorAll(".assign-button");
assignButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Assign Faculty button clicked! Faculty assigned successfully!");
    });
});

// Handle Delete Course Button
const deleteButtons = document.querySelectorAll(".delete-button");
deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Delete Course button clicked! Implement delete functionality here.");
    });
});
