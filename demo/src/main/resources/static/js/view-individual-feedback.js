// Function to get feedback details from URL parameters
function getFeedbackDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || 'Not Specified';
    const studentId = urlParams.get('id') || 'Anonymous';
    const rating = urlParams.get('rating') || '0';
    const comments = urlParams.get('comments') || 'No comments provided';
    const date = urlParams.get('date') || 'Not Available';
    // Populate the page with feedback details
    document.getElementById('course-name').innerText = course;
    document.getElementById('student-id').innerText = studentId;
    document.getElementById('rating').innerText = rating + " / 5";
    document.getElementById('comments').innerText = comments;
    document.getElementById('feedback-date').innerText = formatDate(date);
    
    // Display star rating
    displayStars(rating);
    
    // Enhanced Sentiment Analysis
    analyzeSentiment(comments);
    
    // Extract key points (new feature)
    extractKeyPoints(comments);
    
    // Suggest action items based on feedback (new feature)
    suggestActionItems(comments, rating);
    
    // Update average metrics (new feature)
    updateAverageMetrics(course);
    
    // Initialize the course search feature (new feature)
    initializeCourseSearch();
    
    // Initialize the theme toggle functionality
    initializeThemeToggle();
    
    // Initialize action buttons
    initializeActionButtons();
}

// Function to display star rating visually
function displayStars(rating) {
    let starsHTML = '';
    const numRating = parseFloat(rating);
    
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            starsHTML += '★'; // Filled star
        } else if (i - 0.5 <= numRating) {
            starsHTML += '⯨'; // Half star
        } else {
            starsHTML += '☆'; // Empty star
        }
    }
    
    document.getElementById('star-display').innerHTML = starsHTML;
}

// Enhanced sentiment analysis with more detailed logic
function analyzeSentiment(comments) {
    const sentimentElement = document.getElementById('sentiment');
    const sentimentContainer = document.getElementById('sentiment-container');
    
    // Convert to lowercase for case-insensitive matching
    const text = comments.toLowerCase();
    
    // Positive keywords (expanded)
    const positiveWords = [
        'great', 'excellent', 'good', 'helpful', 'amazing', 'fantastic', 
        'love', 'enjoy', 'clear', 'best', 'informative', 'thorough',
        'engaging', 'awesome', 'wonderful', 'perfect', 'outstanding',
        'insightful', 'interesting', 'valuable', 'useful', 'beneficial'
    ];
                          
    // Negative keywords (expanded)
    const negativeWords = [
        'bad', 'poor', 'confusing', 'unclear', 'difficult', 'boring', 
        'needs improvement', 'waste', 'terrible', 'worst', 'hard to follow',
        'disappointing', 'frustrating', 'inadequate', 'insufficient',
        'unhelpful', 'useless', 'slow', 'complicated', 'tedious'
    ];
    
    // Count matches with weighted scoring
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
        if (text.includes(word)) {
            // Check if the word appears with emphasis
            if (text.includes(`very ${word}`) || text.includes(`really ${word}`)) {
                positiveScore += 2;
            } else {
                positiveScore += 1;
            }
        }
    });
    
    negativeWords.forEach(word => {
        if (text.includes(word)) {
            // Check if the word appears with emphasis
            if (text.includes(`very ${word}`) || text.includes(`really ${word}`)) {
                negativeScore += 2;
            } else {
                negativeScore += 1;
            }
        }
    });
    
    // Determine overall sentiment
    let sentiment = '';
    let sentimentClass = '';
    
    if (positiveScore > negativeScore) {
        sentiment = 'Positive';
        sentimentClass = 'positive';
    } else if (negativeScore > positiveScore) {
        sentiment = 'Negative';
        sentimentClass = 'negative';
    } else {
        sentiment = 'Neutral';
        sentimentClass = 'neutral';
    }
    
    // Update the sentiment display
    sentimentElement.innerText = sentiment;
    sentimentElement.className = `sentiment ${sentimentClass}`;
}

// Function to extract key points from the comments
function extractKeyPoints(comments) {
    const text = comments.toLowerCase();
    
    // Predefined categories for key points
    const positiveCategories = {
        'clarity': ['clear', 'easy to understand', 'well explained', 'straightforward'],
        'engagement': ['engaging', 'interesting', 'interactive', 'fun', 'enjoyed'],
        'content': ['informative', 'thorough', 'comprehensive', 'detailed', 'useful content'],
        'instructor': ['helpful instructor', 'knowledgeable', 'responsive', 'supportive'],
        'resources': ['good resources', 'useful materials', 'helpful examples', 'practical exercises']
    };
    
    const negativeCategories = {
        'pace': ['too fast', 'rushed', 'too slow', 'dragging'],
        'clarity': ['confusing', 'unclear', 'hard to follow', 'complex'],
        'content': ['insufficient', 'too basic', 'outdated', 'irrelevant'],
        'resources': ['lacking resources', 'need more examples', 'poor materials'],
        'workload': ['too much work', 'heavy workload', 'overwhelming', 'time-consuming']
    };
    
    // Find matches
    const positivePoints = [];
    const negativePoints = [];
    
    // Check for positive points
    for (const category in positiveCategories) {
        for (const keyword of positiveCategories[category]) {
            if (text.includes(keyword)) {
                positivePoints.push(`${capitalizeFirstLetter(category)}: ${keyword}`);
                break; // Only add one point per category
            }
        }
    }
    
    // Check for negative points
    for (const category in negativeCategories) {
        for (const keyword of negativeCategories[category]) {
            if (text.includes(keyword)) {
                negativePoints.push(`${capitalizeFirstLetter(category)}: ${keyword}`);
                break; // Only add one point per category
            }
        }
    }
    
    // Fallback points if none are found
    if (positivePoints.length === 0) {
        const positiveFallbacks = ['Good overall experience', 'Satisfactory content'];
        positivePoints.push(positiveFallbacks[Math.floor(Math.random() * positiveFallbacks.length)]);
    }
    
    if (negativePoints.length === 0 && parseFloat(document.getElementById('rating').innerText) < 4) {
        const negativeFallbacks = ['Could use improvement', 'Some aspects need attention'];
        negativePoints.push(negativeFallbacks[Math.floor(Math.random() * negativeFallbacks.length)]);
    }
    
    // Display key points
    if (positivePoints.length > 0) {
        document.getElementById('positive-point-1').innerText = positivePoints[0];
        if (positivePoints.length > 1) {
            document.getElementById('positive-point-2').innerText = positivePoints[1];
        }
    }
    
    if (negativePoints.length > 0) {
        document.getElementById('negative-point-1').innerText = negativePoints[0];
    }
}

// Function to suggest action items based on feedback
function suggestActionItems(comments, rating) {
    const text = comments.toLowerCase();
    const ratingValue = parseFloat(rating);
    
    // Potential action categories
    const actionCategories = {
        'pace': ['adjust pace', 'review pace of material delivery', 'consider adjusting lesson timing'],
        'clarity': ['improve explanations', 'provide clearer instructions', 'simplify complex concepts'],
        'content': ['update course content', 'add more advanced topics', 'include more basic examples'],
        'resources': ['provide additional resources', 'create supplementary materials', 'develop practice exercises'],
        'engagement': ['increase interactivity', 'add more engaging activities', 'incorporate discussions']
    };
    
    // Keywords indicating areas for improvement
    const improvementKeywords = {
        'pace': ['too fast', 'too slow', 'rushed', 'dragging'],
        'clarity': ['confusing', 'unclear', 'hard to follow', 'complex'],
        'content': ['more content', 'too basic', 'too advanced', 'outdated'],
        'resources': ['more examples', 'more exercises', 'better materials'],
        'engagement': ['boring', 'not engaging', 'monotonous', 'passive']
    };
    
    // Keywords indicating strengths to emphasize
    const strengthKeywords = {
        'clarity': ['clear', 'well explained', 'understandable'],
        'engagement': ['engaging', 'interesting', 'interactive'],
        'content': ['informative', 'thorough', 'comprehensive'],
        'resources': ['helpful resources', 'good examples', 'useful materials']
    };
    
    // Find areas for improvement
    const improvementActions = [];
    for (const category in improvementKeywords) {
        for (const keyword of improvementKeywords[category]) {
            if (text.includes(keyword)) {
                // Get a random action from the category
                const actions = actionCategories[category];
                improvementActions.push(capitalizeFirstLetter(actions[Math.floor(Math.random() * actions.length)]));
                break;
            }
        }
    }
    
    // Find strengths to emphasize
    const strengthActions = [];
    for (const category in strengthKeywords) {
        for (const keyword of strengthKeywords[category]) {
            if (text.includes(keyword)) {
                strengthActions.push(`Continue emphasizing ${keyword} aspects`);
                break;
            }
        }
    }
    
    // If rating is low, prioritize improvements
    if (ratingValue <= 3) {
        if (improvementActions.length === 0) {
            improvementActions.push('Review course structure and delivery methods');
        }
    } else {
        // If rating is high but no strengths identified
        if (strengthActions.length === 0) {
            strengthActions.push('Maintain current quality standards');
        }
    }
    
    // Display action items
    if (improvementActions.length > 0) {
        document.getElementById('action-item-1').innerText = improvementActions[0];
    }
    
    if (strengthActions.length > 0) {
        document.getElementById('action-item-2').innerText = strengthActions[0];
    } else if (improvementActions.length > 1) {
        document.getElementById('action-item-2').innerText = improvementActions[1];
    }
}

// Function to update average metrics
function updateAverageMetrics(course) {
    // This would normally fetch data from a backend or API
    // For demo purposes, we'll use mock data
    
    // Mock data for different courses
    const courseData = {
        'Intro to Computer Science': {
            avgRating: 4.2,
            respondents: 124,
            lastUpdated: 'March 15, 2025'
        },
        'Calculus 101': {
            avgRating: 3.8,
            respondents: 87,
            lastUpdated: 'March 10, 2025'
        },
        'Data Structures': {
            avgRating: 4.5,
            respondents: 65,
            lastUpdated: 'March 18, 2025'
        },
        'Psychology 101': {
            avgRating: 4.1,
            respondents: 142,
            lastUpdated: 'March 12, 2025'
        },
        'Not Specified': {
            avgRating: 4.0,
            respondents: 100,
            lastUpdated: 'March 15, 2025'
        }
    };
    
    // Get the data for the current course
    const data = courseData[course] || courseData['Not Specified'];
    
    // Update the UI
    document.getElementById('avg-rating').innerText = data.avgRating + '/5';
    document.getElementById('total-respondents').innerText = data.respondents;
    document.getElementById('last-updated').innerText = data.lastUpdated;
}

// Function to initialize course search and filter
function initializeCourseSearch() {
    const searchInput = document.getElementById('course-search');
    const filterSelect = document.getElementById('course-filter');
    const searchButton = document.getElementById('search-btn');
    
    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            // In a real application, this would search the database or API
            // For demo purposes, we'll just alert
            alert(`Searching for: ${searchTerm}`);
        }
    });
    
    // Enter key for search
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Course filter functionality
    filterSelect.addEventListener('change', () => {
        const selectedCourse = filterSelect.value;
        if (selectedCourse) {
            // Update the metrics for the selected course
            updateAverageMetrics(selectedCourse);
            
            // In a real application, this would load feedback for that course
            // For demo purposes, we'll just update the course name
            document.getElementById('course-name').innerText = selectedCourse;
        }
    });
}

// Function to initialize theme toggle
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Function to initialize action buttons
function initializeActionButtons() {
    const printBtn = document.getElementById('print-feedback');
    const downloadBtn = document.getElementById('download-report');
    const viewDetailsBtns = document.querySelectorAll('.view-more-btn');
    
    // Print functionality
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    // Download report functionality
    downloadBtn.addEventListener('click', () => {
        // Get current feedback data
        const course = document.getElementById('course-name').innerText;
        const studentId = document.getElementById('student-id').innerText;
        const rating = document.getElementById('rating').innerText;
        const comments = document.getElementById('comments').innerText;
        const date = document.getElementById('feedback-date').innerText;
        const sentiment = document.getElementById('sentiment').innerText;
        
        // Create a text version of the report
        const reportContent = `
Course Feedback Report
=====================
Course: ${course}
Student ID: ${studentId}
Rating: ${rating}
Date: ${date}
Sentiment: ${sentiment}

Comments:
${comments}

Key Points:
- ${document.getElementById('positive-point-1').innerText}
- ${document.getElementById('positive-point-2').innerText}
- ${document.getElementById('negative-point-1').innerText}

Action Items:
- ${document.getElementById('action-item-1').innerText}
- ${document.getElementById('action-item-2').innerText}

Generated on: ${new Date().toLocaleString()}
        `;
        
        // Create a download link
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback-report-${studentId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // View more details buttons for similar feedback
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.similar-card');
            const studentId = card.querySelector('p:first-child strong').nextSibling.textContent.trim();
            
            // In a real application, this would navigate to that feedback's details
            // For demo purposes, we'll just alert
            alert(`Viewing details for student: ${studentId}`);
        });
    });
}

// Function to go back to dashboard
function goBack() {
    window.location.href = 'index.html';
}

// Helper function to format date
function formatDate(dateString) {
    // Check if we have a valid date string
    if (!dateString || dateString === 'Not Available') {
        return 'Not Available';
    }
    
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }
        
        // Format as Month Day, Year
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString; // Return original on error
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    getFeedbackDetails();
    
    // Add event listeners for similar card buttons
    const viewMoreBtns = document.querySelectorAll('.view-more-btn');
    viewMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = this.parentElement.querySelector('p:first-child').innerText.split(':')[1].trim();
            // Navigate to the feedback page for this student
            window.location.href = `view-individual-feedback.html?id=${studentId}&course=Intro to Computer Science&rating=4.2&comments=This course was well structured but could use more practical examples.&date=2025-03-10`;
        });
    });
});