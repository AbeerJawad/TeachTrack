// Dummy Data for Statistics
const stats = {
    students: 500,
    faculty: 200,
    courses: 50,
    feedback: 10,
};

// Populate Stats Tiles
document.getElementById("studentsCount").textContent = stats.students;
document.getElementById("facultyCount").textContent = stats.faculty;
document.getElementById("coursesCount").textContent = stats.courses;
document.getElementById("feedbackCount").textContent = stats.feedback;

// Navigation to Other Pages
function navigateTo(page) {
    alert(`Navigating to ${page} page...`); // Placeholder
    // Replace this with actual navigation logic, e.g.,
    // window.location.href = `managestudents.html`;
}
