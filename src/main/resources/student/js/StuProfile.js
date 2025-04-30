// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-280px";
        document.querySelector('.main-section').style.marginLeft = "0";
    } else {
        sidebar.style.left = "0px";
        document.querySelector('.main-section').style.marginLeft = "280px";
    }
}

// Tab switching
function setupProfileTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            const selectedTab = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(selectedTab).classList.add('active');
        });
    });
}

// Load profile data
function loadProfileData() {
    const userId = getUserIdFromSession();
    console.log("Loading profile data for user:", userId);

    fetch(`/api/students/${userId}/profile`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(profile => {
            console.log("Profile data received:", profile);
            updateProfileUI(profile);
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            showNotification('Failed to load profile data.', 'error');
        });
}

// Update profile UI
function updateProfileUI(profile) {
    document.getElementById('studentName').textContent = profile.fullName || 'N/A';
    document.getElementById('studentId').textContent = `Registration: ${profile.registrationNumber || 'N/A'}`;
    document.getElementById('department').textContent = profile.department || 'N/A';
    document.getElementById('completedCourses').textContent = profile.completedCourses || 0;
    document.getElementById('feedbackGiven').textContent = profile.feedbackGiven || 0;
    document.getElementById('currentSemester').textContent = profile.currentSemester || 0;

    document.getElementById('fullName').textContent = profile.fullName || 'N/A';
    document.getElementById('dob').textContent = profile.dob || 'N/A';
    document.getElementById('gender').textContent = profile.gender || 'N/A';
    document.getElementById('email').textContent = profile.email || 'N/A';
    document.getElementById('contact').textContent = profile.contactNumber || 'N/A';

    document.getElementById('regNumber').textContent = profile.registrationNumber || 'N/A';
    document.getElementById('academicDept').textContent = profile.department || 'N/A';
    document.getElementById('batchYear').textContent = profile.batchYear || 'N/A';
    document.getElementById('currentSem').textContent = profile.currentSemester || 'N/A';
    document.getElementById('cgpa').textContent = profile.cgpa || 'N/A';

    if (profile.profileImageUrl) {
        document.getElementById('profileImage').src = profile.profileImageUrl;
    }
}

// Edit profile modal handling
function setupEditProfileModal() {
    const editBtn = document.getElementById('editPersonalBtn');
    const modal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (editBtn && modal) {
        editBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Save profile changes
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfileChanges);
    }
}

// Save profile changes
function saveProfileChanges() {
    const userId = getUserIdFromSession();
    const updatedProfile = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        dob: document.getElementById('editDob').value,
        gender: document.getElementById('editGender').value,
        contactNumber: document.getElementById('editContact').value
    };

    console.log("Saving profile changes:", updatedProfile);

    fetch(`/api/students/${userId}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save profile');
            }
            return response.json();
        })
        .then(data => {
            console.log("Profile updated successfully:", data);
            document.getElementById('editProfileModal').style.display = 'none';
            loadProfileData();
            showNotification('Profile updated successfully!', 'success');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile.', 'error');
        });
}

// Get current user ID
function getUserIdFromSession() {
    return localStorage.getItem('userId') || 1;
}

// Notification utility
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Logout handling
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = '../Startpage.html';
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    setupProfileTabs();
    setupEditProfileModal();
    loadProfileData();

    const logoutLink = document.querySelector('a[href="../Startpage.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
