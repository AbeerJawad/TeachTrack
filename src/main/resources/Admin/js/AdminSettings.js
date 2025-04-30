// Enable Dark Mode on Page Load
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggle").checked = true;
    }
});

// Toggle Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
    }
});

// Manage Roles Button
document.getElementById("manageRoles").addEventListener("click", () => {
    alert("Navigating to Roles & Permissions Management!");
});

// Save Deadline Button
document.querySelector(".save-button").addEventListener("click", (e) => {
    e.preventDefault();
    const deadline = document.getElementById("deadline").value;
    if (!deadline) {
        alert("Please select a deadline date!");
    } else {
        alert(`Feedback deadline has been set to ${deadline}`);
    }
});

// Export Data
document.getElementById("exportData").addEventListener("click", () => {
    alert("System data exported successfully!");
});

// Import Data
document.getElementById("importData").addEventListener("click", () => {
    alert("Import functionality to be implemented.");
});

// Reset Settings Button
document.getElementById("resetSettings").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to reset all settings to default values?")) {
        // Reset dark mode
        document.body.classList.remove("dark-mode");
        document.getElementById("darkModeToggle").checked = false;
        localStorage.setItem("darkMode", "disabled");
        
        // Reset all checkboxes
        document.getElementById("enableFeedbackForms").checked = false;
        document.getElementById("enableCourseEvaluations").checked = false;
        document.getElementById("enableMFA").checked = false;
        
        // Reset language
        document.getElementById("language").value = "en";
        
        alert("All settings have been reset to default values.");
    }
});

// Toggle sidebar function (placeholder)
function toggleSidebar() {
    alert("Sidebar toggle functionality would be implemented here");
}