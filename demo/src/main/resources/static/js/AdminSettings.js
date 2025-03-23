// Enable Dark Mode on Page Load
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
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

// Export Data
document.getElementById("exportData").addEventListener("click", () => {
    alert("System data exported successfully!");
});

// Import Data
document.getElementById("importData").addEventListener("click", () => {
    alert("Import functionality to be implemented.");
});
