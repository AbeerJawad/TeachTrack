document.addEventListener("DOMContentLoaded", function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Unknown Instructor';
    const department = urlParams.get('department') || 'Unknown Department';
    const email = urlParams.get('email') || 'Not Provided';

    // Display data
    document.getElementById('instructorName').textContent = name;
    document.getElementById('department').textContent = department;
    document.getElementById('email').textContent = email;

    // Placeholder Courses
    const courses = [
        { name: "Introduction to Programming", code: "CS101", description: "Basic programming concepts." },
        { name: "Data Structures", code: "CS201", description: "Understanding algorithms and data organization." },
        { name: "Operating Systems", code: "CS301", description: "Processes, memory management, and scheduling." }
    ];

    // Display Courses
    const coursesContainer = document.getElementById("coursesContainer");
    coursesContainer.innerHTML = ""; // Clear loading text

    courses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.className = "course-box";
        courseElement.innerHTML = `
            <p><strong>Course Name:</strong> ${course.name}</p>
            <p><strong>Course Code:</strong> ${course.code}</p>
            <p><strong>Description:</strong> ${course.description}</p>
        `;
        coursesContainer.appendChild(courseElement);
    });
});

// Proceed to Evaluation Function
function proceedToEvaluation() {
    alert("Proceeding to Evaluation...");
    //replace this with actual navigation
}

function goBack() {
    window.location.href = "facultylist.html"; // Redirects to faculty list
}
