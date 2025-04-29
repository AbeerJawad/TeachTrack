// Parse URL parameters to get faculty ID
function getFacultyIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
}

// Function to load faculty profile data
async function loadFacultyProfile() {
    const facultyId = getFacultyIdFromURL();
    
    if (!facultyId) {
        displayError("Faculty ID not found in URL. Please go back to the faculty directory.");
        return;
    }
    
    try {
        const response = await fetch(`/api/students/faculty/${facultyId}`);
        if (!response.ok) throw new Error('Failed to fetch faculty details');
        
        const facultyData = await response.json();
        renderFacultyProfile(facultyData);
    } catch (error) {
        console.error('Error loading faculty profile:', error);
        displayError("Failed to load faculty profile. Please try again later.");
    }
}

// Function to generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        starsHTML += i < fullStars ? '★' : 
                     (i === fullStars && hasHalfStar) ? '½' : '☆';
    }
    
    return starsHTML;
}

// Function to render the faculty profile
function renderFacultyProfile(faculty) {
    const container = document.getElementById('profileContainer');
    container.innerHTML = '';
    
    const rating = faculty.averageRating || faculty.rating || 0;
    const feedbackCount = faculty.feedbackCount || 0;
    
    // Create HTML structure for the profile
    const profileHTML = `
        <div class="profile-header">
            <img src="${faculty.image}" alt="${faculty.name}" class="profile-image" onerror="this.src='pfp.png'">
            <div class="profile-info">
                <h1>${faculty.name}</h1>
                <p class="profile-designation">${faculty.designation || 'Faculty Member'}</p>
                <p class="profile-department">${faculty.department}</p>
                <div class="profile-rating">
                    <span class="stars">${getStarRating(rating)}</span>
                    <span class="rating-value">${rating.toFixed(1)}</span>
                    <span class="feedback-count">(${feedbackCount} reviews)</span>
                </div>
            </div>
            <a href="StuFacultyView.html" class="back-btn">
                <i class="fas fa-arrow-left"></i> Back to Directory
            </a>
        </div>
        
        <div class="profile-content">
            <div class="left-column">
                <div class="profile-detail">
                    <h2>About</h2>
                    <div class="detail-item">
                        <p>${faculty.about || 'No information available.'}</p>
                    </div>
                </div>
                
                <div class="profile-detail">
                    <h2>Qualifications</h2>
                    <div class="detail-item">
                        <div class="detail-label">Education</div>
                        <div class="detail-value">${faculty.qualifications || 'Information not available'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Experience</div>
                        <div class="detail-value">${faculty.yearsOfExperience ? faculty.yearsOfExperience + ' years' : 'Information not available'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Research Interests</div>
                        <div class="detail-value">${faculty.researchInterests || 'Information not available'}</div>
                    </div>
                </div>
                
                <div class="profile-detail">
                    <h2>Teaching</h2>
                    <div class="detail-item">
                        <div class="detail-label">Courses</div>
                        <div class="detail-value">
                            ${faculty.courses && faculty.courses.length > 0 ? faculty.courses.join(', ') : 'No courses listed'}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Teaching Style</div>
                        <div class="detail-value">${faculty.teachingStyle || 'Information not available'}</div>
                    </div>
                </div>
            </div>
            
            <div class="right-column">
                <div class="contact-info">
                    <h2>Contact Information</h2>
                    ${createContactItem('envelope', 'Email', faculty.email)}
                    ${createContactItem('phone', 'Phone', faculty.phone)}
                    ${createContactItem('map-marker-alt', 'Office Location', faculty.officeLocation)}
                    ${createContactItem('clock', 'Office Hours', faculty.officeHours)}
                    
                    <a href="Feedback.html?faculty=${faculty.id}" class="feedback-button">
                        <i class="fas fa-comment"></i> Provide Feedback
                    </a>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = profileHTML;
}

// Helper function to create contact items
function createContactItem(icon, label, value) {
    return `
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="contact-text">
                <div class="contact-label">${label}</div>
                <div class="contact-value">${value || 'Not provided'}</div>
            </div>
        </div>
    `;
}

// Function to display error message
function displayError(message) {
    const container = document.getElementById('profileContainer');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
        <a href="StuFacultyView.html" class="back-btn" style="margin-top: 20px; display: inline-block;">
            <i class="fas fa-arrow-left"></i> Back to Faculty Directory
        </a>
    `;
}

// Initialize page and set up sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    loadFacultyProfile();
    
    // Sidebar toggle functionality
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainSection = document.querySelector('.main-section');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainSection.classList.toggle('shifted');
    });
});

async function loadFacultyCourses(facultyId) {
    try {
        const response = await fetch(`/api/students/faculty/${facultyId}/courses`);
        if (!response.ok) throw new Error('Failed to fetch faculty courses');
        
        const coursesData = await response.json();
        renderFacultyCourses(coursesData);
    } catch (error) {
        console.error('Error loading faculty courses:', error);
    }
}

async function loadFacultyResearch(facultyId) {
    try {
        const response = await fetch(`/api/students/faculty/${facultyId}/research`);
        if (!response.ok) throw new Error('Failed to fetch research interests');
        
        const researchData = await response.json();
        renderResearchInterests(researchData);
    } catch (error) {
        console.error('Error loading research interests:', error);
    }
}

async function loadFacultyOfficeHours(facultyId) {
    try {
        const response = await fetch(`/api/students/faculty/${facultyId}/office-hours`);
        if (!response.ok) throw new Error('Failed to fetch office hours');
        
        const officeHoursData = await response.json();
        renderOfficeHours(officeHoursData);
    } catch (error) {
        console.error('Error loading office hours:', error);
    }
}

// Then update the loadFacultyProfile function to call these new functions
async function loadFacultyProfile() {
    const facultyId = getFacultyIdFromURL();
    
    if (!facultyId) {
        displayError("Faculty ID not found in URL. Please go back to the faculty directory.");
        return;
    }
    
    try {
        const response = await fetch(`/api/students/faculty/${facultyId}`);
        if (!response.ok) throw new Error('Failed to fetch faculty details');
        
        const facultyData = await response.json();
        renderFacultyProfile(facultyData);
        
        // Load additional faculty information
        loadFacultyCourses(facultyId);
        loadFacultyResearch(facultyId);
        loadFacultyOfficeHours(facultyId);
    } catch (error) {
        console.error('Error loading faculty profile:', error);
        displayError("Failed to load faculty profile. Please try again later.");
    }
}