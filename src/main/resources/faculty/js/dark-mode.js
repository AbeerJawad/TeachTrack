// This minimal script just applies dark mode if enabled
document.addEventListener("DOMContentLoaded", function() {
    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    // Listen for changes in dark mode across tabs/pages
    window.addEventListener("storage", function(event) {
        if (event.key === "darkModeChanged") {
            if (localStorage.getItem("darkMode") === "enabled") {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        }
    });
});