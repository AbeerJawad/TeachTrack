document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("settings-form");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const resetSettingsBtn = document.getElementById("resetSettings");
    
    // Load Dark Mode State for ALL Pages
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }
    
    // Apply Dark Mode Globally
    darkModeToggle.addEventListener("change", function () {
        if (darkModeToggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
        // Update all open pages with Dark Mode
        localStorage.setItem("darkModeChanged", "true");
    });
    
    // Listen for changes in Dark Mode across all pages
    window.addEventListener("storage", function (event) {
        if (event.key === "darkModeChanged") {
            if (localStorage.getItem("darkMode") === "enabled") {
                document.body.classList.add("dark-mode");
                darkModeToggle.checked = true;
            } else {
                document.body.classList.remove("dark-mode");
                darkModeToggle.checked = false;
            }
        }
    });
    
    // Save Other Settings (Placeholder, Modify as Needed)
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Add animation for feedback
        const button = this.querySelector('button');
        button.innerHTML = "Saving...";
        
        setTimeout(() => {
            button.innerHTML = "Saved!";
            
            setTimeout(() => {
                button.innerHTML = "Save Changes";
            }, 1500);
        }, 1000);
    });
    
    // Reset All Settings
    resetSettingsBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to reset all settings?")) {
            // Add animation for feedback
            this.innerHTML = "Resetting...";
            
            setTimeout(() => {
                localStorage.clear();
                location.reload();
            }, 800);
        }
    });
    
    // Add animations for form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Maintain the existing toggleSidebar function
function toggleSidebar() {
    // This is a placeholder for your sidebar toggle functionality
    console.log("Sidebar toggle clicked");
    // Your sidebar toggle logic here
}