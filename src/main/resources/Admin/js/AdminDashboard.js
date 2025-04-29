// Dummy Data for Statistics (keeping this from original code)
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

// Side panel toggle functionality
const menuToggle = document.getElementById('menuToggle');
const sidePanel = document.getElementById('sidePanel');
const mainContent = document.querySelector('.main-content');

// Toggle side panel when menu button is clicked
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        sidePanel.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });
}

// Close side panel when clicking outside of it
document.addEventListener('click', function(event) {
    if (sidePanel && menuToggle && 
        !sidePanel.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        sidePanel.classList.contains('active')) {
        sidePanel.classList.remove('active');
        mainContent.classList.remove('shifted');
    }
});