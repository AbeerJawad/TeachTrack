// Initialize faculty data array
let facultyData = [];

// Function to load faculty data from the server
async function loadFacultyData() {
    try {
        const response = await fetch('/api/students/faculty');
        if (!response.ok) {
            throw new Error('Failed to fetch faculty data');
        }
        facultyData = await response.json();
        renderFacultyCards(facultyData);
        
        // Load statistics
        loadStatistics();
    } catch (error) {
        console.error('Error loading faculty data:', error);
        displayErrorMessage('Failed to load faculty data. Please try again later.');
    }
}

// Function to load faculty statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/students/faculty/stats');
        if (!response.ok) {
            throw new Error('Failed to fetch faculty statistics');
        }
        const stats = await response.json();
        
        // Update statistics display
        document.querySelector('.stat-card:nth-child(1) p').textContent = stats.totalFaculty;
        document.querySelector('.stat-card:nth-child(2) p').textContent = stats.departments;
    } catch (error) {
        console.error('Error loading faculty statistics:', error);
    }
}

// Function to generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '★';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '½';
        } else {
            starsHTML += '☆';
        }
    }
    
    return starsHTML;
}

// Function to render faculty cards
function renderFacultyCards(faculty) {
    const container = document.getElementById('facultyContainer');
    container.innerHTML = '';
    
    if (faculty.length === 0) {
        container.innerHTML = '<div class="no-results">No faculty members found</div>';
        return;
    }
    
    faculty.forEach(member => {
        const card = document.createElement('div');
        card.className = 'faculty-card';
        
        card.innerHTML = `
            <img src="${member.image}" alt="Faculty Image" class="faculty-img" onerror="this.src='pfp.png'">
            <div class="faculty-info">
                <h3 class="faculty-name">${member.name}</h3>
                <p class="faculty-dept">${member.department}</p>
                <p class="faculty-role">${member.designation || ''}</p>
                <div class="rating">
                    <span class="stars">${getStarRating(member.rating)}</span>
                    <span class="rating-value">${member.rating.toFixed(1)}</span>
                </div>
                <a href="StuViewFacProfile.html?id=${member.id}" class="action-btn">View Profile</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Function to handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-bar');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length > 0) {
                try {
                    const response = await fetch(`/api/students/faculty/search?query=${encodeURIComponent(searchTerm)}`);
                    if (!response.ok) {
                        throw new Error('Search failed');
                    }
                    const filteredFaculty = await response.json();
                    renderFacultyCards(filteredFaculty);
                } catch (error) {
                    console.error('Error during search:', error);
                    displayErrorMessage('Search failed. Please try again.');
                }
            } else {
                renderFacultyCards(facultyData);
            }
        }, 300); // 300ms debounce
    });
}

// Function to display error messages
function displayErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    
    // Add to top of faculty container
    const container = document.getElementById('facultyContainer');
    container.prepend(errorContainer);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode === container) {
            container.removeChild(errorContainer);
        }
    }, 5000);
}

// Initialize the page
function init() {
    loadFacultyData();
    handleSearch();
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);