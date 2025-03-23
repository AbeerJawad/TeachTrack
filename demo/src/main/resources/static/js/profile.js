document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profile-form");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const successMessage = document.getElementById("successMessage");
    
    // Get all form input elements
    const formInputs = profileForm.querySelectorAll("input, select, textarea");
    
    // Tab functionality
    const tabs = document.querySelectorAll(".tab");
    const tabPanes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Get the tab target
            const targetTab = this.getAttribute("data-tab");
            
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });
    
    // Edit profile functionality
    editProfileBtn.addEventListener("click", function () {
        // Enable all form inputs
        formInputs.forEach(input => {
            input.removeAttribute("disabled");
        });
        
        // Show save and cancel buttons, hide edit button
        editProfileBtn.style.display = "none";
        saveChangesBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
    });
    
    // Cancel edit functionality
    cancelBtn.addEventListener("click", function () {
        // Disable all form inputs
        formInputs.forEach(input => {
            input.setAttribute("disabled", "true");
        });
        
        // Reset form to original values
        profileForm.reset();
        
        // Hide save and cancel buttons, show edit button
        editProfileBtn.style.display = "inline-block";
        saveChangesBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });
    
    // Save changes functionality
    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Validate form (add your validation logic here)
        
        // Update profile information
        // In a real app, you would send this data to a server
        
        // Disable all form inputs
        formInputs.forEach(input => {
            input.setAttribute("disabled", "true");
        });
        
        // Show success message
        successMessage.style.display = "block";
        
        // Hide after 3 seconds
        setTimeout(function() {
            successMessage.style.display = "none";
        }, 3000);
        
        // Hide save and cancel buttons, show edit button
        editProfileBtn.style.display = "inline-block";
        saveChangesBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });
    
    // Toggle dark mode functionality
    // This could be added if you have a dark mode toggle button
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    }
    
    // Profile picture upload
    const editPic = document.querySelector(".edit-pic");
    if (editPic) {
        editPic.addEventListener("click", function() {
            // In a real app, you would trigger a file input here
            alert("This would open a file upload dialog in a real application.");
        });
    }
    
    // Add CSS to style the tab panes
    const style = document.createElement('style');
    style.textContent = `
        .tab-pane {
            display: none;
        }
        .tab-pane.active {
            display: block;
        }
    `;
    document.head.appendChild(style);
});