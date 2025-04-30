document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("settings-form");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const resetSettingsBtn = document.getElementById("resetSettings");
    const sidebar = document.getElementById("sidebar");
    const pageContent = document.getElementById("pageContent");
    const sidebarToggle = document.getElementById("sidebarToggle");
    
    // Load sidebar state
    if (localStorage.getItem("sidebarCollapsed") === "true") {
        sidebar.classList.add("collapsed");
        pageContent.classList.add("expanded");
    }
    
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

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const pageContent = document.getElementById("pageContent");
    
    sidebar.classList.toggle("collapsed");
    pageContent.classList.toggle("expanded");
    
    // Save sidebar state
    if (sidebar.classList.contains("collapsed")) {
        localStorage.setItem("sidebarCollapsed", "true");
    } else {
        localStorage.setItem("sidebarCollapsed", "false");
    }
}